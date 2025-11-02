#!/bin/bash

# cPanel Upload İzinleri Ayar Script'i
# Bu script'i sunucuda çalıştırın

echo "🔧 cPanel Upload İzinleri Ayarlanıyor..."

# Sunucu üzerindeki server klasörünün tam yolunu buraya yazın
# Örnek: /home/kullanici_adi/server veya /home/kullanici_adi/api.dijinew.com/server
SERVER_PATH="${1:-/home/kullanici_adi/server}"

if [ ! -d "$SERVER_PATH" ]; then
    echo "❌ Hata: $SERVER_PATH klasörü bulunamadı!"
    echo "Kullanım: ./setup-upload-permissions.sh /home/kullanici_adi/server"
    exit 1
fi

cd "$SERVER_PATH"

# Uploads klasörlerini oluştur
echo "📁 Uploads klasörleri oluşturuluyor..."
mkdir -p uploads
mkdir -p uploads/images
mkdir -p uploads/documents

# İzinleri ayarla
echo "🔐 İzinler ayarlanıyor..."

# Klasörler için 755 (rwxr-xr-x) - okuma, yazma, çalıştırma (owner), okuma ve çalıştırma (others)
chmod 755 uploads
chmod 755 uploads/images
chmod 755 uploads/documents

# Dosyalar için 644 (rw-r--r--) - okuma, yazma (owner), okuma (others)
# Bu, mevcut dosyalar için geçerlidir, yeni yüklenen dosyalar için multer otomatik ayarlar

echo "✅ İzinler başarıyla ayarlandı!"
echo ""
echo "📋 Ayarlanan İzinler:"
ls -la uploads/
echo ""
echo "📝 Not: Eğer hala sorun yaşıyorsanız:"
echo "1. cPanel File Manager'da uploads klasörüne sağ tıklayıp 'Change Permissions' seçin"
echo "2. Owner: 7 (Read+Write+Execute)"
echo "3. Group: 5 (Read+Execute)"
echo "4. Public: 5 (Read+Execute)"
echo "5. Apply recursively (özyinelemeli uygula) işaretleyin"



