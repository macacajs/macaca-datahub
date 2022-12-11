import React from 'react';
import ReactGA from 'react-ga';
import ReactDom from 'react-dom';
import { Alert, Layout } from 'antd';
import locale from 'easy-i18n-cli/src/locale';
import Home from './pages/Home';
import Project from './pages/Project';
import Document from './pages/Document';
import DashBoard from './pages/DashBoard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ThemeManager from './common/theme';
import en from './locale/en-US';

import { getExperimentConfig, compareServerVersion } from './common/helper';

import 'react-github-button/assets/style.css';

import './app.less';
import './app.module.less';

const themeManager = new ThemeManager();

window.themeManager = window.themeManager || themeManager;

window.__i18n = window.__i18n || locale({
  en,
  useEn() {
    const language = window.localStorage.DATAHUB_LANGUAGE || window.navigator.language;
    return language.startsWith('en');
  },
});

const importAll = (r) => {
  return r.keys().forEach(r);
};
importAll(require.context('./assets/icons', false, /\.svg$/));

const { Content } = Layout;

const pkg = require('../package.json');

localStorage.debug = 'datahub*';

window.addEventListener('load', () => {
  ReactGA.initialize('UA-49226133-2');
  ReactGA.pageview(window.location.pathname + window.location.search);
  process.env.traceFragment;
});

class App extends React.Component {
  // Should use react context in the future
  state = {
    experimentConfig: getExperimentConfig(),
    shouldUpdate: false,
    latestVesion: '',
  };

  componentDidMount() {
    compareServerVersion().then((res) => {
      this.setState({
        shouldUpdate: res.shouldUpdate,
        latestVesion: res.latestVesion,
      });
    });
  }

  updateExperimentConfig = (payload) => {
    this.setState({
      experimentConfig: {
        ...this.state.experimentConfig,
        ...payload,
      },
    });
  };

  pageRouter = () => {
    switch (this.props.pageConfig.pageId) {
      case 'dashboard':
        return <DashBoard experimentConfig={this.state.experimentConfig} />;
      case 'project':
        return <Project experimentConfig={this.state.experimentConfig} />;
      case 'document':
        return <Document experimentConfig={this.state.experimentConfig} />;
      default:
        return <Home />;
    }
  };

  renderInfo = () => {
    const link = location.href;
    return (
      <div className="info">
        <p>please visit the page in desktop browser.</p>
        <p className="link">
          <a href={link} target="_blank">
            {link}
          </a>
        </p>
      </div>
    );
  };

  changeLang = (lang) => {
    window.localStorage.DATAHUB_LANGUAGE = lang;
    location.href = `/?locale=${lang}`;
  };

  closeTip = () => {
    localStorage.setItem(this.getCloseTipFlag(), true);
  };

  getCloseTipFlag = () => {
    const date = new Date();
    const info = `notice-${date.getFullYear()}-${date.getMonth() + 1}`;
    return info;
  };

  render() {
    return (
      <Layout className={`page-${this.props.pageConfig.pageId}`}>
        {window.pageConfig.version[0] === '1' && (
          <Alert
            banner
            message={(
              <div>
                <span>{`Your DataHub server version is ${window.pageConfig.version}, please upgrade to datahub@2: `}</span>
                <a target="_blank" href="https://github.com/macacajs/macaca-datahub/issues/77">
                  https://github.com/macacajs/macaca-datahub/issues/77
                </a>
              </div>
            )}
            type="warning"
            showIcon
          />
        )}
        {this.state.shouldUpdate && !localStorage.getItem(this.getCloseTipFlag()) && (
          <Alert
            banner
            message={(
              <div>
                <span>{`Your DataHub server version is ${window.pageConfig.version}, please upgrade to datahub@${this.state.latestVesion} `}</span>
                <a target="_blank" href="https://www.npmjs.com/package/macaca-datahub">
                  https://www.npmjs.com/package/macaca-datahub
                </a>
              </div>
            )}
            type="warning"
            closable
            showIcon
            onClose={this.closeTip}
          />
        )}
        <Header links={pkg.links} pageConfig={window.pageConfig} context={this.props.context} />
        <Content className="main-content">{this.pageRouter()}</Content>
        <Content className="main-content-mobile">{this.renderInfo()}</Content>
        <Footer
          experimentConfig={this.state.experimentConfig}
          updateExperimentConfig={this.updateExperimentConfig}
          showSideItems={window.pageConfig && window.pageConfig.pageId !== 'home'}
          changeLang={this.changeLang}
          links={pkg.links}
        />
      </Layout>
    );
  }
}

App.defaultProps = {
  context: window.context,
  pageConfig: window.pageConfig,
};

if (window.pageConfig) {
  ReactDom.render(
    <App />,
    document.querySelector('#app'),
  );
} else {
  document.querySelector('#app').innerHTML = 'please set page config';
}
