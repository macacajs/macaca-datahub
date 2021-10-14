import React, {
  Component,
} from 'react';

import {
  Form,
  Modal,
  Table,
  Alert,
  message,
} from 'antd';

import {
  injectIntl,
} from 'react-intl';

import '../../common/jsonlint';
import { genSchemaList } from '../../common/helper';

import {
  UnControlled as CodeMirror,
  defaultCodeMirrorOptions as codeMirrorOptions,
} from '../../common/codemirror';

import './SchemaForm.less';

class SchemaFormComponent extends Component {
  constructor (props) {
    super(props);
    this.codeMirrorInstance = null;

    this.state = {
      stageData: null,
      cursor: null,
      schemaFormType: '',
    };
  }

  componentWillReceiveProps (nextProps) {
    const {
      schemaData,
      schemaFormType,
    } = nextProps;

    if (this.state.stageData && this.state.schemaFormType === schemaFormType) return;

    const schemaObject = schemaData.find(i => i.type === schemaFormType) || {};
    const stageData = schemaObject.data && schemaObject.data.schemaData;

    this.setState({
      stageData,
      schemaFormType,
    });
  }

  formatMessage = id => this.props.intl.formatMessage({ id });

  validateSchema = () => {
    let [data, error] = [{}, null];
    try {
      data = JSON.parse(this.codeMirrorInstance.doc.getValue());
    } catch (err) {
      error = err;
    }
    return { data, error };
  }

  handleCodeMirrorBlur = editor => {
    this.setState({
      cursor: editor.getCursor(),
    });
    try {
      const stageData = JSON.parse(editor.getValue());
      this.setState({
        stageData,
      });
    } catch (e) {
    }
  }

  handleClickTableRow = e => {
    const text = e.target.innerText;
    let lastPos = null;
    let lastQuery = null;
    const editor = this.codeMirrorInstance;

    function search () {
      if (!text) return;
      if (lastQuery !== text) lastPos = null;

      let cursor = editor.getSearchCursor(text, lastPos || editor.getCursor());

      if (!cursor.findNext()) {
        cursor = editor.getSearchCursor(text);
        if (!cursor.findNext()) return;
      }

      editor.setSelection(cursor.from(), cursor.to());
      lastQuery = text;
      lastPos = cursor.to();
      editor.focus();
      editor.doc.setCursor(cursor.pos.to);
    }
    search();
  }

  render () {
    const {
      visible,
      onCancel,
      onOk,
      confirmLoading,
      schemaData,
      schemaFormType,
    } = this.props;

    const formatMessage = this.formatMessage;
    const schemaObject = schemaData.find(i => i.type === schemaFormType) || {};
    const stageData = schemaObject.data && schemaObject.data.schemaData;
    const schemaTableData = this.state.stageData && genSchemaList(this.state.stageData);
    return <Modal
      style={{top: '10px'}}
      width='95%'
      wrapClassName='schema-modal'
      visible={visible}
      destroyOnClose={true}
      title={
        <span>Schema&nbsp;&nbsp;
          <a target="_blank"
            href="https://github.com/macacajs/macaca-datahub/blob/master/README.md#schema-syntax">
            syntax docs
          </a>
        </span>}
      okText={formatMessage('common.confirm')}
      cancelText={formatMessage('common.cancel')}
      destroyOnClose={true}
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
          <CodeMirror
            style={{ height: `${window.document.body.clientHeight}px` }}
            value={stageData && JSON.stringify(stageData, null, 2)}
            options={codeMirrorOptions}
            editorDidMount={instance => {
              this.codeMirrorInstance = instance;
              instance.focus();
            }}
            cursor={this.state.cursor}
            onBlur={this.handleCodeMirrorBlur}
          />
        </div>
        <div className="schema-right-content">
          <Alert
            message={formatMessage('schemaData.tableJumpInfo')}
            type="info"
            style={{ marginBottom: '10px' }}
          />
          <Table
            size="small"
            pagination={false}
            defaultExpandedRowKeys={schemaTableData && schemaTableData.expandedRowKeys || []}
            dataSource={schemaTableData && schemaTableData.schema}
            bordered
            columns={this.props.columns}
            onRow={record => ({
              onClick: this.handleClickTableRow,
            })}
          />
        </div>
      </Form>
    </Modal>;
  }
}

export default injectIntl(SchemaFormComponent);
