<?php
include 'ust.php';
extract($_POST);
if(empty($_POST)){
 ?>
   <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body"><br><br>
		<form name="upload" method="post" action="upload.php?upload=yukle" enctype="multipart/form-data">
		<table border="0" name="upload" width="300">
		<tr>
			<td>
			<input type="file" name="resim" id="resim" lang="tr" />
			</td>
			<td>
			<input type="submit" name="gonder" id="gonder" value="Yükle"/>	
			</td>
		</tr>
			</table>
		</form><br><br>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php 
}else{
if(preg_match('/(.*)\.(.*)/',$_FILES['resim']['name'],$dizi) ) {

$format=$dizi[2];

}

  	$addfrontchar = substr($title,0,3);
		$addfrontchar = strtoupper($addfrontchar);
		$chars = 

array("1","2","3","4","5","6","7","8","9","0");
		$max_chars = count($chars) - 1;
		srand((double)microtime()*1000000);
	for($i = 0; $i < 4; $i++)
		{
		$randnum = ($i == 0) ? $chars[rand(0, 

$max_chars)] : $randnum . $chars[rand(0, $max_chars)];
		}
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
			}else 
		echo "Resim Yüklenemedi";
	// Eğer resim yüklenemediyse move_uploaded_file fonksiyonundan değer false olacağından bu hatayı yazdırırız ekrana
 ?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-9" />
<title>Resim Upload</title>
</head>
<script language="JavaScript1.2" type="text/JavaScript1.2">
var isim = "<?php  echo"$dosya" ?>";
window.opener.urun.resim.value = isim;
window.close();
</script>
<body>
<?php 
}
 ?>