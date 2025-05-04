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
				<h5 class="card-title">GENEL AYARLAR</h5>	
<?php 
if(empty($_POST)){
?>
				  <form name="ayar" action="" method="POST" enctype="multipart/form-data">
				  <input name="id" type="hidden" class="form-control" id="id" value="<?php echo"$ayarid";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Domain</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="domain" type="text" class="form-control" id="isim" value="<?php echo"$domain";?>" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Site Adı (Title)</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="title" type="text" class="form-control" id="title" value="<?php echo"$title";?>" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Açıklama (Description)</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="description" type="text" class="form-control" id="description" value="<?php echo"$description";?>" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Alt Kısım (Footer)</label>
                      <div class="col-md-8 col-lg-9">
					  <textarea name="alt" class="ckeditor" required><?php echo"$alt";?></textarea>
                      </div>
                    </div>					
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Site Logo</label>
                      <div class="col-md-8 col-lg-9">
						<input name="resim" class="form-control" type="file" id="formFile">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Mail Sunucusu</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="sunucu" type="text" class="form-control" id="sunucu" value="<?php echo"$sunucu";?>" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Mail Port</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="port" type="number" class="form-control" id="port" value="<?php echo"$port";?>" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Mail Kullanıcısı</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="mailuser" type="text" class="form-control" id="mailuser" value="<?php echo"$mailuser";?>" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Mail Şifresi</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="mailsifre" type="text" class="form-control" id="mailsifre" value="<?php echo"$mailsifre";?>">
                      </div>
                    </div>	
                    <div class="row mb-3">					
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Güncelle</button>
                    </div>
					</div>
                  </form><!-- End Profile Edit Form -->
<?php 
}else{
/* Resim Yükleme */
if(preg_match('/(.*)\.(.*)/',$_FILES['resim']['name'],$dizi) ) {
$format=$dizi[2];
}
$addfrontchar = substr(0,3);
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
if ($dosyaUzantisi != "jpg" && $dosyaUzantisi != "png") { # Dosya uzantı kontrolü
echo "Sadece jpg ve png uzantılı dosyalar yüklenebilir.";
} else {
$addcatid = $cat_id;
$createprodnum = $addfrontchar . $randnum . 
$addcatid;
$new_name="".$createprodnum.".".$format."";
$kaynak		= $_FILES["resim"]["tmp_name"];   // Yüklenen dosyanın adı
$klasor		= "assets/img/"; // Hedef klasörümüz
$yukle		= $klasor.basename($new_name);
if ( move_uploaded_file($kaynak, $yukle) )
{
$dosya		= "assets/img/" . $new_name;
}
/* Resim Yükleme */
}

$guncelle =$baglan->prepare("UPDATE `ayar` SET `domain`=?,`title`=?,`description`=?,`alt`=?,`logo`=?,`sunucu`=?,`port`=?,`mailuser`=?,`mailsifre`=? WHERE `id`=?");
$guncelle ->execute(array($domain,$title,$description,$alt,$dosya,$sunucu,$port,$mailuser,$mailsifre,$ayarid));
if (isset ($guncelle)){
header('location: ayarlar');
}else{
?>
<div align="center"><h3>Güncelleme Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
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