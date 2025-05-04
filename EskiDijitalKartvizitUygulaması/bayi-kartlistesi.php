<?php 
include 'header.php';
$bayi_id = $_GET["bayi_id"];
$bayim = $baglan->prepare("SELECT * FROM  `bayi` WHERE `id` =?");
$bayim ->execute(array($bayi_id));
$list = $bayim->fetch(PDO::FETCH_ASSOC);
extract($list);
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title"><?php echo"$bayi_adi";?> | BAYİ KARTVİZİT LİSTESİ</h5>
                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
					  <?php if (isMobile()) { ?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Gsm</th>
                        <th scope="col">İşlemler</th>
						<?php }else{?>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Gsm</th>
						<th scope="col">Bayi</th>
                        <th scope="col">Durum</th>
                        <th scope="col">İşlemler</th>
						<?php }?>
                      </tr>
                    </thead>
                    <tbody>
<?php
$urun = $baglan->prepare("SELECT * FROM  `kartvizit` WHERE `bayi_id` =?");
$urun ->execute(array($bayi_id));
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
if($durum =="0"){
$kart_durumu ="Pasif";
}else{
$kart_durumu ="Aktif";
}
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$gsm";?></td>
						<?php if (isMobile()) { ?>
						<?php }else{?>
						<td><?php echo"$bayi_adi";?></td>
						<td><?php echo"$kart_durumu";?></td>
						<?php }?>
						<?php if (isMobile()) { ?>
                        <td>
						<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<?PHP if($yetki =='1'){?><a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a><?php }?>
						<a href="duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						</td>
						<?php }else{ ?>
						<td><h1>
						<a href="index?kart_id=<?php echo"$kart_id";?>" alt="Görüntüle" title="Görüntüle"><i class="bx bxs-credit-card-front"></i></a>
						<?PHP if($yetki =='1'){?><a href="sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a><?php }?>
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
      </div>
    </section>
  </main>
<?php include 'footer.php';?>