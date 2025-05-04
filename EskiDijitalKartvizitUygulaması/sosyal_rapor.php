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
          <li class="breadcrumb-item active">Sosyal Ağ Raporları</li>
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
              <h6 class="card-title">Günlük | Sosyal Ağ Tıklama</h6>
              <!-- Bar Chart -->
              <div id="sosyalgunluk"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#sosyalgunluk"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$whatsapptiklama";?>, <?php echo"$facebooktiklama";?>, <?php echo"$twittertiklama";?>, <?php echo"$instagramtiklama";?>, <?php echo"$telegramtiklama";?>, <?php echo"$snapchattiklama";?>, <?php echo"$tiktoktiklama";?>]
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
                      categories: ['Whatsapp', 'Facebook', 'Twitter', 'İnstagram', 'Telegram', 'Snapchat', 'Tiktok'
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
              <h6 class="card-title">7 Günlük | Sosyal Ağ Tıklama</h6>
              <!-- Bar Chart -->
              <div id="sosyalyedigunluk"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#sosyalyedigunluk"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$whatsapptiklama_yedi";?>, <?php echo"$facebooktiklama_yedi";?>, <?php echo"$twittertiklama_yedi";?>, <?php echo"$instagramtiklama_yedi";?>, <?php echo"$telegramtiklama_yedi";?>, <?php echo"$snapchattiklama_yedi";?>, <?php echo"$tiktoktiklama_yedi";?>]
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
                      categories: ['Whatsapp', 'Facebook', 'Twitter', 'İnstagram', 'Telegram', 'Snapchat', 'Tiktok'
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
              <h6 class="card-title">30 Günlük | Sosyal Ağ Tıklama</h6>
              <!-- Bar Chart -->
              <div id="sosyalotuzgunluk"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#sosyalotuzgunluk"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$whatsapptiklama_otuz";?>, <?php echo"$facebooktiklama_otuz";?>, <?php echo"$twittertiklama_otuz";?>, <?php echo"$instagramtiklama_otuz";?>, <?php echo"$telegramtiklama_otuz";?>, <?php echo"$snapchattiklama_otuz";?>, <?php echo"$tiktoktiklama_otuz";?>]
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
                      categories: ['Whatsapp', 'Facebook', 'Twitter', 'İnstagram', 'Telegram', 'Snapchat', 'Tiktok'
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
              <h6 class="card-title">Toplam | Sosyal Ağ Tıklama</h6>
              <!-- Bar Chart -->
              <div id="sosyaltoplam"></div>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  new ApexCharts(document.querySelector("#sosyaltoplam"), {
                    series: [{
					  name: 'Tıklama',
                      data: [<?php echo"$whatsapptoplam";?>, <?php echo"$facebooktoplam";?>, <?php echo"$twittertoplam";?>, <?php echo"$instagramtoplam";?>, <?php echo"$telegramtoplam";?>, <?php echo"$snapchattoplam";?>, <?php echo"$tiktoktoplam";?>]
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
                      categories: ['Whatsapp', 'Facebook', 'Twitter', 'İnstagram', 'Telegram', 'Snapchat', 'Tiktok'
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