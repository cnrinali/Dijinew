/**
 * Resim sıkıştırma utility fonksiyonları
 * Kaliteyi koruyarak dosya boyutunu optimize eder
 */

/**
 * Resmi belirtilen maksimum boyuta kadar sıkıştırır
 * @param {File} file - Sıkıştırılacak dosya
 * @param {number} maxSizeInMB - Maksimum dosya boyutu (MB)
 * @param {number} maxWidth - Maksimum genişlik (piksel)
 * @param {number} maxHeight - Maksimum yükseklik (piksel)
 * @param {number} quality - Başlangıç kalite (0.1 - 1.0)
 * @returns {Promise<File>} - Sıkıştırılmış dosya
 */
export const compressImage = async (file, maxSizeInMB = 10, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Orijinal boyutları al
            let { width, height } = img;
            
            // Boyutları maksimum değerlere göre ayarla (aspect ratio korunarak)
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }
            
            // Canvas boyutlarını ayarla
            canvas.width = width;
            canvas.height = height;
            
            // Resmi canvas'a çiz
            ctx.drawImage(img, 0, 0, width, height);
            
            // Kaliteyi ayarlayarak sıkıştır
            const compressWithQuality = (currentQuality) => {
                return new Promise((resolveQuality, rejectQuality) => {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const sizeInMB = blob.size / (1024 * 1024);
                                
                                // Eğer boyut uygunsa veya kalite çok düşükse kabul et
                                if (sizeInMB <= maxSizeInMB || currentQuality <= 0.1) {
                                    const compressedFile = new File([blob], file.name, {
                                        type: file.type,
                                        lastModified: Date.now()
                                    });
                                    resolveQuality(compressedFile);
                                } else {
                                    // Kaliteyi düşür ve tekrar dene
                                    const newQuality = Math.max(0.1, currentQuality - 0.1);
                                    compressWithQuality(newQuality).then(resolveQuality).catch(rejectQuality);
                                }
                            } else {
                                rejectQuality(new Error('Resim sıkıştırılamadı'));
                            }
                        },
                        file.type,
                        currentQuality
                    );
                });
            };
            
            compressWithQuality(quality)
                .then(resolve)
                .catch(reject);
        };
        
        img.onerror = () => reject(new Error('Resim yüklenemedi'));
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Resim dosyasının boyutunu kontrol eder ve gerekirse sıkıştırır
 * @param {File} file - Kontrol edilecek dosya
 * @param {number} maxSizeInMB - Maksimum boyut (MB)
 * @returns {Promise<File>} - Sıkıştırılmış veya orijinal dosya
 */
export const optimizeImageForUpload = async (file, maxSizeInMB = 10) => {
    const fileSizeInMB = file.size / (1024 * 1024);
    
    // Eğer dosya zaten uygunsa, orijinalini döndür
    if (fileSizeInMB <= maxSizeInMB) {
        return file;
    }
    
    // Dosya çok büyükse sıkıştır
    console.log(`Dosya boyutu ${fileSizeInMB.toFixed(2)}MB, sıkıştırılıyor...`);
    
    try {
        const compressedFile = await compressImage(file, maxSizeInMB);
        const compressedSizeInMB = compressedFile.size / (1024 * 1024);
        console.log(`Sıkıştırma tamamlandı: ${fileSizeInMB.toFixed(2)}MB → ${compressedSizeInMB.toFixed(2)}MB`);
        return compressedFile;
    } catch (error) {
        console.error('Resim sıkıştırma hatası:', error);
        throw new Error('Resim sıkıştırılamadı');
    }
};

/**
 * Resim boyutlarını alır
 * @param {File} file - Resim dosyası
 * @returns {Promise<{width: number, height: number}>} - Resim boyutları
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => reject(new Error('Resim boyutları alınamadı'));
        img.src = URL.createObjectURL(file);
    });
};

