# Design concept

## Comprehensive Solution

DataHub is born to solving the lifecycle needs of mock/testing data of software development, from development, testing, staging to final production. Software engineers and test engineers use DataHub to manage their mock/testing data.

![](https://wx4.sinaimg.cn/large/6d308bd9gy1fokqvum2gsj20s10l70vh.jpg)

## Decentralization

DataHub is flexible with how and where mock/testing data is stored.

You can use a local instance of Datahub on your local machine to manage your local testing/mock data during development. The mock/testing data is in plain text. It can be versioned and archived with any version control software, together with your project files.

In addition, the local mock/testing data can be pushed and synchronized to a remote Datahub server to meet the needs of data sharing and collaboration.

![](https://wx3.sinaimg.cn/large/6d308bd9gy1fokxgydf80j20np0cr0ts.jpg)

## Data Flow Management

DataHub adopts the principle of unidirectional data flow to make sure you will always get the latest data.

![](https://wx1.sinaimg.cn/large/6d308bd9gy1fokxgywfajj20mx0g0wfj.jpg)

## Consistency Between API Document and Mock Data

Datahub can also automatically generate an API document from your mock/testing data, to help keep your API document up to date and consistent with your mock data.

![](https://ws1.sinaimg.cn/large/bceaad1fly1fwkophwa8qj229m1gejyw.jpg)

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

![](https://ws1.sinaimg.cn/large/bceaad1fly1fwkm9g34dcj229m1ge12a.jpg)

## Save Snapshot

DataHub can save the response of each request by taking snapshot. You can use the archieved snapshot to find out what happened.

![](https://ws1.sinaimg.cn/large/bceaad1fly1fwkm9fj6doj21kw13adnq.jpg)

## Automation Testing

Through the seamless integration of the [switchScene(scenario) API](https://macacajs.github.io/macaca-wd/#switchScene) in test cases, higher test coverage can be achieved.

![](https://wx1.sinaimg.cn/large/6d308bd9gy1g03hp2lea4j21950u0wyx.jpg)

![](https://wx1.sinaimg.cn/large/6d308bd9gy1g03hp2kkh3j21950u0wyg.jpg)

![](https://wx1.sinaimg.cn/large/6d308bd9ly1g0u0rdufm5j21640u0h8z.jpg)
