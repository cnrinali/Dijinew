<?php 
include 'header.php';
?>
  <main id="main" class="main">

    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">

          <div class="card">
		  
            <div class="card-body pt-3">
			<h5 class="card-title">Bayi Kartvizit Oluştur</h5>
                  <?php
				  if(empty($_POST)){
				  ?>
                  <form name="form" action="" method="POST">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Açılacak Adet</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="adet" type="number" class="form-control" id="adet" required>
                      </div>
                    </div>
					
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Bayi Seç</label>
                      <div class="col-md-8 col-lg-9">
            <select name="bayi_id" class="form-control" required>
			<option value="">Bayi Seçiniz</option>
			<?php
$bayibul		=$baglan->prepare("SELECT * FROM `bayi`");
$bayibul		->execute();
while($listele	=$bayibul->fetch(PDO::FETCH_ASSOC)){
$bayiid			=$listele["id"];
$bayi_adi		=$listele["bayi_adi"];
?>
			<option value="<?php echo"$bayiid";?>"><?php echo"$bayi_adi";?></option>
<?php }?>
			</select>
                       </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Oluştur</button>
                    </div>
                  </form>
				  <?php 
				  }else{
$tarih 		=date('d.m.Y',time());
$i=0; 
$a			=$_POST['adet'];
$bayi_id	=$_POST['bayi_id'];
while($i<$a){
$durum ="0";
$isim ="Varsayılan";
$soyisim ="Hesap";
$gsm ="05000000000";
$email ="info@site.com.tr";
$str = '1234567890ABCDE1234567890ABCDE';
$kart_id = substr(str_shuffle($str), 0, 25);

$sql = $baglan->prepare("INSERT INTO `kartvizit` SET `bayi_id`=?,`durum`=?, `kart_id`=?, `isim`=?, `soyisim`=?, `gsm`=?, `email`=?, `tarih`=?");
$kayit = $sql->execute(array($bayi_id,$durum,$kart_id,$isim,$soyisim,$gsm,$email,$tarih)); 
if (isset ($kayit)){
?>
<div align="center"><h6><b>Kartvizit Oluşturuldu | Kart ID :</b><a href="<?php echo"$domain";?>index.php?kart_id=<?php echo"$kart_id";?>"> <?php echo"$kart_id";?></a> -><img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>index?kart_id=<?php echo"$kart_id"?>&chs=80x80&chld=L|0" class="qr-code img-thumbnail img-responsive" /></h6><br>
<?php
}else{
?>
<div align="center"><h3>Kartvizit Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php
}
$i++;}
/* LOG */
$islem ="$a Adet Bayi Kartı Oluşturuldu";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?, proxyip=?, gercekip=?, sehir=?, ulke=?, tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

}
?>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>