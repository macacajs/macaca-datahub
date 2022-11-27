import React, { Component } from 'react';

import { Form, Modal, Table, Alert, message } from 'antd';

import { genSchemaList } from '../../common/helper';

import MonacoEditor from '../MonacoEditor';

import './SchemaForm.less';

class SchemaFormComponent extends Component {
  constructor(props) {
    super(props);
    this.monacoEditorInstance = null;

    this.state = {
      stageData: null,
      schemaFormType: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { schemaData, schemaFormType } = nextProps;

    if (this.state.stageData && this.state.schemaFormType === schemaFormType) return;

    const schemaObject = schemaData.find((i) => {
      return i.type === schemaFormType;
    }) || {};
    const stageData = schemaObject.data && schemaObject.data.schemaData;

    this.setState({
      stageData,
      schemaFormType,
    });
  }

  validateSchema = () => {
    let [data, error] = [{}, null];
    try {
      data = JSON.parse(this.monacoEditorInstance.getValue() || '{}');
      this.setState({
        stageData: data,
      });
    } catch (err) {
      error = err;
    }
    return { data, error };
  };

  handleClickTableRow = (e) => {
    const text = e.target.innerText;
    const editor = this.monacoEditorInstance;

    function search() {
      if (!text) return;

      const params = {
        searchString: text,
        searchOnlyEditableRange: true,
        isRegex: false,
        matchCase: true,
        wordSeparators: '',
        captureMatches: true,
      };
      const matches = editor
        .getModel()
        .findMatches(
          params.searchString,
          params.searchOnlyEditableRange,
          params.isRegex,
          params.matchCase,
          params.wordSeparators,
          params.captureMatches,
        );

      if (!matches.length) return;

      const { endColumn, endLineNumber } = matches[0].range;
      editor.revealLineInCenter(endLineNumber);
      editor.setPosition({
        column: endColumn,
        lineNumber: endLineNumber,
      });
      editor.focus();
    }
    search();
  };

  render() {
    const {
      visible, onCancel, onOk, confirmLoading, schemaData, schemaFormType,
    } = this.props;

    const schemaObject = schemaData.find((i) => {
      return i.type === schemaFormType;
    }) || {};
    const stageData = schemaObject.data && schemaObject.data.schemaData;
    const schemaTableData = this.state.stageData && genSchemaList(this.state.stageData);
    return (
      <Modal
        style={{ top: '10px' }}
        width="95%"
        wrapClassName="schema-modal"
        visible={visible}
        destroyOnClose
        title={(
          <span>
            Schema&nbsp;&nbsp;
            <a
              target="_blank"
              href={
                window.localStorage.DATAHUB_LANGUAGE === 'zh-CN'
                  ? 'https://macacajs.github.io/macaca-datahub/zh/guide/schema-syntax.html'
                  : 'https://macacajs.github.io/macaca-datahub/guide/schema-syntax.html'
              }
            >
              syntax docs
            </a>
          </span>
        )}
        okText={__i18n('确定')}
        cancelText={__i18n('取消')}
        onCancel={onCancel}
        onOk={() => {
          const { data, error } = this.validateSchema();
          if (error) {
            message.warn(__i18n('格式错误，请输入 JSON Schema'));
            return;
          }
          const values = {
            data,
            type: schemaFormType,
          };
          onOk(values);
        }}
        confirmLoading={confirmLoading}
      >
        <Form layout="vertical" className="schema-content-form">
          <div className="schema-left-content">
            <MonacoEditor
              className="schema-monaco-editor"
              language="json"
              value={stageData && JSON.stringify(stageData, null, 2)}
              editorDidMount={(editor) => {
                this.monacoEditorInstance = editor;
                editor.focus();
              }}
            />
          </div>
          <div className="schema-right-content">
            <Alert message={__i18n('点击单元格，跳转到 Schema 编辑（支持重复点击）')} type="info" style={{ marginBottom: '12px' }} />
            <Table
              size="small"
              pagination={false}
              scroll={{ y: '62vh' }}
              expandable={{ defaultExpandedRowKeys: (schemaTableData && schemaTableData.expandedRowKeys) || [] }}
              dataSource={schemaTableData && schemaTableData.schema}
              bordered
              columns={this.props.columns}
              onRow={(record) => {
                return {
                  onClick: this.handleClickTableRow,
                };
              }}
            />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default SchemaFormComponent;
