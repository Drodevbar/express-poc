## Small express API PoC project



## API specification

#### 1. Acquiring access token

`POST /api/auth/token`

Request body (JSON):
```json
{
  "email": "foo@bar.com",
  "password": "secret"
}
```

Possible responses:

| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 200    | Credentials match. Valid token is returned for existing user.       | `token` - valid JWT        |
| 201    | New user for given email has been created. Valid token is returned. | `token` - valid JWT        |
| 401    | Credentials don't match.                                            | `message` - error message |

---

### Todo

_All endpoints require valid access token that needs to be provided via `Authorization` header._
#### 1. Get all todos for logged in user


`GET /api/todo`

Possible responses:
| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 200    | Returns all todos for logged in user       | list of todos (with `id`, `title`, `isCompleted` properties)       |

---

#### 2. Get todo by id

`GET /api/todo/:id`

Possible responses:
| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 200    | Todo found        | object containing `id`, `title`, `isCompleted` properties
| 404    | Todo not found (might be deleted or doesn't belong to logged in user)       | `message` - error message      |

---

#### 3. Add new todo

`POST /api/todo`

Request body (JSON):
```json
{
  "title": "Do the dishes!" // string, min: 3, max: 300 chars
}
```

Possible responses:
| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 201    | Todo created        | object containing `id`, `title`, `isCompleted` properties
| 400    | Validation erros       | `messages` - array of validation errors      |

---

#### 4. Modify (partially) existing todo

`PATCH /api/todo/:id`

Request body (JSON):
```json
{
  "title": "Walk the dog!", // string, min: 3, max: 300 chars
  "isCompleted": true // boolean
}
```

Possible responses:
| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 200    | Todo modified        | object containing `id`, `title`, `isCompleted` properties
| 400    | Validation erros       | `messages` - array of validation errors      |
| 404    | Todo not found       | `message` - error message      |

---

#### 5. Delete existing todo

`DELETE /api/todo/:id`

Possible responses:
| Status | Description                                                         | Body                               |
|--------|---------------------------------------------------------------------|------------------------------------|
| 204    | Todo deleted        | `<no content>`
| 404    | Todo not found       | `message` - error message      |

