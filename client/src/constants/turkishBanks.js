// Türkiye'deki başlıca bankalar listesi
export const TURKISH_BANKS = [
    'Türkiye İş Bankası',
    'Garanti BBVA',
    'Akbank',
    'Yapı Kredi Bankası',
    'Ziraat Bankası',
    'Halkbank',
    'VakıfBank',
    'Denizbank',
    'QNB Finansbank',
    'ING Bank',
    'HSBC Bank',
    'TEB (Türk Ekonomi Bankası)',
    'Şekerbank',
    'İş Yatırım',
    'Fibabanka',
    'Odeabank',
    'Burgan Bank',
    'ICBC Turkey Bank',
    'Anadolubank',
    'Turkish Bank',
    'Alternatifbank',
    'Arap Türk Bankası',
    'Bank Mellat',
    'Citibank',
    'Deutsche Bank',
    'JPMorgan Chase Bank',
    'MUFG Bank Turkey',
    'Rabobank',
    'Societe Generale',
    'Standard Chartered Bank',
    'Diğer'
];

// IBAN formatlama fonksiyonu
export const formatIban = (iban) => {
    // Sadece alfanumerik karakterleri al ve büyük harfe çevir
    const cleaned = iban.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // 4'lü gruplara böl
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    
    return formatted;
};

// IBAN doğrulama fonksiyonu
export const validateTurkishIban = (iban) => {
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    
    // TR ile başlamalı ve 26 karakter olmalı
    if (!cleaned.match(/^TR\d{24}$/)) {
        return {
            isValid: false,
            message: 'IBAN TR ile başlamalı ve 26 karakter olmalıdır.'
        };
    }
    
    return {
        isValid: true,
        message: 'Geçerli IBAN formatı.'
    };
}; 