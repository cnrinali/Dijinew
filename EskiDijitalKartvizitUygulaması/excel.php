<?php 
// Load the database configuration file 
$url = 'https://'.$_SERVER['SERVER_NAME'];
// Database configuration 
$dbHost     = "localhost"; 
$dbUsername = "hupdijit_bayikart"; 
$dbPassword = "21082008.Ck"; 
$dbName     = "hupdijit_bayikart"; 
 
// Create database connection 
$baglan = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName); 
 
// Check connection 
if ($baglan->connect_error) { 
    die("Connection failed: " . $baglan->connect_error); 
}

 
// Filter the excel data 
function filterData(&$str){ 
    $str = preg_replace("/\t/", "\\t", $str); 
    $str = preg_replace("/\r?\n/", "\\n", $str); 
    if(strstr($str, '"')) $str = '"' . str_replace('"', '""', $str) . '"'; 
} 
 
// Excel file name for download 
$fileName = "pasif_kart_" . date('Y-m-d') . ".xls"; 
 
// Column names 
$fields = array('KART ID','BAYI ADI','QR KOD'); 
 
// Display column names as first row 
$excelData = implode("\t", array_values($fields)) . "\n"; 
 
// Fetch records from database 

$urun = $baglan->query("SELECT * FROM  `kartvizit` WHERE `durum` ='0'");
if($urun->num_rows > 0){
while($row = $urun->fetch_assoc()){
$bayi_id	= $row['bayi_id'];
$kart_id	= $row['kart_id'];
$resim = "https://chart.googleapis.com/chart?cht=qr&chl=$url/demo/index.php?kart_id=$kart_id&chs=160x160&chld=L|0";

$bayim = mysqli_query($baglan,"SELECT * FROM  `bayi` WHERE `id` ='$bayi_id'");
$bay = mysqli_fetch_array($bayim);
$bayiadim = $bay["bayi_adi"];

	$lineData = array($kart_id, $bayiadim, $resim); 
	array_walk($lineData, 'filterData'); 
	$excelData .= implode("\t", array_values($lineData)) . "\n";
}
}else{ 
    $excelData .= 'No records found...'. "\n"; 
}

 
// Headers for download 
header("Content-Type: application/vnd.ms-excel"); 
header("Content-Disposition: attachment; filename=\"$fileName\""); 
 
// Render excel data 
echo $excelData; 
 
exit;
?>