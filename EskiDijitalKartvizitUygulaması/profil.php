<?php 
include 'header.php';
$uye_id	=$_GET["id"];
$profilim 	= $baglan->prepare("SELECT * FROM `uye` WHERE `id`=?");
$profilim ->execute(array($uye_id));
$uyebilgi 	= $profilim->FETCH(PDO::FETCH_ASSOC);
$isim		= $uyebilgi["isim"];
$soyisim	= $uyebilgi["soyisim"];
$telefon	= $uyebilgi["telefon"];
$email		= $uyebilgi["email"];
$kullaniciadi		=$uyebilgi["kullaniciadi"];
$paket		=$uyebilgi["paket"];
?>
  <main id="main" class="main">

    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">

          <div class="card">
            <div class="card-body pt-3">
              <!-- Bordered Tabs -->
              <ul class="nav nav-tabs nav-tabs-bordered">

                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Profil Bilgileri</button>
                </li>

                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Profil Düzenleme</button>
                </li>

                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Şifre Değiştirme</button>
                </li>

              </ul>
              <div class="tab-content pt-2">

                <div class="tab-pane fade show active profile-overview" id="profile-overview">
                  <h5 class="card-title">Profil Detayları</h5>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label ">İsim</div>
                    <div class="col-lg-9 col-md-8"><b><?php echo"$isim";?></b></div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label ">Soysim</div>
                    <div class="col-lg-9 col-md-8"><b><?php echo"$soyisim";?></b></div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label ">telefon</div>
                    <div class="col-lg-9 col-md-8"><b><?php echo"$telefon";?></b></div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">E-Posta</div>
                    <div class="col-lg-9 col-md-8"><b><?php echo"$email";?></b></div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Kullanıcı Adı</div>
                    <div class="col-lg-9 col-md-8"><b><?php echo"$kullaniciadi";?></b></div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 col-md-4 label">Kartvizit Paketi</div>
                    <div class="col-lg-9 col-md-8"><b><?php echo"$paket";?> Adet</b></div>
                  </div>

                </div>

                <div class="tab-pane fade profile-edit pt-3" id="profile-edit">

                  <!-- Profile Edit Form -->
                  <form name="form" action="profil-guncelle" method="POST">
				  <input name="id" type="hidden" class="form-control" id="id" value="<?php echo"$uye_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">İsim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" value="<?php echo"$isim";?>">
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Soyisim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" value="<?php echo"$soyisim";?>">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Telefon</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="telefon" type="number" class="form-control" id="telefon" value="<?php echo"$telefon";?>">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">E-Posta</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" value="<?php echo"$email";?>">
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Güncelle</button>
                    </div>
                  </form><!-- End Profile Edit Form -->

                </div>

                <div class="tab-pane fade pt-3" id="profile-change-password">
                  <!-- Change Password Form -->
                  <form name="form" action="sifre-guncelle" method="POST">
						<input name="id" type="hidden" class="form-control" id="id" value="<?php echo"$uye_id";?>">
                    <div class="row mb-3">
                      <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Yeni Şifre</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="sifre" type="password" class="form-control" id="currentPassword">
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Şifre Güncelle</button>
                    </div>
                  </form><!-- End Change Password Form -->

                </div>

              </div><!-- End Bordered Tabs -->

            </div>
          </div>

        </div>
      </div>
    </section>

  </main><!-- End #main -->
<?php include 'footer.php';?>