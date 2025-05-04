<?php include 'header.php';
$id		= $_GET["id"];
?>
  <main id="main" class="main">
    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">
         <div class="card">
            <div class="card-body pt-3">
			<h5 class="card-title">Şifre Güncelle</h5>
                  <form name="form" action="sifre-guncelle" method="POST">
		            <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Yeni Şifre</label>
                      <div class="col-md-8 col-lg-9">
						<input name="id" type="hidden" class="form-control" id="id" value="<?php echo"$id";?>" required>
                        <input name="sifre" type="text" class="form-control" id="sifre" required>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Şifreyi Değiştir</button>
                    </div>
                  </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>