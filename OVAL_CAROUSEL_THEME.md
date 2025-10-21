# Oval Carousel Tema Dokümantasyonu

## Genel Bakış
Oval Carousel Tema, iletişim ikonlarını hafif sola eğimli oval bir sahnede sergiler. Kullanıcılar ikonları yukarıdan aşağıya sürükleyerek döngü halinde ön plana çıkarabilir.

## Özellikler
- **Oval Carousel Sahnesi**: İkonlar sola yaslanmış eliptik bir yüzey üzerinde konumlandırılır.
- **Beyaz Arka Plan**: Temel yüzey beyaz bırakılarak ikonlara odak sağlanır; başlık bölümü koyu gradient ile ayrışır.
- **Derinlik Efekti**: Öndeki ikonlar daha parlak ve büyük görünür, arka plandakiler hafif bulanıklaşır.
- **Sürükle-Bırak Kontrolleri**: Mouse veya dokunmatik hareketlerle ikonlar çevrilir.
- **Akıcı Animasyonlar**: Yumuşak geçişler ve hover efektleri modern görünüm sağlar.
- **Merkezde Sahnelenen İkonlar**: Tüm ikonlar sahnenin merkezinde döner, öne çıkan ikon parlaklık ve ölçekle vurgulanır.

## Teknik Detaylar
```javascript
const anglePerItem = 360 / totalItems;
const angle = (index * anglePerItem + rotation) % 360;

const radiusX = 78;
const radiusY = 140;
const leanOffset = -10;

const x = Math.cos((angle * Math.PI) / 180) * radiusX + leanOffset;
const y = Math.sin((angle * Math.PI) / 180) * radiusY;

const depth = (Math.cos((angle * Math.PI) / 180) + 1) / 2;
const scale = 0.65 + depth * 0.3;
const opacity = 0.35 + depth * 0.6;
```

## Kullanım
1. CardWizard veya yönetim formlarından `Oval Carousel` temasını seçin.
2. Önizleme penceresinde ikonları yukarı-aşağı sürükleyerek döngüyü test edin.
3. Sahnede öne çıkan ikon otomatik olarak vurgulanır, kullanıcı tek tıkla etkileşime girebilir.

## Stil Parametreleri
- Carousel Zemin Rengi: `#ffffff`
- Başlık Bölümü: `linear-gradient(135deg, #1e293b 0%, #1f2937 100%)`
- İkon Kapsülleri: 90x90px, köşeleri 34px, markaya özel gradient
- Elips Alanı: 270x300px (dikeyde daha uzun, siyah arka plan kaldırıldı)
- Seçili İkon Gölgesi: `0 20px 35px rgba(color, 0.35)`
- Yazı Renkleri: `rgba(255,255,255,0.85)` ve `rgba(255,255,255,0.6)`

## İpuçları
- Sürükleme sırasında animasyonlar devre dışı bırakılır, bırakınca yumuşak geçiş uygulanır.
- Derinlik `0.15` üzerinde olan ikonlar etkileşime açıktır, diğerleri arka planda kalarak sahneye derinlik katar.
