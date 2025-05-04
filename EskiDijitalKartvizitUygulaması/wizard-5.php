<?php 
include 'businessheader.php';
$kart_id		=$_GET["kart_id"];
?>
  <main id="kapsa" class="kapsa">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" Style="color:#000;">DÖKÜMAN</h5>
<?php 
extract($_POST);
if(empty($_POST)){
?>				
<form name="form" action="" method="POST" enctype="multipart/form-data">
<input name="kart_id" type="hidden" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
					<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Döküman Başlık</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="baslik" class="form-control" type="text" required>
                      </div>
                    </div>
                    <div class="row mb-3">
					<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>PDF Formatında Döküman Seçiniz</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="resim" class="form-control" type="file" id="formFile">
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Yükle</button>
                    </div>
    </form>
	                   	<br>
				   <div class="text-center"><a href="wizard-6?kart_id=<?php echo"$kart_id";?>"><button class="btn btn-ligh" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
<?PHP
}else{
if(preg_match('/(.*)\.(.*)/',$_FILES['resim']['name'],$dizi) ) {
$format=$dizi[2];
}
$addfrontchar = substr($title,0,3);
$addfrontchar = strtoupper($addfrontchar);
$chars = array("1","2","3","4","5","6","7","8","9","0");
$max_chars = count($chars) - 1;
srand((double)microtime()*1000000);
for($i = 0; $i < 4; $i++)
{
$randnum = ($i == 0) ? $chars[rand(0, 
$max_chars)] : $randnum . $chars[rand(0, $max_chars)];
}
$dosyaUzantisi = pathinfo($_FILES['resim']['name'], PATHINFO_EXTENSION);
if ($dosyaUzantisi != "pdf") { # Dosya uzantı kontrolü
echo "Sadece pdf uzantılı dosyalar yüklenebilir.";
} else {
$createprodnum = $addfrontchar . $randnum ;
$new_name="".$createprodnum.".".$format."";
$kaynak		= $_FILES["resim"]["tmp_name"];   // Yüklenen dosyanın adı
$klasor		= "assets/katalog/"; // Hedef klasörümüz
$yukle		= $klasor.basename($new_name);
if ( move_uploaded_file($kaynak, $yukle) )
{
$dosya		= "assets/katalog/" . $new_name;

$sql = $baglan->prepare("INSERT INTO `katalog` SET `kart_id`=?,`link`=?,`baslik`=?");
$kayit = $sql->execute(array($kart_id,$dosya,$baslik));
}else{}
}
if (isset ($kayit)){
?>
<div align="center">
<h3>Döküman Oluşturuldu.</h3> <br><br>
<a href="wizard-6?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
</div>
<?php
}else{
?>
<div align="center"><h3>İşlem Başarısız Lütfen Geri Tuşuna Basıp Eksikleri Gideriniz.</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
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