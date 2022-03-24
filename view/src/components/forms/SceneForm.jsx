import React, { useRef } from 'react';
import { Form, Input, Modal, message, Collapse, Radio, Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl';
import { MonacoEditor, monacoEditorJsonConfig, monacoEditorJsConfig } from '../MonacoEditor';
import './SceneForm.less';

const { Panel } = Collapse;

const getCode = (stageData) => {
  if (stageData.format === 'javascript') {
    return decodeURIComponent(stageData.data || '');
  }
  return JSON.stringify(stageData.data, null, 2);
};

function SceneFormComponent(props) {
  const { visible, onCancel, onOk, onChangeMode, confirmLoading, stageData, experimentConfig } = props;
  const [form] = Form.useForm();
  let showResInfo = false;
  if (stageData.contextConfig) {
    const { responseDelay, responseStatus, responseHeaders } = stageData.contextConfig;
    showResInfo =
      (responseDelay && `${responseDelay}` !== '0') ||
      (responseStatus && `${responseStatus}` !== '200') ||
      (responseHeaders && JSON.stringify(responseHeaders) !== '{}');
  }
  const isOpenRunJsMode = experimentConfig && experimentConfig.isOpenRunJsMode;

  const monacoEditorRef = useRef(null);
  const monacoEditorResHeaderRef = useRef(null);

  const formatMessage = (id) => props.intl.formatMessage({ id });

  const validateCode = (format) => {
    const monacoEditorInstance = monacoEditorRef.current;
    const monacoEditorResHeaderInstance = monacoEditorResHeaderRef.current;
    let [data, responseHeaders, error] = [{}, {}, null];
    if (format === 'javascript') {
      try {
        data = encodeURIComponent(monacoEditorInstance.getValue());
        responseHeaders = JSON.parse(monacoEditorResHeaderInstance ? monacoEditorResHeaderInstance.getValue() : '{}');
      } catch (err) {
        error = err;
      }
    } else {
      try {
        data = JSON.parse(monacoEditorInstance.getValue());
        responseHeaders = JSON.parse(monacoEditorResHeaderInstance ? monacoEditorResHeaderInstance.getValue() : '{}');
      } catch (err) {
        error = err;
      }
    }
    return { data, responseHeaders, error };
  };

  const jsObjectCodeToJsonCode = () => {
    const monacoEditorInstance = monacoEditorRef.current;
    const formatCode = JSON.stringify(eval(`(${monacoEditorInstance.getValue()})`), null, 2);
    monacoEditorInstance.setValue(formatCode);
  };

  return (
    <Modal
      style={{ top: '20px' }}
      width="84%"
      wrapClassName="code-modal scene-form-modal"
      visible={visible}
      destroyOnClose={true}
      title={formatMessage(stageData.uniqId ? 'sceneList.updateScene' : 'sceneList.createScene')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            const { data, responseHeaders, error } = validateCode(stageData.format);
            if (error) {
              message.warn(formatMessage('sceneList.invalidSceneData'));
              return;
            }
            values.data = data;
            values.contextConfig = {
              responseDelay: values.responseDelay,
              responseStatus: values.responseStatus,
              responseHeaders,
            };
            values.format = stageData.format || 'json';
            onOk(values);
          })
          .catch((errorInfo) => {
            message.warn(formatMessage('common.input.invalid'));
            return;
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          sceneName: stageData.sceneName,
          responseDelay: (stageData.contextConfig && stageData.contextConfig.responseDelay) || 0,
          responseStatus: (stageData.contextConfig && stageData.contextConfig.responseStatus) || 200,
        }}
      >
        <Form.Item
          name="sceneName"
          label={formatMessage('sceneList.sceneName')}
          rules={[
            {
              required: true,
              message: formatMessage('sceneList.invalidSceneName'),
              pattern: /^[\u4e00-\u9fa5-_a-zA-Z0-9]+$/,
            },
            { max: 128 },
          ]}
        >
          <Input style={{ display: 'inline' }} />
        </Form.Item>
        {isOpenRunJsMode && (
          <Form.Item name="sceneFormat" className="res-format" label={formatMessage('sceneList.sceneFormat')}>
            <span>
              {stageData.uniqId ? (
                stageData.format
              ) : (
                <Radio.Group onChange={(e) => onChangeMode(e.target.value)} defaultValue={stageData.format || 'json'}>
                  <Radio value="json">JSON</Radio>
                  <Radio value="javascript">JavaScript</Radio>
                </Radio.Group>
              )}
            </span>
          </Form.Item>
        )}
        {stageData.format !== 'javascript' && (
          <Collapse defaultActiveKey={showResInfo ? '0' : ''}>
            <Panel header={formatMessage('sceneList.rewriteResponse')} key="0">
              <Form.Item
                name="responseDelay"
                label={formatMessage('contextConfig.responseDelayField')}
                rules={[
                  {
                    message: formatMessage('contextConfig.invalidDelay'),
                    pattern: /^[0-9]{1,2}(\.\d)?$/,
                  },
                ]}
              >
                <Input maxLength={4} />
              </Form.Item>
              <Form.Item
                name="responseStatus"
                label={`${formatMessage('contextConfig.responseStatus')} 200-50x`}
                rules={[
                  {
                    pattern: /^[1-5]\d{2}$/,
                    message: formatMessage('contextConfig.invalidStatus'),
                  },
                ]}
              >
                <Input maxLength={3} />
              </Form.Item>
              <Form.Item className="context-config" label={formatMessage('sceneList.rewriteResponseHeader')}>
                <MonacoEditor
                  height="120"
                  options={monacoEditorJsonConfig}
                  value={
                    stageData.contextConfig && stageData.contextConfig.responseHeaders
                      ? JSON.stringify(stageData.contextConfig.responseHeaders, null, 2)
                      : '{}'
                  }
                  theme="vs-light"
                  editorDidMount={(editor) => {
                    monacoEditorResHeaderRef.current = editor;
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}
        <Form.Item className="res-data" label={formatMessage('sceneList.responseData')}>
          <div className="monaco-editor-menu">
            <span>
              <Button onClick={jsObjectCodeToJsonCode}>
                Object
                <SwapOutlined />
                Json
              </Button>
            </span>
          </div>
          <MonacoEditor
            height="400"
            options={stageData.format === 'javascript' ? monacoEditorJsConfig : monacoEditorJsonConfig}
            value={getCode(stageData)}
            theme="vs-light"
            editorDidMount={(editor) => {
              monacoEditorRef.current = editor;
              editor.focus();
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default injectIntl(SceneFormComponent);
