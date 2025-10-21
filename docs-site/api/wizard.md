# Wizard Token API’sı

Wizard token’ları kapsamlı “Kart Sihirbazı” deneyimini başlatmak için kullanılır. Tüm rotalar `/api/wizard` altında bulunur.

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `POST` | `/api/wizard/create` | Bearer (`admin` veya `corporate`) | Wizard token’ı üretir, paylaşılabilir URL döner. |
| `GET` | `/api/wizard/validate/:token` | Public | Token’ın geçerliliğini kontrol eder. |
| `PUT` | `/api/wizard/use/:token` | Public (opsiyonel auth) | Token’ı kullanıldı olarak işaretler. |
| `GET` | `/api/wizard/my-tokens` | Bearer (`admin` veya `corporate`) | Oluşturulan token’ların listesini döner. |

## `POST /api/wizard/create`

- **Gövde**
  - `type` `string` – zorunlu (`admin` veya `corporate`)
  - `expiryDays` `number` – opsiyonel (varsayılan `7`)
- **Kurallar**
  - Kurumsal kullanıcılar yalnızca `type = corporate` oluşturabilir.
- **Yanıt `201`**
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
- Kurumsal token’lar otomatik olarak `companyId` ile etiketlenir.

## `GET /api/wizard/validate/:token`

Token geçerliyse:
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

Hatalar:
- `400` – token parametresi yok
- `404` – token bulunamadı
- `410` – token süresi dolmuş veya daha önce kullanılmış

## `PUT /api/wizard/use/:token`

Token’ı `isUsed = 1` yapar. Auth varsa `usedBy` alanına kullanıcı ID’si yazılır. Token geçersizse `400`.

## `GET /api/wizard/my-tokens`

Token oluşturucusuna ait kayıtlar listelenir; kart bilgileri ve durum etiketi (`Aktif`, `Süresi Dolmuş`, `Kullanıldı`) içerir:
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
