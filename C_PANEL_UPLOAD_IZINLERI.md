# cPanel Dosya Upload İzinleri Ayarlama Kılavuzu

## 🔧 Yöntem 1: cPanel File Manager İle (Önerilen)

### Adım 1: cPanel'e Giriş
1. cPanel'e giriş yapın: `https://your-domain.com:2083` veya `https://cpanel.your-domain.com`
2. **File Manager** uygulamasını açın

### Adım 2: Uploads Klasörlerini Bulun
1. `server` veya `api.dijinew.com` klasörüne gidin
2. `uploads` klasörünü bulun (yoksa oluşturun)
3. `uploads` klasörünün içinde şu alt klasörler olmalı:
   - `images/`
   - `documents/`

### Adım 3: İzinleri Ayarlayın

#### Uploads Ana Klasörü İçin:
1. `uploads` klasörüne sağ tıklayın
2. **Change Permissions** seçin
3. Şu izinleri ayarlayın:
   - **Owner (Owner)**: `7` (Read + Write + Execute)
   - **Group (Grup)**: `5` (Read + Execute)
   - **Public (Herkese Açık)**: `5` (Read + Execute)
   - **Numeric Value**: `755`
4. **Apply recursively (Özyinelemeli uygula)** işaretleyin
5. **Change Permissions** butonuna tıklayın

#### Images ve Documents Alt Klasörleri İçin:
Aynı işlemi `uploads/images` ve `uploads/documents` için tekrarlayın.

### Adım 4: Klasörleri Oluşturma
Eğer klasörler yoksa:
1. `uploads` klasörüne sağ tıklayın → **Create Folder**
2. `images` adını girin
3. Aynı şekilde `documents` klasörünü de oluşturun
4. İzinleri yukarıdaki gibi ayarlayın

---

## 🔧 Yöntem 2: SSH/Terminal İle

### SSH Bağlantısı:
```bash
ssh kullanici_adi@sunucu_ip
# veya
ssh kullanici_adi@your-domain.com
```

### Komutlar:
```bash
# Server klasörüne gidin (kendi yolunuzu yazın)
cd /home/kullanici_adi/server
# veya
cd ~/api.dijinew.com/server

# Klasörleri oluştur
mkdir -p uploads/images
mkdir -p uploads/documents

# İzinleri ayarla (Owner: rwx, Group: rx, Public: rx)
chmod 755 uploads
chmod 755 uploads/images
chmod 755 uploads/documents

# Owner'ı ayarla (web sunucusu genellikle 'nobody' veya 'apache')
# Kendi kullanıcı adınızı öğrenmek için: whoami
# chown -R kullanici_adi:nobody uploads/

# Kontrol et
ls -la uploads/
```

### İzin Değerleri Açıklaması:
- **755** = `rwxr-xr-x`
  - Owner: Read (4) + Write (2) + Execute (1) = 7
  - Group: Read (4) + Execute (1) = 5
  - Public: Read (4) + Execute (1) = 5

---

## 🔧 Yöntem 3: Deploy Script İle Otomatik

`deploy-server.sh` script'inize şu komutları ekleyebilirsiniz:

```bash
# Deploy sonrası izinleri ayarla
echo "🔐 Upload izinleri ayarlanıyor..."
cd server
chmod 755 uploads uploads/images uploads/documents 2>/dev/null || true
```

---

## ✅ Kontrol Listesi

Yüklemelerin çalışıp çalışmadığını kontrol edin:

1. **API Test**: `POST https://api.dijinew.com/api/upload/image` endpoint'ini test edin
2. **Dosya Kontrol**: Yükleme sonrası `uploads/images/` klasöründe dosyanın göründüğünü kontrol edin
3. **İzin Kontrol**: SSH ile `ls -la uploads/images/` komutunu çalıştırın

---

## ❌ Yaygın Sorunlar ve Çözümleri

### Sorun 1: "EACCES: permission denied" Hatası
**Çözüm**: 
```bash
chmod -R 755 uploads/
chown -R $(whoami):nobody uploads/
```

### Sorun 2: Klasör Oluşturulamıyor
**Çözüm**: 
- cPanel'de klasörü manuel oluşturun
- İzinleri 755 yapın
- Owner'ı web sunucusu kullanıcısına ayarlayın (genellikle `nobody` veya `apache`)

### Sorun 3: Dosya Yazılamıyor
**Çözüm**:
- Owner'a Write (7) izni verin
- Group izinlerini kontrol edin
- Disk alanının dolup dolmadığını kontrol edin: `df -h`

### Sorun 4: Dosyalar Görünmüyor
**Çözüm**:
- Public Read (4) izninin olduğundan emin olun
- `.htaccess` dosyasında uploads klasörü için özel kural olmamalı

---

## 📝 Ek Notlar

### Güvenlik:
- **Public Write izni vermeyin** (6 veya 7)
- Sadece Owner'ın yazma izni olmalı
- Group ve Public sadece okuma (5) izni yeterli

### Performans:
- Büyük dosyalar için disk alanını kontrol edin
- Upload limit'leri `server.js` ve `multer` ayarlarında tanımlı (şu anda 5-10MB)

### Log Kontrolü:
Sunucu loglarını kontrol etmek için:
```bash
tail -f server/server.log
# veya
journalctl -u your-service-name -f
```

---

## 🆘 Yardım

Sorun devam ederse:
1. cPanel'de **Error Log** kontrol edin
2. Node.js **server.log** dosyasını kontrol edin
3. Browser **Console** ve **Network** tab'ını kontrol edin
4. Sunucu sağlayıcınızla iletişime geçin (disk alanı limit'i olabilir)



