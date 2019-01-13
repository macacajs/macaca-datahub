# Schema 语法

DataHub 采用 [标准的 JSON schema 语法](//github.com/epoberezkin/ajv) 来描述接口，用以校验数据和自动生成文档，schema 需要以下格式：

```json
{
  "type": "object",
  "required": [
    "success"
  ],
  "properties": {
    "success": {
      "type": "boolean",
      "description": "server side success"
    },
    "data": {
      "type": "array",
      "description": "data field",
      "required": [
        "age",
        "key",
        "name",
        "address"
      ],
      "items": [
        {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "key": {
              "type": "string",
              "description": "key description"
            },
            "name": {
              "type": "string",
              "description": "name description"
            },
            "age": {
              "type": "number",
              "description": "age description"
            },
            "address": {
              "type": "string",
              "description": "address description"
            }
          }
        }
      ]
    },
    "errorMessage": {
      "type": "string",
      "description": "error message description"
    }
  }
}
```

