# 实验特性

## 动态执行 Node.js 脚本

![](/macaca-datahub/assets/datahub-js-run-zh.png)

![](/macaca-datahub/assets/datahub-js-run-code-zh.png)

示例：

```javascript
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

sleep(500); // sleep 500 milliseconds

ctx.body = {
  query: ctx.query, // get querystring
  body: ctx.request.body, // get post json body
  inner_scene_data: await ctx.getSceneData('default'), // get other scene data
  from_mockjs: $mock.Mock.mock({
    'list|1-10': [{
      'id|+1': 1
    }],
  }), // http://mockjs.com/examples.html
  from_fakerjs: $mock.Faker.name.findName(), // http://marak.github.io/faker.js/
};
```

## 打开导入导出功能

![](/macaca-datahub/assets/1556087017130-d28c06f4-fc93-496a-8eec-ec5e6f1ce83d.png)

## 导入导出项目数据

![](/macaca-datahub/assets/1556087034370-c015c30c-3ffd-4c9a-8539-a3669ac31674.png)

## 导入导出接口数据

![](/macaca-datahub/assets/1556087047193-7f16c85f-f8e6-4adc-8665-fc62e74a55ea.png)
