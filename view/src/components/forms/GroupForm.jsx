import React from 'react';

import { Modal, Form, Input, message } from 'antd';

import { injectIntl } from 'react-intl';

export default injectIntl(GroupFormComponent);

function GroupFormComponent(props) {
  const { visible, onCancel, onOk, confirmLoading } = props;
  const [form] = Form.useForm();
  const formatMessage = (id) => {
    return props.intl.formatMessage({ id });
  };
  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={formatMessage('group.create')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((errorInfo) => {
            message.warn(formatMessage('common.input.invalid'));
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="groupName"
          label={formatMessage('group.newGroupInputPlaceholder')}
          rules={[
            {
              required: true,
              pattern: /^[a-zA-Z0-9_-]([.:a-zA-Z0-9/_-]*[a-zA-Z0-9_-])?$/,
              message: formatMessage('group.invalidGroupName'),
            },
            { max: 128 },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
