<?php 
require("header.php");
$day 		=date('d.m.Y',time());
if($yetki =='1'){
$toplam_uye			= $baglan->prepare("SELECT count(id) FROM `uye`");
$toplam_uye			->execute();  
$toplam_kartvizit	= $baglan->prepare("SELECT count(id) FROM `kartvizit`");
$toplam_kartvizit	->execute();  
$bugun_kartvizit	= $baglan->prepare("SELECT count(id) FROM `kartvizit` WHERE `tarih` =?");
$bugun_kartvizit	->execute(array($day));  
}else{
$toplam_uye			= $baglan->prepare("SELECT count(id) FROM `uye` WHERE `id` =?");
$toplam_uye			->execute(array($uye_id));  
$toplam_kartvizit	= $baglan->prepare("SELECT count(id) FROM `kartvizit` WHERE `uye_id` =?");
$toplam_kartvizit	->execute(array($uye_id));  
$bugun_kartvizit	= $baglan->prepare("SELECT count(id) FROM `kartvizit` WHERE `uye_id` =? AND `tarih` =?");
$bugun_kartvizit	->execute(array($uye_id,$day));  
}
$uye 			= $toplam_uye->fetch(PDO::FETCH_NUM);
$uye_sayisi		= $uye[0];
/* TOPLAM ÜYE */

/* TOPLAM KARTVİZİT */

$kartvizit 			= $toplam_kartvizit->fetch(PDO::FETCH_NUM);
$kartvizit_sayisi	= $kartvizit[0];
/* TOPLAM KARTVİZİT */

/* BUGÜN KARTVİZİT */

$bugun 				=  $bugun_kartvizit->fetch(PDO::FETCH_NUM);
$bugun_sayi			= $bugun[0];
/* BUGÜN KARTVİZİT */

if($yetki =="1"){
?>
<main id="main" class="main">
      <div class="pagetitle">
      <h1>Anasayfa</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="yonetim">Anasayfa</a></li>
          <li class="breadcrumb-item active">İstatistikler</li>
        </ol>
      </nav>
    </div><!-- End Page Title -->
    <section class="section dashboard">
      <div class="row">

        <!-- Left side columns -->
        <div class="col-lg-8">
          <div class="row">

            <div class="col-xxl-4 col-xl-12">

              <div class="card info-card customers-card">

                <div class="card-body">
                  <h5 class="card-title">Bugün Oluşturulan Kartvizit</h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-credit-card-2-front-fill"></i>
                    </div>
                    <div class="ps-3">
                      <h6><?php echo"$bugun_sayi";?></h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-xl-12">
              <div class="card info-card customers-card">
                <div class="card-body">
                  <h5 class="card-title">Toplam Kullanıcı</h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-people"></i>
                    </div>
                    <div class="ps-3">
                      <h6><?php echo"$uye_sayisi";?></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-xl-12">
              <div class="card info-card customers-card">
                <div class="card-body">
                  <h5 class="card-title">Toplam Kartvizit</h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-credit-card-2-front"></i>
                    </div>
                    <div class="ps-3">
                      <h6><?php echo"$kartvizit_sayisi";?></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="card recent-sales overflow-auto">
                <div class="card-body">
                  <h5 class="card-title">Oluşturulan Kartvizitler <span>| Bugün</span></h5>
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Gsm</th>
                        <th scope="col">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
if($yetki =='1'){
$urun = $baglan->prepare("SELECT * FROM `kartvizit` WHERE `tarih` =?");
$urun	->execute(array($day));  
}else{
$urun = $baglan->prepare("SELECT * FROM  `kartvizit` WHERE `uye_id` =? AND `tarih` =?");
$urun	->execute(array($uye_id,$day));  
}
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$gsm";?></td>
						<?php if (isMobile()) { ?>
                        <td>
						<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
						<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						</td>
						<?php }else{ ?>
						<td><h1>
						<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
						<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						</h1></td>
						<?php }?>
					  </tr>
<?php }?>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="card recent-sales overflow-auto">
                <div class="card-body">
                  <h5 class="card-title">Kayıt Olanlar <span>| Bugün</span></h5>
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Gsm</th>
                        <th scope="col">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
