<?php
/* DENEME SÜRESİ KONTROL */
$bugun 		=date('d.m.Y',time());
$baslangicTarihi = strtotime("$bugun"); 
$bitisTarihi = strtotime("25.04.2023");
/* $fark = ($bitisTarihi - $baslangicTarihi) / 86400; */

if($bitisTarihi < $baslangicTarihi){
echo"Bugün Büyük";
}else{
echo"Bugün Küçük";
}
/* DENEME SÜRESİ KONTROL */
?>