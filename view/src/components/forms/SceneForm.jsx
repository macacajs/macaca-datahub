import React, { useRef } from 'react';
import {
  Form,
  Input,
  Modal,
  message,
  Collapse,
  Radio,
  Select,
  Row,
  Col,
} from 'antd';
import { injectIntl } from 'react-intl';
import { UnControlled as CodeMirror, jsonCodeMirrorOptions, jsCodeMirrorOptions } from '../../common/codemirror';

import './SceneForm.less';

const { Panel } = Collapse;
const { Option } = Select;

const getCode = (stageData) => {
  if (stageData.format === 'javascript') {
    return decodeURIComponent(stageData.data || '');
  }
  return JSON.stringify(stageData.data, null, 2);
};

function SceneFormComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    onChangeMode,
    confirmLoading,
    stageData,
    experimentConfig,
    groupList,
  } = props;
  const [form] = Form.useForm();
  form.setFieldsValue({
    sceneName: stageData.sceneName,
    responseDelay: (stageData.contextConfig && stageData.contextConfig.responseDelay) || 0,
    responseStatus: (stageData.contextConfig && stageData.contextConfig.responseStatus) || 200,
    groupUniqId: (stageData && stageData.groupUniqId) || (groupList[0] && groupList[0].uniqId),
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

  const codeMirrorRef = useRef(null);
  const codeMirrorResHeaderRef = useRef(null);

  const formatMessage = (id) => props.intl.formatMessage({ id });

  const validateCode = (format) => {
    const codeMirrorInstance = codeMirrorRef.current;
    const codeMirrorResHeaderInstance = codeMirrorResHeaderRef.current;
    let [data, responseHeaders, error] = [{}, {}, null];
    if (format === 'javascript') {
      try {
        data = encodeURIComponent(codeMirrorInstance.doc.getValue());
        responseHeaders = JSON.parse(codeMirrorResHeaderInstance ? codeMirrorResHeaderInstance.doc.getValue() : '{}');
      } catch (err) {
        error = err;
      }
    } else {
      try {
        data = JSON.parse(codeMirrorInstance.doc.getValue());
        responseHeaders = JSON.parse(codeMirrorResHeaderInstance ? codeMirrorResHeaderInstance.doc.getValue() : '{}');
      } catch (err) {
        error = err;
      }
    }
    return { data, responseHeaders, error };
  };

  return (
    <Modal
      style={{ top: '20px' }}
      width="80%"
      wrapClassName="code-modal scene-form-modal"
      visible={visible}
      destroyOnClose={true}
      title={formatMessage(stageData.uniqId ? 'sceneList.updateScene' : 'sceneList.createScene')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      destroyOnClose={true}
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
      >
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="groupUniqId"
              label={formatMessage('group.selectGroup')}>
              <Select>
                {
                  groupList.map(group => {
                    return (
                      <Option value={group.uniqId} key={group.uniqId} >{group.groupName}</Option>
                    );
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
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
                <CodeMirror
                  value={
                    stageData.contextConfig && stageData.contextConfig.responseHeaders
                      ? JSON.stringify(stageData.contextConfig.responseHeaders, null, 2)
                      : '{}'
                  }
                  options={jsonCodeMirrorOptions}
                  editorDidMount={(instance) => {
                    codeMirrorResHeaderRef.current = instance;
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}
        <Form.Item className="res-data" label={formatMessage('sceneList.responseData')}>
          <CodeMirror
            value={getCode(stageData)}
            options={stageData.format === 'javascript' ? jsCodeMirrorOptions : jsonCodeMirrorOptions}
            editorDidMount={(instance) => {
              codeMirrorRef.current = instance;
              instance.focus();
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default injectIntl(SceneFormComponent);
