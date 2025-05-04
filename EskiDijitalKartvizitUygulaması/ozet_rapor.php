<?php 
include 'header.php';
include 'rapor-veri.php';
?>
  <main id="main" class="main">
       <div class="pagetitle">
      <h1>RAPORLARIM</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="yonetim.php">Anasayfa</a></li>
          <li class="breadcrumb-item active">Raporlar Özet</li>
        </ol>
      </nav>
    </div>
<?PHP 
if($paket !=='1'){
?>
<form name="kartim" action="" method="GET">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
			 <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Kartvizit Seçiniz</label>
                      <div class="col-md-12 col-lg-12">
<select name="skart_id" class="form-control" required>
  <option value="">Kart Seçiniz</option>
<?php
if($yetki =="1"){
$kartvizitbul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kartvizitbul	->execute();	
}else{
$kartvizitbul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kartvizitbul	->execute(array($uye_id));
}
while($kartvizitlistele		=$kartvizitbul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$kartvizitlistele["kart_id"];
$isim			=$kartvizitlistele["isim"];
$soyisim		=$kartvizitlistele["soyisim"];
?>
  <option value="<?php echo"$kart_id";?>"><?php echo"$isim $soyisim";?></option>
<? } ?>
</select>

                      </div>
					  

			</div>
              <div class="d-grid gap-2 mt-3">
                <button type="submit" class="btn btn-dark" type="button">RAPOR DÖKÜMÜ</button>
              </div>
			</div>
			</div>
		  </div>
			</form>
<?php }?>
    <section class="section">
	      <div class="row">
		  
		  
        <div class="col-lg-6">
		  <div class="card">
            <div class="card-body">
              <h5 class="card-title">Etkileşim Özet Raporlar</h5>
              <div id="etkilesim" style="min-height: 400px;" class="echart"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  echarts.init(document.querySelector("#etkilesim")).setOption({
                    xAxis: {
                      type: 'category',
                      data: [' S. Medya', ' Pazaryeri', ' Diğer']
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: [{
                      data: [<?php echo"$toplamsosyal";?>, <?php echo"$toplampazaryeri";?>, <?php echo"$toplamdiger";?>],
                      type: 'bar'
                    }]
                  });
                });
              </script>
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>
        <div class="col-lg-6">
		  <div class="card">
            <div class="card-body">
              <h5 class="card-title">Ziyaretçi Özet Raporlar</h5>
              <div id="ziyaretci" style="min-height: 400px;" class="echart"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  echarts.init(document.querySelector("#ziyaretci")).setOption({
                    xAxis: {
                      type: 'category',
                      data: ['Günlük', '7 Gün', '30 Gün', 'Toplam']
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: [{
                      data: [<?php echo"$ziyaretcitekilsayi";?>, <?php echo"$ziyaretcitekilsayi_yedi";?>, <?php echo"$ziyaretcitekilsayi_otuz";?>, <?php echo"$ziyaretcitekilsayi_toplam";?>],
                      type: 'bar'
                    }]
                  });
                });
              </script>
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>		
        </div>		
	  </div>
    </section>
  </main>
<?php include 'footer.php';?>