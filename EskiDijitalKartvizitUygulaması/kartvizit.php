 <?php 
 require("header.php");
if($yetki =='1'){
	?>
  <main id="main" class="main">
   <section class="section dashboard">
      <div class="row">
            <div class="col-12">
              <div class="card recent-sales overflow-auto">
               <div class="card-body">
                  <h5 class="card-title">KARTVİZİT LİSTESİ</h5>
                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
					  <?php if (isMobile()) { ?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">İşlemler</th>
						<?php }else{?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Profil</th>
                        <th scope="col">Gsm</th>
						<th scope="col">Bayi</th>
                        <th scope="col">Durum</th>
                        <th scope="col">Oluşturma Tarihi</th>
                        <th scope="col">Bitis Tarihi</th>
                        <th scope="col" style="min-width:180px;">İşlemler</th>
						<?php }?>
                      </tr>
                    </thead>
                    <tbody>
	<?php
$urun = $baglan->prepare("SELECT * FROM  `kartvizit` WHERE `durum` !='0'");
$urun ->execute();
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
if($durum =="0"){
$kart_durumu ="Pasif";
}elseif($durum =="2"){
$kart_durumu ="Donduruldu";
}else{
$kart_durumu ="Aktif";
}
$bayim = $baglan->prepare("SELECT * FROM  `bayi`  WHERE `id` =?"); 
$bayim->execute(array($bayi_id));
$bay = $bayim->fetch(PDO::FETCH_ASSOC);
$bayiadim = $bay["bayi_adi"];

?>
<tr>
<?php if (isMobile()) { ?>
<td><?php echo"$isim $soyisim";?></td>
<td>
<h2><a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
<a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Kartvizit Silinecektir Onaylıyor Musunuz? Geri Dönüşü Yoktur.')"><i class="bx bx-trash"></i></a>
<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
<a href="durumdegistir?id=<?php echo"$id";?>&durum=2" alt="Dondur" title="Dondur"><i class="bx bx-error"></i></a>
<a href="durumdegistir?id=<?php echo"$id";?>&durum=1" alt="Aktif Et" title="Aktif Et"><i class="bx bxs-check-shield"></i></a>
<a href="yenile.php?k_id=<?php echo"$id";?>" alt="Kartın Süresini Uzat" title="Kartın Süresini Uzat"><i class="bx  bx-refresh"></i></a>
</h2></td>
<?php 	}else{ ?>
<td><?php echo"$isim $soyisim";?></td>
<td><?php echo"$profil";?></td>
<td><?php echo"$gsm";?></td>
<td><?php echo"$bayiadim";?></td>
<td><?php echo"$kart_durumu";?></td>
<td><?php echo"$tarih";?></td>
<td><?php echo"$bitis";?></td>
<td><h2>
<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
<a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Kartvizit Silinecektir Onaylıyor Musunuz? Geri Dönüşü Yoktur.')"><i class="bx bx-trash"></i></a>
<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
<a href="durumdegistir?id=<?php echo"$id";?>&durum=2" alt="Dondur" title="Dondur"><i class="bx bx-error"></i></a>
<a href="durumdegistir?id=<?php echo"$id";?>&durum=1" alt="Aktif Et" title="Aktif Et"><i class="bx bxs-check-shield"></i></a>
<a href="yenile.php?k_id=<?php echo"$id";?>" alt="Kartın Süresini Uzat" title="Kartın Süresini Uzat"><i class="bx  bx-refresh"></i></a>
</h2></td>
<?php 
}
}
?>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</section>
</main>
<?php
}else{
?>
<div id="main">
   <section class="section dashboard">
      <div class="row">
            <div class="col-12">
              <div class="card recent-sales overflow-auto">
               <div class="card-body">
                  <h5 class="card-title">KARTVİZİT LİSTESİ</h5>
                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
					  <?php if (isMobile()) { ?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">İşlemler</th>
						<?php }else{?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Profil</th>
                        <th scope="col">Gsm</th>
                        <th scope="col">Durum</th>
                        <th scope="col">Oluşturma Tarihi</th>
                        <th scope="col">Bitis Tarihi</th>
                        <th scope="col" style="min-width:180px;">İşlemler</th>
						<?php }?>
                      </tr>
                    </thead>
                    <tbody>
<?php
$urun = $baglan->prepare("SELECT * FROM  `kartvizit` WHERE `uye_id` =?");
$urun ->execute(array($uye_id));
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
if($durum =="0"){
$kart_durumu ="Pasif";
}elseif($durum =="2"){
$kart_durumu ="Donduruldu";
}else{
$kart_durumu ="Aktif";
}
$bayim = $baglan->prepare("SELECT * FROM  `bayi`  WHERE `id` =?"); 
$bayim->execute(array($bayi_id));
$bay = $bayim->fetch(PDO::FETCH_ASSOC);
$bayiadim = $bay["bayi_adi"];
if($durum =="2"){
?>
<div align="center"><h4>Dijital Kartınız Dondurulmuştur. <br>Yönetici İle İrtibata Geçiniz</h4> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php
}else{
?>
<tr>
<?php if (isMobile()) { ?>
<td><?php echo"$isim $soyisim";?></td>
<td>
<h2><a href="link?id=<?php echo"$id";?>" alt="Özel Adres Oluştur" title="Özel Adres Oluştur"><i class="bx  bxs-credit-card"></i></a>
<h2><a href="business?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
<a href="durumdegistir?id=<?php echo"$id";?>&durum=2" alt="Dondur" title="Dondur" onclick="return confirm('Kartvizit Dondurulacaktır Onaylıyor Musunuz?.')"><i class="bx bx-error"></i></a>
</h2></td>
<?php 	}else{?>
<td><?php echo"$isim $soyisim";?></td>
<td><?php echo"$profil";?></td>
<td><?php echo"$gsm";?></td>
<td><?php echo"$kart_durumu";?></td>
<td><?php echo"$tarih";?></td>
<td><?php echo"$bitis";?></td>
<td>

<h2>
<a href="link?id=<?php echo"$id";?>" alt="Özel Adres Oluştur" title="Özel Adres Oluştur"><i class="bx  bxs-credit-card"></i></a>
<a href="business?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<?php 
						if($uye_id =="112"){}else{
						?>
<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
<a href="durumdegistir?id=<?php echo"$id";?>&durum=2" alt="Dondur" title="Dondur" onclick="return confirm('Kartvizit Dondurulacaktır Onaylıyor Musunuz?.')"><i class="bx bx-error"></i></a>
<?php }?>
</h2>
						
</td>
<?php 
}
}
}
?>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</section>
</div>
<?php
}
?>

<?php include 'footer.php';?>