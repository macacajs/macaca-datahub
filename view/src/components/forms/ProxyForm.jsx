import React from 'react';

import {
  Form,
  Input,
  Modal,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

function ProxyFormComponent(props) {
  const {
    visible,
    onCancel,
    onOk,
    confirmLoading,
  } = props;
  const formatMessage = id => props.intl.formatMessage({ id });
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      destroyOnClose={true}
      title={formatMessage('proxyConfig.addProxyUrl')}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(values => {
          const { proxyUrl } = values;
          if (!/^https?:\/\/.+$/.test(proxyUrl)) {
            message.warn(formatMessage('proxyConfig.invalidProxyUrl'));
            return;
          }
          onOk(values);
        }).catch(errorInfo => {
            message.warn(formatMessage('common.input.invalid'));
            return;
        });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
      >
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
          <Input
            placeholder="http://example.com/api/user"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default injectIntl(ProxyFormComponent);
