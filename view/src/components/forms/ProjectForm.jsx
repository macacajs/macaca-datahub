import React from 'react';

import { Modal, Form, Input, message } from 'antd';

import { injectIntl } from 'react-intl';

const FormItem = Form.Item;

export default injectIntl(ProjectFormComponent);

function ProjectFormComponent(props) {
  const { visible, onCancel, onOk, loading, stageData } = props;
  const formatMessage = (id) => props.intl.formatMessage({ id });
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={stageData ? formatMessage('project.update') : formatMessage('project.create')}
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
      confirmLoading={loading}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          projectName: stageData && stageData.projectName,
          description: stageData && stageData.description,
          globalProxy: stageData && stageData.globalProxy,
        }}
      >
        <FormItem
          name="projectName"
          label={formatMessage('project.name')}
          rules={[
            {
              required: true,
              message: formatMessage('project.name.invalid'),
              pattern: /^[a-z0-9_-]+$/,
            },
            { max: 32 },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          name="description"
          label={formatMessage('project.description')}
          rules={[
            {
              required: true,
              pattern: /^[^\s].*$/,
              message: formatMessage('project.description.invalid'),
            },
            { max: 32 },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          name="globalProxy"
          label={formatMessage('project.globalProxy')}
          rules={[
            {
              required: false,
              pattern: /^https?:\/\/.+$/,
              message: formatMessage('project.globalProxy.invalid'),
            },
          ]}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
}
