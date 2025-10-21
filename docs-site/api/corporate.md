# Kurumsal API

Kurumsal kullanıcılar, şirketlerine ait kart ve kullanıcıları `/api/corporate/*` uç noktaları üzerinden yönetir. Tüm rotalar `role = corporate` veya `admin` taşıyan JWT gerektirir; middleware `req.user.companyId` bilgisini sağlar.

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `GET` | `/api/corporate/cards` | Şirkete ait kartları listeler (sayfalama + filtre). |
| `POST` | `/api/corporate/cards` | Şirket adına yeni kart oluşturur. |
| `GET` | `/api/corporate/users` | Şirkete ait kullanıcıları listeler. |
| `POST` | `/api/corporate/users` | Şirkete yeni kullanıcı ekler ve kimlik bilgilerini e-posta ile gönderir. |

## Kart Listeleme – `GET /api/corporate/cards`

Sorgu parametreleri:

- `page`, `limit` – varsayılan 1 / 10
- `search` – kart adı, kart sahibinin adı veya kullanıcı adı üzerinde arama yapar
- `isActive` – `true` / `false`

Yanıt örneği:
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "cardName": "Dijital Kart",
      "creationType": "Sihirbaz ile oluşturuldu",
      "isActive": true
    }
  ],
  "totalCount": 4,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

Eğer veritabanında `Cards.companyId` kolonu yoksa boş liste ve migration mesajı döner.

## Kart Oluşturma – `POST /api/corporate/cards`

- **Gövde**
  - `name` (zorunlu)
  - `userId` (opsiyonel; aynı şirkete ait kullanıcı olmalı)
  - `title`, `email`, `phone`, `website`, `address`, `isActive`, `customSlug` (opsiyonel)
- **Kurallar**
  - Şirketin `cardLimit` değerini aşamaz; limit doluysa `400`.
  - `customSlug` format ve benzersizlik açısından kontrol edilir.
  - `userId` belirtilmişse kullanıcının e-postası kart e-postası olarak kullanılır ve `title` otomatik `null` yapılır.
- **Transaction:** Kart ekleme, slug kontrolü, QR kod üretimi ve ilgili isimlerin çekilmesi tek transaction içinde yapılır.
- **Yanıt**
  ```json
  {
    "success": true,
    "data": {
      "id": 84,
      "name": "Yeni Kart",
      "customSlug": "yeni-kart",
      "companyId": 7,
      "companyName": "Acme Corp",
      "isActive": true,
      "qrCodeData": "data:image/png;base64,..."
    }
  }
  ```

## Kullanıcı Oluşturma – `POST /api/corporate/users`

- **Gövde**
  - `name`, `email`, `password`, `role` (zorunlu; `role` sadece `user` veya `corporate`)
- **Kurallar**
  - Şirketin `userLimit` değerini aşamaz.
  - Şifre en az 6 karakter olmalı, e-posta formatı doğrulanır.
  - E-posta benzersiz değilse `400`.
- **Davranış**
  - Parola hashlenir, kullanıcı şirketle ilişkilendirilerek kaydedilir.
  - İşlem transaction ile yürütülür.
  - Başarılıysa kullanıcıya giriş bilgileri e-posta ile gönderilir (gönderim hatası ana işlemi bozmaz).
- **Yanıt**
  ```json
  {
    "success": true,
    "data": {
      "id": 150,
      "name": "Ahmet Kaya",
      "email": "ahmet@example.com",
      "role": "user",
      "companyId": 7,
      "companyName": "Acme Corp"
    },
    "emailSent": true
  }
  ```

## Kullanıcı Listeleme – `GET /api/corporate/users`

Şirkete bağlı tüm kullanıcıları `createdAt DESC` sırasıyla döner. Şimdilik sayfalama veya filtreleme yok; ihtiyaç halinde genişletilebilir.
