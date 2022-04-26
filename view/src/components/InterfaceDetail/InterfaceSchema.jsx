import React, { Component } from 'react';

import { Table, Button, Checkbox } from 'antd';

import { injectIntl } from 'react-intl';

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

  formatMessage = (id) => this.props.intl.formatMessage({ id });

  isValidationEnabled = (type) => {
    const { data = {} } = this.props.schemaData.find((i) => i.type === type) || {};
    return data.enableSchemaValidate;
  };

  getDataSource = (type) => {
    const { data = {} } = this.props.schemaData.find((i) => i.type === type) || {};
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

  getColumns = () => [
    {
      title: this.props.intl.formatMessage({ id: 'schemaData.field' }),
      dataIndex: 'field',
      width: '30%',
      key: 'field',
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: this.props.intl.formatMessage({ id: 'schemaData.type' }),
      dataIndex: 'type',
      width: '15%',
      key: 'type',
      render: (text, record, index) => <span className="text-capitalize">{text}</span>,
    },
    {
      title: this.props.intl.formatMessage({ id: 'schemaData.required' }),
      dataIndex: 'required',
      width: '15%',
      key: 'required',
      render: (text, record, index) => <Checkbox checked={text} disabled></Checkbox>,
    },
    {
      title: this.props.intl.formatMessage({ id: 'schemaData.description' }),
      width: '40%',
      dataIndex: 'description',
      key: 'description',
    },
  ];

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
          <h1>{this.formatMessage('interfaceDetail.requestSchema')}</h1>
          {!unControlled && (
            <Checkbox
              checked={enableRequestSchemaValidation}
              onChange={(e) => props.toggleValidation('request', e.target.checked)}
            >
              {this.formatMessage('schemaData.enableValidation')}
            </Checkbox>
          )}
          {!unControlled && (
            <Checkbox
              checked={this.state.expandedAllRowKeysForRequest}
              onChange={(e) => this.changeExpandedAllRowKeysForRequest(e.target.checked)}
            >
              {this.formatMessage('schemaData.enableExpandedAllRowKeys')}
            </Checkbox>
          )}
          {!unControlled && (
            <Button
              type="primary"
              size="small"
              style={{ marginBottom: '5px' }}
              data-accessbilityid="project-api-schema-edit-btn"
              onClick={() => this.showSchemaForm('request')}
            >
              {' '}
              {this.formatMessage('schemaData.edit')}
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
          <h1 style={{ marginTop: '24px' }}>{this.formatMessage('interfaceDetail.responseSchema')}</h1>
          {!unControlled && (
            <Checkbox
              checked={enableResponseSchemaValidation}
              onChange={(e) => props.toggleValidation('response', e.target.checked)}
            >
              {this.formatMessage('schemaData.enableValidation')}
            </Checkbox>
          )}
          {!unControlled && (
            <Checkbox
              checked={this.state.expandedAllRowKeysForResponse}
              onChange={(e) => this.changeExpandedAllRowKeysForResponse(e.target.checked)}
            >
              {this.formatMessage('schemaData.enableExpandedAllRowKeys')}
            </Checkbox>
          )}
          {!unControlled && (
            <Button
              type="primary"
              size="small"
              style={{ marginBottom: '5px' }}
              data-accessbilityid="project-api-schema-edit-btn"
              onClick={() => this.showSchemaForm('response')}
            >
              {' '}
              {this.formatMessage('schemaData.edit')}
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

export default injectIntl(InterfaceSchema);
