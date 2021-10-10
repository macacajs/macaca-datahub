import React, { Component } from 'react';
import {
  Form, Input, Modal,
  message, Collapse, Radio,
} from 'antd';
import {
  injectIntl,
} from 'react-intl';
import {
  UnControlled as CodeMirror,
  jsonCodeMirrorOptions,
  jsCodeMirrorOptions,
} from '../../common/codemirror';

import './SceneForm.less';

const { Item: FormItem } = Form;
const { Panel } = Collapse;

const getCode = stageData => {
  if (stageData.format === 'javascript') {
    return decodeURIComponent(stageData.data || '');
  }
  return JSON.stringify(stageData.data, null, 2);
};

class SceneFormComponent extends Component {
  constructor (props) {
    super(props);
    this.codeMirrorInstance = null;
    this.codeMirrorResHeaderInstance = null;
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  validateCode = (format) => {
    let [data, responseHeaders, error] = [{}, {}, null];
    if (format === 'javascript') {
      try {
        data = encodeURIComponent(this.codeMirrorInstance.doc.getValue());
        responseHeaders = JSON.parse(this.codeMirrorResHeaderInstance ? this.codeMirrorResHeaderInstance.doc.getValue() : '{}');
      } catch (err) {
        error = err;
      }
    } else {
      try {
        data = JSON.parse(this.codeMirrorInstance.doc.getValue());
        responseHeaders = JSON.parse(this.codeMirrorResHeaderInstance ? this.codeMirrorResHeaderInstance.doc.getValue() : '{}');
      } catch (err) {
        error = err;
      }
    }
    return { data, responseHeaders, error };
  }

  render () {
    const {
      visible,
      onCancel,
      onOk,
      onChangeMode,
      form,
      confirmLoading,
      stageData,
      experimentConfig,
    } = this.props;
    const {
      getFieldDecorator,
    } = form;
    const formatMessage = this.formatMessage;

    let showResInfo = false;
    if (stageData.contextConfig) {
      const {
        responseDelay,
        responseStatus,
        responseHeaders,
      } = stageData.contextConfig;
      showResInfo = responseDelay && `${responseDelay}` !== '0' || responseStatus && `${responseStatus}` !== '200' || responseHeaders && JSON.stringify(responseHeaders) !== '{}';
    }
    const isOpenRunJsMode = experimentConfig && experimentConfig.isOpenRunJsMode;

    return (
      <Modal
        style={{top: '20px'}}
        width='80%'
        wrapClassName='code-modal scene-form-modal'
        visible={visible}
        destroyOnClose={true}
        title={formatMessage(stageData.uniqId ? 'sceneList.updateScene' : 'sceneList.createScene')}
        okText={formatMessage('common.confirm')}
        cancelText={formatMessage('common.cancel')}
        destroyOnClose={true}
        onCancel={onCancel}
        onOk={() => {
          form.validateFields((err, values) => {
            if (err) {
              message.warn(formatMessage('common.input.invalid'));
              return;
            }
            const { data, responseHeaders, error } = this.validateCode(stageData.format);
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
          });
        }}
        confirmLoading={confirmLoading}
      >
        <Form layout="vertical">
          <FormItem label={formatMessage('sceneList.sceneName')}>
            {getFieldDecorator('sceneName', {
              initialValue: stageData.sceneName,
              rules: [
                {
                  required: true,
                  message: formatMessage('sceneList.invalidSceneName'),
                  pattern: /^[\u4e00-\u9fa5-_a-zA-Z0-9]+$/,
                },
                { max: 128 },
              ],
            })(
              <Input style={{display: 'inline'}} />
            )}
          </FormItem>
          {isOpenRunJsMode && (
            <FormItem className="res-format" label={formatMessage('sceneList.sceneFormat')}>
              {getFieldDecorator('sceneFormat', {})(
                <span>
                  {stageData.uniqId ? (
                    stageData.format
                  ) : (
                    <Radio.Group
                      onChange={e => onChangeMode(e.target.value)}
                      defaultValue={stageData.format || 'json'}
                    >
                      <Radio value="json">JSON</Radio>
                      <Radio value="javascript">JavaScript</Radio>
                    </Radio.Group>
                  )}
                </span>
              )}
            </FormItem>
          )}
          {stageData.format !== 'javascript' && (
            <Collapse defaultActiveKey={showResInfo ? '0' : ''}>
              <Panel header={formatMessage('sceneList.rewriteResponse')} key="0">
                <FormItem label={formatMessage('contextConfig.responseDelayField')}>
                  {getFieldDecorator('responseDelay', {
                    initialValue: stageData.contextConfig && stageData.contextConfig.responseDelay || 0,
                    rules: [
                      {
                        message: formatMessage('contextConfig.invalidDelay'),
                        pattern: /^[0-9]{1,2}(\.\d)?$/,
                      },
                    ],
                  })(
                    <Input maxLength={4}/>
                  )}
                </FormItem>
                <FormItem label={`${formatMessage('contextConfig.responseStatus')} 200-50x`}>
                  {getFieldDecorator('responseStatus', {
                    initialValue: stageData.contextConfig && stageData.contextConfig.responseStatus || 200,
                    rules: [
                      {
                        pattern: /^[1-5]\d{2}$/,
                        message: formatMessage('contextConfig.invalidStatus'),
                      },
                    ],
                  })(
                    <Input maxLength={3}/>
                  )}
                </FormItem>
                <FormItem className="context-config" label={formatMessage('sceneList.rewriteResponseHeader')}>
                  <CodeMirror
                    value={stageData.contextConfig && stageData.contextConfig.responseHeaders ? JSON.stringify(stageData.contextConfig.responseHeaders, null, 2) : '{}'}
                    options={jsonCodeMirrorOptions}
                    editorDidMount={instance => {
                      this.codeMirrorResHeaderInstance = instance;
                    }}
                  />
                </FormItem>
              </Panel>
            </Collapse>
          )}
          <FormItem className="res-data" label={formatMessage('sceneList.responseData')}>
            <CodeMirror
              value={getCode(stageData)}
              options={stageData.format === 'javascript' ? jsCodeMirrorOptions : jsonCodeMirrorOptions}
              editorDidMount={instance => {
                this.codeMirrorInstance = instance;
                instance.focus();
              }}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(injectIntl(SceneFormComponent));
