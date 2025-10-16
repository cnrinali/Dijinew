# 🎡 3D Carousel Tema Dokümantasyonu

## Genel Bakış
3D Carousel Tema, kullanıcıların iletişim ikonlarını dairesel bir düzende görüntülediği ve yukarı/aşağı sürükleyerek döndürebildiği interaktif bir kartvizit temasıdır.

## Özellikler

### 🎯 Ana Özellikler
- **3D Dönen Carousel**: İkonlar dairesel bir düzende yerleştirilmiş
- **Sürükle ve Bırak**: Mouse veya touch ile yukarı/aşağı sürükleme
- **Perspektif Efekti**: Arkadaki ikonlar küçülür ve solukluk
- **Renkli İkonlar**: Her ikon kendi rengine sahip
- **Smooth Animasyon**: Yumuşak geçişler ve hover efektleri

### 📱 Desteklenen İletişim Kanalları
- Telefon (Yeşil)
- E-posta (Mavi)
- Web Sitesi (Mor)
- LinkedIn (LinkedIn Mavisi)
- Instagram (Pembe/Mor Gradient)
- Twitter (Açık Mavi)
- Konum (Kırmızı)
- QR Kod (Turuncu)
- Paylaş (Pembe)

## Teknik Detaylar

### 3D Hesaplamalar
```javascript
// Her ikon için açı hesaplama
const anglePerItem = 360 / totalItems;
const angle = (index * anglePerItem + rotation) % 360;

// Y ve Z pozisyonu (dairesel yerleşim)
const radius = 180;
const y = Math.sin((angle * Math.PI) / 180) * radius;
const z = Math.cos((angle * Math.PI) / 180) * radius;

// Ölçek ve opaklık (arkadakiler küçük ve soluk)
const scale = 0.6 + (z / radius) * 0.4;
const opacity = 0.3 + (z / radius) * 0.7;
```

### Event Handling
- **Mouse Events**: mouseDown, mouseMove, mouseUp, mouseLeave
- **Touch Events**: touchStart, touchMove, touchEnd
- **Drag Sensitivity**: 0.5 (yukarı/aşağı hareket hassasiyeti)

### Görsel Parametreler
- **Radius**: 180px (daire yarıçapı)
- **İkon Boyutu**: 100x100px
- **Min Scale**: 0.6 (arkadaki ikonlar)
- **Max Scale**: 1.0 (öndeki ikon)
- **Min Opacity**: 0.3 (arkadaki ikonlar)
- **Max Opacity**: 1.0 (öndeki ikon)

## Kullanım

### Wizard'da Seçim
1. CardWizard'da "Tema Seçimi" adımına gidin
2. Dropdown'dan "🎡 3D Carousel Tema" seçin
3. Önizlemede temayı test edin

### Kod Entegrasyonu
```javascript
import { getThemeComponent } from './components/CardThemes';

const ThemeComponent = getThemeComponent('carousel');
<ThemeComponent cardData={cardData} />
```

## Responsive Tasarım
- **Desktop**: Mouse ile sürükle
- **Mobile**: Touch ile sürükle
- **Tablet**: Hem mouse hem touch desteği

## Performans Optimizasyonları
- Sürükleme sırasında transition devre dışı (smooth drag için)
- Z-index dinamik hesaplama (render performansı)
- Pointer events sadece görünür ikonlarda aktif (opacity > 0.7)

## Renk Paleti
```css
Profil Bölümü: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Telefon: #10B981 (Yeşil)
E-posta: #3B82F6 (Mavi)
Web: #8B5CF6 (Mor)
LinkedIn: #0077B5
Instagram: #E1306C
Twitter: #1DA1F2
Konum: #EF4444 (Kırmızı)
QR Kod: #F59E0B (Turuncu)
Paylaş: #EC4899 (Pembe)
```

## Browser Desteği
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Gelecek Geliştirmeler
- [ ] Otomatic döndürme modu
- [ ] Momentum scrolling (fırlatma efekti)
- [ ] Snap to item (ikona kilitleme)
- [ ] Özelleştirilebilir renkler
- [ ] Özelleştirilebilir ikon boyutu

## Sorun Giderme

### İkonlar Görünmüyor
- cardData'nın gerekli alanlarının dolu olduğundan emin olun
- Console'da hata mesajlarını kontrol edin

### Sürükleme Çalışmıyor
- userSelect: 'none' CSS özelliğinin aktif olduğunu kontrol edin
- touchAction: 'pan-x' ayarını kontrol edin

### Performans Sorunları
- Çok fazla ikon varsa (>10), radius değerini artırın
- Eski cihazlarda transition süresini artırın

## Lisans
MIT License - Dijinew Project 2025
