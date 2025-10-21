# User Profile & Bank Accounts

All `/api/users/*` endpoints require a valid Bearer token from the authentication API. They operate on `req.user`, which is derived from the JWT payload.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/users/profile` | Bearer | Returns basic profile fields for the logged-in user. |
| `PUT` | `/api/users/profile` | Bearer | Updates `name` and `email` after validating uniqueness. |
| `PUT` | `/api/users/change-password` | Bearer | Changes the current user's password. |
| `GET` | `/api/users/bank-accounts` | Bearer | Lists saved bank accounts for the user. |
| `POST` | `/api/users/bank-accounts` | Bearer | Adds a bank account record. |
| `PUT` | `/api/users/bank-accounts/:id` | Bearer | Updates an existing bank account. |
| `DELETE` | `/api/users/bank-accounts/:id` | Bearer | Removes a bank account. |

## `GET /api/users/profile`

Returns:
```json
{
  "id": 12,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "user",
  "createdAt": "2024-03-01T10:12:45.000Z"
}
```

## `PUT /api/users/profile`

- **Body**
  - `name` `string` (required)
  - `email` `string` (required, valid format, unique across all users)
- **Behaviour:** Rejects duplicate emails with `400`. The response echoes the updated profile fields.

## `PUT /api/users/change-password`

- **Body**
  - `currentPassword` `string` (required)
  - `newPassword` `string` (required, minimum length: 6, must differ from `currentPassword`)
- **Errors**
  - `401` when `currentPassword` does not match the stored hash.
  - `400` for validation failures.
- **Response `200`**
  ```json
  { "message": "Şifreniz başarıyla değiştirildi." }
  ```

## Bank Account Endpoints

All bank account mutations ensure the IBAN is unique per user and matches Turkish formatting (`TR` followed by 24 digits).

### `GET /api/users/bank-accounts`
Returns an array ordered by `createdAt DESC`.

### `POST /api/users/bank-accounts`

- **Body**
  - `bankName` `string`
  - `iban` `string` (26 characters, starts with `TR`; whitespace is stripped automatically)
  - `accountName` `string`
- **Response `201`** – newly created bank account row.
- **Errors**
  - `400` if required fields are missing, format mismatch, or IBAN already exists for the user.

### `PUT /api/users/bank-accounts/:id`

Accepts the same body schema as `POST`. The `:id` must belong to the authenticated user; otherwise a `404` is returned. Unique/format validation applies.

### `DELETE /api/users/bank-accounts/:id`

Deletes the record if it belongs to the caller. Returns:
```json
{ "message": "Banka hesabı başarıyla silindi." }
```
