<?php
   //Creating a DateTime object
   $date1 = date_create("26.03.2023");
   $date2 = date_create("04.04.2023");
   $interval = date_diff($date1, $date2);
   $hesapla = $interval->format('%d') ;
if($hesapla > "7"){
echo"Süre Doldu $hesapla";
}else{
echo"Süre Var $hesapla";	
}
?>