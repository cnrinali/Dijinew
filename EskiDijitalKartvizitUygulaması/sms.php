<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">TOPLU SMS</h5>
<?php
extract($_POST);
if(empty($_POST)){
?>
              <form action="" method="POST" class="row g-3">
                <div class="col-12">
				  <label class="form-check-label">
                   Alıcı Seç
                  </label>
                    <select name="kisi" class="form-select" id="floatingSelect" aria-label="State">
                      <option value="0">Herkese Gönder</option>
<?php
$urun = $baglan->prepare("SELECT * FROM `kartvizit` WHERE `durum`='1'");
$urun ->execute();
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
$isim		=$u["isim"];
$soyisim	=$u["soyisim"];
$gsm	=$u["gsm"];
?>
<option value="<?php echo"$gsm";?>"><?php echo"$isim $soyisim";?></option>
<?php 
}
?>
                    </select>
                </div>
                <div class="col-12">
                  <label for="inputAddress" class="form-label">Sms İçeriği</label>
                  <textarea name="mesaj" class="form-control" style="height: 100px"></textarea>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-dark">Gönder</button>
                </div>
              </form>
<?php 
}else{
if($kisi =="0"){
	
$urun = $baglan->prepare("SELECT * FROM `kartvizit` WHERE `gsm` !='05000000000' ");
$urun ->execute();
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
$telefon =$u["gsm"];
$telefonlar ="$telefon,";
	$curl = curl_init();
	curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://api.netgsm.com.tr/sms/send/get',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('usercode' => '8503089932','password' => 'y4.6CFM3','gsmno' => ''.$telefonlar.'','message' => ''.$mesaj.'','msgheader' => '8503089932','filter' => '0','dil' => 'TR'),
));

$response = curl_exec($curl);
curl_close($curl); 
}

}else{
	
 	$curl = curl_init();
	curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://api.netgsm.com.tr/sms/send/get',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('usercode' => '8503089932','password' => 'y4.6CFM3','gsmno' => ''.$kisi.'','message' => ''.$mesaj.'','msgheader' => '8503089932','filter' => '0','dil' => 'TR'),
));

$response = curl_exec($curl);
curl_close($curl);

}
$sonuc = substr($response, 0, 2);
if($sonuc =='00'){
echo'
<div align="center"><h3>SMS Gönderimi Başarılıdır.</h3> 
<a href="sms"><button type="button" class="btn btn-dark">Geri Dön</button></a></div>
';
}else{
echo'
<div align="center"><h3>SMS Gönderimi Sırasında Hata Oluştu.</h3> 
<a href="sms"><button type="button" class="btn btn-dark">Geri Dön</button></a></div>
';
}
}
?>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>