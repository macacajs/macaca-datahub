import React from 'react';

import { Modal, Form, Input, Select, message } from 'antd';

import { injectIntl } from 'react-intl';

const { Option } = Select;

export default injectIntl(InterfaceFormComponent);

function InterfaceFormComponent(props) {
  const { visible, onCancel, onOk, confirmLoading, stageData, groupList } = props;
  const [form] = Form.useForm();
  form.setFieldsValue({
    pathname: stageData && stageData.pathname,
    description: stageData && stageData.description,
    method: (stageData && stageData.method) || 'ALL',
    groupUniqId: (stageData && stageData.groupUniqId) || (groupList[0] && groupList[0].uniqId),
  });
  const formatMessage = (id) => props.intl.formatMessage({ id });

  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={formatMessage(stageData ? 'interfaceList.updateInterface' : 'interfaceList.addInterface')}
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
          name="pathname"
          label={formatMessage('interfaceList.interfacePathnameInput')}
          rules={[
            {
              required: true,
              message: formatMessage('interfaceList.invalidPathname'),
              pattern: /^[a-zA-Z0-9_-]([.:a-zA-Z0-9/_-]*[a-zA-Z0-9_-])?$/,
            },
            { max: 128 },
          ]}
        >
          <Input placeholder="path/name" />
        </Form.Item>
        <Form.Item
          name="description"
          label={formatMessage('interfaceList.interfaceDescription')}
          rules={[
            {
              required: true,
              pattern: /^[^\s].*$/,
              message: formatMessage('interfaceList.invalidDescription'),
            },
            { max: 128 },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="method" label={formatMessage('interfaceList.interfaceMethod')}>
          <Select>
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        </Form.Item>
        <Form.Item name="groupUniqId" label={formatMessage('group.selectGroup')}>
          <Select>
            {groupList.map((group) => (
              <Option value={group.uniqId} key={group.uniqId}>
                {group.groupName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
