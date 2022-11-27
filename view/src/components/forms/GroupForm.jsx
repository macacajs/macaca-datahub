import React from 'react';

import { Modal, Form, Input, message } from 'antd';

export default GroupFormComponent;

function GroupFormComponent(props) {
  const { visible, onCancel, onOk, confirmLoading } = props;
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={__i18n('添加分组')}
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
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="groupName"
          label={__i18n('请输入分组名')}
          rules={[
            {
              required: true,
              pattern: /^[a-zA-Z0-9_-]([.:a-zA-Z0-9/_-]*[a-zA-Z0-9_-])?$/,
              message: __i18n('请输入合法的分组名称'),
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
