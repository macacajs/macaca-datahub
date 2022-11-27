import React from 'react';

import { Form, Input, Modal, message } from 'antd';

function ProxyFormComponent(props) {
  const { visible, onCancel, onOk, confirmLoading } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={__i18n('添加代理 Url 地址')}
      okText={__i18n('确定')}
      cancelText={__i18n('取消')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            const { proxyUrl } = values;
            if (!/^https?:\/\/.+$/.test(proxyUrl)) {
              message.warn(__i18n('请输入 Url'));
              return;
            }
            onOk(values);
          })
          .catch((errorInfo) => {
            message.warn(__i18n('请修改输入的内容'));
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="proxyUrl"
          label="Url"
          rules={[
            {
              required: true,
              max: 128,
            },
          ]}
        >
          <Input placeholder="http://example.com/api/user" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProxyFormComponent;
