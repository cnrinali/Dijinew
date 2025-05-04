<?php 
include 'header.php';
$uye_id		=$_GET["id"];
$profilim 	= $baglan->prepare("SELECT * FROM `uye` WHERE `id` =?");
$profilim	->execute(array($uye_id));
$uyebilgi 	= $profilim->fetch(PDO::FETCH_ASSOC);
$isim		= $uyebilgi["isim"];
$soyisim	= $uyebilgi["soyisim"];
$telefon	= $uyebilgi["telefon"];
$email		= $uyebilgi["email"];
$paket		=$uyebilgi["paket"];
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
							<h5 class="card-title">KULLANICI LİSTESİ</h5>
				<?php
				if(empty($_POST)){
				?>
                  <form name="form" action="" method="POST">
				  <input name="id" type="hidden" class="form-control" id="id" value="<?php echo"$uye_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">İsim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" value="<?php echo"$isim";?>">
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Soyisim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" value="<?php echo"$soyisim";?>">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Telefon</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="telefon" type="number" class="form-control" id="telefon" value="<?php echo"$telefon";?>">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">E-Posta</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" value="<?php echo"$email";?>">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Yetki</label>
                      <div class="col-md-8 col-lg-9">
						<select name="yetki" class="form-control" required>
						<option value="0">Klasik ve Kurumsal Paket</option>
						<option value="1">Admin</option>
						</select>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Paket</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="paket" type="number" class="form-control" id="kullaniciadi" value="<?php echo"$paket";?>" required>
                      </div>
                    </div>	
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Güncelle</button>
                    </div>
                  </form><!-- End Profile Edit Form -->
				<?PHP }ELSE{

extract($_POST);
if (empty($_POST)){
echo'
<div align="center"><h3>Güncelleme Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
}ELSE{
$guncelle =$baglan->prepare("UPDATE `uye` SET `isim`=?,`soyisim`=?,`telefon`=?,`email`=?,`yetki`=?,`paket`=? WHERE `id`=?");
$guncelle ->execute(array($isim,$soyisim,$telefon,$email,$yetki,$paket,$id));
if (isset ($guncelle)){
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Kullanıcı Güncellemesi Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: kullanicilar');
}else{
?>
<div align="center"><h3>Güncelleme Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
				}
?>

            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>