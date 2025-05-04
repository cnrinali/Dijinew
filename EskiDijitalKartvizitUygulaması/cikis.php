<?php
session_start();
session_destroy(); // Bu Fonksiyon ile tüm Session siliyoruz.
echo "<script>location.href='yonetim';</script>";

setcookie("kullanici", $kullanici, time()-3600*24*24*24);
setcookie("sifre", $sifre, time()-3600*24*24*24);
echo "<script>location.href='yonetim';</script>";

/* LOG */
require("baglan.php");
$tarih 		=date('d.m.Y',time());
$islem ="$kullanici Adlı Kullanıcı Çıkış Yaptı";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array('1',$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

unset($_COOKIE["kullanici"]);
unset($_COOKIE["sifre"]);
?>