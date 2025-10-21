# Dijinew API Dokümantasyonu

## API Dokümantasyonuna Erişim

API dokümantasyonumuza **Scalar API Reference** ile güzel bir arayüzden erişebilirsiniz:

### Yerel Geliştirme
```
http://localhost:5001/api/docs
```

### Production
```
https://api.dijinew.com/api/docs
```

## Özellikler

- ✅ **İnteraktif API Testi**: Doğrudan browser'dan API endpoint'lerini test edebilirsiniz
- ✅ **Otomatik Authentication**: Bearer token ile kimlik doğrulama desteği
- ✅ **Detaylı Şemalar**: Request ve response şemaları ile tam tip güvenliği
- ✅ **Örnek İstekler**: Her endpoint için hazır kod örnekleri
- ✅ **Canlı Swagger JSON**: Dinamik olarak güncellenen OpenAPI 3.0 spesifikasyonu

## Swagger/OpenAPI JSON

Ham OpenAPI/Swagger JSON dosyasına erişmek için:

```
http://localhost:5001/api/docs/swagger.json
```

Bu endpoint:
- Dinamik olarak mevcut server URL'ini günceller
- Development, staging ve production server'larını listeler
- Her türlü API client (Postman, Insomnia, vs.) ile uyumludur

## API Grupları

Dokümantasyon aşağıdaki ana kategorilere ayrılmıştır:

### 1. **Auth** - Kimlik Doğrulama
- Kullanıcı kaydı
- Giriş/çıkış
- Şifre sıfırlama

### 2. **Users** - Kullanıcı Yönetimi
- Profil bilgileri
- Şifre değiştirme
- Banka hesap yönetimi

### 3. **Cards** - Kartvizit İşlemleri
- Kart oluşturma, güncelleme, silme
- Kart durumu yönetimi
- Karta özel banka hesapları

### 4. **Public** - Herkese Açık
- Public kartvizit görüntüleme

### 5. **Admin** - Admin Paneli
- Kullanıcı yönetimi
- İstatistikler
- Sistem yönetimi

### 6. **Upload** - Dosya Yükleme
- Profil resmi
- Kapak resmi
- Logo yükleme

### 7. **Analytics** - Analitik
- Kart görüntüleme istatistikleri
- Tıklama verileri

### 8. **Activities** - Aktiviteler
- Kullanıcı aktivite logu

### 9. **Wizard** - Kartvizit Oluşturma Sihirbazı
- Adım adım kart oluşturma

### 10. **Corporate** - Kurumsal İşlemler
- Kurumsal hesap yönetimi

### 11. **System** - Sistem Bilgileri
- Sunucu durumu
- Sistem metrikleri

## Authentication (Kimlik Doğrulama)

API'mizin çoğu endpoint'i JWT Bearer token ile korunmaktadır.

### Token Alma

1. `/api/auth/register` veya `/api/auth/login` endpoint'ine POST isteği gönderin
2. Response'dan `token` değerini alın
3. Sonraki isteklerde bu token'ı kullanın

### Token Kullanımı

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5001/api/users/profile
```

Scalar dokümantasyonunda, sağ üst köşeden "Authorize" butonuna tıklayıp token'ınızı girebilirsiniz.

## Örnek Kullanım

### 1. Kullanıcı Kaydı

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Giriş Yapma

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmet@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Kart Oluşturma (Token Gerekli)

```bash
curl -X POST http://localhost:5001/api/cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmet Yılmaz",
    "title": "Yazılım Geliştirici",
    "company": "Dijinew Tech",
    "email": "ahmet@dijinew.com",
    "phone": "+90 555 123 4567"
  }'
```

### 4. Public Kart Görüntüleme (Token Gerektirmez)

```bash
curl http://localhost:5001/api/public/ahmet-yilmaz
```

## Swagger JSON'u Güncelleme

`server/swagger.json` dosyasını düzenleyerek API dokümantasyonunu güncelleyebilirsiniz. Server her başlatıldığında bu dosyayı okur ve servis eder.

### Önemli Notlar:

- **OpenAPI Version**: 3.0.3
- **Format**: JSON
- **Validation**: Değişikliklerden sonra swagger.json'un geçerli olduğundan emin olun
- **Auto-reload**: Server restart gerektirir

## Postman / Insomnia ile Kullanım

1. Swagger JSON URL'ini kopyalayın: `http://localhost:5001/api/docs/swagger.json`
2. Postman'de: `Import` > `Link` > URL'i yapıştırın
3. Insomnia'da: `Import/Export` > `Import Data` > `From URL` > URL'i yapıştırın

## Geliştirme Notları

- Scalar API Reference CDN üzerinden yüklenir (internet bağlantısı gerekir)
- Dokümantasyon tamamen stateless'tir
- CORS ayarları tüm dijinew.com domainlerine izin verir
- API Logger middleware dokümantasyon endpoint'lerini loglamaz

## Destek

Sorularınız için:
- API Dokümantasyonu: http://localhost:5001/api/docs
- Repository: [GitHub](https://github.com/dijinew)
- Website: https://dijinew.com
