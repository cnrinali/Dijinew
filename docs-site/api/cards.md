# Kart API’sı

Kart yönetimi ikiye ayrılır: kimlik doğrulaması gerektiren özel uç noktalar ve herkese açık kart görüntüleme uç noktası.

## Korumalı Kart Yönetimi (`/api/cards`)

Bu rotaların tamamı Bearer token ister. Standart kullanıcılar yalnızca kendi kartlarını görüp yönetebilir. Kurumsal kullanıcılar şirket içindeki belirli kullanıcılar adına kart oluşturabilir (`userId` alanı).

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `GET` | `/api/cards` | Giriş yapan kullanıcının kartlarını listeler. |
| `POST` | `/api/cards` | Yeni kart oluşturur. |
| `GET` | `/api/cards/:id` | Kullanıcıya ait belirli kartı döner. |
| `PUT` | `/api/cards/:id` | Kart bilgilerini günceller. |
| `DELETE` | `/api/cards/:id` | Kartı siler. |
| `PATCH` | `/api/cards/:id/status` | Kartı aktif/pasif yapar. |
| `GET` | `/api/cards/:cardId/bank-accounts` | Kartın banka hesaplarını listeler. |
| `POST` | `/api/cards/:cardId/bank-accounts` | Kart için banka hesabı ekler. |
| `PUT` | `/api/cards/:cardId/bank-accounts/:accountId` | Banka hesabını günceller. |
| `DELETE` | `/api/cards/:cardId/bank-accounts/:accountId` | Banka hesabını siler. |

### `GET /api/cards`

Giriş yapan kullanıcının tüm kartlarını döner. Yanıtta `status` alanı otomatik olarak boolean `isActive` değerine dönüştürülür.

### `POST /api/cards`

- **Gövde**
  - Temel bilgiler: `cardName`, `name`, `title`, `company`, `bio`, `phone`, `email`, `website`, `address`, `theme`, `profileImageUrl`, `coverImageUrl`
  - Pazar yeri ve sosyal alanları: `linkedinUrl`, `twitterUrl`, `instagramUrl`, `trendyolUrl`, `hepsiburadaUrl`, `ciceksepeti`, `sahibindenUrl`, `hepsiemlakUrl`, `gittigidiyorUrl`, `n11Url`, `amazonTrUrl`, `getirUrl`, `yemeksepetiUrl`
  - Opsiyonel `customSlug` – sadece küçük harf, sayı ve tireye izin verilir; benzersiz olmalıdır.
  - Kurumsal kullanım: `userId` alanı doldurulursa ilgili kullanıcı şirketle ilişkilendirilmiş olmalıdır.
- **Kurallar**
  - `role = user` olanlar yalnızca *bir* kart yaratabilir (`400` döner).
  - Geçersiz slug formatı veya tekrar eden slug reddedilir.
- **Yanıt `201`** – veritabanındaki tam kart kaydını döner (`id`, `createdAt`, `customSlug`, vb.).

### `GET /api/cards/:id`

Belirtilen kart kullanıcıya ait değilse `404`. Aksi halde kart bilgisini döner.

### `PUT /api/cards/:id`

`POST` ile aynı alanları kabul eder. `isActive` tercihi veya `customSlug` değişikliği yapılabilir. Slug tekrar benzersizliğe tabi tutulur.

### `DELETE /api/cards/:id`

Kart sahibine aitse siler ve aşağıdaki mesajı döner:
```json
{ "message": "Kartvizit başarıyla silindi", "id": 42 }
```

### `PATCH /api/cards/:id/status`

- **Gövde**
  - `isActive` `boolean`
- **Davranış:** Kart sahibine aitse `status` alanını günceller ve yeni durumu döner.

## Kart Banka Hesapları

Kart bazlı banka hesapları, kullanıcı banka hesaplarıyla aynı validasyonlardan geçer (`TR` ile başlayan 26 haneli IBAN ve kart içinde benzersizlik).

- `GET /api/cards/:cardId/bank-accounts` – `createdAt DESC` sıralı liste.
- `POST` / `PUT` – `bankName`, `iban`, `accountName` alanlarını ister.
- `DELETE` – kart sahibine aitse kaydı kaldırır.

## Herkese Açık Kart Sorgusu (`/api/public`)

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `GET` | `/api/public/:slugOrId` | Public | Kartı ID, `customSlug` veya `permanentSlug` ile döner. |

- **Parametre:** `:slugOrId` tamsayı (kart ID) veya slug olabilir. Geçersiz formatta `400`.
- **Yanıt `200`** – Tam kart kaydı + ilişkili `CardBankAccounts` listesi.
- **Hata** – Aktif kart bulunmazsa `404`.
