import React, { Component } from 'react';

import { Form, Modal, Table, Alert, message } from 'antd';

import { injectIntl } from 'react-intl';

import '../../common/jsonlint';
import { genSchemaList } from '../../common/helper';

import { UnControlled as CodeMirror, defaultCodeMirrorOptions as codeMirrorOptions } from '../../common/codemirror';

import { MonacoEditor, monacoEditorJsonConfig } from '../MonacoEditor';

import './SchemaForm.less';

class SchemaFormComponent extends Component {
  constructor(props) {
    super(props);
    this.codeMirrorInstance = null;
    this.monacoEditorInstance = null;

    this.state = {
      stageData: null,
      cursor: null,
      schemaFormType: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { schemaData, schemaFormType } = nextProps;

    if (this.state.stageData && this.state.schemaFormType === schemaFormType) return;

    const schemaObject = schemaData.find((i) => i.type === schemaFormType) || {};
    const stageData = schemaObject.data && schemaObject.data.schemaData;

    this.setState({
      stageData,
      schemaFormType,
    });
  }

  formatMessage = (id) => this.props.intl.formatMessage({ id });

  validateSchema = () => {
    let [data, error] = [{}, null];
    try {
      data = JSON.parse(this.monacoEditorInstance.getValue());
    } catch (err) {
      error = err;
    }
    return { data, error };
  };

  handleCodeMirrorBlur = (editor) => {
    this.setState({
      cursor: editor.getCursor(),
    });
    try {
      const stageData = JSON.parse(editor.getValue());
      this.setState({
        stageData,
      });
    } catch (e) {}
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
      editor.setPosition({
        column: endColumn,
        lineNumber: endLineNumber,
      });
      editor.focus();
    }
    search();
  };

  render() {
    const { visible, onCancel, onOk, confirmLoading, schemaData, schemaFormType } = this.props;

    const formatMessage = this.formatMessage;
    const schemaObject = schemaData.find((i) => i.type === schemaFormType) || {};
    const stageData = schemaObject.data && schemaObject.data.schemaData;
    const schemaTableData = this.state.stageData && genSchemaList(this.state.stageData);
    return (
      <Modal
        style={{ top: '10px' }}
        width="95%"
        wrapClassName="schema-modal"
        visible={visible}
        destroyOnClose={true}
        title={
          <span>
            Schema&nbsp;&nbsp;
            <a target="_blank" href="https://github.com/macacajs/macaca-datahub/blob/master/README.md#schema-syntax">
              syntax docs
            </a>
          </span>
        }
        okText={formatMessage('common.confirm')}
        cancelText={formatMessage('common.cancel')}
        onCancel={onCancel}
        onOk={() => {
          const { data, error } = this.validateSchema();
          if (error) {
            message.warn(formatMessage('schemaData.invalidSchemaData'));
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
            {/* <CodeMirror
            style={{ height: `${window.document.body.clientHeight}px` }}
            value={stageData && JSON.stringify(stageData, null, 2)}
            options={codeMirrorOptions}
            editorDidMount={instance => {
              this.codeMirrorInstance = instance;
              instance.focus();
            }}
            cursor={this.state.cursor}
            onBlur={this.handleCodeMirrorBlur}
          /> */}
            <MonacoEditor
              height={window.document.body.clientHeight}
              options={monacoEditorJsonConfig}
              value={stageData && JSON.stringify(stageData, null, 2)}
              theme="vs-light"
              editorDidMount={(editor) => {
                this.monacoEditorInstance = editor;
                editor.focus();
              }}
            />
          </div>
          <div className="schema-right-content">
            <Alert message={formatMessage('schemaData.tableJumpInfo')} type="info" style={{ marginBottom: '10px' }} />
            <Table
              size="small"
              pagination={false}
              defaultExpandedRowKeys={(schemaTableData && schemaTableData.expandedRowKeys) || []}
              dataSource={schemaTableData && schemaTableData.schema}
              bordered
              columns={this.props.columns}
              onRow={(record) => ({
                onClick: this.handleClickTableRow,
              })}
            />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default injectIntl(SchemaFormComponent);
