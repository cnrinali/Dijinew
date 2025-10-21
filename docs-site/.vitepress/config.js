import { defineConfig } from 'vitepress';

const trNav = [
  { text: 'Genel Bakış', link: '/' },
  {
    text: 'API',
    items: [
      { text: 'Kimlik Doğrulama', link: '/api/authentication' },
      { text: 'Kullanıcılar', link: '/api/users' },
      { text: 'Kartlar', link: '/api/cards' },
      { text: 'Yönetici', link: '/api/admin' },
      { text: 'Kurumsal', link: '/api/corporate' },
      { text: 'Analitik', link: '/api/analytics' },
      { text: 'Aktivite', link: '/api/activities' },
      { text: 'Wizard', link: '/api/wizard' },
      { text: 'Basit Wizard', link: '/api/simple-wizard' },
      { text: 'Yüklemeler', link: '/api/upload' },
      { text: 'Sistem', link: '/api/system' }
    ]
  }
];

const trSidebar = {
  '/': [
    {
      text: 'Başlarken',
      items: [
        { text: 'Giriş', link: '/' }
      ]
    },
    {
      text: 'API Referansı',
      items: [
        { text: 'Kimlik Doğrulama', link: '/api/authentication' },
        { text: 'Kullanıcı Profili & Banka Hesapları', link: '/api/users' },
        { text: 'Kartlar', link: '/api/cards' },
        { text: 'Yönetici', link: '/api/admin' },
        { text: 'Kurumsal', link: '/api/corporate' },
        { text: 'Analitik', link: '/api/analytics' },
        { text: 'Aktivite', link: '/api/activities' },
        { text: 'Wizard Token', link: '/api/wizard' },
        { text: 'Basit Wizard', link: '/api/simple-wizard' },
        { text: 'Dosya Yükleme', link: '/api/upload' },
        { text: 'Sistem İzleme', link: '/api/system' }
      ]
    }
  ]
};

const enNav = [
  { text: 'Overview', link: '/en/' },
  {
    text: 'API',
    items: [
      { text: 'Authentication', link: '/en/api/authentication' },
      { text: 'Users', link: '/en/api/users' },
      { text: 'Cards', link: '/en/api/cards' },
      { text: 'Admin', link: '/en/api/admin' },
      { text: 'Corporate', link: '/en/api/corporate' },
      { text: 'Analytics', link: '/en/api/analytics' },
      { text: 'Activities', link: '/en/api/activities' },
      { text: 'Wizard', link: '/en/api/wizard' },
      { text: 'Simple Wizard', link: '/en/api/simple-wizard' },
      { text: 'Uploads', link: '/en/api/upload' },
      { text: 'System', link: '/en/api/system' }
    ]
  }
];

const enSidebar = {
  '/en/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/en/' }
      ]
    },
    {
      text: 'API Reference',
      items: [
        { text: 'Authentication', link: '/en/api/authentication' },
        { text: 'User Profile & Bank Accounts', link: '/en/api/users' },
        { text: 'Cards', link: '/en/api/cards' },
        { text: 'Admin', link: '/en/api/admin' },
        { text: 'Corporate', link: '/en/api/corporate' },
        { text: 'Analytics', link: '/en/api/analytics' },
        { text: 'Activity', link: '/en/api/activities' },
        { text: 'Wizard Tokens', link: '/en/api/wizard' },
        { text: 'Simple Wizard', link: '/en/api/simple-wizard' },
        { text: 'Uploads', link: '/en/api/upload' },
        { text: 'System Monitoring', link: '/en/api/system' }
      ]
    }
  ]
};

export default defineConfig({
  srcDir: '.',
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: 'Türkçe',
      lang: 'tr-TR',
      title: 'Dijinew API Dokümantasyonu',
      description: 'Dijinew REST servisleri için kapsamlı Türkçe dokümantasyon.',
      themeConfig: {
        nav: trNav,
        sidebar: trSidebar,
        outline: 'deep',
        socialLinks: [
          { icon: 'github', link: 'https://github.com/dijinew' }
        ]
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Dijinew API Docs',
      description: 'Comprehensive documentation for Dijinew REST APIs.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        outline: 'deep',
        socialLinks: [
          { icon: 'github', link: 'https://github.com/dijinew' }
        ]
      }
    }
  }
});
