# Experiment

## Dynamically execute Node.js modules

![](/macaca-datahub/assets/datahub-js-run-en.png)

![](/macaca-datahub/assets/datahub-js-run-code-en.png)

e.g.

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

## Use Upload and Download

![](/macaca-datahub/assets/1556086650491-f5126b12-7da6-4cef-9674-cff5f8fee43a.png)

## Upload and Download Project Data

![](/macaca-datahub/assets/1556086662394-c6301e41-61c9-474f-8eab-929550558e68.png)

## Upload and Download Interface Data

![](/macaca-datahub/assets/1556086685982-66cefd2e-b5da-4835-88d0-d095313883f2.png)
