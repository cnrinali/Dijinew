# Sunucu İzin Kontrol Komutları

SSH'da şu komutları çalıştırarak kontrol edin:

## 1. Klasör İzinlerini Kontrol
```bash
cd ~/api.dijinew.com/server
ls -la uploads/
ls -la uploads/images/
ls -la uploads/documents/
```

**Beklenen Sonuç:**
- Tüm klasörler: `drwxr-xr-x` (755)
- Owner: `dijinew`

## 2. Yazma İzni Testi
```bash
cd ~/api.dijinew.com/server/uploads/images
touch test-yazma.txt
echo "test" > test-yazma.txt
cat test-yazma.txt
rm test-yazma.txt
```

**Başarılı olmalı:** Dosya oluşturulmalı ve silinebilmeli

## 3. Klasör İçeriklerini Kontrol
```bash
ls -la ~/api.dijinew.com/server/uploads/images/
ls -la ~/api.dijinew.com/server/uploads/documents/
```

**Not:** Şu an boş olabilirler, yeni yüklemeler burada olacak

## 4. Node.js Process Owner Kontrolü
```bash
ps aux | grep node
# veya
ps aux | grep server.js
```

**Beklenen:** Node.js process'i `dijinew` kullanıcısı altında çalışmalı

## 5. Disk Alanı Kontrolü
```bash
df -h ~/api.dijinew.com/server/uploads/
du -sh ~/api.dijinew.com/server/uploads/
```

## 6. Log Kontrolü (Upload Hataları İçin)
```bash
tail -f ~/api.dijinew.com/server/server.log
# veya
tail -f ~/api.dijinew.com/server/logs/error.log
```

---

## Eğer Hala Sorun Varsa:

### A) Owner'ı Değiştir (Gerekirse)
```bash
cd ~/api.dijinew.com/server
chown -R dijinew:dijinew uploads/
```

### B) İzinleri Yeniden Ayarla
```bash
chmod -R 755 uploads/
# Dosyalar için de:
find uploads/ -type f -exec chmod 644 {} \;
```

### C) SELinux Kontrolü (Eğer aktifse)
```bash
getenforce
# Eğer "Enforcing" ise:
sudo setenforce 0
# veya
sudo chcon -R -t httpd_sys_rw_content_t uploads/
```



