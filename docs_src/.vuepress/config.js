'use strict';

const name = 'macaca-datahub';

module.exports = {
  dest: 'docs',
  base: `/${name}/`,

  locales: {
    '/': {
      lang: 'en-US',
      title: 'DataHub',
      description: 'Just enjoy the data out-of-the-box.📦',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'DataHub',
      description: '全周期的数据环境解决方案',
    },
  },
  head: [
    ['script', {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-49226133-2',
    }, ''],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-49226133-2');
    `]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: `macacajs/${name}`,
    editLinks: true,
    docsDir: 'docs_src',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh',
          },
        },
        nav: [
          {
            text: 'Guide',
            link: '/guide/introduce.html'
          },
        ],
        sidebar: {
          '/guide/': genSidebarConfig('Guide')
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用',
            buttonText: '刷新',
          },
        },
        nav: [
          {
            text: '指南',
            link: '/zh/guide/introduce.html'
          },
        ],
        sidebar: {
          '/zh/guide/': genSidebarConfig('指南')
        }
      },
    },
  },
};

function genSidebarConfig(title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'introduce',
        'design-concept',
        'install',
        'config',
        'webpack-tutorial',
        'quick-start',
        'schema',
        'project-integration',
        'share',
      ],
    },
  ];
}
