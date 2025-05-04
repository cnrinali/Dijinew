<?php
SESSION_START();
OB_START();
include 'baglan.php';
function isMobile () {
  return is_numeric(strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "mobile"));
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Language" content="en">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title><?php echo"$title";?></title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
<meta name="msapplication-tap-highlight" content="no">
<link rel="canonical" href="<?php echo $_SERVER['SERVER_NAME'];?>" />
<link rel="next" href="<?php echo $_SERVER['SERVER_NAME'];?> />
<meta property="og:title" content="<?php echo"$title";?>" />
<meta property="og:description" content="<?php echo"$description";?>" />
<meta property="og:url" content="<?php $_SERVER['SERVER_NAME'];?>" />
<meta property="og:site_name" content="<?php echo"$title";?>" />
<meta property="og:image" content="<?php echo"$logo";?>" />
<link href="assets/img/logosiyah.png" rel="icon">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/css/style.css?v=0.0014" rel="stylesheet">
</head>
<body>
<header id="header" class="fixed-top">
<div class="card-body" style="margin-top:15px;">
<img src="assets/img/logosiyah.png" style="max-height:50px;" class="img-fluid">
</div>
</header>