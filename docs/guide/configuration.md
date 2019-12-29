# Configuration

| key          | type     | description                 | default   |
| ------------ | -------- | --------------------------- | --------- |
| port         | Number   | port for DataHub server     | 9200      |
| mode         | String   | mode for DataHub server     | 'prod'    |
| protocol     | String   | protocol for DataHub server | 'http'    |
| database     | String   | path to file database       | $HOME     |
| store        | String   | path to migrate directory   | undefined |
| view         | Object   | view layer config           | {}        |

Sample: [macaca-datahub.config.js](./macaca-datahub.config.js)

```javascript
module.exports = {
  mode: 'local',

  port: 7001,

  store: path.resolve(__dirname, 'data'),

  view: {
    // set assets base url
    assetsUrl: 'https://npmcdn.com/datahub-view@latest',
  },
};
```

You can also use the Third-part UI platform, for example use [datahub-platform](//github.com/zhuyali/datahub-platform), only need to point `assetsUrl`.

```javascript
module.exports = {
  view: {
    assetsUrl: 'https://unpkg.com/datahub-platform@latest',
  },
};

```

Pass config file[`.js`|`.json`] to DataHub server.

```bash
$ datahub server -c path/to/config.js --verbose
```

## Database

DataHub's data persistence relies on sqllite, and database management software can view the data in DataHub.

```bash
$ cd $HOME/.macaca-datahub
```

![](/macaca-datahub/assets/datahub-sqllite.png)
