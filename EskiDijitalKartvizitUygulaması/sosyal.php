<?php 
include 'header.php';
extract($_POST);
?>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js"></script>
<script>
$(function(){
    $("#sosyal").change(function(){
        if($(this).val() == "whatsapp"){
            $("#whatsapp").show();
        }else{
			$("#whatsapp").hide();
		}
		
        if($(this).val() == "facebook"){
            $("#facebook").show();
        }else{
			$("#facebook").hide();
		}
		
        if($(this).val() == "instagram"){
            $("#instagram").show();
        }else{
			$("#instagram").hide();
		}
		
		if($(this).val() == "twitter"){
            $("#twitter").show();
        }else{
			$("#twitter").hide();
		}
		
		if($(this).val() == "telegram"){
            $("#telegram").show();
        }else{
			$("#telegram").hide();
		}
		
        if($(this).val() == "linkedin"){
            $("#linkedin").show();
        }else{
			$("#linkedin").hide();
		}
		
        if($(this).val() == "youtube"){
            $("#youtube").show();
        }else{
			$("#youtube").hide();
		}
		
        if($(this).val() == "skype"){
            $("#skype").show();
        }else{
			$("#skype").hide();
		}
		
        if($(this).val() == "wechat"){
            $("#wechat").show();
        }else{
			$("#wechat").hide();
		}
		
        if($(this).val() == "snapchat"){
            $("#snapchat").show();
        }else{
			$("#snapchat").hide();
		}
		
        if($(this).val() == "sahibinden"){
            $("#sahibinden").show();
        }else{
			$("#sahibinden").hide();
		}
		
        if($(this).val() == "hepsiemlak"){
            $("#hepsiemlak").show();
        }else{
			$("#hepsiemlak").hide();
		}
		
        if($(this).val() == "arabam"){
            $("#arabam").show();
        }else{
			$("#arabam").hide();
		}
		
		if($(this).val() == "letgo"){
            $("#letgo").show();
        }else{
			$("#letgo").hide();
		}
		
		if($(this).val() == "pinterest"){
            $("#pinterest").show();
        }else{
			$("#pinterest").hide();
		}
		
		if($(this).val() == "tiktok"){
            $("#tiktok").show();
        }else{
			$("#tiktok").hide();
		}
		
		if($(this).val() == "link"){
            $("#link").show();
        }else{
			$("#link").hide();
		}	
		
		if($(this).val() == "whatsappkatalog"){
            $("#whatsappkatalog").show();
        }else{
			$("#whatsappkatalog").hide();
		}
		if($(this).val() == "hepsiburada"){
            $("#hepsiburada").show();
        }else{
			$("#hepsiburada").hide();
		}
		
		if($(this).val() == "n11"){
            $("#n11").show();
        }else{
			$("#n11").hide();
		}
		
		if($(this).val() == "trendyol"){
            $("#trendyol").show();
        }else{
			$("#trendyol").hide();
		}
		
		if($(this).val() == "amazon"){
            $("#amazon").show();
        }else{
			$("#amazon").hide();
		}
		
		if($(this).val() == "ptt"){
            $("#ptt").show();
        }else{
			$("#ptt").hide();
		}
		
		if($(this).val() == "ciceksepeti"){
            $("#ciceksepeti").show();
        }else{
			$("#ciceksepeti").hide();
		}
	
    });
    $("#whatsapp").hide(); 
    $("#facebook").hide();
    $("#instagram").hide();
    $("#twitter").hide();
    $("#telegram").hide();
    $("#linkedin").hide();
    $("#youtube").hide();
    $("#skype").hide();
    $("#wechat").hide();
    $("#snapchat").hide();
    $("#sahibinden").hide();
    $("#hepsiemlak").hide();
    $("#arabam").hide();
    $("#letgo").hide();
    $("#pinterest").hide();
    $("#tiktok").hide();
    $("#link").hide();
    $("#whatsappkatalog").hide();
	$("#n11").hide();
    $("#trendyol").hide();
    $("#hepsiburada").hide();
    $("#amazon").hide();
    $("#ptt").hide();
    $("#ciceksepeti").hide();
});

