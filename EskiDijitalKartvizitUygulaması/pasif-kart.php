 <?php 
 require("header.php");
 ?>
  <main id="main" class="main">
   <section class="section dashboard">
      <div class="row">
            <div class="col-12">
              <div class="card recent-sales overflow-auto">
               <div class="card-body">
                  <h5 class="card-title">PASİF KARTVİZİT LİSTESİ | <a href="excel" alt="Excel Olarak İndir" title="Excel Olarak İndir"><button type="button" class="btn btn-dark"><i class="bi bi-folder"></i> Excel Olarak İndir</button></a></h5>
                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
					  <?php if (isMobile()) { ?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">İşlemler</th>
						<?php }else{?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Serino</th>
                        <th scope="col">Gsm</th>
						<th scope="col">Bayi</th>
                        <th scope="col">Durum</th>
                        <th scope="col">Oluşturma Tarihi</th>
                        <th scope="col" style="min-width:180px;">İşlemler</th>
						<?php }?>
                      </tr>
                    </thead>
                    <tbody>
<?php
$urun = $baglan->prepare("SELECT * FROM  `kartvizit` WHERE `durum` ='0'");
$urun ->execute();
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
if($durum =="0"){
$kart_durumu ="Pasif";
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
                        <td><h1>
						<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
						<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						<img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>business?kart_id=<?php echo"$kart_id"?>&chs=160x160&chld=L|0" style="max-height:30px;" class="qr-code img-thumbnail img-responsive" />
						<h1></td>
						<?php }else{?>
						<td><?php echo"$isim $soyisim";?></td>
						<td><?php echo"$serino";?></td>
                        <td><?php echo"$gsm";?></td>
						<td><?php echo"$bayiadim";?></td>
						<td><?php echo"$kart_durumu";?></td>
						<td><?php echo"$tarih";?></td>
						<td><h1>
						<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
						<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						<img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>business?kart_id=<?php echo"$kart_id"?>&chs=160x160&chld=L|0" style="max-height:40px;" class="qr-code img-thumbnail img-responsive" />
						</h1></td>
						<?php }?>
					  </tr>
<?php }?>
                    </tbody>
                  </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>