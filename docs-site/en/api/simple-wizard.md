# Simple Wizard API

The “Simple Wizard” flow issues lightweight tokens that guide card owners through a simplified setup experience. Endpoints are mounted under `/api/simple-wizard`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/simple-wizard/create` | Bearer (`admin` or `corporate`) | Generates a wizard token, creates a draft card, and optionally emails the invite. |
| `GET` | `/api/simple-wizard/validate/:token` | Public | Confirms a token is valid, unused, and unexpired. |
| `GET` | `/api/simple-wizard/card/:token` | Public | Retrieves the draft card tied to the token. |
| `PUT` | `/api/simple-wizard/card/:token` | Public | Updates card details through the wizard. |
| `PUT` | `/api/simple-wizard/update-ownership/:token` | Public | Reassigns card ownership by user id. |
| `PUT` | `/api/simple-wizard/use/:token` | Public | Marks the wizard token as used. |
| `GET` | `/api/simple-wizard/my-wizards` | Bearer (`admin` or `corporate`) | Lists tokens created by the caller. |
| `GET` | `/api/simple-wizard/debug-schema` | Public (diagnostic) | Checks/extends card schema (adds `companyId` / `permanentSlug` if missing). |
| `GET` | `/api/simple-wizard/test-permanent-slug` | Public (diagnostic) | Runs ad-hoc queries against `permanentSlug`. |

## Create Token – `POST /api/simple-wizard/create`

- **Body**
  - `email` `string` (optional) – if provided and valid, the API emails the wizard link.
- **Behaviour**
  - Only admins or corporate users may call this route.
  - Automatically creates a draft card with a UUID slug and `isActive = false`.
  - Corporate callers link the card to their company (when `Cards.companyId` exists) and respect company quotas if enforced elsewhere.
  - Stores the token in `SimpleWizardTokens` with `expiresAt = now + 30 days`.
  - Generates a QR code pointing to `/card/{slug}` and includes both the Data URL and a ready-to-use `/qr/{slug}` link.
- **Response `201`**
  ```json
  {
    "success": true,
    "data": {
      "id": 25,
      "token": "abcd1234ef...",
      "cardId": 320,
      "cardSlug": "71f358a2-cd21-...",
      "wizardUrl": "https://app.dijinew.com/wizard/71f...?",
      "qrCodeUrl": "https://app.dijinew.com/qr/71f...",
      "emailSent": true
    },
    "message": "Sihirbaz linki başarıyla oluşturuldu. Email gönderildi. QR kod hazırlandı."
  }
  ```

## Token Validation – `GET /api/simple-wizard/validate/:token`

Confirms the token exists, has not expired, and has not been used. Returns basic card metadata and the invite email. Errors:

- `404` – token not found
- `410` – expired
- `409` – already used

## Fetch Card Draft – `GET /api/simple-wizard/card/:token`

Returns the draft card plus token metadata when the token is valid. Response fields include:

- `name`, `title`, `email`, `phone`, `website`, `address`, `bio`, `customSlug`, `isActive`
- `companyId`/`companyName` (if present)
- Token state (`isUsed`, `isExpired`, `expiresAt`)

## Update Card – `PUT /api/simple-wizard/card/:token`

- **Body:** Portion of the card model (`name`, `title`, `email`, `phone`, `website`, `address`, `bio`, `isActive`, etc.).
- **Behaviour:**
  - Rejects expired or unknown tokens.
  - Automatically activates the card (`isActive = true`) when a meaningful `name` is provided; otherwise, honours the supplied `isActive` boolean.
  - Updates base profile fields and regenerates a random slug when `name` changes.
  - Marks the token as used when the card becomes active.

## Update Ownership – `PUT /api/simple-wizard/update-ownership/:token`

Body requires `newUserId`. Associates the draft card with the specified user (no authentication required, but token validity is enforced). Useful when the wizard needs to hand off the card to a newly created account.

## Mark Token as Used – `PUT /api/simple-wizard/use/:token`

Sets `isUsed = 1`. Calling this endpoint explicitly is optional because `PUT /card/:token` already marks tokens as used when the card is activated.

## List My Wizards – `GET /api/simple-wizard/my-wizards`

Authenticated admins and corporate users receive their issued tokens along with card state and a human-friendly status string (`Aktif`, `Süresi Dolmuş`, `Kullanıldı`).

## Diagnostic Endpoints

- `GET /api/simple-wizard/debug-schema` – Inspects the `Cards` table and, if necessary, attempts to add missing `companyId`/`permanentSlug` columns (plus supporting constraints). Use with caution in production; it alters schema.
- `GET /api/simple-wizard/test-permanent-slug` – Runs sample queries against `Cards.permanentSlug` and returns the raw result sets to help debug slug lookups.