</script>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" Style="color:#000;">SOSYAL AĞ & PAZARYERİ BİLGİLERİNİZ</h5>
<?php
if($yetki =='1'){
?>

              <table class="table table-borderless datatable">
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Platform</th>
                        <th scope="col">Hesap</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kullanicibul->execute();
while ($listele	= $kullanicibul->FETCH(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
$urun_listele 	= $baglan->prepare("SELECT * FROM  `sosyal_medya` WHERE`kart_id` =?");
$urun_listele->execute(array($kart_id));
while ($row 	= $urun_listele->FETCH(PDO::FETCH_ASSOC)){
$hesap			= $row["hesap"];
$sosyal			= $row["sosyal"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$sosyal";?></td>
                        <td><?php echo"$hesap";?></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<h1>
						<a href="sosyalsil?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Resim Silinecektir Onaylıyor Musunuz?')"><i class="bx bx-trash"></i></a>
						<a href="sguncelle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						</h1>
						<?php }?>
						</td>
					 </tr>
<?php
}
}
}
?>
                  </table>
<?php
}elseif($yetki =='0'){
?>

                  <table class="table table-borderless" style="font-size:9pt;">
                      <tr>
<?php if($paket !=="1"){ ?>
                        <th scope="col">İsim Soyisim</th>
<?php }?>
                        <th scope="col">Platform</th>
                        <th scope="col">Hesap</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul->execute(array($uye_id));
while($listele		=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
$urun_listele 	= $baglan->prepare("SELECT * FROM  `sosyal_medya` WHERE`kart_id` =?");
$urun_listele->execute(array($kart_id));
while ($row 	= $urun_listele->FETCH(PDO::FETCH_ASSOC)){
$hesap			= $row["hesap"];
$sosyal			= $row["sosyal"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
<?php if($paket !=="1"){ ?>
                        <td><?php echo"$isim $soyisim";?></td>
<?php }?>
                        <td><?php echo ucfirst($sosyal);?></td>
                        <td><?php echo"$hesap";?></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<h1>
						<a href="sosyalsil?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Resim Silinecektir Onaylıyor Musunuz?')"><i class="bx bx-trash"></i></a>
						<a href="sguncelle?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						</h1>
						<?php }?>
						</td>
					 </tr>
<?php 
}
}
}
}
?>
                  </table>
				  <h5 class="card-title" Style="color:#000;">SOSYAL AĞ & PAZARYERİ EKLE</h5>
