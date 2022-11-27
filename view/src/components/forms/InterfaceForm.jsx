import React from 'react';

import { Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

export default InterfaceFormComponent;

function InterfaceFormComponent(props) {
  const { visible, onCancel, onOk, confirmLoading, stageData, groupList } = props;
  const [form] = Form.useForm();
  form.setFieldsValue({
    pathname: stageData && stageData.pathname,
    description: stageData && stageData.description,
    method: (stageData && stageData.method) || 'ALL',
    groupUniqId: (stageData && stageData.groupUniqId) || (groupList[0] && groupList[0].uniqId),
  });

  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={stageData ? __i18n('修改接口') : __i18n('添加接口')}
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
          name="pathname"
          label={__i18n('请输入接口 URL pathname')}
          rules={[
            {
              required: true,
              message: __i18n('请输入 pathname'),
              pattern: /^[a-zA-Z0-9_-]([.:a-zA-Z0-9/_-]*[a-zA-Z0-9_-])?$/,
            },
            { max: 128 },
          ]}
        >
          <Input placeholder="path/name" />
        </Form.Item>
        <Form.Item
          name="description"
          label={__i18n('请输入接口描述')}
          rules={[
            {
              required: true,
              pattern: /^[^\s].*$/,
              message: __i18n('请输入接口描述'),
            },
            { max: 128 },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="method" label={__i18n('请选择请求方法')}>
          <Select>
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        </Form.Item>
        <Form.Item name="groupUniqId" label={__i18n('请选择分组')}>
          <Select>
            {groupList.map((group) => {
              return (
                <Option value={group.uniqId} key={group.uniqId}>
                  {group.groupName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
