# Eski PHP Projesinden Modern Sisteme Dönüşüm Raporu

Bu belge, yüklenen eski dijital kartvizit uygulamasının tüm PHP dosyalarını analiz ederek modern bir mimariye nasıl dönüştürülebileceğini kapsamlı şekilde tanımlar.

---

## 📁 Dosya Analizi ve Modül Atamaları

Aşağıda her PHP dosyasının hangi modüle ait olduğu özetlenmiştir:

- `aktivasyon.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `ayarlar.php` → **Yapılandırma / Veritabanı Bağlantısı**
- `baglan.php` → **Yapılandırma / Veritabanı Bağlantısı**
- `banka.php` → **Sosyal Medya / Banka Bilgileri**
- `bankasil.php` → **Sosyal Medya / Banka Bilgileri**
- `bayi_kart.php` → **Bayi Yönetimi**
- `bayi-duzenle.php` → **Bayi Yönetimi**
- `bayi-kartlistesi.php` → **Bayi Yönetimi**
- `bayi-sil.php` → **Bayi Yönetimi**
- `bayi.php` → **Bayi Yönetimi**
- `bayiler.php` → **Bayi Yönetimi**
- `bguncelle.php` → **Diğer / Belirsiz**
- `business.php` → **Kurumsal Kartvizitler**
- `businessheader.php` → **Kurumsal Kartvizitler**
- `cikis.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `class.upload.php` → **Medya Yönetimi / Dosya Yükleme**
- `config.php` → **Yapılandırma / Veritabanı Bağlantısı**
- `destek.php` → **Destek Modülü**
- `diger_rapor.php` → **Raporlama & İstatistik**
- `durumdegistir.php` → **Diğer / Belirsiz**
- `duzenle.php` → **Diğer / Belirsiz**
- `eski-index.php` → **Diğer / Belirsiz**
- `excel.php` → **Diğer / Belirsiz**
- `footer.php` → **Diğer / Belirsiz**
- `giris.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `hata.php` → **Diğer / Belirsiz**
- `header.php` → **Diğer / Belirsiz**
- `index.php` → **Diğer / Belirsiz**
- `istatistik.php` → **Raporlama & İstatistik**
- `kacgun.php` → **Diğer / Belirsiz**
- `kart.php` → **Kartvizit Yönetimi**
- `kartvizit.php` → **Kartvizit Yönetimi**
- `katalog.php` → **Diğer / Belirsiz**
- `katalogsil.php` → **Diğer / Belirsiz**
- `kguncelle.php` → **Diğer / Belirsiz**
- `kullanici-duzenle.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `kullanici-sil.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `kullanici.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `kullanicilar.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `kurumsal_kartvizit.php` → **Kurumsal Kartvizitler**
- `kurumsal_pasif_kart.php` → **Kurumsal Kartvizitler**
- `kurumsal.php` → **Kurumsal Kartvizitler**
- `kurumsalsil.php` → **Kurumsal Kartvizitler**
- `kurumsaluye-duzenle.php` → **Kurumsal Kartvizitler**
- `kurumsaluye-sil.php` → **Kurumsal Kartvizitler**
- `kurumsaluye.php` → **Kurumsal Kartvizitler**
- `kurumsaluyeler.php` → **Kurumsal Kartvizitler**
- `link.php` → **Diğer / Belirsiz**
- `netgsm.php` → **Diğer / Belirsiz**
- `ozel_rapor.php` → **Raporlama & İstatistik**
- `ozet_rapor.php` → **Raporlama & İstatistik**
- `pasif-kart.php` → **Kartvizit Yönetimi**
- `pasif.php` → **Diğer / Belirsiz**
- `pazaryeri_rapor.php` → **Raporlama & İstatistik**
- `profil-guncelle.php` → **Diğer / Belirsiz**
- `profil.php` → **Diğer / Belirsiz**
- `rapor-veri.php` → **Raporlama & İstatistik**
- `rapor.php` → **Raporlama & İstatistik**
- `rehber.php` → **Diğer / Belirsiz**
- `resim-guncelle.php` → **Medya Yönetimi / Dosya Yükleme**
- `resim.php` → **Medya Yönetimi / Dosya Yükleme**
- `resimsil.php` → **Medya Yönetimi / Dosya Yükleme**
- `sguncelle.php` → **Diğer / Belirsiz**
- `sifirla.php` → **Diğer / Belirsiz**
- `sifre-guncelle.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `sifre.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `sihirbaz-1.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sihirbaz-2.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sihirbaz-3.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sihirbaz-4.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sihirbaz-5.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sihirbaz-6.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sihirbaz.php` → **NFC / Kartvizit Oluşturma Adımları**
- `sil.php` → **Diğer / Belirsiz**
- `slider.php` → **Medya Yönetimi / Dosya Yükleme**
- `slidersil.php` → **Medya Yönetimi / Dosya Yükleme**
- `sms.php` → **Diğer / Belirsiz**
- `sosyal_rapor.php` → **Sosyal Medya / Banka Bilgileri**
- `sosyal.php` → **Sosyal Medya / Banka Bilgileri**
- `sosyalsil.php` → **Sosyal Medya / Banka Bilgileri**
- `talep-detay.php` → **Destek Modülü**
- `upload.php` → **Medya Yönetimi / Dosya Yükleme**
- `ust.php` → **Diğer / Belirsiz**
- `uye_kayit.php` → **Diğer / Belirsiz**
- `uye-kayit.php` → **Diğer / Belirsiz**
- `video.php` → **Medya Yönetimi / Dosya Yükleme**
- `videosil.php` → **Medya Yönetimi / Dosya Yükleme**
- `wizard-1.php` → **NFC / Kartvizit Oluşturma Adımları**
- `wizard-2.php` → **NFC / Kartvizit Oluşturma Adımları**
- `wizard-3.php` → **NFC / Kartvizit Oluşturma Adımları**
- `wizard-4.php` → **NFC / Kartvizit Oluşturma Adımları**
- `wizard-5.php` → **NFC / Kartvizit Oluşturma Adımları**
- `wizard-6.php` → **NFC / Kartvizit Oluşturma Adımları**
- `wizard.php` → **NFC / Kartvizit Oluşturma Adımları**
- `yeni-kartvizit.php` → **Kartvizit Yönetimi**
- `yeni-soru.php` → **Diğer / Belirsiz**
- `yeni-tema.php` → **Diğer / Belirsiz**
- `yenile.php` → **Diğer / Belirsiz**
- `yonetim.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `yukle.php` → **Diğer / Belirsiz**
- `ziyaretci_rapor.php` → **Raporlama & İstatistik**
- `._aktivasyon.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `._ayarlar.php` → **Yapılandırma / Veritabanı Bağlantısı**
- `._baglan.php` → **Yapılandırma / Veritabanı Bağlantısı**
- `._banka.php` → **Sosyal Medya / Banka Bilgileri**
- `._bankasil.php` → **Sosyal Medya / Banka Bilgileri**
- `._bayi_kart.php` → **Bayi Yönetimi**
- `._bayi-duzenle.php` → **Bayi Yönetimi**
- `._bayi-kartlistesi.php` → **Bayi Yönetimi**
- `._bayi-sil.php` → **Bayi Yönetimi**
- `._bayi.php` → **Bayi Yönetimi**
- `._bayiler.php` → **Bayi Yönetimi**
- `._bguncelle.php` → **Diğer / Belirsiz**
- `._business.php` → **Kurumsal Kartvizitler**
- `._businessheader.php` → **Kurumsal Kartvizitler**
- `._cikis.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `._class.upload.php` → **Medya Yönetimi / Dosya Yükleme**
- `._config.php` → **Yapılandırma / Veritabanı Bağlantısı**
- `._destek.php` → **Destek Modülü**
- `._diger_rapor.php` → **Raporlama & İstatistik**
- `._durumdegistir.php` → **Diğer / Belirsiz**
- `._duzenle.php` → **Diğer / Belirsiz**
- `._eski-index.php` → **Diğer / Belirsiz**
- `._excel.php` → **Diğer / Belirsiz**
- `._footer.php` → **Diğer / Belirsiz**
- `._giris.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `._hata.php` → **Diğer / Belirsiz**
- `._header.php` → **Diğer / Belirsiz**
- `._index.php` → **Diğer / Belirsiz**
- `._istatistik.php` → **Raporlama & İstatistik**
- `._kacgun.php` → **Diğer / Belirsiz**
- `._kart.php` → **Kartvizit Yönetimi**
- `._kartvizit.php` → **Kartvizit Yönetimi**
- `._katalog.php` → **Diğer / Belirsiz**
- `._katalogsil.php` → **Diğer / Belirsiz**
- `._kguncelle.php` → **Diğer / Belirsiz**
- `._kullanici-duzenle.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `._kullanici-sil.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `._kullanici.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `._kullanicilar.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `._kurumsal_kartvizit.php` → **Kurumsal Kartvizitler**
- `._kurumsal_pasif_kart.php` → **Kurumsal Kartvizitler**
- `._kurumsal.php` → **Kurumsal Kartvizitler**
- `._kurumsalsil.php` → **Kurumsal Kartvizitler**
- `._kurumsaluye-duzenle.php` → **Kurumsal Kartvizitler**
- `._kurumsaluye-sil.php` → **Kurumsal Kartvizitler**
- `._kurumsaluye.php` → **Kurumsal Kartvizitler**
- `._kurumsaluyeler.php` → **Kurumsal Kartvizitler**
- `._link.php` → **Diğer / Belirsiz**
- `._netgsm.php` → **Diğer / Belirsiz**
- `._ozel_rapor.php` → **Raporlama & İstatistik**
- `._ozet_rapor.php` → **Raporlama & İstatistik**
- `._pasif-kart.php` → **Kartvizit Yönetimi**
- `._pasif.php` → **Diğer / Belirsiz**
- `._pazaryeri_rapor.php` → **Raporlama & İstatistik**
- `._profil-guncelle.php` → **Diğer / Belirsiz**
- `._profil.php` → **Diğer / Belirsiz**
- `._rapor-veri.php` → **Raporlama & İstatistik**
- `._rapor.php` → **Raporlama & İstatistik**
- `._rehber.php` → **Diğer / Belirsiz**
- `._resim-guncelle.php` → **Medya Yönetimi / Dosya Yükleme**
- `._resim.php` → **Medya Yönetimi / Dosya Yükleme**
- `._resimsil.php` → **Medya Yönetimi / Dosya Yükleme**
- `._sguncelle.php` → **Diğer / Belirsiz**
- `._sifirla.php` → **Diğer / Belirsiz**
- `._sifre-guncelle.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `._sifre.php` → **Kullanıcı Giriş / Şifre / Aktivasyon**
- `._sihirbaz-1.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sihirbaz-2.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sihirbaz-3.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sihirbaz-4.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sihirbaz-5.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sihirbaz-6.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sihirbaz.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._sil.php` → **Diğer / Belirsiz**
- `._slider.php` → **Medya Yönetimi / Dosya Yükleme**
- `._slidersil.php` → **Medya Yönetimi / Dosya Yükleme**
- `._sms.php` → **Diğer / Belirsiz**
- `._sosyal_rapor.php` → **Sosyal Medya / Banka Bilgileri**
- `._sosyal.php` → **Sosyal Medya / Banka Bilgileri**
- `._sosyalsil.php` → **Sosyal Medya / Banka Bilgileri**
- `._talep-detay.php` → **Destek Modülü**
- `._upload.php` → **Medya Yönetimi / Dosya Yükleme**
- `._ust.php` → **Diğer / Belirsiz**
- `._uye_kayit.php` → **Diğer / Belirsiz**
- `._uye-kayit.php` → **Diğer / Belirsiz**
- `._video.php` → **Medya Yönetimi / Dosya Yükleme**
- `._videosil.php` → **Medya Yönetimi / Dosya Yükleme**
- `._wizard-1.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._wizard-2.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._wizard-3.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._wizard-4.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._wizard-5.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._wizard-6.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._wizard.php` → **NFC / Kartvizit Oluşturma Adımları**
- `._yeni-kartvizit.php` → **Kartvizit Yönetimi**
- `._yeni-soru.php` → **Diğer / Belirsiz**
- `._yeni-tema.php` → **Diğer / Belirsiz**
- `._yenile.php` → **Diğer / Belirsiz**
- `._yonetim.php` → **Admin Paneli / Kullanıcı Yönetimi**
- `._yukle.php` → **Diğer / Belirsiz**
- `._ziyaretci_rapor.php` → **Raporlama & İstatistik**
- `._class.upload.hr_HR.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.zh_CN.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.fi_FI.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.uk_UA.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.zh_CN.gb-2312.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.sr_YU.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.sv_SE.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.id_ID.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.mk_MK.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ar_EG.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.sk_SK.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.zh_TW.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.lt_LT.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.fr_FR.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.he_IL.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ta_TA.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.de_DE.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.it_IT.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ro_RO.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.fa_IR.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ja_JP.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.es_ES.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.uk_UA.windows-1251.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.el_GR.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.nl_NL.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.pl_PL.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.cs_CS.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.vn_VN.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ru_RU.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.et_EE.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.tr_TR.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.no_NO.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.da_DK.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.xx_XX.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.pt_BR.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ca_CA.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.ru_RU.windows-1251.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.upload.hu_HU.php` → **Medya Yönetimi / Dosya Yükleme**
- `._class.smtp.php` → **Diğer / Belirsiz**
- `._ckmail.php` → **Diğer / Belirsiz**
- `._class.pop3.php` → **Diğer / Belirsiz**
- `._class.phpmailer.php` → **Diğer / Belirsiz**
- `class.upload.hr_HR.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.zh_CN.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.fi_FI.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.uk_UA.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.zh_CN.gb-2312.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.sr_YU.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.sv_SE.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.id_ID.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.mk_MK.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ar_EG.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.sk_SK.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.zh_TW.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.lt_LT.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.fr_FR.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.he_IL.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ta_TA.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.de_DE.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.it_IT.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ro_RO.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.fa_IR.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ja_JP.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.es_ES.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.uk_UA.windows-1251.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.el_GR.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.nl_NL.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.pl_PL.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.cs_CS.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.vn_VN.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ru_RU.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.et_EE.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.tr_TR.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.no_NO.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.da_DK.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.xx_XX.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.pt_BR.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ca_CA.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.ru_RU.windows-1251.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.upload.hu_HU.php` → **Medya Yönetimi / Dosya Yükleme**
- `class.smtp.php` → **Diğer / Belirsiz**
- `ckmail.php` → **Diğer / Belirsiz**
- `class.pop3.php` → **Diğer / Belirsiz**
- `class.phpmailer.php` → **Diğer / Belirsiz**

