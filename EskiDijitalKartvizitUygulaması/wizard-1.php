<?php 
include 'businessheader.php';
$kart_id		=$_GET["kart_id"];
?>
  <main id="kapsa" class="kapsa">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				  <h5 class="card-title" Style="color:#000;">FİRMA BİLGİLERİ</h5>
<?php
extract($_POST);
if(empty($_POST)){
?>				
<form name="form" action="" method="POST">
<input name="kartid" type="hidden" value="<?php echo"$kart_id";?>">
				<div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Firma Ünvanı</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="firma" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Vergi Dairesi</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="vergidairesi" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Vergi Numarası</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="vergino" type="number" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Adres</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="adres" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
    </form>
	                   	<br>
				   <div class="text-center"><a href="wizard-2?kart_id=<?php echo"$kart_id";?>"><button class="btn btn-light" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
<?php 
}else{
$tarih 		=date('d.m.Y',time());
$sql = $baglan->prepare("INSERT INTO `kurumsal` SET kart_id=?,firma=?,vergidairesi=?,vergino=?,adres=? ");
$kayit = $sql ->execute(array($kart_id,$firma,$vergidairesi,$vergino,$adres));

if (isset ($kayit)){
?>
<div align="center">
<h3>Firma Bilgileriniz Oluşturuldu.</h3> <br><br>
<a href="wizard-2?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
</div>

<?php
}else{
?>
<div align="center"><h3>İşlem Başarısız Lütfen Geri Tuşuna Basıp Eksikleri Gideriniz.</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}?>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
<?php include 'footer.php';?>