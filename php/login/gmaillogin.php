<?php
//Default Login with Google code, with credentials of our app
require 'functions.php';  //SQL Statements witten by us to add users Facebook/Gmail login data to database.
########## Google Settings.. Client ID, Client Secret from https://cloud.google.com/console #############
$google_client_id 		= '688650382676-crn4lsfiehqnfpiqf4gkkqgmufm89k8a.apps.googleusercontent.com';
$google_client_secret 	= 'Hozb2NeBFrYKQtORvIu7Oq_3';
$google_redirect_url 	= 'http://www.lifewin.co/php/login/gmaillogin.php'; //path to your script
$google_developer_key 	= 'AIzaSyBJwKUHsL96OZ9eJYvwyCpFLZBZBkWMFH8';
$access_type = 'offline';
$approval_prompt = 'force';

//include google api files
require_once 'Google_Client.php';
require_once 'contrib/Google_Oauth2Service.php';

//start session
session_start();

$gClient = new Google_Client();
$gClient->setApplicationName('LifeWin App');
$gClient->setClientId($google_client_id);
$gClient->setClientSecret($google_client_secret);
$gClient->setRedirectUri($google_redirect_url);
$gClient->setAccessType($access_type);
$gClient->setApprovalPrompt($approval_prompt);
$gClient->setDeveloperKey($google_developer_key);

$google_oauthV2 = new Google_Oauth2Service($gClient);

//If user wish to log out, we just unset Session variable
if (isset($_REQUEST['reset'])) 
{
  unset($_SESSION['token']);
  $gClient->revokeToken();
  header('Location: ' . filter_var($google_redirect_url, FILTER_SANITIZE_URL)); //redirect user back to page
}

//If code is empty, redirect user to google authentication page for code.
//Code is required to aquire Access Token from google
//Once we have access token, assign token to session variable
//and we can redirect user back to page and login.
if (isset($_GET['code'])) 
{ 
	$gClient->authenticate($_GET['code']);
	$_SESSION['token'] = $gClient->getAccessToken();
	header('Location: ' . filter_var($google_redirect_url, FILTER_SANITIZE_URL));
	return;
}


if (isset($_SESSION['token'])) 
{ 
	$gClient->setAccessToken($_SESSION['token']);
}


if ($gClient->getAccessToken()) 
{
	  //For logged in user, get details from google using access token
	  $user 				= $google_oauthV2->userinfo->get();
	  $user_id 				= $user['id'];
	  $user_name 			= filter_var($user['name'], FILTER_SANITIZE_SPECIAL_CHARS);
	  $email 				= filter_var($user['email'], FILTER_SANITIZE_EMAIL);
	  $profile_url 			= filter_var($user['link'], FILTER_VALIDATE_URL);
	  $profile_image_url 	= filter_var($user['picture'], FILTER_VALIDATE_URL);
	  $personMarkup 		= "$email<div><img src='$profile_image_url?sz=50'></div>";
	  $_SESSION['token'] 	= $gClient->getAccessToken();
}
else 
{
	//For Guest user, get google login url
	$authUrl = $gClient->createAuthUrl();
}

if(isset($authUrl)) //user is not logged in, show login button
{
?>
	<script type="text/javascript">top.location.href='<?php echo $authUrl?>';</script>
<?php
	// echo '<a class="login" href="'.$authUrl.'"><img src="images/google-login-button.png" /></a>';
} 
else // user logged in 
{
	$id = $user['id'];
	$email = $user['email'];
	$uname = ($user['name']) ? $user['name'] : $user['given_name']. ' '.$user['family_name'];

	checkuser($id,$uname,$email,'gmail');
	header('Location: http://lifewin.co/app.php');
	die();
}
?>
