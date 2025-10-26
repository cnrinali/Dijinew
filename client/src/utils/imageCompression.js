/**
 * Resim sıkıştırma utility fonksiyonları
 */

/**
 * Resmi sıkıştırır ve yeni bir File objesi döndürür
 * @param {File} file - Sıkıştırılacak resim dosyası
 * @param {number} maxWidth - Maksimum genişlik (varsayılan: 800)
 * @param {number} maxHeight - Maksimum yükseklik (varsayılan: 600)
 * @param {number} quality - Kalite (0.1 - 1.0, varsayılan: 0.8)
 * @returns {Promise<File>} Sıkıştırılmış resim dosyası
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        // Sadece resim dosyalarını işle
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Orijinal boyutları al
            let { width, height } = img;

            // Boyutları hesapla (aspect ratio'yu koru)
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            // Canvas boyutlarını ayarla
            canvas.width = width;
            canvas.height = height;

            // Resmi canvas'a çiz
            ctx.drawImage(img, 0, 0, width, height);

            // Canvas'ı blob'a çevir
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Yeni File objesi oluştur
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        
                        console.log(`Resim sıkıştırıldı: ${file.size} bytes -> ${compressedFile.size} bytes`);
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Resim sıkıştırılamadı'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => {
            reject(new Error('Resim yüklenemedi'));
        };

        // Resmi yükle
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Profil resmi için optimize edilmiş sıkıştırma
 * @param {File} file - Profil resmi dosyası
 * @returns {Promise<File>} Sıkıştırılmış profil resmi
 */
export const compressProfileImage = (file) => {
    return compressImage(file, 400, 400, 0.9); // Profil resmi için daha yüksek kalite
};

/**
 * Kapak resmi için optimize edilmiş sıkıştırma
 * @param {File} file - Kapak resmi dosyası
 * @returns {Promise<File>} Sıkıştırılmış kapak resmi
 */
export const compressCoverImage = (file) => {
    return compressImage(file, 1200, 800, 0.8); // Kapak resmi için daha büyük boyut
};
