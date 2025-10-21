# Dijinew API Dokümantasyonu

Bu dokümantasyon seti, Dijinew platformunun sunduğu tüm REST servislerini kapsamlı biçimde açıklar. Servislerin ne işe yaradığını, kimlerin kullanabileceğini ve beklenen istek/yanıt formatlarını burada bulabilirsiniz.

- **Prod API URL’si:** `https://api.dijinew.com`
- **Kimlik Doğrulama:** Genel olarak tüm korumalı isteklerde `Authorization: Bearer <JWT>` başlığı zorunludur. Token’ı `POST /api/auth/login` veya `POST /api/auth/register` çağrısı ile alabilirsiniz.

## İçindekiler

- [Kimlik Doğrulama](api/authentication.md)
- [Kullanıcı Profili & Banka Hesapları](api/users.md)
- [Kartlar (Korumalı ve Genel)](api/cards.md)
- [Yönetici API’leri](api/admin.md)
- [Kurumsal API’ler](api/corporate.md)
- [Analitik ve Takip](api/analytics.md)
- [Aktivite Kaydı](api/activities.md)
- [Wizard Token API’leri](api/wizard.md)
- [Basit Wizard API’leri](api/simple-wizard.md)
- [Dosya Yükleme](api/upload.md)
- [Sistem Sağlığı](api/system.md)

Her sayfa şu başlıkları içerir:

1. Hızlı özet tabloları
2. İstek/yanıt şemaları ve geçerlilik kuralları
3. Express ve MSSQL tarafındaki gerçek davranışlardan alınan notlar

> İpucu: Korumalı rotaları Postman/curl ile denerken önce `POST /api/auth/login` çağrısı yapın, dönen JWT’yi Authorization başlığında kullanın.
