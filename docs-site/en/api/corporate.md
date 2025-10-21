# Corporate API

Corporate operators manage their company’s cards and users through `/api/corporate/*`. All endpoints require a JWT whose role is `corporate`; the middleware also injects `req.user.companyId`, which drives scoping and quota checks.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/corporate/cards` | Lists cards owned by the company (with paging and filters). |
| `POST` | `/api/corporate/cards` | Creates a new card under the company, optionally on behalf of a specific user. |
| `GET` | `/api/corporate/users` | Lists company users. |
| `POST` | `/api/corporate/users` | Creates a new user within the company and emails credentials. |

## Card Listing – `GET /api/corporate/cards`

Query parameters:

- `page`, `limit` (defaults: 1 / 10)
- `search` – matches card name, card owner name, or user name.
- `isActive` – `true` or `false`

The handler automatically filters by `req.user.companyId`. The response payload:
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "cardName": "Dijital Kart",
      "creationType": "Sihirbaz ile oluşturuldu",
      "isActive": true,
      ...
    }
  ],
  "totalCount": 4,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

If your database is missing the `Cards.companyId` column, the API returns an empty dataset plus a migration hint.

## Create Company Card – `POST /api/corporate/cards`

- **Body**
  - `name` `string` (required)
  - `userId` `number` (optional; must belong to the same company)
  - `title`, `email`, `phone`, `website`, `address`, `isActive`, `customSlug` (optional)
- **Behaviour**
  - Verifies the caller’s company has not exceeded `Companies.cardLimit`.
  - Validates the optional `customSlug` using the shared slug checker and ensures uniqueness.
  - When `userId` is provided, pulls the user’s email and forces `title = null`. Otherwise, the posted values are used.
  - Inserts the card inside a SQL transaction, generates a QR code (`qrCodeData`), and returns the stored record including `companyName`.
- **Response**
  ```json
  {
    "success": true,
    "data": {
      "id": 84,
      "name": "Yeni Kart",
      "customSlug": "yeni-kart",
      "isActive": true,
      "companyId": 7,
      "companyName": "Acme Corp",
      "qrCodeData": "data:image/png;base64,..."
    }
  }
  ```

Errors include `400` when limits are exceeded, slug conflicts exist, or the user is not part of the company.

## Create Company User – `POST /api/corporate/users`

- **Body**
  - `name`, `email`, `password`, `role` (all required; `role` must be `user` or `corporate`)
- **Validation**
  - Enforces company `userLimit`.
  - Checks email uniqueness.
  - Requires password length ≥ 6 and proper email format.
- **Behaviour**
  - Hashes the password, stores the user linked to `req.user.companyId`, and wraps the insert in a transaction.
  - Sends login credentials via the shared `emailService` (failures are logged but do not roll back).
- **Response**
  ```json
  {
    "success": true,
    "data": {
      "id": 150,
      "name": "Ahmet Kaya",
      "email": "ahmet@example.com",
      "role": "user",
      "companyId": 7,
      "companyName": "Acme Corp"
    },
    "emailSent": true
  }
  ```

## List Company Users – `GET /api/corporate/users`

Returns all users assigned to the company, ordered by `createdAt DESC`. This endpoint is a simple list today (no pagination/filtering yet).
