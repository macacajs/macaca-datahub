# Schema Syntax

DataHub use [standard JSON schema syntax](//github.com/epoberezkin/ajv), schema must has the `root` node.

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

