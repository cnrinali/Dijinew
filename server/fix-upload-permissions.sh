#!/bin/bash

# Mevcut yüklenmiş dosyaların izinlerini düzelt

echo "🔧 Mevcut upload dosyalarının izinleri düzeltiliyor..."

cd ~/api.dijinew.com/server

# Images klasöründeki tüm resim dosyalarına okuma izni ver
if [ -d "uploads/images" ]; then
    echo "📸 Images klasörü düzeltiliyor..."
    find uploads/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" \) -exec chmod 644 {} \;
    echo "✅ Images klasörü düzeltildi"
fi

# Documents klasöründeki tüm PDF dosyalarına okuma izni ver
if [ -d "uploads/documents" ]; then
    echo "📄 Documents klasörü düzeltiliyor..."
    find uploads/documents -type f -name "*.pdf" -exec chmod 644 {} \;
    echo "✅ Documents klasörü düzeltildi"
fi

# Eski resimler uploads ana klasöründeyse onları da düzelt
echo "🔄 Eski dosyalar kontrol ediliyor..."
find uploads -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \) -exec chmod 644 {} \;

echo ""
echo "✅ Tüm dosya izinleri düzeltildi!"
echo ""
echo "📋 Kontrol:"
ls -la uploads/images/ | head -5
echo ""
echo "🌐 Test URL: https://api.dijinew.com/uploads/images/image-1761758247702-431223837.jpg"



