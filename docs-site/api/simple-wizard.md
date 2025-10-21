# Basit Sihirbaz API’sı

Basit sihirbaz akışı, hızlı kart kurulum deneyimi sunar. Uç noktalar `/api/simple-wizard` altında yer alır.

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `POST` | `/api/simple-wizard/create` | Bearer (`admin` veya `corporate`) | Taslak kart ve wizard token oluşturur, gerekirse e-posta gönderir. |
| `GET` | `/api/simple-wizard/validate/:token` | Public | Token geçerlilik kontrolü. |
| `GET` | `/api/simple-wizard/card/:token` | Public | Token’a bağlı kart taslağını getirir. |
| `PUT` | `/api/simple-wizard/card/:token` | Public | Kartı sihirbaz üzerinden günceller. |
| `PUT` | `/api/simple-wizard/update-ownership/:token` | Public | Kart sahipliğini kullanıcı ID’siyle değiştirir. |
| `PUT` | `/api/simple-wizard/use/:token` | Public | Token’ı kullanıldı olarak işaretler. |
| `GET` | `/api/simple-wizard/my-wizards` | Bearer (`admin` veya `corporate`) | Kullanıcının oluşturduğu token’lar. |
| `GET` | `/api/simple-wizard/debug-schema` | Public (diagnostic) | `Cards` şemasını kontrol eder ve eksik kolonları eklemeyi dener. |
| `GET` | `/api/simple-wizard/test-permanent-slug` | Public (diagnostic) | `permanentSlug` üzerine test sorguları çalıştırır. |

## `POST /api/simple-wizard/create`

- **Gövde**
  - `email` `string` – opsiyonel; geçerliyse davet e-postası gönderilir.
- **Davranış**
  - Sadece admin ve kurumsal kullanıcılar erişebilir.
  - Varsayılan olarak `isActive = false` ve UUID temelli slug’a sahip taslak kart oluşturur.
  - Kurumsal çağrılarda kart şirket ile ilişkilendirilir (veritabanında `companyId` varsa).
  - Token 30 gün geçerlidir ve `SimpleWizardTokens` tablosuna kaydedilir.
  - Kart için QR kod üretilir; hem Data URL hem de `/qr/{slug}` formatındaki link döner.
- **Yanıt `201`**
  ```json
  {
    "success": true,
    "data": {
      "id": 25,
      "token": "abcd1234ef...",
      "cardId": 320,
      "cardSlug": "71f358a2-cd21-...",
      "wizardUrl": "https://app.dijinew.com/wizard/71f...?",
      "qrCodeUrl": "https://app.dijinew.com/qr/71f...",
      "emailSent": true
    },
    "message": "Sihirbaz linki başarıyla oluşturuldu. Email gönderildi. QR kod hazırlandı."
  }
  ```

## `GET /api/simple-wizard/validate/:token`

Token geçerli ve kullanılmamışsa kart ve e-posta bilgileriyle birlikte başarılı yanıt döner. Aksi halde:

- `404` – token yok
- `410` – token süresi dolmuş
- `409` – token daha önce kullanılmış

## `GET /api/simple-wizard/card/:token`

Taslak kart bilgilerini, token durumunu (`isUsed`, `isExpired`, `expiresAt`) ve varsa şirket bilgilerini döner. Token geçersizse `404`.

## `PUT /api/simple-wizard/card/:token`

- **Gövde:** Kart profil alanlarının tamamını veya bir kısmını içerebilir (`name`, `title`, `email`, `phone`, `website`, `address`, `bio`, `isActive`, vb.).
- **Davranış**
  - Token doğrulanır; süresi dolmuşsa `410`.
  - `name` dolu ve farklıysa kart otomatik aktive edilir, yeni rastgele slug üretilir.
  - Kart aktive edildiğinde token `isUsed = 1` yapılır.

## `PUT /api/simple-wizard/update-ownership/:token`

- **Gövde:** `newUserId` zorunludur.
- Taslak kartın `userId` alanını günceller. Token kullanılmışsa veya geçersizse `404`.

## `PUT /api/simple-wizard/use/:token`

Token’ı manuel olarak `isUsed = 1` yapar. Kart güncellemesi zaten token’ı kullanılmış olarak işaretliyorsa bu adım opsiyoneldir.

## `GET /api/simple-wizard/my-wizards`

Admin ve kurumsal kullanıcılar, oluşturdukları tüm token’ların listesini alır. Her kayıt, kart adı, slug’ı, durum etiketi ve son kullanma tarihini içerir.

## Diagnostik Uç Noktalar

- `GET /api/simple-wizard/debug-schema` – `Cards` tablosunda `companyId` veya `permanentSlug` gibi kolonlar eksikse eklemeyi dener. Üretimde dikkatli kullanılmalıdır.
- `GET /api/simple-wizard/test-permanent-slug` – `Cards.permanentSlug` alanına yönelik test sorguları çalıştırır ve ham sonuçları döner.