if($yetki =='1'){
$uyem = $baglan->prepare("SELECT * FROM `uye` WHERE `tarih` =?");
$uyem	->execute(array($day));  
}
while($userim = $uyem->fetch(PDO::FETCH_ASSOC)){
extract($userim);
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$telefon";?></td>
						<td><h1><a href="kullanici-duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a></h1></td>
					</tr>
<?php }?>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Son Yapılan 15 İşlem</h5>
              <div class="activity">
<?php
$logcu = $baglan->prepare("SELECT * FROM `log` ORDER BY `log`.`id` DESC limit 0,15");
$logcu	->execute();
while($loglar = $logcu->fetch(PDO::FETCH_ASSOC)){
extract($loglar);
?>
                <div class="activity-item d-flex">
                  <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                  <div class="activity-content">
                    <?php echo"$islem - <b>$tarih</b>";?>
                  </div>
                </div>
<?php }?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
	</main>
<?php
}else{
if($paket =="1"){
/* DENEME SÜRESİ KONTROL */
$bugunum 		=date('d.m.Y',time());
$baslangicTarihi = strtotime("$bugunum"); 
$bitisTarihi = strtotime("$bitis");
/* DENEME SÜRESİ KONTROL */
?>
<div id="kapsa">
   <section class="section">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" align="center"><b>DİJİTACO</b> KARTVİZİT PANELİ</h5>
<?php
if($bitisTarihi < $baslangicTarihi){
?>
              <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <h4 class="alert-heading">Deneme Süresi Dolmuştur.</h4>
                <p>Sayın <?php echo"$isim $soyisim";?> 7 Günlük Deneme Süreniz Bitmiştir. DijitaCO'nuzu Kullanmaya Devam Etmek İçin "0850 308 9932" Numaralı Telefondan Bizi Arayabilirsiniz.</p>
                <hr>
                <p class="mb-0">DİJİTACO'Yu Tercih Ettiğiniz İçin Teşekkür Ederiz.</p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
<?php
}
?>

<a href="duzenle?id=<? echo"$kkart_id";?>">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-credit-card-2-back-fill"></i></h1>
<b>KİŞİSEL BİLGİLERİM</b>
</div>
</div>
</a>
<a href="kurumsal">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-clipboard-data"></i></h1>
<b>FİRMA BİLGİLERİM</b>
</div>
</div>
</a>
<a href="banka">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-bank"></i></h1>
<b>BANKA BİLGİLERİM</b>
</div>
</div>
</a>
<a href="katalog">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-file-earmark-pdf-fill"></i></h1>
<b>DÖKÜMAN BİLGİLERİM</b>
</div>
</div>
</a>
<a href="resim">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-card-image"></i></h1>
<b>ÜRÜN BİLGİLERİM</b>
</div>
</div>
</a>
<a href="sosyal">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-share-fill"></i></h1>
<b>PLATFORM BİLGİLERİM</b>
</div>
</div>
</a>
<a href="video">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-camera-video-fill"></i></h1>
<b>TANITIM VİDEOM</b>
</div>
</div>
</a>
<a href="destek">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-support"></i></h1>
<b>DESTEK TALEBİ OLUŞTUR</b>
</div>
</div>
</a>
<a href="ozet_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-report"></i></h1>
<b>RAPOR ÖZETİM</b>
</div>
</div>
</a>
<a href="pazaryeri_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-basket"></i></h1>
<b>PAZARYERİ RAPORLARIM</b>
</div>
</div>
</a>
<a href="sosyal_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxl-whatsapp"></i></h1>
<b>SOSYAL AĞ RAPORLARIM</b>
</div>
</div>
</a>
<a href="diger_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-like"></i></h1>
<b>ETKİLEŞİM RAPORLARIM</b>
</div>
</div>
</a>
<a href="ozel_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-line-chart"></i></h1>
<b>ÖZEL RAPORLAMA</b>
</div>
</div>
</a>
<?php if($kartdurumu=="1"){?>
<a href="durumdegistir?id=<?php echo"$kkart_id";?>&durum=2" alt="Dondur" title="Dondur" onclick="return confirm('Kartvizit Dondurulacaktır Onaylıyor Musunuz?')">
<?php }else{?>
<a href="durumdegistir?id=<?php echo"$kkart_id";?>&durum=1" alt="Aktifleştir" title="Aktifleştir" onclick="return confirm('Kartvizit Aktifleştirilecektir Onaylıyor Musunuz?')">
<?php }?>
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-error"></i></h1>
<b><?php if($kartdurumu=="1"){?>KARTVİZİT DONDUR<?php }else{?>KARTVİZİTİ AKTİFLEŞTİR<?PHP }?></b>
</div>
</div>
</a>

<a href="cikis">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-exit"></i></h1>
<b>OTURUMU KAPAT</b>
</div>
</div>
</a>
<a href="profil?id=<?php echo"$uye_id";?>">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-key"></i></h1>
<b>ŞİFRE DEĞİŞTİR</b>
</div>
</div>
</a>
            </div>
          </div>
        </div>
      </div>
    </section>
	</div>
<?php
}else{
/* DENEME SÜRESİ KONTROL */
$bugun 		=date('d.m.Y',time());
$baslangicTarihi = strtotime("$bugun"); 
$bitisTarihi = strtotime("$bitis");
/* DENEME SÜRESİ KONTROL */
?>
<div id="main">
   <section class="section">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" align="center"><b>DİJİTACO</b> KURUMSAL PRO PANELİ</h5>
<?php
if($bitisTarihi < $baslangicTarihi){
?>
              <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <h4 class="alert-heading">Deneme Süresi Dolmuştur.</h4>
                <p>Sayın <?php echo"$isim $soyisim";?> 7 Günlük Deneme Süreniz Bitmiştir. DijitaCO'nuzu Kullanmaya Devam Etmek İçin "0850 308 9932" Numaralı Telefondan Bizi Arayabilirsiniz.</p>
                <hr>
                <p class="mb-0">DİJİTACO'Yu Tercih Ettiğiniz İçin Teşekkür Ederiz.</p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
<?php
}
?>
<a href="kartvizit">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-credit-card-2-back-fill"></i></h1>
<b>DİJİTACO'LARINI LİSTELE</b>
</div>
</div>
</a>
<a href="kurumsal">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-clipboard-data"></i></h1>
<b>FİRMA BİLGİLERİM</b>
</div>
</div>
</a>
<a href="banka">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-bank"></i></h1>
<b>BANKA BİLGİLERİM</b>
</div>
</div>
</a>
<a href="katalog">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-file-earmark-pdf-fill"></i></h1>
<b>DÖKÜMAN BİLGİLERİM</b>
</div>
</div>
</a>
<a href="resim">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-card-image"></i></h1>
<b>ÜRÜN BİLGİLERİM</b>
</div>
</div>
</a>
<a href="sosyal">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-share-fill"></i></h1>
<b>PLATFORM BİLGİLERİM</b>
</div>
</div>
</a>
<a href="slider">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-images"></i></h1>
<b>SLİDER BİLGİLERİM</b>
</div>
</div>
</a>
<a href="video">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bi bi-camera-video-fill"></i></h1>
<b>TANITIM VİDEOM</b>
</div>
</div>
</a>
<a href="destek">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-support"></i></h1>
<b>DESTEK TALEBİ OLUŞTUR</b>
</div>
</div>
</a>
<a href="ozet_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-report"></i></h1>
<b>RAPOR ÖZETİM</b>
</div>
</div>
</a>
<a href="pazaryeri_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-basket"></i></h1>
<b>PAZARYERİ RAPORLARIM</b>
</div>
</div>
</a>
<a href="sosyal_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxl-whatsapp"></i></h1>
<b>SOSYAL AĞ RAPORLARIM</b>
</div>
</div>
</a>
<a href="diger_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-like"></i></h1>
<b>ETKİLEŞİM RAPORLARIM</b>
</div>
</div>
</a>
<a href="ozel_rapor">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bx-line-chart"></i></h1>
<b>ÖZEL RAPORLAMA</b>
</div>
</div>
</a>
<a href="cikis">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-exit"></i></h1>
<b>OTURUMU KAPAT</b>
</div>
</div>
</a>
<a href="profil?id=<?php echo"$uye_id";?>">
<div class="col-md-5 col-5 mb-2" style="float:left; margin-left:15px;">
<div class="shadow bg-white text-center" style="font-size:12px; height:120px; padding-top:30px; padding-left:5px; padding-right:5px; border-radius:10px !important;">
<h1><i class="bx bxs-key"></i></h1>
<b>PROFİL BİLGİLERİM</b>
</div>
</div>
</a>
            </div>
          </div>
        </div>
      </div>
    </section>
	</main>
<?php 
} 
}
 include 'footer.php';?>