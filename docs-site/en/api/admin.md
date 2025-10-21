# Admin API

All `/api/admin/*` endpoints require an authenticated user whose JWT role is `admin`. The admin router wires several modules together for user, company, and card administration plus dashboards.

## Summary

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/admin/stats` | Returns headline figures for the admin dashboard. |
| `GET` | `/api/admin/users` | Lists every user with optional company metadata. |
| `POST` | `/api/admin/users` | Creates a user on behalf of an admin. |
| `PUT` | `/api/admin/users/:id` | Updates a user's profile/role/company. |
| `DELETE` | `/api/admin/users/:id` | Deletes a user (self-deletion is blocked). |
| `POST` | `/api/admin/companies` | Creates a company record. |
| `GET` | `/api/admin/companies` | Lists companies. |
| `GET` | `/api/admin/companies/:id` | Fetches a company by id. |
| `PUT` | `/api/admin/companies/:id` | Updates company metadata and limits. |
| `DELETE` | `/api/admin/companies/:id` | Deletes a company (fails if FK constraints block). |
| `GET` | `/api/admin/cards` | Lists cards across the platform; accepts filters and pagination. |
| `POST` | `/api/admin/cards` | Creates a card (individual or corporate) with extensive validation. |
| `PUT` | `/api/admin/cards/:id` | Updates any card. |
| `DELETE` | `/api/admin/cards/:id` | Deletes a card. |
| `GET` | `/api/admin/cards/export` | Streams an Excel workbook containing all cards. |
| `POST` | `/api/admin/cards/import` | Imports cards from an uploaded Excel file (`file` field). |
| `GET` | `/api/admin/cards/qr-codes` | Streams a ZIP of PNG QR codes for all active cards. |
| `GET` | `/api/admin/cards/:id/qr` | Streams a single card QR code as PNG. |
| `GET` | `/api/admin/companies/:companyId/cards` | Same as `/api/admin/cards` but scoped to a company. |

## Dashboard Stats

`GET /api/admin/stats` queries `Users` and `Cards` to return:

```json
{
  "totalUsers": 120,
  "totalCards": 350,
  "activeCards": 280
}
```

## User Management

### `GET /api/admin/users`
Returns all users ordered by creation date, including `companyId` and `companyName`.

### `POST /api/admin/users`

- **Body**
  - `name`, `email`, `password`, `role` (required; role must be `admin`, `user`, or `corporate`)
  - `companyId` `number` (optional; validated when present)
- **Behaviour**
  - Rejects duplicate emails and invalid roles.
  - Hashes the password using bcrypt.
  - If `companyId` is supplied, verifies the company exists.
- **Response `201`**
  ```json
  {
    "message": "Kullanıcı başarıyla oluşturuldu.",
    "user": {
      "id": 45,
      "name": "Zeynep Öztürk",
      "email": "zeynep@example.com",
      "role": "corporate",
      "companyId": 7,
      "companyName": "Dijinew Dijital"
    }
  }
  ```

### `PUT /api/admin/users/:id`

- **Body**
  - `name`, `email` (required)
  - `role` (optional; `admin` or `user`)
  - `companyId` (optional, pass `null` to de-associate)
- **Rules**
  - Admins cannot update their own record via this endpoint.
  - Email uniqueness is enforced.
  - If `companyId` is provided, it must map to an existing company.

### `DELETE /api/admin/users/:id`

Deletes the user when the id is valid and does not belong to the requesting admin. Cascading behaviour depends on database constraints (the current code assumes `ON DELETE CASCADE` for dependent records).

## Company Management

All company endpoints live under `/api/admin/companies`.

- **Create (`POST`)** expects `name`, `userLimit`, `cardLimit`, optional `status` (defaults to active), plus optional `phone`, `website`, `address`.
- **Update (`PUT`)** accepts the same fields; supply `status` only when it should change. Both create/update set `updatedAt` automatically.
- **Delete (`DELETE`)** fails with `400` if foreign-key constraints exist (e.g., company still has users/cards).

## Card Management

`/api/admin/cards` exposes the most feature-complete card controls.

### `GET /api/admin/cards`

Query parameters:

- `search` – matches against card name and owner name.
- `isActive` – `true` or `false`; converted to SQL `BIT`.
- `page`, `limit` – pagination (default `1`/`10`).

Returns a paginated payload:
```json
{
  "data": [ { "id": 1, "name": "Kart", ... } ],
  "totalCount": 120,
  "page": 1,
  "limit": 10,
  "totalPages": 12
}
```

Mounting the same router at `/api/admin/companies/:companyId/cards` adds an implicit company filter based on the `:companyId` path param.

### `POST /api/admin/cards`

Key rules mirrored from the shared card logic:

- One of `companyId` or `userId` must be provided; if both are provided, the `userId` must belong to the company.
- Validates unique `customSlug` when present.
- Generates and stores a QR code image (`qrCodeData`) for the card.
- Automatically looks up and attaches `companyName`/`userName` in the response.

### `PUT /api/admin/cards/:id`

Accepts the same fields as creation. Supports slug changes (with uniqueness check) and updates QR codes if required. Corporate-specific metadata is preserved.

### `DELETE /api/admin/cards/:id`

Deletes the card. Returns `{ "message": "Kartvizit başarıyla silindi", "id": "123" }`.

### `GET /api/admin/cards/export`

Streams a generated `.xlsx` file containing all cards with metadata (owner, company, timestamps). Useful for reporting.

### `POST /api/admin/cards/import`

- Upload a single Excel file via multipart form field `file`.
- Each row (starting from row 2) must include at least the card name.
- Inserts records inside a DB transaction; returns per-row error messages.
- Automatically deletes the temp upload file when finished.

### `GET /api/admin/cards/qr-codes`

Returns a ZIP archive; each entry is a PNG QR code named using the card, owner, and company values.

### `GET /api/admin/cards/:id/qr`

Returns a single PNG QR code for the specified card id.
