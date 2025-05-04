<?php 
include 'header.php';
extract($_POST);
?>
  <div id="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">PROFİL ADRESİNİ ÖZELLEŞTİR</h5>	
<?php 
if(empty($_POST)){
$id		=$_GET["id"];
$urun 	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE `id` =?");
$urun  ->execute(array($id));
$u = $urun->fetch(PDO::FETCH_ASSOC);
extract($u);
?>
<form name="urun" action="" method="POST">
					<input name="id" type="hidden" value="<?php echo"$id";?>">
                    <div class="row mb-3">
                      <div align="center"><h3>Yeni Adres Oluştur.</h3></div>
					  <div align="center"><h6>Mevcut Adres : index.php?kart_id=<?php echo"$kart_id";?></h6></div>
                      <div class="col-md-12 col-lg-12">
                        <input name="profil" type="text" class="form-control" id="profil" placeholder="Profil Adresinizi Yeniden Yazınız" required>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Güncelle</button>  <a href="yonetim.php" class="btn btn-danger">Geri Dön</a>
                    </div>
                  </form>
<?php 
}else{
$tarih 		=date('d.m.Y',time());
$cekk	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `profil` =?");
$cekk 	->execute(array($profil));
$bull 	= $cekk->fetch(PDO::FETCH_ASSOC);
$profilim		= $bull["profil"];
if($profilim =="$profil"){
echo'
<div align="center"><h3>Yazdığınız Profil İsmi Başka Kullanıcı Tarafından Kullanılıyor<br>Geri Dönüp Değiştiriniz.</h3> <img src="assets/img/error.gif?v=0.1" border="0" height="64px"></div>
';
}else{
	
function tr_cevir($profil) {
global $baglan;
$s=str_replace("â€™","_",$profil);
$s=str_replace("â€?","_",$s);
$s=str_replace("â€œ","_",$s);
$s=str_replace("â€˜","_",$s);
$s=str_replace("â€™","_",$s);
$s=str_replace("ç","c",$s);
$s=str_replace("Ã§","c",$s);
$s=str_replace("ş","s",$s);
$s=str_replace("ÅŸ","s",$s);
$s=str_replace("ı","i",$s);
$s=str_replace("Ä±","i",$s);
$s=str_replace("ö","o",$s);
$s=str_replace("Ã¶","o",$s);
$s=str_replace("ğ","g",$s);
$s=str_replace("ÄŸ","g",$s);
$s=str_replace("ü","u",$s);
$s=str_replace("Ã¼","u",$s);
$s=str_replace("Ç","C",$s);
$s=str_replace("Ã‡","C",$s);
$s=str_replace("Ş","S",$s);
$s=str_replace("İ","I",$s);
$s=str_replace("Ä°","I",$s);
$s=str_replace("Ö","O",$s);
$s=str_replace("Ã–","O",$s);
$s=str_replace("Ğ","G",$s);
$s=str_replace(" ","_",$s);
$s=str_replace("Ü","U",$s);
$s=str_replace("Ãœ","U",$s);
return $s;}
$trprofil = tr_cevir($profil);
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `profil`=? WHERE `id`=?");
$guncelle ->execute(array($trprofil,$id));
/* LOG */
$islem ="Kartvizit Güncelleme Yapıldı ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
if (isset ($guncelle)){

?>
<div align="center"><h5>Güncelleme Başarılı <br><br> Yeni Adresiniz <br><br><a href="<?php echo"$domain$trprofil";?>.pro"><?php echo"$domain$trprofil";?>.pro</a> </h5><br><br>
<a href="yonetim"><button type="button" class="btn btn-dark">Geri Dön</button></a></div>
<?php
}else{
?>
<div align="center"><h5>Güncelleme Başarısız</h5></div>
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
  </div>
<?php include 'footer.php';?>