<?php 
extract($_POST);
if(empty($_POST)){
?>
<form name="form" action="" method="POST">
												<?php 
						if($uye_id =="112"){}else{
						?>
    
	<?php 
						}
if($yetki =='1'){
?>
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Kartvizit Seç</b></label>
                      <div class="col-md-8 col-lg-9">
            <select name="kart_id[]" id="multiple-checkboxes" multiple="multiple" class="form-control" required>

			<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kullanicibul	->execute();
while($listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
			?>
			<option value="<?php echo"$kart_id";?>"><?php echo"$isim $soyisim";?></option>
<?php }?>
			</select>
                       </div>
                    </div>
<?php
}elseif($yetki =='0'){
if($paket =='1'){
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul	->execute(array($uye_id));
$listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
?>
<input name="kart_id[]" type="hidden" value="<?php echo"$kart_id";?>">
<?php 
}else{
?>
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Kartvizit Seç</b></label>
                      <div class="col-md-8 col-lg-9">
            <select name="kart_id[]" id="multiple-checkboxes" multiple="multiple" class="form-control" required>

			<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul	->execute(array($uye_id));
while($listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
			?>
			<option value="<?php echo"$kart_id";?>"><?php echo"$isim $soyisim";?></option>
<?php }?>
			</select>
                       </div>
                       </div>
<?php
}
}
?>
<div class="row mb-3">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Sosyal Ağ & Pazaryeri Seç</b></label>
<div class="col-md-8 col-lg-9">
<select name="sosyal" id="sosyal" class="form-control">
<option value="">Seçim Yapın</option>
<option value="whatsapp">Whatsapp</option>
<option value="facebook">Facebook</option>
<option value="instagram">Instagram</option>
<option value="twitter">Twitter</option>
<option value="telegram">Telegram</option>
<option value="linkedin">Linkedin</option>
<option value="youtube">Youtube</option>
<option value="skype">Skype</option>
<option value="wechat">Wechat</option>
<option value="snapchat">Snapchat</option>
<option value="sahibinden">Sahibinden</option>
<option value="hepsiemlak">Hepsiemlak</option>
<option value="arabam">Arabam.com</option>
<option value="letgo">Letgo</option>
<option value="n11">N11</option>
<option value="hepsiburada">Hepsiburada</option>
<option value="trendyol">Trendyol</option>
<option value="amazon">Amazon</option>
<option value="ptt">PTT Avm</option>
<option value="ciceksepeti">Çiçek Sepeti</option>
<option value="pinterest">Pinterest</option>
<option value="tiktok">Tiktok</option>
<option value="link">Web Site</option>
<option value="whatsappkatalog">Whatsapp İşletme Kataloğunuz</option>
</select>
</div>
</div>
<div class="row mb-3" id="whatsapp">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Whatsapp</label>
<div class="col-md-8 col-lg-9">
<input name="whatsapp" type="text" class="form-control" placeholder="Örnek : 05001002020">
</div>
</div>
					
<div class="row mb-3" id="facebook">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Facebook</label>
<div class="col-md-8 col-lg-9">
<input name="facebook" type="text" class="form-control" placeholder="https://www.facebook.com/ kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="twitter">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Twitter</b></label>
<div class="col-md-8 col-lg-9">
<input name="twitter" maxlength="255" type="text" class="form-control" placeholder="https://twitter.com/ kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="instagram">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">İnstagram</b></label>
<div class="col-md-8 col-lg-9">
<input name="instagram" maxlength="255" type="text" class="form-control" placeholder="https://www.instagram.com/ kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="telegram">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Telegram</b></label>
<div class="col-md-8 col-lg-9">
<input name="telegram" maxlength="255" type="text" class="form-control" placeholder="https://web.telegram.org/k/#@ kısmından sonra ki kullanıcı adını yazınız"         >
</div>
</div>

<div class="row mb-3" id="linkedin">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Linkedin</b></label>
<div class="col-md-8 col-lg-9">
<input name="linkedin" maxlength="255" type="text" class="form-control" placeholder="https://www.linkedin.com/ kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="youtube">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Youtube</b></label>
<div class="col-md-8 col-lg-9">
<input name="youtube" maxlength="255" type="text" class="form-control" placeholder="https://www.youtube.com/ kısmından sonra ki bölümü yazınız">
</div>
</div>

<div class="row mb-3" id="skype">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Skype</b></label>
<div class="col-md-8 col-lg-9">
<input name="skype" maxlength="255" type="text" class="form-control" placeholder="live: kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="wechat">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Wechat</b></label>
<div class="col-md-8 col-lg-9">
<input name="wechat" maxlength="255" type="text" class="form-control" placeholder="Wechat Profil Linkinizi yazınız">
</div>
</div>

<div class="row mb-3" id="snapchat">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Snapchat</b></label>
<div class="col-md-8 col-lg-9">
<input name="snapchat" maxlength="255" type="text" class="form-control" placeholder="Snapchat kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="sahibinden">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Sahibinden</b></label>
<div class="col-md-8 col-lg-9">
<input name="sahibinden" maxlength="255" type="text" class="form-control" placeholder="Sahibinden Mağaza Sayfa Adresinizi Yazınız">
</div>
</div>

<div class="row mb-3" id="hepsiemlak">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Hepsi Emlak</b></label>
<div class="col-md-8 col-lg-9">
<input name="hepsiemlak" maxlength="255" type="text" class="form-control" placeholder="Hepsi Emlak Mağaza Sayfa Adresinizi Yazınız">
</div>
</div>

<div class="row mb-3" id="arabam">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Arabam.com</b></label>
<div class="col-md-8 col-lg-9">
<input name="arabam" maxlength="255" type="text" class="form-control" placeholder="Arabam.com Mağaza Sayfa Adresinizi Yazınız">
</div>
</div>

<div class="row mb-3" id="letgo">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Letgo</b></label>
<div class="col-md-8 col-lg-9">
<input name="letgo" maxlength="255" type="text" class="form-control" placeholder="Letgo Mağaza Sayfa Adresinizi Yazınız">
</div>
</div>

<div class="row mb-3" id="n11">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">N11</b></label>
<div class="col-md-8 col-lg-9">
<input name="n11" maxlength="255" type="text" class="form-control" placeholder="N11 Mağaza Sayfa Adını Yazınız">
</div>
</div>

<div class="row mb-3" id="trendyol">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Trendyol</b></label>
<div class="col-md-8 col-lg-9">
<input name="trendyol" maxlength="255" type="text" class="form-control" placeholder="Trendyol Mağaza Sayfa Adını Yazınız">
</div>
</div>

<div class="row mb-3" id="hepsiburada">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Hepsiburada</b></label>
<div class="col-md-8 col-lg-9">
<input name="hepsiburada" maxlength="255" type="text" class="form-control" placeholder="Hepsiburada Mağaza Sayfa Adını Yazınız">
</div>
</div>

<div class="row mb-3" id="amazon">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Amazon</b></label>
<div class="col-md-8 col-lg-9">
<input name="amazon" maxlength="255" type="text" class="form-control" placeholder="Ör: https://www.amazon.com.tr/s?me=A221FNQUWGU65G">
</div>
</div>

<div class="row mb-3" id="ptt">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Ptt Avm</b></label>
<div class="col-md-8 col-lg-9">
<input name="ptt" maxlength="255" type="text" class="form-control" placeholder="PTT AVM Mağaza Sayfa Adresinizi Yazınız">
</div>
</div>

<div class="row mb-3" id="ciceksepeti">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Çiçek Sepeti</b></label>
<div class="col-md-8 col-lg-9">
<input name="ciceksepeti" maxlength="255" type="text" class="form-control" placeholder="https://www.ciceksepeti.com/ kısmından sonraki bölümü yazınız">
</div>
</div>

<div class="row mb-3" id="pinterest">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Pinterest</b></label>
<div class="col-md-8 col-lg-9">
<input name="pinterest" maxlength="255" type="text" class="form-control" placeholder="https://pinterest.com/ kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="tiktok">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Tiktok</b></label>
<div class="col-md-8 col-lg-9">
<input name="tiktok" maxlength="255" type="text" class="form-control" placeholder="https://www.tiktok.com/@ kısmından sonra ki kullanıcı adını yazınız">
</div>
</div>

<div class="row mb-3" id="whatsappkatalog">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Whataspp Katalog</label>
<div class="col-md-8 col-lg-9">
<input name="whatsappkatalog" type="text" class="form-control" id="isim"  placeholder="Örnek : https://wa.me/c/551515151555">
</div>
</div>

<div class="row mb-3" id="link">
<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Dış Bağlantı</label>
<div class="col-md-8 col-lg-9">
<input name="link" type="text" class="form-control" id="link"  placeholder="Örnek : www.dijitaco.com">
</div>
</div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
    </form>
<?php 
}else{
if($uye_id =="64"){
echo'
<div align="center"><h3>Demo Hesap İşleme Kapalıdır.<br>Lütfen Geri Dönmek İçin Tıklayınız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
}else{
$tarih 		=date('d.m.Y',time());
     $deger 		= count($_POST['kart_id']); 
     for ($i 		= 0; $i < $deger; $i++){
	 $sosyal 		= $_POST['sosyal'];
	 $sosyalhesap 	= "$whatsapp$facebook$instagram$twitter$telegram$linkedin$youtube$skype$wechat$snapchat$sahibinden$n11$amazon$ptt$ciceksepeti$trendyol$hepsiburada$hepsiemlak$arabam$letgo$pinterest$tiktok$whatsappkatalog$link";
	 $kart_id 		= $_POST['kart_id'][$i];

$sql = $baglan->prepare("INSERT INTO `sosyal_medya` SET `kart_id`=?, `hesap`=?, `sosyal`=? ");
$kayit = $sql ->execute(array($kart_id,$sosyalhesap,$sosyal));
	 }
if (isset ($kayit)){

/* LOG */
$islem ="Sosyal Medya Hesabı Eklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: sosyal');	
?>
<?php
}else{
?>
<div align="center"><h3>Sosyal Medya Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
}?>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
    <script src="assets/multiple/jquery.js?v=<?php echo"$sayilar";?>"></script>
  <link rel="stylesheet" href="assets/multiple/bootstrap.min.css?v=<?php echo"$sayilar";?>">
  <script type="text/javascript" src="assets/multiple/bootstrap.min.js?v=<?php echo"$sayilar";?>"></script>
  <script src="assets/multiple/bootstrap-multiselect.js?v=<?php echo"$sayilar";?>"></script>
  <link rel="stylesheet" href="assets/multiple/bootstrap-multiselect.css?v=<?php echo"$sayilar";?>">
<script>
    $(document).ready(function() {
        $('#multiple-checkboxes').multiselect({
          includeSelectAllOption: true,
        });
    });
</script>
<?php include 'footer.php';?>