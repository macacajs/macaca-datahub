import React from 'react';
import { Modal, Form, Input, message } from 'antd';

const FormItem = Form.Item;

function ProjectFormComponent(props) {
  const { visible, onCancel, onOk, loading, stageData } = props;
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={stageData ? __i18n('更新项目') : __i18n('创建新项目')}
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
          projectName: stageData && stageData.projectName,
          description: stageData && stageData.description,
          globalProxy: stageData && stageData.globalProxy,
        }}
      >
        <FormItem
          name="projectName"
          label={__i18n('项目名称')}
          rules={[
            {
              required: true,
              message: __i18n('请输入小写字母或者数字'),
              pattern: /^[a-z0-9_-]+$/,
            },
            { max: 32 },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          name="description"
          label={__i18n('项目描述')}
          rules={[
            {
              required: true,
              pattern: /^[^\s].*$/,
              message: __i18n('请输入项目描述'),
            },
            { max: 32 },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          name="globalProxy"
          label={__i18n('全局项目代理')}
          rules={[
            {
              required: false,
              pattern: /^https?:\/\/.+$/,
              message: __i18n('请输入 URL'),
            },
          ]}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
}

export default ProjectFormComponent;
