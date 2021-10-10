import React from 'react';

import {
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

const Option = Select.Option;
const FormItem = Form.Item;

export default Form.create()(injectIntl(InterfaceFormComponent));

function InterfaceFormComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    form,
    confirmLoading,
    stageData,
  } = props;
  const {
    getFieldDecorator,
  } = form;
  const formatMessage = id => props.intl.formatMessage({ id });
  return <Modal
    visible={visible}
    destroyOnClose={true}
    title={formatMessage(stageData ? 'interfaceList.updateInterface' : 'interfaceList.addInterface')}
    okText={formatMessage('common.confirm')}
    cancelText={formatMessage('common.cancel')}
    onCancel={onCancel}
    onOk={() => {
      form.validateFields((err, values) => {
        if (err) {
          message.warn(formatMessage('common.input.invalid'));
          return;
        }
        onOk(values);
      });
    }}
    confirmLoading={confirmLoading}
  >
    <Form layout="vertical">
      <FormItem label={formatMessage('interfaceList.interfacePathnameInput')}>
        {getFieldDecorator('pathname', {
          initialValue: stageData && stageData.pathname,
          rules: [
            {
              required: true,
              message: formatMessage('interfaceList.invalidPathname'),
              pattern: /^[a-zA-Z0-9_-]([.:a-zA-Z0-9/_-]*[a-zA-Z0-9_-])?$/,
            },
            { max: 128 },
          ],
        })(
          <Input
            placeholder="path/name"
          />
        )}
      </FormItem>
      <FormItem label={formatMessage('interfaceList.interfaceDescription')}>
        {getFieldDecorator('description', {
          initialValue: stageData && stageData.description,
          rules: [
            {
              required: true,
              pattern: /^[^\s].*$/,
              message: formatMessage('interfaceList.invalidDescription'),
            },
            { max: 128 },
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={formatMessage('interfaceList.interfaceMethod')}>
        {getFieldDecorator('method', {
          initialValue: stageData && stageData.method || 'ALL',
        })(
          <Select>
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        )}
      </FormItem>
    </Form>
  </Modal>;
}
