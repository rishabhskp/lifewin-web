<?php
/*This authenticates whether the user has logged in by checking the presence of the session id and also checks whether he is in app.php file*/
/*If either of them are false then the user would remain in index.php*/
@session_start();
if(isset($_SESSION['userId']) and $_SERVER["PHP_SELF"] != '/app.php') {
    header('location: app.php');
    die();
}

?>
