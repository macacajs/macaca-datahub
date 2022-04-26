const fs = require('fs');
const path = require('path');

const template = path.join(__dirname, '..', 'index.html');

module.exports = (context, pageConfig = {}) =>
  new Promise((resolve) => {
    const content = fs
      .readFileSync(template, 'utf8')
      .replace(
        /<!--\s*data\s*-->/,
        () => `
          <script>
            window.pageConfig = ${JSON.stringify(pageConfig)};
            window.context = ${JSON.stringify(context)};
          </script>
        `,
      )
      .replace(/<!--\s*title\s*-->/, () => `${pageConfig.title} - DataHub`);
    resolve(content);
  });