---

## 🔄 Modern Karşılıkları (React.js + Node.js API)

**Not:** Aşağıdaki endpoint'lerin çoğu `protect` middleware'i ile korunmalı ve rol bazlı erişim için `authorize` middleware'i kullanılmalıdır (bkz. Yetkilendirme bölümü).

### 1. 🔐 Kimlik Doğrulama & Yetkilendirme (Auth)
- Giriş / Çıkış → `POST /api/auth/login`, `POST /api/auth/logout`
    - Login yanıtı kullanıcı bilgilerine ek olarak `role` ve (varsa) `companyId` içermelidir.
- Kayıt Ol (Admin tarafından) → `POST /api/admin/users` (Rol ve şirket atanarak)
- Şifre Sıfırlama → `POST /api/auth/forgot`, `PUT /api/auth/reset`
- Şifre Değiştirme (Kullanıcı) → `PUT /api/users/change-password`
- Aktivasyon → JWT temelli
- Frontend bileşenleri: `LoginPage.jsx`, `RegisterPage.jsx` (Admin için), `ForgotPassword.jsx`, `ResetPassword.jsx`, `ProfilePage.jsx` (Şifre sekmesi)

### 2. 🏢 Şirket & Kullanıcı Yönetimi (Admin & Business Rolleri)
- **Admin Yetkileri:**
    - Şirket Oluştur/Listele/Güncelle/Sil → `POST/GET/PUT/DELETE /api/admin/companies` (Limitleri belirleyerek)
    - Tüm Kullanıcıları Listele/Detay → `GET /api/admin/users`, `GET /api/admin/users/:id`
    - Kullanıcı Oluştur (Rol ve Şirket atayarak) → `POST /api/admin/users`
    - Kullanıcı Güncelle/Sil/Rol Değiştir → `PUT/DELETE /api/admin/users/:id`, `PUT /api/admin/users/:id/role`
