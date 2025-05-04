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

### 1. 🔐 Kimlik Doğrulama (Auth)
- Giriş / Çıkış → `POST /api/auth/login`, `POST /api/auth/logout`
- Şifre Sıfırlama → `POST /api/auth/forgot`, `PUT /api/auth/reset`
- Aktivasyon → JWT veya e-posta onayı
- Frontend bileşenleri: `LoginPage.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`

### 2. 👤 Kullanıcı & Admin Yönetimi
- Kullanıcı ekle/sil → `GET/POST/DELETE /api/admin/users`
- Roller ve yetkiler → `PUT /api/admin/users/:id/role`
- React sayfaları: `UserManagement.jsx`, `AdminDashboard.jsx`

### 3. 🗂 Kartvizit Yönetimi
- Kart oluştur/güncelle → `POST /api/cards`, `PUT /api/cards/:id`
- Kart listeleme → `GET /api/cards`, `GET /api/cards/:id`
- Kart durumu yönetimi (aktif/pasif)
- React bileşeni: `CardEditor.jsx`, `CardList.jsx`

### 4. 🏢 Kurumsal Yapı & Bayiler
- Bayi işlemleri → `GET/POST/DELETE /api/branches`
- Kurumsal kartlar → `GET /api/cards?type=corporate`
- React bileşenleri: `BranchList.jsx`, `CorporateCard.jsx`

### 5. 🌐 Sosyal Medya & Banka Bilgileri
- Sosyal Medya CRUD → `POST /api/cards/:id/socials`
- Banka Bilgisi CRUD → `POST /api/cards/:id/banks`
- React bileşeni: `SocialBankForm.jsx`

### 6. 📊 Raporlama & İstatistik
- Genel istatistikler → `GET /api/analytics`
- Rapor sayfaları: `Reports.jsx`, `StatsDashboard.jsx`

### 7. 🖼 Medya Yönetimi
- Dosya yükleme → `POST /api/upload`, `PUT /api/upload/:id`
- Slider, katalog, video yönetimi
- React bileşenleri: `MediaManager.jsx`

### 8. 🛠 Yapılandırmalar & Bağlantılar
- `config.js` → environment değişkenleri
- `db.js` → mssql bağlantısı

### 9. 📞 Destek ve Talep Sistemi
- Destek kayıtları → `POST /api/support`
- Destek yönetimi → `GET /api/admin/support`
- React bileşeni: `SupportForm.jsx`

### 10. 📶 NFC Sihirbazı
- Kart adım adım oluşturma → çok sayfalı form (wizard)
- React: `WizardStep1.jsx` ... `WizardStep6.jsx`

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

### 4. Veri Tabanı Tasarımı (MSSQL Tablolar)
- Users (id, name, email, password, role)
- Cards (id, user_id, phone, title, company)
- Socials (id, card_id, type, link)
- Banks (id, card_id, bank_name, iban)
- Logs (id, card_id, viewer_ip, viewed_at)

### 5. Avantajlar
- Kurumsal ortamlarda uyumluluk
- Mevcut MSSQL altyapıları ile kolay entegrasyon
- Güçlü veri analitiği ve prosedür desteği

---

Bu yapılandırma sayesinde React + Node.js ile geliştirilen modern dijital kartvizit sistemi, Microsoft SQL Server ile sorunsuz şekilde çalışabilir hale gelir.