# Analitik API’sı

Bu uç noktalar kart etkileşimlerini kaydeder ve özet istatistikler üretir. Tümü `/api/analytics` altında çalışır.

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `POST` | `/api/analytics/view/:cardId` | Public | Kart görüntülenmesini kaydeder. |
| `POST` | `/api/analytics/click/:cardId` | Public | Kart tıklamasını kaydeder. |
| `GET` | `/api/analytics/card/:cardId` | Bearer | Kart bazında istatistik döner. |
| `GET` | `/api/analytics/user/:userId` | Bearer | Kullanıcının kart portföyü için istatistik döner. |
| `GET` | `/api/analytics/admin` | Bearer (admin) | Platform geneli özet ve top kartlar. |

## Olay Kaydı

### `POST /api/analytics/view/:cardId`

- **Parametre:** `cardId` (integer)
- **Opsiyonel Gövde:** `ipAddress`, `userAgent`, `referrer`, `country`, `city`
- **Davranış:** `CardViews` tablosuna kayıt ekler, ardından `DailyStats` içindeki günlük görüntülenme sayacını artırır.
- **Yanıt:** `{ "success": true, "message": "Görüntülenme kaydedildi" }`

### `POST /api/analytics/click/:cardId`

- **Gövde**
  - `clickType` `string` – zorunlu (`phone`, `email`, `social`, `marketplace`, `bank`, `website`, `address` gibi değerler)
  - `clickTarget` `string` – zorunlu (tıklanan bağlantı/etiket)
  - Opsiyonel `ipAddress`, `userAgent`
- **Davranış:** `CardClicks` tablosuna kayıt ekler ve `DailyStats` içinde ilgili sayaçları günceller.
- **Hata:** Eksik `clickType` veya `clickTarget` için `400`.
- **Yanıt:** `{ "success": true, "message": "Tıklama kaydedildi" }`

## Kart Bazlı İstatistik – `GET /api/analytics/card/:cardId`

- **Erişim:** Kart sahibi veya admin.
- **Sorgu Parametresi:** `period` – gün sayısı (varsayılan `30`).
- **Yanıt:**
  ```json
  {
    "general": {
      "totalViews": 124,
      "totalClicks": 37,
      "uniqueVisitors": 92,
      "activeDays": 12
    },
    "categories": [ { "clickType": "website", "clickCount": 10 } ],
    "detailed": [ { "clickType": "website", "clickTarget": "https://dijinew.com", "clickCount": 5 } ],
    "dailyTrend": [ { "date": "2024-03-10", "views": 8 } ]
  }
  ```

## Kullanıcı Portföyü – `GET /api/analytics/user/:userId`

- **Erişim:** Doğrulanmış kullanıcılar. Admin ise tüm kartlar listelenir; diğer roller sadece belirtilen `userId` için sonuç alır.
- **Parametre:** `period` (varsayılan `30`).
- **Yanıt:** Kart başına özet (`cardId`, `cardName`, `totalViews`, `totalClicks`, `uniqueVisitors`). Admin yanıtında `userName` ve `userEmail` de yer alır.

## Platform Özeti – `GET /api/analytics/admin`

- **Erişim:** Yalnızca admin.
- **Parametre:** `period` (varsayılan `30`).
- **Yanıt:**
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
