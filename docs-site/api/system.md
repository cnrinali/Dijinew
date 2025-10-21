# Sistem İzleme API’sı

Altyapı sağlığını takip etmeye yarayan uç noktalar `/api/system` altında bulunur. Tüm rotalar `role = admin` olan kullanıcı gerektirir.

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `GET` | `/api/system/status` | Sunucu, veritabanı, CPU, bellek, disk ve ağ özetini döner. |
| `GET` | `/api/system/resources` | Ayrıntılı kaynak kullanımı ve süreç metrikleri sağlar. |
| `GET` | `/api/system/performance` | Performans metriklerini döner ve `SystemMetrics` tablosuna kayıt ekler. |

## `GET /api/system/status`

Yanıt örneği:
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
    "os": { "platform": "linux", "distro": "Ubuntu", "release": "22.04", "arch": "x64" },
    "security": { "status": "secure" }
  }
}
```
Veriler `systeminformation` paketinden ve basit bir veritabanı bağlantı testinden alınır.

## `GET /api/system/resources`

Ayrıntılı metrik döner:
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

Yük odaklı metrikler ve veritabanına yazılan kayıtlar:
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
API `SystemMetrics` tablosuna `cpu`, `memory` ve `response_time` kayıtları eklemeyi dener; başarısız olursa loglar fakat yanıtı başarısız kılmaz.
