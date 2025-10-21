# Yönetici API’sı

Tüm `/api/admin/*` uç noktaları `role = admin` olan doğrulanmış kullanıcı gerektirir. Router, kullanıcı, şirket ve kart yönetimi ile gösterge paneli verilerini tek çatı altında toplar.

## Özet

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `GET` | `/api/admin/stats` | Yönetici paneli için özet sayılar. |
| `GET` | `/api/admin/users` | Tüm kullanıcıları listeler. |
| `POST` | `/api/admin/users` | Yönetici adına yeni kullanıcı oluşturur. |
| `PUT` | `/api/admin/users/:id` | Kullanıcının profil/rol/şirket bilgisini günceller. |
| `DELETE` | `/api/admin/users/:id` | Kullanıcıyı siler (admin kendisini silemez). |
| `POST` | `/api/admin/companies` | Yeni şirket kaydı ekler. |
| `GET` | `/api/admin/companies` | Şirketleri listeler. |
| `GET` | `/api/admin/companies/:id` | Şirket detayını döner. |
| `PUT` | `/api/admin/companies/:id` | Şirket limitlerini/metadatasını günceller. |
| `DELETE` | `/api/admin/companies/:id` | Şirketi siler (FK engeli varsa hata). |
| `GET` | `/api/admin/cards` | Platformdaki tüm kartları listeler (filtre/paging). |
| `POST` | `/api/admin/cards` | Kart oluşturur (bireysel veya kurumsal). |
| `PUT` | `/api/admin/cards/:id` | Kartı günceller. |
| `DELETE` | `/api/admin/cards/:id` | Kartı siler. |
| `GET` | `/api/admin/cards/export` | Tüm kartları Excel olarak dışa aktarır. |
| `POST` | `/api/admin/cards/import` | Excel’den kart içe aktarır (`file` alanı). |
| `GET` | `/api/admin/cards/qr-codes` | Aktif kartlar için ZIP formatında QR kodları döner. |
| `GET` | `/api/admin/cards/:id/qr` | Tek kartın QR kodunu PNG olarak döner. |
| `GET` | `/api/admin/companies/:companyId/cards` | Belirli şirketin kartlarını listeler. |

## Gösterge Paneli

`GET /api/admin/stats` aşağıdaki yapıyı döner:
```json
{
  "totalUsers": 120,
  "totalCards": 350,
  "activeCards": 280
}
```

## Kullanıcı Yönetimi

### `GET /api/admin/users`
- Tüm kullanıcıları `createdAt DESC` sıralı döner.
- Yanıt her kullanıcı için `companyId` ve `companyName` içerir.

### `POST /api/admin/users`
- **Gövde:** `name`, `email`, `password`, `role` zorunlu; `role` yalnızca `admin`, `user`, `corporate`.
- `companyId` opsiyoneldir, gönderilirse şirketin varlığı doğrulanır.
- Parola bcrypt ile hashlenir.
- **Yanıt `201`**
  ```json
  {
    "message": "Kullanıcı başarıyla oluşturuldu.",
    "user": {
      "id": 45,
      "name": "Zeynep Öztürk",
      "email": "zeynep@example.com",
      "role": "corporate",
      "companyId": 7,
      "companyName": "Dijinew Dijital"
    }
  }
  ```

### `PUT /api/admin/users/:id`
- Admin kendi kaydını bu uç noktadan güncelleyemez.
- `name` ve `email` zorunlu; `email` benzersiz olmalı.
- Opsiyonel `role` (`admin` veya `user`) ve `companyId` (null gönderilebilir).
- `companyId` sağlanırsa şirket varlığı doğrulanır.

### `DELETE /api/admin/users/:id`
- Hedef kullanıcı admin’in kendisi değilse siler.
- `ON DELETE CASCADE` varsayımı mevcut; aksi durumda ilişkili veriler için ilave temizlik gerekebilir.

## Şirket Yönetimi

`/api/admin/companies` altında çalışır.

- **POST** – `name`, `userLimit`, `cardLimit` zorunlu; `status` opsiyonel (varsayılan aktif). `phone`, `website`, `address` isteğe bağlı.
- **PUT** – Aynı alanları kabul eder; `status` sadece gönderildiğinde güncellenir. `updatedAt` otomatik güncellenir.
- **DELETE** – Şirkete bağlı kullanıcı/kart varsa `400` döner (`FK` kısıtı).

## Kart Yönetimi

### `GET /api/admin/cards`
- Sorgu parametreleri:
  - `search` – kart adı veya kullanıcı adına göre filtre.
  - `isActive` – `true` / `false`; SQL `BIT`’e çevrilir.
  - `page`, `limit` – sayfalama (varsayılan 1 / 10).
- Yanıt:
  ```json
  {
    "data": [ { "id": 1, "name": "Kart", ... } ],
    "totalCount": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
  ```
- Aynı router şirket bazlı mount edildiğinde (`/api/admin/companies/:companyId/cards`) `:companyId` ile otomatik filtre uygulanır.

### `POST /api/admin/cards`
- `companyId` veya `userId` (veya her ikisi) verilmelidir; `userId` varsa aynı şirkete bağlı olmalıdır.
- `customSlug` benzersizliği ve formatı kontrol edilir.
- Kart için QR kodu üretilir (`qrCodeData`).

### `PUT /api/admin/cards/:id`
- Oluşturma ile aynı alanları kabul eder, slug değişikliklerini ve QR kod güncellemesini destekler.

### `DELETE /api/admin/cards/:id`
- Silme işlemi başarılıysa `{ "message": "Kartvizit başarıyla silindi", "id": "123" }` döner.

### `GET /api/admin/cards/export`
- Tüm kartları sahip ve şirket bilgileriyle `.xlsx` olarak dışa aktarır.

### `POST /api/admin/cards/import`
- Tek Excel dosyası (multipart `file` alanı) kabul eder.
- İlk satır başlık varsayılır, her satır için kart ekleme denemesi yapar; hatalar raporlanır.
- İşlem bir transaction içinde yürütülür ve geçici dosya silinir.

### `GET /api/admin/cards/qr-codes`
- Aktif kartların QR kodlarını PNG olarak üretir ve ZIP arşivi halinde döner.

### `GET /api/admin/cards/:id/qr`
- Belirli kart ID’si için tek bir PNG QR kodu gönderir.
