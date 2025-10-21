# Kimlik Doğrulama API’sı

Bu uç noktalar Dijinew kullanıcı oturumlarını oluşturur ve yönetir. Token’lar `JWT_SECRET` ile imzalanır ve varsayılan olarak 30 gün geçerlidir.

| Metot | Yol | Erişim | Açıklama |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Yeni kullanıcı kaydeder ve JWT döner. |
| `POST` | `/api/auth/login` | Public | Kullanıcıyı doğrular ve JWT döner. |
| `POST` | `/api/auth/logout` | Bearer | Çıkış aktivitesini kaydeder; token istemcide silinmelidir. |
| `POST` | `/api/auth/forgot` | Public | E-posta kayıtlıysa şifre sıfırlama linki üretir. |
| `PUT` | `/api/auth/reset/:resetToken` | Public | E-postadaki token ile şifreyi yeniler. |
| `PUT` | `/api/auth/update-role` | Bearer (admin) | Başka bir kullanıcının rolünü günceller. |

## `POST /api/auth/register`

- **Gövde**
  - `name` `string` – zorunlu
  - `email` `string` – zorunlu, benzersiz, e-posta formatı
  - `password` `string` – zorunlu
  - `role` `string` – opsiyonel, varsayılan `user`; desteklenen roller `user`, `corporate`, `admin`
- **Davranış**
  - Yinelenen e-postalarda `400` döner.
  - Parola bcrypt ile hashlenir ve `Users.password` alanına kaydedilir.
- **Yanıt `201`**
  ```json
  {
    "id": 12,
    "name": "Ayşe Yılmaz",
    "email": "ayse@example.com",
    "role": "user",
    "token": "<jwt>"
  }
  ```

## `POST /api/auth/login`

- **Gövde**
  - `email` `string` – zorunlu
  - `password` `string` – zorunlu
- **Davranış**
  - Parola doğrulaması sonrası `ActivityLogger` ile giriş kaydı oluşturur.
  - JWT payload’ı içine `role` ve varsa `companyId` eklenir.
- **Yanıt `200`**
  ```json
  {
    "id": 12,
    "name": "Ayşe Yılmaz",
    "email": "ayse@example.com",
    "role": "corporate",
    "companyId": 5,
    "token": "<jwt>"
  }
  ```
- **Hatalar**
  - `400` eksik alan varsa
  - `401` hatalı kimlik bilgileri

## `POST /api/auth/logout`

- **Erişim:** Her türlü doğrulanmış kullanıcı.
- **Davranış:** Çıkış aktivitesini kaydeder, token’lar sunucuda kara listeye alınmaz; istemci token’ı silmelidir.
- **Yanıt `200`**
  ```json
  { "message": "Çıkış başarılı (istemci token silmeli)" }
  ```

## `POST /api/auth/forgot`

- **Gövde**
  - `email` `string` – zorunlu
- **Davranış**
  - 10 dakikalık süreli tek kullanımlık token üretir, hashleyerek veritabanında saklar.
  - Şu anda e-posta konsola loglanır; gerçek gönderim için e-posta servisi entegre edin.
- **Yanıt `200`**
  - E-posta kayıtlı olsun olmasın aynı mesajı döner (hesap keşfini engellemek için).

## `PUT /api/auth/reset/:resetToken`

- **Parametre**
  - `resetToken` `string` – e-postayla gelen ham token
- **Gövde**
  - `password` `string` – zorunlu
- **Davranış**
  - Token hashlenerek veritabanındaki kayıtla karşılaştırılır; süresi dolmuşsa kabul edilmez.
  - Parola güncellendikten sonra token alanları temizlenir.
- **Hatalar**
  - `400` eksik parola veya geçersiz/expired token.

## `PUT /api/auth/update-role`

- **Erişim:** `role = admin` olan kullanıcılar.
- **Gövde**
  - `userId` `number` – zorunlu
  - `role` `string` – zorunlu (`admin`, `corporate`, `user`)
- **Davranış**
  - Belirtilen kullanıcının rolünü günceller; kullanıcı bulunmazsa `404`.
