<?php
SESSION_START();
OB_START();
include 'baglan.php';

if(isset($_POST["image"]))
{
	$data = $_POST["image"];
	$image_array_1 = explode(";", $data);
	$image_array_2 = explode(",", $image_array_1[1]);
	$data = base64_decode($image_array_2[1]);
	$imageName = 'assets/images/' . time() . '.png';
	file_put_contents($imageName, $data);
	echo $imageName;
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `resim`=? WHERE `kart_id`=?");
$guncelle ->execute(array($imageName,$kart_id));
}
?>