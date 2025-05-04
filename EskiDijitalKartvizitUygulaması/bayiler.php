<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
            <div class="col-12">
              <div class="card recent-sales overflow-auto">
               <div class="card-body">
				<h5 class="card-title">BAYİ LİSTESİ</h5>
                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Bayi Adı</th>
                        <th scope="col">Telefon</th>
                        <th scope="col">T. Kart</th>
                        <th scope="col">A. Kart</th>
                        <th scope="col">P. Kart</th>
                        <th scope="col" style="min-width:150px;">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
$urun = $baglan->prepare("SELECT * FROM  `bayi`"); 
$urun->execute();
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);

$toplam_kart	= $baglan->prepare("SELECT count(id) FROM `kartvizit` WHERE `bayi_id` =?");
$toplam_kart	->execute(array($id));
$toplamkart		= $toplam_kart->fetch(PDO::FETCH_NUM);
$tkart			= $toplamkart[0];

$aktif_kart	= $baglan->prepare("SELECT count(id) FROM `kartvizit` WHERE `bayi_id` =? AND `durum` ='1'");
$aktif_kart	->execute(array($id));
$aktifkart		= $aktif_kart->fetch(PDO::FETCH_NUM);
$akart			= $aktifkart[0];

$pkart = $tkart - $akart;
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$bayi_adi";?></td>
                        <td><?php echo"$telefon";?></td>
                        <td><?php echo"$tkart";?></td>
                        <td><?php echo"$akart";?></td>
                        <td><?php echo"$pkart";?></td>
                        <td>
						<h1><a href="bayi-kartlistesi?bayi_id=<?php echo"$id";?>" alt="Kart Listesi" title="Kart Listesi"><i class="bx bx-search"></i></a>
						<a href="bayi-sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
						<a href="bayi-duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a></h1>

						</td>
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