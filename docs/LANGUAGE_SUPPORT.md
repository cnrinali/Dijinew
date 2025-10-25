# Çok Dilli Destek (Multi-Language Support)

Bu özellik, dijital kartvizit sisteminde hem bireysel kullanıcılar hem de kurumsal hesaplar için 5 farklı dil desteği sağlar.

## Desteklenen Diller

| Dil | Kod | Native İsim | Bayrak | RTL |
|-----|-----|-------------|--------|-----|
| Türkçe | `tr` | Türkçe | 🇹🇷 | Hayır |
| İngilizce | `en` | English | 🇬🇧 | Hayır |
| Arapça | `ar` | العربية | 🇸🇦 | Evet |
| Rusça | `ru` | Русский | 🇷🇺 | Hayır |
| Portekizce | `pt` | Português | 🇵🇹 | Hayır |

**Varsayılan Dil:** Türkçe (`tr`)

## Kurulum

### 1. Veritabanı Migration

Dil desteğini eklemek için migration scriptini çalıştırın:

```bash
cd server
node database/migrate_language_support.js
```

Veya otomatik migration ile:

```bash
cd server
node database/runMigrations.js
```

### 2. Migration Detayları

Migration aşağıdaki değişiklikleri yapar:

- **Users Tablosu:**
  - `language` kolonu eklenir (NVARCHAR(5), varsayılan: 'tr')
  - Check constraint: Sadece 'tr', 'en', 'ar', 'ru', 'pt' değerlerine izin verilir
  - Index oluşturulur: `IX_Users_Language`

- **Companies Tablosu:**
  - `language` kolonu eklenir (NVARCHAR(5), varsayılan: 'tr')
  - Check constraint: Sadece 'tr', 'en', 'ar', 'ru', 'pt' değerlerine izin verilir
  - Index oluşturulur: `IX_Companies_Language`

## API Kullanımı

### Kullanıcı İşlemleri

#### Kullanıcı Profilini Getir
```javascript
GET /api/users/profile
```

**Yanıt:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "language": "en",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### Kullanıcı Profilini Güncelle
```javascript
PUT /api/users/profile
```

**İstek Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "language": "en"
}
```

**Dil Validasyonu:**
- `language` alanı opsiyoneldir
- Sadece `['tr', 'en', 'ar', 'ru', 'pt']` değerlerine izin verilir
- Geçersiz bir dil kodu gönderilirse `400 Bad Request` döner

#### Giriş (Login)
```javascript
POST /api/auth/login
```

**Yanıt:** (language alanı eklendi)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "companyId": null,
  "language": "tr",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Kurumsal İşlemler

#### Şirket Oluştur
```javascript
POST /api/admin/companies
```

**İstek Body:**
```json
{
  "name": "Acme Corp",
  "userLimit": 50,
  "cardLimit": 100,
  "status": 1,
  "phone": "+90 555 123 4567",
  "website": "https://acme.com",
  "address": "İstanbul, Türkiye",
  "language": "tr"
}
```

#### Şirket Bilgilerini Güncelle
```javascript
PUT /api/admin/companies/:id
```

**İstek Body:**
```json
{
  "name": "Acme Corp",
  "userLimit": 50,
  "cardLimit": 100,
  "language": "en"
}
```

#### Şirket Bilgilerini Getir
```javascript
GET /api/admin/companies/:id
```

**Yanıt:**
```json
{
  "id": 1,
  "name": "Acme Corp",
  "userLimit": 50,
  "cardLimit": 100,
  "status": true,
  "phone": "+90 555 123 4567",
  "website": "https://acme.com",
  "address": "İstanbul, Türkiye",
  "language": "tr",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:00.000Z"
}
```

## Frontend Kullanımı

### Language Constants

```javascript
import { LANGUAGES, LANGUAGE_LIST, getLanguageByCode } from '../constants/languages';

// Tüm dilleri listele
console.log(LANGUAGE_LIST);
// [
//   { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
//   { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false },
//   ...
// ]

// Dil koduna göre dil bilgisi al
const turkish = getLanguageByCode('tr');
console.log(turkish); // { code: 'tr', name: 'Türkçe', ... }
```

### LanguageSelector Component

```javascript
import LanguageSelector from '../components/LanguageSelector';

function ProfileSettings() {
  const [language, setLanguage] = useState('tr');

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // API'ye kaydet
    updateUserProfile({ language: newLanguage });
  };

  return (
    <LanguageSelector 
      value={language}
      onChange={handleLanguageChange}
      label="Dil Seçin"
      showFlag={true}
      size="medium"
    />
  );
}
```

**Component Props:**
- `value` (string): Seçili dil kodu (varsayılan: 'tr')
- `onChange` (function): Dil değiştiğinde çağrılacak fonksiyon
- `disabled` (boolean): Selector'ü devre dışı bırak (varsayılan: false)
- `label` (string): Label metni (varsayılan: 'Dil / Language')
- `showFlag` (boolean): Bayrak emojisini göster (varsayılan: true)
- `size` (string): Select boyutu - 'small', 'medium', 'large' (varsayılan: 'medium')

## RTL (Right-to-Left) Desteği

Arapça için RTL desteği eklenmek üzere hazırlanmıştır. Her dil nesnesinde `rtl` özelliği bulunur:

```javascript
const language = getLanguageByCode('ar');
if (language.rtl) {
  // RTL layout'a geç
  document.dir = 'rtl';
} else {
  document.dir = 'ltr';
}
```

## Test Senaryoları

### Backend Testleri

```bash
# Migration testi
cd server
node database/migrate_language_support.js

# Manuel SQL testi
USE webinaja_dijinew;
SELECT * FROM Users WHERE id = 1;
UPDATE Users SET language = 'en' WHERE id = 1;
```

### API Testleri

```bash
# Kullanıcı profili güncelleme
curl -X PUT http://localhost:5001/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","language":"en"}'

# Şirket oluşturma
curl -X POST http://localhost:5001/api/admin/companies \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Corp","userLimit":10,"cardLimit":20,"language":"pt"}'
```

## Gelecek Geliştirmeler

- [ ] i18n kütüphanesi entegrasyonu (react-i18next)
- [ ] Tam RTL layout desteği
- [ ] Otomatik dil algılama (tarayıcı dil tercihi)
- [ ] Email şablonlarında dil desteği
- [ ] Kart temalarında dil bazlı içerik
- [ ] Admin panelinde dil bazlı istatistikler

## Sorun Giderme

### Migration Hatası
```
❌ Dil desteği eklenirken hata: Invalid column name 'language'
```
**Çözüm:** Migration'ı tekrar çalıştırın veya manuel olarak SQL script'i çalıştırın.

### Validation Hatası
```
400 Bad Request: Geçersiz dil seçimi
```
**Çözüm:** Sadece 'tr', 'en', 'ar', 'ru', 'pt' değerlerini kullanın.

### Check Constraint Hatası
```
The INSERT statement conflicted with the CHECK constraint "CK_Users_Language"
```
**Çözüm:** Dil kodu geçerli değerlerden biri olmalıdır.

## Lisans ve Katkıda Bulunma

Bu özellik, Dijinew dijital kartvizit sistemi için geliştirilmiştir.
Katkılarınızı bekliyoruz!
