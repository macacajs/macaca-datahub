import React from 'react';

import {
  Modal,
  Form,
  Input,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

export default injectIntl(GroupFormComponent);

function GroupFormComponent (props) {
  const {
    visible,
    onCancel,
    onOk,
    confirmLoading,
    stageData,
  } = props;
  const [form] = Form.useForm();
  const formatMessage = id => props.intl.formatMessage({ id });
  return <Modal
    visible={visible}
    destroyOnClose={true}
    title={formatMessage('group.create')}
    okText={formatMessage('common.confirm')}
    cancelText={formatMessage('common.cancel')}
    onCancel={onCancel}
    onOk={() => {
      form.validateFields().then(values => {
        onOk(values);
      }).catch(errorInfo => {
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
        groupName: stageData && stageData.groupName,
      }}
    >
      <Form.Item
        name="groupName"
        label={formatMessage('group.newGroupInputPlaceholder')}
        rules= {[
          {
            required: true,
            pattern: /^[^\s].*$/,
            message: formatMessage('group.newGroupInputPlaceholder'),
          },
          { max: 128 },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  </Modal>;
}
