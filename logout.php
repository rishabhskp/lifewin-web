<!-- Logout File That gets executed on clicking logout in the menu - Destroys the session and redirects to index.php -->
<?php 
session_start();
session_destroy();
header("Location: index.php");
die();
?>