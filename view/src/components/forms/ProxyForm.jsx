import React, {
  Component,
} from 'react';

import {
  Form,
  Input,
  Modal,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

const FormItem = Form.Item;

class ProxyFormComponent extends Component {
  formatMessage = id => this.props.intl.formatMessage({ id });

  render () {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
    } = this.props;
    const {
      getFieldDecorator,
    } = form;
    const formatMessage = this.formatMessage;
    return <Modal
      visible={visible}
      destroyOnClose={true}
      title={formatMessage('proxyConfig.addProxyUrl')}
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
          const { proxyUrl } = values;
          if (!/^https?:\/\/.+$/.test(proxyUrl)) {
            message.warn(formatMessage('proxyConfig.invalidProxyUrl'));
            return;
          }
          onOk(values);
        });
      }}
      confirmLoading={confirmLoading}
    >
      <Form layout="vertical">
        <FormItem label="Url">
          {getFieldDecorator('proxyUrl', {
            rules: [
              {
                required: true,
              },
              { max: 128 },
            ],
          })(
            <Input
              placeholder="http://example.com/api/user"
            />
          )}
        </FormItem>
      </Form>
    </Modal>;
  }
}

export default Form.create()(injectIntl(ProxyFormComponent));
