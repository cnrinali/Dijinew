<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-body pt-3">
			<a href="yeni-soru" class="btn btn-dark"><i class="bi bi-patch-question-fill me-2"></i>Talep Oluştur</a>
			<div class="table-responsive">
			                  <table class="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">Talep Numarası</th>
                        <th scope="col">Konu</th>
                        <th scope="col">Yazan</th>
                        <th scope="col">Durumu</th>
                        <th scope="col">Oluşturma Tarihi</th>
                        <th scope="col">Cevap Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
if($yetki =="1"){
$soru = $baglan->prepare("SELECT * FROM  `sorular` ORDER BY `durum` ASC");
$soru->execute();
}else{
$soru = $baglan->prepare("SELECT * FROM  `sorular` where `uye_id`=?  ORDER BY `durum` ASC");
$soru->execute(array($uye_id));
}
while($sorum = $soru->fetch(PDO::FETCH_ASSOC)){
$ticket_id 	= $sorum["ticket_id"];
$soru_uid 	= $sorum["uye_id"];
$baslik 	= $sorum["baslik"];
$durum 		= $sorum["durum"];
$otarih 	= $sorum["tarih"];
$uyem = $baglan->prepare("SELECT * FROM  `uye` where `id`=?"); 
$uyem->execute(array($soru_uid));
$uyemiz = $uyem->fetch(PDO::FETCH_ASSOC);
$uyeismi 	= $uyemiz["kullaniciadi"];
if($durum =="0"){
$durumu ="Cevap Bekliyor";
}else{
$durumu ="<b>Cevaplandı</b>";
}
$cevap = $baglan->prepare("SELECT * FROM  `cevaplar` where `ticket_id`=? ORDER BY `id` DESC limit 0,1"); 
$cevap->execute(array($ticket_id));
$cevaplar = $cevap->fetch(PDO::FETCH_ASSOC);
$starih 	= $cevaplar["tarih"];
?>
                      <tr>
                        <td><a href="talep-detay.php?talep=<?php echo"$ticket_id";?>" class="btn btn-dark btn-sm"><?php echo"$ticket_id";?></a></td>
                        <td><?php echo"$baslik";?></td>
                        <td><?php echo"$uyeismi";?></td>
                        <td><?php echo"$durumu";?></td>
                        <td><?php echo"$otarih";?></td>
                        <td><?php echo"$starih";?></td>
						</tr>
<?php }?>
                    </tbody>
                  </table>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>