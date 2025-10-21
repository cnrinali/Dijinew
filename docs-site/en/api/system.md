# System Monitoring API

Infrastructure health endpoints, mounted at `/api/system`, help admins monitor server and database status. All routes require an authenticated admin user.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/system/status` | High-level server, database, CPU, memory, storage, and network snapshot. |
| `GET` | `/api/system/resources` | Detailed resource metrics, including process counts. |
| `GET` | `/api/system/performance` | Performance metrics plus basic persistence to `SystemMetrics`. |

## `GET /api/system/status`

Response example:
```json
{
  "success": true,
  "data": {
    "server": { "status": "online", "uptime": 240, "response_time": 35 },
    "database": { "status": "connected", "message": "Veritabanı bağlantısı başarılı" },
    "memory": { "total": 16, "used": 6, "percentage": 38 },
    "cpu": { "usage": 12, "cores": 8 },
    "storage": { "total": 250, "used": 90, "percentage": 36 },
    "network": { "rx": 4, "tx": 2 },
    "os": { "platform": "darwin", "distro": "macOS", "release": "14.3", "arch": "x64" },
    "security": { "status": "secure" }
  }
}
```
Values are derived from the `systeminformation` package and a lightweight DB connectivity check.

## `GET /api/system/resources`

Returns granular metrics suitable for dashboards:
```json
{
  "success": true,
  "data": {
    "cpu": { "usage": 10, "cores": 8, "speed": 2.6 },
    "memory": { "total": 16, "used": 6, "free": 10, "percentage": 38 },
    "storage": { "total": 250, "used": 90, "free": 160, "percentage": 36 },
    "network": { "interface": "en0", "rx_speed": 1, "tx_speed": 0, "rx_total": 120, "tx_total": 45 },
    "processes": { "total": 240, "running": 120, "sleeping": 110 },
    "uptime": 240
  }
}
```

## `GET /api/system/performance`

Focuses on load metrics and persists a subset into the `SystemMetrics` table:
```json
{
  "success": true,
  "data": {
    "cpu_usage": 15,
    "memory_usage": 40,
    "disk_io": { "read": 1, "write": 0 },
    "network_io": { "rx": 1, "tx": 0 },
    "response_time": 30,
    "uptime_percentage": 99.9,
    "performance_score": 60
  }
}
```
The API attempts to insert rows for `cpu`, `memory`, and `response_time` metrics; failures are logged but do not impact the response.
