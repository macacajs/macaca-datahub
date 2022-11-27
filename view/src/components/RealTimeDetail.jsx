import React from 'react';

import {
  Form, Input, Modal, Select, Button, Collapse, Breadcrumb, message,
} from 'antd';

import { sceneService } from '../service';
import './RealTimeDetail.less';

const FormItem = Form.Item;
const { Panel } = Collapse;
const { Option } = Select;

function SaveSceneFormComponent(props) {
  const { visible, onCancel, onOk, loading } = props;
  const [form] = Form.useForm();
  let defaultInterface = '';
  const projectName = window.context && window.context.projectName;

  for (const interfaceData of props.interfaceList) {
    const { method, path } = props.requestData;
    if ([method, 'ALL'].includes(interfaceData.method) && path === `/${projectName}/${interfaceData.pathname}`) {
      defaultInterface = interfaceData.uniqId;
      break;
    }
  }

  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={__i18n('新增场景')}
      okText={__i18n('确定')}
      cancelText={__i18n('取消')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((errorInfo) => {
            message.warn(__i18n('请修改输入的内容'));
          });
      }}
      confirmLoading={loading}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          interfaceUniqId: defaultInterface,
        }}
      >
        <FormItem name="interfaceUniqId" label={__i18n('选择接口')}>
          <Select>
            {props.interfaceList.map((interfaceData, index) => {
              return (
                <Option key={index} value={interfaceData.uniqId}>
                  {`${interfaceData.pathname} (${interfaceData.method})`}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem
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
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
}

const SaveSceneForm = SaveSceneFormComponent;
class RealTimeDetail extends React.Component {
  state = {
    sceneFormVisible: false,
    sceneFormLoading: false,
  };

  renderHeaders = ({ headers }) => {
    return Object.keys(headers).map((key) => {
      return (
        <div key={key}>
          <b className="header-key">{key}</b>
          {headers[key].toString()}
        </div>
      );
    });
  };

  renderBody = ({ body }) => {
    let result = null;
    if (typeof body === 'object') {
      result = JSON.stringify(body, {}, 2);
    } else {
      try {
        result = JSON.stringify(JSON.parse(body), {}, 2);
      } catch (e) {
        result = body;
      }
    }
    return <pre>{result}</pre>;
  };

  closeSceneForm = () => {
    this.setState({
      sceneFormVisible: false,
    });
  };

  confirmSceneForm = async ({ sceneName, interfaceUniqId }) => {
    this.setState({
      sceneFormLoading: true,
    });
    const res = await sceneService.createScene({
      interfaceUniqId,
      sceneName,
      contextConfig: {
        responseDelay: 0,
        responseStatus: 200,
        responseHeaders: {},
      },
      data: this.props.realTimeData.res.body,
    });
    this.setState({
      sceneFormLoading: false,
    });
    if (res.success) {
      this.setState({
        sceneFormVisible: false,
      });
    }
  };

  showSceneForm = () => {
    this.setState({
      sceneFormVisible: true,
    });
  };

  render() {
    if (!this.props.realTimeData) {
      return null;
    }
    const { req, res } = this.props.realTimeData;
    return (
      <div className="real-time-detail">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/dashboard">
              {__i18n('所有项目')}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{window.context && window.context.projectName}</Breadcrumb.Item>
          <Breadcrumb.Item>
            {__i18n('实时快照')}
          </Breadcrumb.Item>
        </Breadcrumb>
        <section className="save-to" data-accessbilityid="real-time-save-to">
          <Button type="primary" style={{ float: 'right' }} onClick={this.showSceneForm}>
            {__i18n('保存为新场景')}
          </Button>
        </section>

        <h2 style={{ marginTop: '10px' }}>Request</h2>
        <Collapse>
          <Panel header="request header" key="header">
            <div className="headers-list">{this.renderHeaders({ headers: req.headers })}</div>
          </Panel>
          <Panel header="request body" key="body">
            <div className="body-content">{this.renderBody({ body: req.body })}</div>
          </Panel>
        </Collapse>
        <h2 style={{ marginTop: '10px' }}>Respose</h2>
        <Collapse defaultActiveKey={['body']}>
          <Panel header="response header" key="header">
            <div className="headers-list">{this.renderHeaders({ headers: res.headers })}</div>
          </Panel>
          <Panel header="response body" key="body">
            <div className="body-content">{this.renderBody({ body: res.body })}</div>
          </Panel>
        </Collapse>
        <SaveSceneForm
          visible={this.state.sceneFormVisible}
          onCancel={this.closeSceneForm}
          onOk={this.confirmSceneForm}
          confirmLoading={this.state.sceneFormLoading}
          interfaceList={this.props.interfaceList}
          requestData={this.props.realTimeData.req}
        />
      </div>
    );
  }
}

export default RealTimeDetail;
