<?php 
include 'header.php';
?>
  <main id="main" class="main">

    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">

          <div class="card">
		  
            <div class="card-body pt-3">
			<h5 class="card-title">Yeni Hesap</h5>
                  <?php
				  if(empty($_POST)){
				  ?>
                  <form name="form" action="" method="POST">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">İsim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Soyisim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Telefon</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="telefon" type="number" class="form-control" id="telefon" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">E-Posta</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Kullanıcı Adı</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="username" type="text" class="form-control" id="kullaniciadi" required>
                      </div>
                    </div>	
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Şifre</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="password" type="text" class="form-control" id="kullaniciadi" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Yetki</label>
                      <div class="col-md-8 col-lg-9">
						<select name="yetki" class="form-control" required>
						<option value="0">Kullanıcı</option>
						<option value="1">Admin</option>
						</select>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Kartvizit Açma Adeti</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="paket" type="number" class="form-control" id="kullaniciadi" required>
                      </div>
                    </div>					
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
                  </form>
				  <?PHP }else{
$isim	 	= $_POST['isim'];
$soyisim 	= $_POST['soyisim'];
$telefon 	= $_POST['telefon'];
$email 	 	= $_POST['email'];
$username	= $_POST['username'];
$parola 	= $_POST['password'];
$yetki 		= $_POST['yetki'];
$paket 		= $_POST['paket'];

$sifre =md5($parola);
$tarih 		=date('d.m.Y',time());
$sor = $baglan->prepare("SELECT * FROM `uye` WHERE `email` =?");
$sor	->execute(array($email));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(isset($id)){
echo'<h5 class="card-title text-center pb-0 fs-4">Bu Mail Adresi ile Kayıt Mevcut<br>Şifrenizi Unuttuysanız Lütfen Şifremi Unuttum Linkine Tıklayınız.</h5>';
} else {
$sql = $baglan->prepare("INSERT INTO `uye` SET isim=?, soyisim=?, telefon=?, email=?, kullaniciadi=?, password=?, yetki=?, paket=?, tarih=?");
$kayit = $sql->execute(array($isim,$soyisim,$telefon,$email,$username,$sifre,$yetki,$paket,$tarih));

if (isset ($kayit)){
	
/* LOG */

$islem ="Yeni Üye Kaydı Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: kullanicilar');
}else{
?>
<div align="center"><h3>Üye Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
				  }?>
            </div>
          </div>

        </div>
      </div>
    </section>

  </main><!-- End #main -->
<?php include 'footer.php';?>