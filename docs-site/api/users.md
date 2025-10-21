# Kullanıcı Profili & Banka Hesapları

Tüm `/api/users/*` uç noktaları geçerli bir Bearer token gerektirir. Middleware, JWT içindeki veriyi `req.user` olarak aktarır.

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `GET` | `/api/users/profile` | Bearer | Giriş yapmış kullanıcının profilini döner. |
| `PUT` | `/api/users/profile` | Bearer | `name` ve `email` alanlarını günceller. |
| `PUT` | `/api/users/change-password` | Bearer | Kullanıcının şifresini değiştirir. |
| `GET` | `/api/users/bank-accounts` | Bearer | Kullanıcının banka hesaplarını listeler. |
| `POST` | `/api/users/bank-accounts` | Bearer | Yeni banka hesabı ekler. |
| `PUT` | `/api/users/bank-accounts/:id` | Bearer | Kayıtlı banka hesabını günceller. |
| `DELETE` | `/api/users/bank-accounts/:id` | Bearer | Banka hesabını siler. |

## `GET /api/users/profile`

Yanıt örneği:
```json
{
  "id": 12,
  "name": "Ayşe Yılmaz",
  "email": "ayse@example.com",
  "role": "user",
  "createdAt": "2024-03-01T10:12:45.000Z"
}
```

## `PUT /api/users/profile`

- **Gövde**
  - `name` `string` – zorunlu
  - `email` `string` – zorunlu, benzersiz, geçerli format
- **Davranış:** Aynı e-posta başka kullanıcıda varsa `400`. Yanıt, güncellenmiş profil bilgisini içerir.

## `PUT /api/users/change-password`

- **Gövde**
  - `currentPassword` `string` – zorunlu
  - `newPassword` `string` – zorunlu, min. 6 karakter, mevcut şifre ile aynı olamaz
- **Hatalar**
  - `401` mevcut şifre doğrulanamazsa
  - `400` diğer validasyon hataları
- **Yanıt `200`**
  ```json
  { "message": "Şifreniz başarıyla değiştirildi." }
  ```

## Banka Hesabı Uç Noktaları

Her işlem IBAN formatını kontrol eder: boşluklar temizlenir, `TR` ile başlamalı ve toplam 26 karakter olmalıdır. Aynı IBAN kullanıcı bazında yalnızca bir kez eklenebilir.

- `GET /api/users/bank-accounts` – hesaplar `createdAt DESC` sırası ile döner.
- `POST /api/users/bank-accounts` & `PUT /api/users/bank-accounts/:id`
  - Gövde: `bankName`, `iban`, `accountName`
  - Aynı IBAN eklenmeye çalışılırsa `400` döner.
- `DELETE /api/users/bank-accounts/:id` – kayıt kullanıcıya aitse siler ve
  ```json
  { "message": "Banka hesabı başarıyla silindi." }
  ``` 
  döner.
