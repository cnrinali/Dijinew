<?php 
SESSION_START();
OB_START();
require("baglan.php");
$siparis_id =$_GET["siparis_id"];
$urun = $baglan->prepare("SELECT * FROM  `kartvizit` WHERE `durum` ='0' limit 0,1");
$urun ->execute();
$kartim = $urun->fetch(PDO::FETCH_ASSOC);
$kart_id = $kartim["kart_id"];


 header('location: aktivasyon?kart_id='.$kart_id.'&siparis_id='.$siparis_id.'');

require 'footer.php';
?>