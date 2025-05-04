<?php
$database_host = "localhost";
$database_user = "kripto13_dijikart";
$database_name = "kripto13_dijikart";
$database_pass = "Sifre.1234";

try {
    $baglan = new PDO("mysql:host=$database_host;dbname=$database_user;charset=utf8", $database_name, $database_pass);
    $baglan->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
catch(PDOException $e)
    {
    echo "Bağlantı hatası: " . $e->getMessage();
    }
require("config.php");
?>