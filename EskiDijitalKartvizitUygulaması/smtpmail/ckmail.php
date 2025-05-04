<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv="Content-Language" content="tr">
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-9" />
<script language="javascript">
function kapat(){window.close()}
</script>
</head>
<?php
require("class.phpmailer.php");
require("../database.php");
$firma 				="çöişüğıÇÖİŞÜĞI";
$konu				="çöişüğıÇÖİŞÜĞI";
$mesaj	="çöişüğıÇÖİŞÜĞI";

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth = true;
$mail->Host     = "mail.site.com";
$mail->Port     = "587";
$mail->Username = "info@site.com";
$mail->Password = "sifre";
$mail->SetFrom($mail->Username, "$firma");
$mail->AddAddress("mail adresi taz"); 
$mail->AddCC("ikinci mail adresi yaz");
$mail->CharSet = "UTF-8";
$mail->Subject = "$konu";
$mail->MsgHTML("$mesaj");
if($mail->Send()) {
echo'<div align="center"><font face="Cambria" size="5" color="#000000"><img src="../image/success-icon.png"><br><br>Mail Gonderildi</font><br><br>';
echo'<input type="button" value="Kapat!" onclick="kapat()"></div>';
} else {
   echo "Mailer Error: " . $mail->ErrorInfo;
} 
?>