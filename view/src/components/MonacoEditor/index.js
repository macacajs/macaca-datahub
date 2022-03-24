import React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { noop, processSize } from './utils';

class MonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.containerElement = undefined;
    this._subscription = null;
    this.__prevent_trigger_change_event = false;
  }

  componentDidMount() {
    const value = this.props.value != null ? this.props.value : this.props.defaultValue;
    const { theme, overrideServices, className, readOnly } = this.props;
    if (this.containerElement) {
      const options = {
        value,
        readOnly,
        ...this.props.options,
        ...this.editorWillMount(),
        ...(className ? { extraEditorClassName: className } : {}),
        ...(theme ? { theme } : {}),
      };
      this.editor = monaco.editor.create(this.containerElement, options, overrideServices);
      this.editorDidMount(this.editor);
    }
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme, height, options, width, className } = this.props;

    const { editor } = this;
    const model = editor.getModel();

    if (this.props.value != null && this.props.value !== model.getValue()) {
      this.__prevent_trigger_change_event = true;
      this.editor.pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ],
      );
      this.editor.pushUndoStop();
      this.__prevent_trigger_change_event = false;
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(model, language);
    }
    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }
    if (editor && (width !== prevProps.width || height !== prevProps.height)) {
      editor.layout();
    }
    if (prevProps.options !== options) {
      const { model: _model, ...optionsWithoutModel } = options;
      editor.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel,
      });
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.dispose();
      const model = this.editor.getModel();
      if (model) {
        model.dispose();
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount ? editorWillMount(monaco) : {};
    return options;
  }

  editorDidMount(editor) {
    this.props.editorDidMount(editor, monaco);

    this._subscription = editor.onDidChangeModelContent((event) => {
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(editor.getValue(), event);
      }
    });
  }

  render() {
    const { width, height } = this.props;
    const fixedWidth = processSize(width);
    const fixedHeight = processSize(height);
    const style = {
      width: fixedWidth,
      height: fixedHeight,
      border: '1px solid rgba(0, 0, 0, 0.2)',
    };

    return (
      <div
        ref={(component) => {
          this.containerElement = component;
        }}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }
}

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  theme: null,
  options: {},
  overrideServices: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  className: null,
  readOnly: false,
  onDidBlurEditorWidget: noop,
};

const monacoEditorDefaultConfig = {
  language: 'json',
  automaticLayout: true,
  tabSize: 2,
  formatOnPaste: true,
  links: true,
  showFoldingControls: 'always',
  minimap: { enabled: false },
};

const monacoEditorJsonConfig = {
  ...monacoEditorDefaultConfig,
  language: 'json',
  placeholder: '{\n  ... Input JSON data here\n}',
};

const monacoEditorJsConfig = {
  ...monacoEditorDefaultConfig,
  language: 'javascript',
  placeholder: '// Input Javascript code here\nctx.body = { time: Date.now() };\n',
};

export { MonacoEditor, monacoEditorDefaultConfig, monacoEditorJsonConfig, monacoEditorJsConfig };
