# Cards API

Card management is split between private endpoints (for authenticated owners) and a public read-only lookup used by the card experience.

## Private Card Management (`/api/cards`)

All routes below require a Bearer token. Standard users can manage only their own cards; corporate users may optionally act on behalf of colleagues within the same company (see details under `POST /api/cards`).

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/cards` | Lists cards owned by the authenticated user. |
| `POST` | `/api/cards` | Creates a new card. |
| `GET` | `/api/cards/:id` | Returns a specific card owned by the caller. |
| `PUT` | `/api/cards/:id` | Updates card fields. |
| `DELETE` | `/api/cards/:id` | Deletes the card. |
| `PATCH` | `/api/cards/:id/status` | Toggles the active flag. |
| `GET` | `/api/cards/:cardId/bank-accounts` | Lists bank accounts attached to the card. |
| `POST` | `/api/cards/:cardId/bank-accounts` | Adds a bank account to the card. |
| `PUT` | `/api/cards/:cardId/bank-accounts/:accountId` | Updates a bank account. |
| `DELETE` | `/api/cards/:cardId/bank-accounts/:accountId` | Removes a bank account. |

### `GET /api/cards`

Returns an array of cards belonging to the JWT subject. Each item includes an additional `isActive` boolean derived from the `status` column.

### `POST /api/cards`

- **Body**
  - Core: `cardName`, `name`, `title`, `company`, `bio`, `phone`, `email`, `website`, `address`, `theme`, `profileImageUrl`, `coverImageUrl`.
  - Marketplace & social URLs: `linkedinUrl`, `twitterUrl`, `instagramUrl`, `trendyolUrl`, `hepsiburadaUrl`, `ciceksepeti`, `sahibindenUrl`, `hepsiemlakUrl`, `gittigidiyorUrl`, `n11Url`, `amazonTrUrl`, `getirUrl`, `yemeksepetiUrl`.
  - Optional `customSlug` – validated to contain only lowercase letters, numbers, and hyphens; must be unique.
  - Corporate-only: `userId` lets a corporate operator create a card on behalf of another team member (the user must belong to the same company). Company users are limited by their `Companies.cardLimit`.
- **Rules**
  - Standard users (`role = user`) are limited to a single card; attempts to create a second card return `400`.
  - If `customSlug` fails validation (invalid characters) the request is rejected.
- **Response `201`** – the stored card row including generated fields such as `id`, `createdAt`, and `customSlug`.

### `GET /api/cards/:id`

Fetches a single card only if it belongs to the caller. Returns `404` when the `id` is unknown or owned by another user.

### `PUT /api/cards/:id`

Accepts the same payload as `POST`, plus:

- Optional `isActive` flag.
- Optional new `customSlug` (validated and uniqueness-checked).

Ownership is enforced; `404` is returned if the card does not belong to the caller. The response echoes the updated record.

### `DELETE /api/cards/:id`

Removes the card if the caller is the owner. Returns:
```json
{ "message": "Kartvizit başarıyla silindi", "id": 42 }
```

### `PATCH /api/cards/:id/status`

- **Body**
  - `isActive` `boolean`
- **Behaviour:** Updates the `status` bit for the specified card (if owned by the caller) and returns the new state.

## Card Bank Accounts

Bank accounts attached directly to a card share the same validation rules as user bank accounts (IBAN must match `TR\d{24}` and be unique per card). Ownership of both the card and account is strictly enforced.

- `GET /api/cards/:cardId/bank-accounts` – returns an array ordered by `createdAt DESC`.
- `POST /api/cards/:cardId/bank-accounts` and `PUT /api/cards/:cardId/bank-accounts/:accountId` require `bankName`, `iban`, and `accountName`.
- `DELETE /api/cards/:cardId/bank-accounts/:accountId` removes the record if the card belongs to the caller.

## Public Card Lookup (`/api/public`)

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/public/:slugOrId` | Public | Returns an active card by numeric ID, `customSlug`, or `permanentSlug`. |

- **Parameters**
  - `:slugOrId` accepts either an integer card ID or a slug string. Slugs are normalised server-side; invalid formats yield `400`.
- **Response `200`**
  - Full card record including any associated `CardBankAccounts` under `bankAccounts`.
- **Errors**
  - `404` if no active card matches.

Public responses omit ownership checks but only surface cards with `isActive = 1`.
