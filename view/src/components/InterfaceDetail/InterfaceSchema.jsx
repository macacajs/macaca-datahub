import React, { Component } from 'react';
import { Table, Button, Checkbox } from 'antd';
import SchemaForm from '../forms/SchemaForm';
import { genSchemaList } from '../../common/helper';

class InterfaceSchema extends Component {
  state = {
    schemaFormVisible: false,
    schemaFormLoading: false,
    expandedAllRowKeysForResponse: false,
    expandedAllRowKeysForRequest: false,
    stageData: null,
    schemaFormType: null,
  };

  changeExpandedAllRowKeysForResponse = (checked) => {
    this.setState({
      expandedAllRowKeysForResponse: checked,
    });
  };

  changeExpandedAllRowKeysForRequest = (checked) => {
    this.setState({
      expandedAllRowKeysForRequest: checked,
    });
  };

  isValidationEnabled = (type) => {
    const { data = {} } =
      this.props.schemaData.find((i) => {
        return i.type === type;
      }) || {};
    return data.enableSchemaValidate;
  };

  getDataSource = (type) => {
    const { data = {} } =
      this.props.schemaData.find((i) => {
        return i.type === type;
      }) || {};
    if (!data.schemaData) return [];
    if (!data.schemaData.properties && !data.schemaData.items) {
      return [];
    }
    try {
      return genSchemaList(data.schemaData);
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  getColumns = () => {
    return [
      {
        title: __i18n('字段'),
        dataIndex: 'field',
        width: '30%',
        key: 'field',
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: __i18n('类型'),
        dataIndex: 'type',
        width: '15%',
        key: 'type',
        render: (text, record, index) => {
          return <span className="text-capitalize">{text}</span>;
        },
      },
      {
        title: __i18n('是否必需'),
        dataIndex: 'required',
        width: '15%',
        key: 'required',
        render: (text, record, index) => {
          return <Checkbox checked={text} disabled></Checkbox>;
        },
      },
      {
        title: __i18n('参数说明'),
        width: '40%',
        dataIndex: 'description',
        key: 'description',
      },
    ];
  };

  showSchemaForm = (type) => {
    this.setState({
      schemaFormType: type,
      schemaFormVisible: true,
    });
  };

  closeSchemaForm = () => {
    this.setState({
      schemaFormVisible: false,
    });
  };

  confirmSchemaForm = async ({ type, data }) => {
    this.setState({
      schemaFormLoading: true,
    });
    const res = await this.props.updateSchemaData({ type, data });
    this.setState({
      schemaFormLoading: false,
    });
    if (res.success) {
      this.setState({
        schemaFormVisible: false,
      });
    }
  };

  render() {
    const { props } = this;
    const { unControlled } = props;
    const columns = this.getColumns();
    const enableRequestSchemaValidation = this.isValidationEnabled('request');
    const enableResponseSchemaValidation = this.isValidationEnabled('response');
    const requestSchemaData = this.getDataSource('request');
    const responseSchemaData = this.getDataSource('response');

    return (
      <section>
        <div className="api-schema-req">
          <h1>{__i18n('请求字段描述')}</h1>
          {!unControlled && (
            <Checkbox
              checked={enableRequestSchemaValidation}
              onChange={(e) => {
                return props.toggleValidation('request', e.target.checked);
              }}
            >
              {__i18n('是否开启校验')}
            </Checkbox>
          )}
          {!unControlled && (
            <Checkbox
              checked={this.state.expandedAllRowKeysForRequest}
              onChange={(e) => {
                return this.changeExpandedAllRowKeysForRequest(e.target.checked);
              }}
            >
              {__i18n('是否展开所有行')}
            </Checkbox>
          )}
          {!unControlled && (
            <Button
              type="primary"
              size="small"
              style={{ marginBottom: '5px' }}
              data-accessbilityid="project-api-schema-edit-btn"
              onClick={() => {
                return this.showSchemaForm('request');
              }}
            >
              {' '}
              {__i18n('编辑')}
            </Button>
          )}
          {requestSchemaData && requestSchemaData.schema && this.state.expandedAllRowKeysForRequest ? (
            <div>
              <Table
                size="small"
                pagination={false}
                expandable={{ defaultExpandedRowKeys: requestSchemaData.expandedRowKeys }}
                dataSource={requestSchemaData.schema}
                bordered
                columns={columns}
              />
            </div>
          ) : (
            <Table size="small" pagination={false} dataSource={requestSchemaData.schema} bordered columns={columns} />
          )}
        </div>
        <div className="api-schema-res">
          <h1 style={{ marginTop: '24px' }}>{__i18n('响应字段描述')}</h1>
          {!unControlled && (
            <Checkbox
              checked={enableResponseSchemaValidation}
              onChange={(e) => {
                return props.toggleValidation('response', e.target.checked);
              }}
            >
              {__i18n('开启字段校验')}
            </Checkbox>
          )}
          {!unControlled && (
            <Checkbox
              checked={this.state.expandedAllRowKeysForResponse}
              onChange={(e) => {
                return this.changeExpandedAllRowKeysForResponse(e.target.checked);
              }}
            >
              {__i18n('展开所有')}
            </Checkbox>
          )}
          {!unControlled && (
            <Button
              type="primary"
              size="small"
              style={{ marginBottom: '5px' }}
              data-accessbilityid="project-api-schema-edit-btn"
              onClick={() => {
                return this.showSchemaForm('response');
              }}
            >
              {' '}
              {__i18n('编辑')}
            </Button>
          )}
          {responseSchemaData && responseSchemaData.schema && this.state.expandedAllRowKeysForResponse ? (
            <div>
              <Table
                size="small"
                pagination={false}
                expandable={{ defaultExpandedRowKeys: responseSchemaData.expandedRowKeys }}
                dataSource={responseSchemaData.schema}
                bordered
                columns={columns}
              />
            </div>
          ) : (
            <Table size="small" pagination={false} dataSource={responseSchemaData.schema} bordered columns={columns} />
          )}
        </div>

        <SchemaForm
          visible={this.state.schemaFormVisible}
          onCancel={this.closeSchemaForm}
          onOk={this.confirmSchemaForm}
          confirmLoading={this.state.schemaFormLoading}
          schemaFormType={this.state.schemaFormType}
          columns={columns}
          schemaData={this.props.schemaData}
        />
      </section>
    );
  }
}

export default InterfaceSchema;
