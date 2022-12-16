import React, { useRef } from 'react';
import { Form, Input, Modal, message, Collapse, Radio, Tooltip } from 'antd';
import MonacoEditor from '../MonacoEditor';
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

  form.setFieldsValue({
    sceneName: stageData.sceneName,
    responseDelay: (stageData.contextConfig && stageData.contextConfig.responseDelay) || 0,
    responseStatus: (stageData.contextConfig && stageData.contextConfig.responseStatus) || 200,
  });

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

  const objectCodeToJsonCode = () => {
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
      destroyOnClose
      title={__i18n(stageData.uniqId ? '更新场景' : '新增场景')}
      okText={__i18n('确定')}
      cancelText={__i18n('取消')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            const { data, responseHeaders, error } = validateCode(stageData.format);
            if (error) {
              message.warn(__i18n('格式错误，请输入 JSON 数据'));
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
            message.warn(__i18n('请修改输入的内容'));
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="sceneName"
          label={__i18n('场景名称')}
          rules={[
            {
              required: true,
              message: __i18n('格式不正确，请输入中文/字母/数字/中划线/下划线'),
              pattern: /^[\u4e00-\u9fa5-_a-zA-Z0-9]+$/,
            },
            { max: 128 },
          ]}
        >
          <Input style={{ display: 'inline' }} />
        </Form.Item>
        {isOpenRunJsMode && (
          <Form.Item name="sceneFormat" className="res-format" label={__i18n('响应格式')}>
            <span>
              {stageData.uniqId ? (
                stageData.format
              ) : (
                <Radio.Group
                  onChange={(e) => {
                    return onChangeMode(e.target.value);
                  }}
                  defaultValue={stageData.format || 'json'}
                >
                  <Radio value="json">JSON</Radio>
                  <Radio value="javascript">JavaScript</Radio>
                </Radio.Group>
              )}
            </span>
          </Form.Item>
        )}
        {stageData.format !== 'javascript' && (
          <Collapse defaultActiveKey={showResInfo ? '0' : ''}>
            <Panel header={__i18n('设置响应延迟时间、响应头、状态码')} key="0">
              <Form.Item
                name="responseDelay"
                label={__i18n('增加响应延迟时间，单位秒')}
                rules={[
                  {
                    message: __i18n('请输入延迟时间，单位秒'),
                    pattern: /^[0-9]{1,2}(\.\d)?$/,
                  },
                ]}
              >
                <Input maxLength={4} />
              </Form.Item>
              <Form.Item
                name="responseStatus"
                label={`${__i18n('修改响应状态码')} 200-50x`}
                rules={[
                  {
                    pattern: /^[1-5]\d{2}$/,
                    message: __i18n('请输入状态码'),
                  },
                ]}
              >
                <Input maxLength={3} />
              </Form.Item>
              <Form.Item label={__i18n('覆盖响应头（JSON 格式）')}>
                <MonacoEditor
                  height="120px"
                  language="json"
                  value={
                    stageData.contextConfig && stageData.contextConfig.responseHeaders
                      ? JSON.stringify(stageData.contextConfig.responseHeaders, null, 2)
                      : '{}'
                  }
                  editorDidMount={(editor) => {
                    monacoEditorResHeaderRef.current = editor;
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}
        <Form.Item className="res-data" label={__i18n('响应数据')}>
          {stageData.format !== 'javascript' && (
            <Tooltip title={__i18n('输入合法的Object, 点击转JSON')}>
              <div className="json-format-btn" onClick={objectCodeToJsonCode}>
                {__i18n('格式化JSON')}
              </div>
            </Tooltip>
          )}
          <MonacoEditor
            height="400px"
            language={stageData.format === 'javascript' ? 'javascript' : 'json'}
            value={getCode(stageData)}
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

export default SceneFormComponent;
