<?php 
include 'header.php';
extract($_POST);
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				  <h5 class="card-title" Style="color:#000;">SOSYAL AĞ & PAZARYERİ BİLGİLERİNİZ</h5>
<?php 
extract($_POST);
if(empty($_POST)){
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul->execute(array($uye_id));
$listele	= $kullanicibul->FETCH(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
?>
<form name="form" action="" method="POST">
<input name="kart_id" type="hidden" value="<?php echo"$kart_id";?>">
<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Whatsapp</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Örnek : 05415319425">
<input name="sosyal[]" type="hidden" value="whatsapp">
</div>
</div>
					
<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Facebook</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://www.facebook.com/ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="facebook">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Twitter</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://twitter.com/ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="twitter">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>İnstagram</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://www.instagram.com/ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="instagram">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Telegram</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://web.telegram.org/k/#@ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="telegram">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Linkedin</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://www.linkedin.com/ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="linkedin">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Youtube</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://www.youtube.com/ kısmından sonra ki bölümü yazınız">
<input name="sosyal[]" type="hidden" value="youtube">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Skype</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="live: Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="skype">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Wechat</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Wechat Profil Linkinizi yazınız">
<input name="sosyal[]" type="hidden" value="wechat">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Snapchat</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Snapchat kullanıcı adını yazınız">
<input name="sosyal[]" type="hidden" value="snapchat">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Sahibinden</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Sahibinden Mağaza Sayfa Adresinizi Yazınız">
<input name="sosyal[]" type="hidden" value="sahibinden">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Hepsi Emlak</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Hepsi Emlak Mağaza Sayfa Adresinizi Yazınız">
<input name="sosyal[]" type="hidden" value="hepsiemlak">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Arabam.com</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Arabam.com Mağaza Sayfa Adresinizi Yazınız">
<input name="sosyal[]" type="hidden" value="arabam">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Letgo</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Letgo Mağaza Sayfa Adresinizi Yazınız">
<input name="sosyal[]" type="hidden" value="letgo">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>N11</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="N11 Mağaza Sayfa Adını Yazınız">
<input name="sosyal[]" type="hidden" value="n11">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Trendyol</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Trendyol Mağaza Sayfa Adını Yazınız">
<input name="sosyal[]" type="hidden" value="trendyol">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Hepsiburada</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="Hepsiburada Mağaza Sayfa Adını Yazınız">
<input name="sosyal[]" type="hidden" value="hepsiburada">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Ptt Avm</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" maxlength="255" type="text" class="form-control" placeholder="PTT AVM Mağaza Sayfa Adresinizi Yazınız">
<input name="sosyal[]" type="hidden" value="ptt">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Pinterest</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://pinterest.com/ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="pinterest">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Tiktok</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" placeholder="https://www.tiktok.com/@ Kısmından Sonra ki Kullanıcı Adını Yazınız">
<input name="sosyal[]" type="hidden" value="tiktok">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Whataspp İşletme Kataloğunuz</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" id="isim"  placeholder="Örnek : https://wa.me/c/551515151555">
<input name="sosyal[]" type="hidden" value="whatsappkatalog">
</div>
</div>

<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Web Site</b></label>
<div class="col-md-8 col-lg-9">
<input name="hesap[]" type="text" class="form-control" id="link"  placeholder="Örnek : www.dijitaco.com">
<input name="sosyal[]" type="hidden" value="link">
</div>
</div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
    </form>
		                   	<br>
				   <div class="text-center"><a href="sihirbaz-5"><button class="btn btn-ligh" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
<?php }else{
$tarih 		=date('d.m.Y',time());

     $deger = count($_POST['hesap']); 
     for ($i = 0; $i < $deger; $i++){
	$kart_id	= $_POST['kart_id'];
	$hesap		= $_POST['hesap'][$i];
	$sosyal		= $_POST['sosyal'][$i];

if(empty($hesap)){

}else{
$sql = $baglan->prepare("INSERT INTO `sosyal_medya` SET `kart_id`=?, `hesap`=?, `sosyal`=? ");
$kayit = $sql ->execute(array($kart_id,$hesap,$sosyal));	
}
}

if (isset ($kayit)){

/* LOG */
$islem ="Sosyal Medya Hesabı Eklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

?>
<div align="center">
<h3>Sosyal Ağ ve Pazaryeri Bilgileriniz Oluşturuldu.</h3> <br><br>
<a href="sihirbaz-5"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
</div>
<?php
}else{
?>
<div align="center"><h3>İşlem Başarısız Lütfen Geri Tuşuna Basıp Eksikleri Gideriniz.</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}?>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
<?php include 'footer.php';?>