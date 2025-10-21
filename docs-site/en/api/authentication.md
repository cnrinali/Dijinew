# Authentication API

These endpoints create and manage Dijinew user sessions. Tokens are JSON Web Tokens signed with `JWT_SECRET` and are valid for 30 days by default.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Registers a new user and returns a JWT. |
| `POST` | `/api/auth/login` | Public | Authenticates a user and returns a JWT. |
| `POST` | `/api/auth/logout` | Bearer | Emits a logout activity; the client must discard its token. |
| `POST` | `/api/auth/forgot` | Public | Issues a password-reset email if the address exists. |
| `PUT` | `/api/auth/reset/:resetToken` | Public | Resets a password using the emailed token. |
| `PUT` | `/api/auth/update-role` | Bearer (admin) | Updates another user's role. |

## `POST /api/auth/register`

- **Body**
  - `name` `string` (required)
  - `email` `string` (required, unique, valid email format)
  - `password` `string` (required)
  - `role` `string` (optional, defaults to `user`; allowed values: `user`, `corporate`, `admin`)
- **Behaviour**
  - Rejects duplicate emails with `400`.
  - Hashes the password with bcrypt and stores it in `Users.password`.
- **Response `201`**
  ```json
  {
    "id": 12,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "user",
    "token": "<jwt>"
  }
  ```

## `POST /api/auth/login`

- **Body**
  - `email` `string` (required)
  - `password` `string` (required)
- **Behaviour**
  - Validates credentials against the hashed password.
  - Logs the login via `ActivityLogger`.
  - Embeds `role` and optional `companyId` inside the JWT payload.
- **Response `200`**
  ```json
  {
    "id": 12,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "corporate",
    "companyId": 5,
    "token": "<jwt>"
  }
  ```
- **Errors**
  - `400` if inputs are missing.
  - `401` for invalid credentials.

## `POST /api/auth/logout`

- **Access:** Bearer (any authenticated role).
- **Behaviour:** Writes a logout activity record and returns a success message. Tokens are not revoked server-side; the client must delete its stored token.
- **Response `200`**
  ```json
  { "message": "Çıkış başarılı (istemci token silmeli)" }
  ```

## `POST /api/auth/forgot`

- **Body**
  - `email` `string` (required)
- **Behaviour**
  - Generates a one-time reset token, hashes it, and stores it alongside an expiration timestamp (`+10 minutes`).
  - Logs the reset URL to the server console; integrate an email provider to send the message.
- **Response `200`** regardless of whether the email exists, to prevent account enumeration.

## `PUT /api/auth/reset/:resetToken`

- **Params**
  - `resetToken` `string` – raw token from the reset link.
- **Body**
  - `password` `string` (required)
- **Behaviour**
  - Hashes `resetToken`, looks up a user whose token matches and has not expired, then stores the new password and clears reset fields.
- **Errors**
  - `400` for missing password or an invalid/expired token.

## `PUT /api/auth/update-role`

- **Access:** Bearer token with `role = admin`.
- **Body**
  - `userId` `number` (required)
  - `role` `string` (required; typical values: `admin`, `corporate`, `user`)
- **Behaviour**
  - Updates the target user's `role`. Returns `404` if the user does not exist.