- **Business Yetkileri:**
    - Kendi Şirket Bilgisini Getir → `GET /api/business/company`
    - Kendi Şirket Kullanıcılarını Listele/Detay → `GET /api/business/users`, `GET /api/business/users/:id`
    - Şirkete Kullanıcı Ekle (Limit dahilinde) → `POST /api/business/users`
    - Şirket Kullanıcısını Güncelle/Sil → `PUT/DELETE /api/business/users/:id`
- React sayfaları: `CompanyManagement.jsx` (Admin), `UserManagement.jsx` (Admin), `BusinessUserManagement.jsx` (Business), `AdminDashboard.jsx`

### 3. 🗂 Kartvizit Yönetimi (Rol Bazlı)
- **Admin Yetkileri:**
    - Tüm Kartları Listele → `GET /api/admin/cards`
    - Kart Detayı Görüntüle → `GET /api/cards/:id` (Tüm kartlar için)
    - Kart Durumu Değiştir (Aktif/Pasif) → `PUT /api/admin/cards/:id/status`
- **Business Yetkileri:**
    - Kendi Şirketinin Kartlarını Listele → `GET /api/business/cards`
    - Kendi Şirketine Kart Oluştur (Limit dahilinde) → `POST /api/business/cards`
    - Kendi Şirket Kartını Güncelle/Sil → `PUT/DELETE /api/business/cards/:id`
    - Excel ile Toplu Kartvizit Yükle → `POST /api/business/cards/import`
