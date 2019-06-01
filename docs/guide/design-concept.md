# Design concept

## Comprehensive Solution

DataHub is born to solving the lifecycle needs of mock/testing data of software development, from development, testing, staging to final production. Software engineers and test engineers use DataHub to manage their mock/testing data.

![](/macaca-datahub/assets/1556086490725-acfac2d7-cf35-487a-969c-808c1f8ade72.png)

## Decentralization

DataHub is flexible with how and where mock/testing data is stored.

You can use a local instance of Datahub on your local machine to manage your local testing/mock data during development. The mock/testing data is in plain text. It can be versioned and archived with any version control software, together with your project files.

In addition, the local mock/testing data can be pushed and synchronized to a remote Datahub server to meet the needs of data sharing and collaboration.

![](/macaca-datahub/assets/1556086532480-37b7b14f-49c7-49dd-9073-6a8fbd6d4798.png)

## Data Flow Management

DataHub adopts the principle of unidirectional data flow to make sure you will always get the latest data.

![](/macaca-datahub/assets/1556086545198-c616ab3f-c817-4e0c-a178-4774c800f0b3.png)

## Consistency Between API Document and Mock Data

Datahub can also automatically generate an API document from your mock/testing data, to help keep your API document up to date and consistent with your mock data.

![](/macaca-datahub/assets/1556086563101-f3e67f48-fc7a-44ba-89af-006e5806d12f.png)

## DataHub Dashboard

DataHub adopts multi-scenario design, can group data according to the scene name, and provide scene data addition, deletion, and change, and can operate through DataHub's panel interface.

DataHub provides a dashboard for you to manage your data. You can group data by scene, or by stage such as development, testing, or staging. Datahub provides standard CRUD funtions.

Datahub use [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for dynamic path matching.

API name example:

| DataHub API name | matched request path |
| ----             | ----                 |
| api1/books       | api1/books           |
| api2/:foo/:bar   | api2/group/project   |
| api3/:id         | api3/fred            |
| api3/:id         | api3/baz             |

![](/macaca-datahub/assets/1556086579826-71b38922-b6f4-40e9-be7f-a530a30ad8ce.png)

## Save Snapshot

DataHub can save the response of each request by taking snapshot. You can use the archieved snapshot to find out what happened.

![](/macaca-datahub/assets/1556086592035-2367cbca-2521-4b10-bfd7-c8fc70577ce1.png)

## Automation Testing

Through the seamless integration of the [switchScene(scenario) API](https://macacajs.github.io/macaca-wd/#switchScene) in test cases, higher test coverage can be achieved.

![](/macaca-datahub/assets/1556086605998-4e6c3073-21eb-4100-87e2-e1f15dd4115a.png)

![](/macaca-datahub/assets/1556086618676-859c45b0-bd38-40e0-8886-3d06607ac19d.png)

![](/macaca-datahub/assets/1556086630693-5b7d1828-087f-4c15-85a4-1959f3c4fb3a.png)
