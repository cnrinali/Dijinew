# Analytics API

These endpoints record engagement events and deliver aggregated insight. Routes are mounted under `/api/analytics`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/analytics/view/:cardId` | Public | Logs a card view event. |
| `POST` | `/api/analytics/click/:cardId` | Public | Logs a card click event. |
| `GET` | `/api/analytics/card/:cardId` | Bearer | Returns a card’s analytics summary. |
| `GET` | `/api/analytics/user/:userId` | Bearer | Returns stats for every card belonging to a user. |
| `GET` | `/api/analytics/admin` | Bearer (admin) | Aggregated stats across the platform. |

## Event Recording

### `POST /api/analytics/view/:cardId`

- **Path Param:** `cardId` (integer)
- **Body (optional)**
  - `ipAddress` `string` (defaults to request IP)
  - `userAgent` `string` (defaults to `User-Agent` header)
  - `referrer` `string` (defaults to `Referer` header)
  - `country`, `city` `string`
- **Outcome:** Inserts a row into `CardViews` and bumps the daily view counter in `DailyStats`.
- **Response:** `{ "success": true, "message": "Görüntülenme kaydedildi" }`

### `POST /api/analytics/click/:cardId`

- **Body**
  - `clickType` `string` (required; expected values include `phone`, `email`, `social`, `marketplace`, `bank`, `website`, `address`)
  - `clickTarget` `string` (required; free-form label or URL)
  - Optional `ipAddress`, `userAgent`
- **Outcome:** Inserts into `CardClicks` and updates per-type counters in `DailyStats`.
- **Response:** `{ "success": true, "message": "Tıklama kaydedildi" }`
- **Errors:** `400` if `clickType` or `clickTarget` is missing.

## Card-Level Stats – `GET /api/analytics/card/:cardId`

- **Access:** Requires authentication; intended for card owners or admins.
- **Query Params:** `period` (number of days, default `30`).
- **Response:** 
  ```json
  {
    "general": {
      "totalViews": 124,
      "totalClicks": 37,
      "uniqueVisitors": 92,
      "activeDays": 12
    },
    "categories": [ { "clickType": "website", "clickCount": 10 }, ... ],
    "detailed": [ { "clickType": "website", "clickTarget": "https://dijinew.com", "clickCount": 5 } ],
    "dailyTrend": [ { "date": "2024-03-10", "views": 8 }, ... ]
  }
  ```

## User Portfolio Stats – `GET /api/analytics/user/:userId`

- **Access:** Authenticated. Admins receive stats for *all* active cards; other roles are restricted to the specified `userId`.
- **Query Params:** `period` (days, default `30`).
- **Response:** Array of per-card aggregates (`cardId`, `cardName`, `totalViews`, `totalClicks`, `uniqueVisitors`). Admin responses also include `userName` and `userEmail`.

## Platform Overview – `GET /api/analytics/admin`

- **Access:** Admin only.
- **Query Params:** `period` (days, default `30`).
- **Response:** 
  ```json
  {
    "system": {
      "totalCards": 350,
      "totalViews": 1240,
      "totalClicks": 360,
      "uniqueVisitors": 820,
      "activeUsers": 95
    },
    "topCards": [
      { "id": 5, "cardName": "VIP Kart", "userName": "Ece", "views": 180, "clicks": 45 }
    ]
  }
  ```
