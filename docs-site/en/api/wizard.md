# Wizard Token API

Wizard tokens bootstrap the full-featured “Card Wizard” onboarding flow. Routes live under `/api/wizard`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/wizard/create` | Bearer (`admin` or `corporate`) | Generates a wizard token and shareable URL. |
| `GET` | `/api/wizard/validate/:token` | Public | Validates that a token exists, is unused, and unexpired. |
| `PUT` | `/api/wizard/use/:token` | Public (auth optional) | Marks a token as used. |
| `GET` | `/api/wizard/my-tokens` | Bearer (`admin` or `corporate`) | Lists tokens created by the caller. |

## `POST /api/wizard/create`

- **Body**
  - `type` `string` – required; must be `admin` or `corporate`.
  - `expiryDays` `number` – optional; defaults to 7.
- **Rules**
  - Corporate users may only request `type = corporate`.
- **Response `201`**
  ```json
  {
    "success": true,
    "data": {
      "id": 15,
      "token": "32bytehex...",
      "type": "corporate",
      "expiresAt": "2024-04-20T09:40:00.000Z",
      "createdAt": "2024-03-20T09:40:00.000Z",
      "wizardUrl": "https://app.dijinew.com/wizard?token=32bytehex...",
      "expiryDays": 7
    },
    "message": "Sihirbaz linki başarıyla oluşturuldu."
  }
  ```

The API automatically ties corporate tokens to `req.user.companyId`.

## `GET /api/wizard/validate/:token`

Checks the provided token and returns its metadata when valid:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "type": "corporate",
    "companyId": 7,
    "expiresAt": "2024-04-20T09:40:00.000Z"
  },
  "message": "Token geçerli."
}
```

Errors:

- `400` if the token parameter is missing.
- `404` for unknown tokens.
- `410` when expired or already used.

## `PUT /api/wizard/use/:token`

Marks a token as consumed (sets `isUsed = 1`). If the caller is authenticated, their user id is recorded as `usedBy`. Responds with the updated token snapshot or `400` if the token is invalid/expired.

## `GET /api/wizard/my-tokens`

Returns every token created by the requester, along with card information and computed status labels:
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "token": "32bytehex...",
      "cardName": "Yeni Kart",
      "cardSlug": "yeni-kart",
      "status": "Aktif",
      "isExpired": 0,
      "isUsed": 0,
      "expiresAt": "2024-04-20T09:40:00.000Z"
    }
  ]
}
```
