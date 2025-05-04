<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
            <div class="col-12">
              <div class="card recent-sales overflow-auto">
               <div class="card-body">
				<h5 class="card-title">KULLANICI LİSTESİ</h5>
                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Kullanıcı Adı</th>
                        <th scope="col">Telefon</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
$urun = $baglan->prepare("SELECT * FROM  `uye` WHERE `paket` ='1'"); 
$urun->execute();
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$kullaniciadi";?></td>
                        <td><?php echo"$telefon";?></td>
                        <td>
						<h1><a href="kullanici-sil?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
						<a href="kullanici-duzenle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						<a href="sifre?id=<?php echo"$id";?>" alt="Şifre Değiştir" title="Şifre Değiştir"><i class="bx  bxs-key"></i></a>
						</h1>
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