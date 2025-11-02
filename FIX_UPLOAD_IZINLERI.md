# Upload Dosya İzinleri Düzeltme

## 🔴 Sorun:
Resim yüklendi ama görüntülenemiyor. Dosya izinleri yeterli değil.

## ✅ Çözüm 1: Mevcut Dosyalar İçin (SSH'da çalıştırın)

```bash
cd ~/api.dijinew.com/server/uploads/images

# Tüm resim dosyalarına okuma izni ver
find . -type f -name "*.jpg" -exec chmod 644 {} \;
find . -type f -name "*.jpeg" -exec chmod 644 {} \;
find . -type f -name "*.png" -exec chmod 644 {} \;
find . -type f -name "*.gif" -exec chmod 644 {} \;

# Veya tek komutla tüm dosyalar:
chmod 644 *.jpg *.jpeg *.png *.gif 2>/dev/null || true

# Documents klasörü için de:
cd ../documents
find . -type f -name "*.pdf" -exec chmod 644 {} \;
```

## ✅ Çözüm 2: Otomatik İzin Ayarlama (Node.js Server'da)

Server.js dosyasına dosya oluşturulduktan sonra izin ayarlama eklenebilir.

## ✅ Çözüm 3: Test

```bash
# Dosya izinlerini kontrol et
ls -la ~/api.dijinew.com/server/uploads/images/image-*.jpg | head -5

# Beklenen: -rw-r--r-- (644)

# Web'den erişim testi
curl -I https://api.dijinew.com/uploads/images/image-1761758247702-431223837.jpg

# 200 OK dönmeli, 403 Forbidden değil
```

## 📝 Yeni Yüklemeler İçin

Multer dosya oluştururken otomatik olarak 644 iznini ayarlamalı. 
Eğer ayarlamazsa, upload.controller.js'e chmod eklenmeli.



