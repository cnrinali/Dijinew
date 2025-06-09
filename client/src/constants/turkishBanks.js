// Türkiye'deki başlıca bankalar listesi (logo bilgileri ile)
export const TURKISH_BANKS = [
    { name: 'Türkiye İş Bankası', logo: '/img/banka/is.png' },
    { name: 'Garanti BBVA', logo: '/img/banka/garanti.png' },
    { name: 'Akbank', logo: '/img/banka/akbank.png' },
    { name: 'Yapı Kredi Bankası', logo: '/img/banka/ykredi.png' },
    { name: 'Ziraat Bankası', logo: '/img/banka/ziraat.png' },
    { name: 'Halkbank', logo: '/img/banka/halkbank.png' },
    { name: 'VakıfBank', logo: '/img/banka/vakif.png' },
    { name: 'Denizbank', logo: '/img/banka/deniz.png' },
    { name: 'QNB Finansbank', logo: '/img/banka/qnb.png' },
    { name: 'ING Bank', logo: '/img/banka/ing.png' },
    { name: 'HSBC Bank', logo: '/img/banka/hsbc.png' },
    { name: 'TEB (Türk Ekonomi Bankası)', logo: '/img/banka/teb.png' },
    { name: 'Şekerbank', logo: '/img/banka/seker.png' },
    { name: 'PTT Bank', logo: '/img/banka/ptt.png' },
    { name: 'OYAK Bank', logo: '/img/banka/oyak.png' },
    { name: 'Kuveyt Türk', logo: '/img/banka/kuveyt.png' },
    { name: 'Türkiye Finans', logo: '/img/banka/turkiyefinans.png' },
    { name: 'İş Yatırım', logo: null },
    { name: 'Fibabanka', logo: null },
    { name: 'Odeabank', logo: null },
    { name: 'Burgan Bank', logo: null },
    { name: 'ICBC Turkey Bank', logo: null },
    { name: 'Anadolubank', logo: null },
    { name: 'Turkish Bank', logo: null },
    { name: 'Alternatifbank', logo: null },
    { name: 'Arap Türk Bankası', logo: null },
    { name: 'Bank Mellat', logo: null },
    { name: 'Citibank', logo: null },
    { name: 'Deutsche Bank', logo: null },
    { name: 'JPMorgan Chase Bank', logo: null },
    { name: 'MUFG Bank Turkey', logo: null },
    { name: 'Rabobank', logo: null },
    { name: 'Societe Generale', logo: null },
    { name: 'Standard Chartered Bank', logo: null },
    { name: 'Diğer', logo: null }
];

// Sadece banka isimlerini döndüren yardımcı fonksiyon (geriye uyumluluk için)
export const getBankNames = () => TURKISH_BANKS.map(bank => bank.name);

// Banka logosu alma fonksiyonu
export const getBankLogo = (bankName) => {
    const bank = TURKISH_BANKS.find(b => b.name === bankName);
    return bank ? bank.logo : null;
};

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