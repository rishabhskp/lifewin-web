<?php
// Required in functions.php file to connect to the db

//Dublicate file. Need to be sorted later.
$db = mysql_connect("localhost", "lifewafb", "1password") or die("Error: Could not connect to the database.");
mysql_select_db("lifewafb_app", $db);
?>