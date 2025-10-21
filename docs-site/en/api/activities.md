# Activity API

Activity endpoints expose the audit trail captured in `ActivityLogs`. All routes require authentication; additional role checks apply.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/activities/admin` | Admin | Paginated list of every activity event. |
| `GET` | `/api/activities/corporate` | Corporate | Activities scoped to the caller’s company. |
| `GET` | `/api/activities/recent` | Bearer | Last 10 events relevant to the caller. |
| `GET` | `/api/activities/stats` | Bearer | Counts grouped by `actionType` for the past 30 days. |

## `GET /api/activities/admin`

Query parameters:

- `page`, `limit` (defaults: 1 / 20)
- `actionType`, `targetType` – match exact values stored in the log.
- `userId`, `companyId` – integer filters.

Response body:
```json
{
  "success": true,
  "data": [
    {
      "id": 99,
      "action": "USER_LOGIN",
      "actionType": "LOGIN",
      "userName": "Admin",
      "companyName": "Acme Corp",
      "metadata": { ... },
      "createdAt": "2024-03-16T08:20:00.000Z"
    }
  ],
  "totalCount": 250,
  "page": 1,
  "limit": 20,
  "totalPages": 13
}
```

`metadata` is parsed JSON (or `null` when absent).

## `GET /api/activities/corporate`

Identical to the admin endpoint but automatically filters on `req.user.companyId`. Returns `403` if the caller lacks a company id.

## `GET /api/activities/recent`

Returns the most recent 10 activity entries relevant to the caller:

- Admins see the latest across the entire system.
- Corporate users see company-scoped entries.
- Other roles see their own events.

If the `ActivityLogs` table is missing (e.g., during initial setup), the API responds with an empty `data` array and a descriptive message.

## `GET /api/activities/stats`

Counts the number of activities per `actionType` across the last 30 days. Scope depends on the requester’s role:

- Admin – all entries.
- Corporate – entries for their company.
- Other roles – entries authored by the user.

Example response:
```json
{
  "success": true,
  "data": [
    { "actionType": "LOGIN", "count": 42 },
    { "actionType": "CARD_CREATE", "count": 8 }
  ]
}
```
