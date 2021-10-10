import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import './jsonlint';

export {
  UnControlled,
  Controlled,
} from 'react-codemirror2';

export const jsonCodeMirrorOptions = {
  theme: 'default',
  mode: 'application/json',
  lint: true,
  autofocus: true,
  foldGutter: true,
  lineNumbers: true,
  matchBrackets: true,
  styleActiveLine: true,
  autoCloseBrackets: true,
  showTrailingSpace: true,
  placeholder: '{\n  ... Input JSON data here\n}',
  scrollbarStyle: 'overlay',
  gutters: [
    'CodeMirror-lint-markers',
    'CodeMirror-foldgutter',
  ],
};

export const jsCodeMirrorOptions = {
  theme: 'default',
  mode: 'text/javascript',
  lint: true,
  autofocus: true,
  foldGutter: true,
  lineNumbers: true,
  matchBrackets: true,
  styleActiveLine: true,
  autoCloseBrackets: true,
  showTrailingSpace: true,
  placeholder: '// Input Javascript code here\nctx.body = { time: Date.now() };\n',
  scrollbarStyle: 'overlay',
  gutters: [
    'CodeMirror-lint-markers',
    'CodeMirror-foldgutter',
  ],
};
