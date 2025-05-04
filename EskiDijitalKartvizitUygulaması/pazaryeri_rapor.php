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
          <li class="breadcrumb-item active">Pazaryeri Raporları</li>
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
              <h6 class="card-title">Günlük | Pazaryeri Tıklama</h6>
              <!-- Bar Chart -->
              <div id="pazaryerigunluk"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#pazaryerigunluk"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$N11tiklama";?>, <?php echo"$trendyoltiklama";?>, <?php echo"$hepsiburadatiklama";?>, <?php echo"$sahibindentiklama";?>, <?php echo"$hepsiemlaktiklama";?>, <?php echo"$arabamtiklama";?>, <?php echo"$letgotiklama";?>, <?php echo"$amazontiklama";?>, <?php echo"$ptttiklama";?>, <?php echo"$ciceksepetitiklama";?>]
                    }],
                    chart: {
                      type: 'bar',
                      height: 350
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: true,
                      }
                    },
                    dataLabels: {
                      enabled: true
                    },
                    xaxis: {
                      categories: ['N11', 'Trendyol', 'Hepsiburada', 'Sahibinden', 'Hepsiemlak', 'Arabam.com', 'Letgo', 'Amazon', 'Ptt', 'Çiçek Sepeti'
                      ],
                    }
                  }).render();
                });
              </script>
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title">7 Günlük | Pazaryeri Tıklama</h6>
              <!-- Bar Chart -->
              <div id="pazaryeriyedigunluk"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#pazaryeriyedigunluk"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$N11tiklama_yedi";?>, <?php echo"$trendyoltiklama_yedi";?>, <?php echo"$hepsiburadatiklama_yedi";?>, <?php echo"$sahibindentiklama_yedi";?>, <?php echo"$hepsiemlaktiklama_yedi";?>, <?php echo"$arabamtiklama_yedi";?>, <?php echo"$letgotiklama_yedi";?>, <?php echo"$amazontiklama_yedi";?>, <?php echo"$ptttiklama_yedi";?>, <?php echo"$ciceksepetitiklama_yedi";?>]
                    }],
                    chart: {
                      type: 'bar',
                      height: 350
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: true,
                      }
                    },
                    dataLabels: {
                      enabled: true
                    },
                    xaxis: {
                      categories: ['N11', 'Trendyol', 'Hepsiburada', 'Sahibinden', 'Hepsiemlak', 'Arabam.com', 'Letgo', 'Amazon', 'Ptt', 'Çiçek Sepeti'
                      ],
                    }
                  }).render();
                });
              </script>
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>
		</div>
<div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title">30 Günlük | Pazaryeri Tıklama</h6>
              <!-- Bar Chart -->
              <div id="pazaryeriotuzgunluk"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#pazaryeriotuzgunluk"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$N11tiklama_otuz";?>, <?php echo"$trendyoltiklama_otuz";?>, <?php echo"$hepsiburadatiklama_otuz";?>, <?php echo"$sahibindentiklama_otuz";?>, <?php echo"$hepsiemlaktiklama_otuz";?>, <?php echo"$arabamtiklama_otuz";?>, <?php echo"$letgotiklama_otuz";?>, <?php echo"$amazontiklama_otuz";?>, <?php echo"$ptttiklama_otuz";?>, <?php echo"$ciceksepetitiklama_otuz";?>]
                    }],
                    chart: {
                      type: 'bar',
                      height: 350
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: true,
                      }
                    },
                    dataLabels: {
                      enabled: true
                    },
                    xaxis: {
                      categories: ['N11', 'Trendyol', 'Hepsiburada', 'Sahibinden', 'Hepsiemlak', 'Arabam.com', 'Letgo', 'Amazon', 'Ptt', 'Çiçek Sepeti'
                      ],
                    }
                  }).render();
                });
              </script>
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title">Toplam | Pazaryeri Tıklama</h6>
              <!-- Bar Chart -->
              <div id="pazaryeritoplam"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#pazaryeritoplam"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$N11toplam";?>, <?php echo"$trendyoltoplam";?>, <?php echo"$hepsiburadatoplam";?>, <?php echo"$sahibindentoplam";?>, <?php echo"$hepsiemlaktoplam";?>, <?php echo"$arabamtoplam";?>, <?php echo"$letgotoplam";?>, <?php echo"$amazontoplam";?>, <?php echo"$ptttoplam";?>, <?php echo"$ciceksepetitoplam";?>]
                    }],
                    chart: {
                      type: 'bar',
                      height: 350
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: true,
                      }
                    },
                    dataLabels: {
                      enabled: true
                    },
                    xaxis: {
                      categories: ['N11', 'Trendyol', 'Hepsiburada', 'Sahibinden', 'Hepsiemlak', 'Arabam.com', 'Letgo', 'Amazon', 'Ptt', 'Çiçek Sepeti'
                      ],
                    }
                  }).render();
                });
              </script>
              <!-- End Bar Chart -->
            </div>
          </div>
        </div>
	  </div>
    </section>
  </main>
<?php include 'footer.php';?>