- **User Yetkileri:**
    - Kendi Kartlarını Listele → `GET /api/cards`
    - Kendi Kartını Oluştur (Limit dahilinde, genellikle 1) → `POST /api/cards`
    - Kendi Kartını Güncelle/Sil → `PUT/DELETE /api/cards/:id`
- **Genel:**
    - Public Kartvizit Görünümü → `GET /api/public/cards/:slugOrId` (Token gerektirmez)
- React bileşenleri: `CardList.jsx` (Rol'e göre farklı veri), `CardEditor.jsx`, `CardImport.jsx` (Business), `PublicCardView.jsx`

### 4. 👤 Kullanıcı Profili (Tüm Roller)
- Profil Bilgilerini Getir → `GET /api/users/profile`
- Profil Bilgilerini Güncelle (isim, email vb.) → `PUT /api/users/profile`
- React sayfası: `ProfilePage.jsx` (Bilgilerim sekmesi)

### 5. 🌐 İçerik Yönetimi (Sosyal Medya, Banka, Ürünler, Dökümanlar vb.)
- **Genel Yaklaşım:** Bu bilgiler genellikle bir kartvizite bağlıdır. İlgili kartvizitin sahibi (veya admin/ilgili business) tarafından yönetilir.
- Sosyal Medya CRUD → `GET/POST/PUT/DELETE /api/cards/:cardId/socials`
- Banka Bilgisi CRUD → `GET/POST/PUT/DELETE /api/cards/:cardId/banks`
- Ürün Bilgisi CRUD → `GET/POST/PUT/DELETE /api/cards/:cardId/products`
- Döküman Bilgisi CRUD → `GET/POST/PUT/DELETE /api/cards/:cardId/documents`
- Tanıtım Videosu → `PUT /api/cards/:cardId/video` (URL veya dosya yükleme)
- Slider Yönetimi (Şirket veya Kart bazlı?) → `GET/POST/DELETE /api/cards/:cardId/sliders` veya `/api/business/sliders`
- React bileşenleri: `SocialBankForm.jsx`, `ProductManager.jsx`, `DocumentManager.jsx`, `VideoUpload.jsx`, `SliderManager.jsx` (Kart düzenleme sayfasının parçaları olabilir)

### 6. 📊 Raporlama & İstatistik (Rol Bazlı)
- **Admin Yetkileri:**
    - Genel Sistem Raporları → `GET /api/admin/reports/summary`
    - Kullanıcı/Şirket Bazlı Raporlar → `GET /api/admin/reports/users`, `/api/admin/reports/companies`
- **Business Yetkileri:**
    - Kendi Şirketinin Raporları → `GET /api/business/reports/summary`
    - Şirket Etkileşim Raporları → `GET /api/business/reports/interactions`
- **User Yetkileri:**
    - Kendi Kartvizit Raporları (Özet, Etkileşim vb.) → `GET /api/users/reports/summary`, `/api/users/reports/interactions`
    - Pazaryeri Raporları (Varsa) → `GET /api/users/reports/marketplace`
    - Sosyal Ağ Raporları (Varsa) → `GET /api/users/reports/social`
- Rapor sayfaları: `AdminReports.jsx`, `BusinessReports.jsx`, `UserReports.jsx`, `StatsDashboard.jsx` (Genel)

### 7. 🖼 Medya Yönetimi
- Dosya yükleme (Profil, Kart, Slider, Döküman vb.) → `POST /api/upload` (Yetkilendirme ve dosya tipi kontrolü ile)
- React bileşenleri: `ImageUpload.jsx`, `FileUpload.jsx` (Genel amaçlı)

### 8. 🛠 Yapılandırmalar & Bağlantılar
- `config.js` veya `.env` → environment değişkenleri (DB, JWT Secret vb.)
- `db.js` → mssql bağlantısı (Mevcut haliyle iyi görünüyor)

### 9. 📞 Destek ve Talep Sistemi
- Destek Talebi Oluştur (User/Business) → `POST /api/support/tickets`
- Destek Taleplerini Listele (Kullanıcı kendi, Business kendi şirketi, Admin hepsi) → `GET /api/support/tickets` (Rol'e göre filtreli)
- Talep Detayı/Yanıtla (Admin/İlgili Kullanıcı) → `GET /api/support/tickets/:id`, `POST /api/support/tickets/:id/reply`
- React bileşeni: `SupportTicketList.jsx`, `SupportTicketDetail.jsx`, `NewSupportTicket.jsx`

### 10. 📶 NFC Sihirbazı (Kart Oluşturma/Düzenleme Adımları)
- Mevcut `CardEditor.jsx` bileşeni içinde çok adımlı bir yapı (Stepper) kullanılabilir veya ayrı `WizardStepX.jsx` bileşenleri ile yönetilebilir. Backend tarafında `POST /api/cards` ve `PUT /api/cards/:id` endpoint'leri kullanılır.

---

## 🔐 Yetkilendirme (Authorization) Middleware

API endpoint'lerinin güvenliğini sağlamak ve rol bazlı erişimi kontrol etmek için iki temel middleware kullanılacaktır:

1.  **`protect` (Kimlik Doğrulama):**
    - Gelen istekteki JWT'yi (Authorization header) doğrular.
    - Geçerli ise, token içerisindeki kullanıcı bilgisini (id, rol vb.) veritabanından çekerek `req.user` nesnesine ekler.
    - Geçersiz veya eksik token durumunda 401 Unauthorized hatası döner.
    - Hemen hemen tüm özel API endpoint'lerinde ilk olarak bu middleware kullanılır.

2.  **`authorize(...roles)` (Yetkilendirme):**
    - `protect` middleware'inden sonra çalışır ve `req.user` nesnesinin var olduğunu varsayar.
    - Parametre olarak izin verilen rolleri (`['admin']`, `['admin', 'business']` vb.) alır.
    - `req.user.role` bilgisini kontrol eder. Eğer kullanıcının rolü izin verilen rollerden biri değilse, 403 Forbidden hatası döner.
    - Sadece belirli rollerin erişebilmesi gereken endpoint'lerde kullanılır.

**Örnek Kullanım (`routes.js` içinde):**
```javascript
// Sadece admin erişebilir
router.get('/users', protect, authorize('admin'), userController.getAllUsers);

// Admin ve Business erişebilir
router.get('/cards', protect, authorize('admin', 'business'), cardController.getCards);

// Giriş yapmış tüm kullanıcılar erişebilir (authorize gerekmez, protect yeterli)
router.get('/profile', protect, userController.getUserProfile);
```

---

## 🎯 Hedeflenen Kazanımlar

- Modern SPA (Single Page App) kullanıcı deneyimi
- Mobil uyumlu ve responsive tasarım
- API-first mimari ile kolay entegrasyon
- Gelişmiş güvenlik ve kullanıcı yönetimi
- Kolay sürdürülebilir, modüler kod yapısı

---

Bu analiz, projeni baştan sona modern bir dijital kartvizit platformuna dönüştürmek için yol haritası sağlar.

---

## 🗃️ VERİTABANI SEÇİMİ: MSSQL ADAPTASYONU

### 🔧 MSSQL Kullanımı için Gerekli Yapılandırmalar

Proje Node.js ile geliştirileceği için MSSQL bağlantısı şu adımlarla sağlanabilir:

### 1. MSSQL Bağlantısı için Kullanılacak Kütüphane
- `mssql` → Microsoft SQL Server için resmi Node.js istemcisi
- Yükleme:  
```bash
npm install mssql
```

### 2. MSSQL Bağlantı Dosyası (db.js)
```js
// /config/db.js
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true // Localhost için true olabilir
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("MSSQL bağlantısı başarılı.");
        return pool;
    })
    .catch(err => console.error("Bağlantı hatası:", err));

module.exports = { sql, poolPromise };
```

### 3. Örnek SQL Sorgusu Kullanımı
```js
const { sql, poolPromise } = require('../config/db');

const getUsers = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
};
```

### 4. Veri Tabanı Tasarımı (MSSQL Tablolar) - Güncellenmiş
- **Companies**
    - `id` (INT, Primary Key, Identity)
    - `name` (NVARCHAR(255), Not Null)
    - `userLimit` (INT, Not Null, Default 1)
    - `cardLimit` (INT, Not Null, Default 1)
    - `status` (BIT, Not Null, Default 1) -- 1: Aktif, 0: Pasif
    - `phone` (NVARCHAR(50), Null)
    - `website` (NVARCHAR(255), Null)
    - `address` (NVARCHAR(500), Null)
    - `createdAt` (DATETIME2, Default GETDATE())
    - `updatedAt` (DATETIME2, Default GETDATE()) -- Güncelleme tarihi eklendi
- **Users**
    - `id` (INT, Primary Key, Identity)
    - `name` (NVARCHAR(100), Not Null)
    - `email` (NVARCHAR(100), Not Null, Unique)
    - `password` (NVARCHAR(255), Not Null) - Hashlenmiş
    - `role` (NVARCHAR(20), Not Null, CHECK (role IN ('admin', 'business', 'user')))
    - `companyId` (INT, Null, Foreign Key References Companies(id)) - Business rolü için zorunlu olabilir
    - `createdAt` (DATETIME2, Default GETDATE())
    - `isActive` (BIT, Default 1) - Kullanıcıyı dondurmak için
- **Cards**
    - `id` (INT, Primary Key, Identity)
    - `userId` (INT, Not Null, Foreign Key References Users(id)) - Kartın sahibi olan kullanıcı
    - `companyId` (INT, Null, Foreign Key References Companies(id)) - Kartın ait olduğu şirket (business kartları için)
    - `title` (NVARCHAR(100), Null)
    - `name` (NVARCHAR(100), Null) - Kart üzerindeki isim
    - `companyName` (NVARCHAR(100), Null) - Kart üzerindeki şirket adı
    - `phone` (NVARCHAR(20), Null)
    - `email` (NVARCHAR(100), Null) - Kart üzerindeki e-posta
    - `address` (NVARCHAR(255), Null)
    - `website` (NVARCHAR(255), Null)
    - `profileImageUrl` (NVARCHAR(512), Null)
    - `logoImageUrl` (NVARCHAR(512), Null)
    - `slug` (NVARCHAR(100), Null, Unique) - Public erişim için benzersiz kısa isim
    - `theme` (NVARCHAR(50), Null) - Kart tema bilgisi
    - `isActive` (BIT, Default 1) - Kartı dondurmak için
    - `createdAt` (DATETIME2, Default GETDATE())
    - `updatedAt` (DATETIME2, Default GETDATE())
    - *(Diğer kart detayları eklenebilir: bio, jobTitle vb.)*
- **Socials** (id, card_id FK, type, link) - Mevcut haliyle iyi
- **Banks** (id, card_id FK, bank_name, iban) - Mevcut haliyle iyi
- **Products** (id, card_id FK, name, description, price, imageUrl) - Eklenebilir
- **Documents** (id, card_id FK, name, fileUrl, description) - Eklenebilir
- **Sliders** (id, card_id FK?, companyId FK?, imageUrl, link, order) - Eklenebilir (Kart veya Şirket bazlı olabilir)
- **Videos** (id, card_id FK, videoUrl, description) - Eklenebilir (veya Cards tablosuna bir alan olarak)
- **Logs** (id, card_id FK, viewer_ip, viewed_at, user_agent) - Mevcut haliyle iyi, user_agent eklenebilir
- **SupportTickets** (id, userId FK, subject, message, status, createdAt)
- **SupportReplies** (id, ticketId FK, userId FK, message, createdAt)

### 5. Avantajlar
- Kurumsal ortamlarda uyumluluk
- Mevcut MSSQL altyapıları ile kolay entegrasyon
- Güçlü veri analitiği ve prosedür desteği

---

Bu yapılandırma sayesinde React + Node.js ile geliştirilen modern dijital kartvizit sistemi, Microsoft SQL Server ile sorunsuz şekilde çalışabilir hale gelir.