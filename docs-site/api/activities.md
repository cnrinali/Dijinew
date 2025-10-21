# Aktivite API’sı

Aktivite uç noktaları `ActivityLogs` tablosunda tutulan denetim kayıtlarını expose eder. Tüm rotalar kimlik doğrulaması gerektirir; role göre kapsam değişir.

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `GET` | `/api/activities/admin` | Admin | Tüm aktivitelerin pagine edilmiş listesi. |
| `GET` | `/api/activities/corporate` | Corporate | Şirkete ait aktiviteler. |
| `GET` | `/api/activities/recent` | Bearer | Kullanıcıya göre son 10 aktivite. |
| `GET` | `/api/activities/stats` | Bearer | Son 30 günde `actionType` bazında sayımlar. |

## `GET /api/activities/admin`

Sorgu parametreleri:

- `page`, `limit` – varsayılan 1 / 20
- `actionType`, `targetType`
- `userId`, `companyId`

Yanıt örneği:
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

`metadata` alanı JSON ise parse edilerek nesne olarak döner.

## `GET /api/activities/corporate`

Admin endpoint’iyle aynıdır ancak sonuçlar otomatik olarak `req.user.companyId` ile filtrelenir. Şirket ID’si yoksa `403`.

## `GET /api/activities/recent`

En son 10 aktiviteyi döner:

- Admin: tüm sistem aktiviteleri
- Corporate: şirket aktiviteleri
- Diğer roller: kullanıcıya ait aktiviteler

`ActivityLogs` tablosu yoksa boş dizi ve açıklayıcı mesaj gönderir.

## `GET /api/activities/stats`

Son 30 gün içinde `actionType` bazında aktivite sayısı döner. Kapsam role bağlıdır:

- Admin – tüm kayıtlar
- Corporate – aynı şirket
- Diğer roller – kullanıcının kendi kayıtları

Örnek:
```json
{
  "success": true,
  "data": [
    { "actionType": "LOGIN", "count": 42 },
    { "actionType": "CARD_CREATE", "count": 8 }
  ]
}
```
