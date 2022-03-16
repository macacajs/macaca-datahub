import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

export const monacoEditor = editor;

export const monacoEditorDefaultConfig = {
  language: 'json',
  automaticLayout: true,
  tabSize: 2,
  formatOnPaste: true,
  links: true,
  showFoldingControls: 'always',
  minimap: { enabled: false },
};
