import React from 'react';
import ReactGA from 'react-ga';
import ReactDom from 'react-dom';
import { Alert, Layout } from 'antd';
import { intlShape, addLocaleData, IntlProvider } from 'react-intl';

import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import zhCN from './locale/zh_CN';
import enUS from './locale/en_US';

import Home from './pages/Home';
import Project from './pages/Project';
import Document from './pages/Document';
import DashBoard from './pages/DashBoard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ThemeManager from './common/theme';

import { getExperimentConfig, compareServerVersion } from './common/helper';

import 'react-github-button/assets/style.css';

import './app.less';
import './app.module.less';

const themeManager = new ThemeManager();

window.themeManager = window.themeManager || themeManager;

const importAll = (r) => {
  return r.keys().forEach(r);
};
importAll(require.context('./assets/icons', false, /\.svg$/));

addLocaleData([...en, ...zh]);

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
            message={
              <div>
                <span>{`Your DataHub server version is ${window.pageConfig.version}, please upgrade to datahub@2: `}</span>
                <a target="_blank" href="https://github.com/macacajs/macaca-datahub/issues/77">
                  https://github.com/macacajs/macaca-datahub/issues/77
                </a>
              </div>
            }
            type="warning"
            showIcon
          />
        )}
        {this.state.shouldUpdate && !localStorage.getItem(this.getCloseTipFlag()) && (
          <Alert
            banner
            message={
              <div>
                <span>{`Your DataHub server version is ${window.pageConfig.version}, please upgrade to datahub@${this.state.latestVesion} `}</span>
                <a target="_blank" href="https://www.npmjs.com/package/macaca-datahub">
                  https://www.npmjs.com/package/macaca-datahub
                </a>
              </div>
            }
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
          currentLocale={this.context.intl.locale}
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

// This is just for <Footer/> component
// react-intl will use new context API, watch on it
App.contextTypes = {
  intl: intlShape.isRequired,
};

const chooseLocale = () => {
  const zh = {
    locale: 'zh-CN',
    messages: zhCN,
  };
  const en = {
    locale: 'en-US',
    messages: enUS,
  };
  const ua = window.navigator.userAgent;
  if (ua.indexOf('en-US') !== -1) return en;
  if (ua.indexOf('zh-CN') !== -1) return zh;

  const language = window.localStorage.DATAHUB_LANGUAGE || window.navigator.language;

  switch (language) {
    case 'zh-CN':
    case 'zh-HK':
    case 'zh-TW':
    case 'zh':
      return zh;
    default:
      return en;
  }
};

if (window.pageConfig) {
  const { locale, messages } = chooseLocale();
  ReactDom.render(
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>,
    document.querySelector('#app'),
  );
} else {
  document.querySelector('#app').innerHTML = 'please set page config';
}
