<?php
	/*Validates the form content and then mails the content to contact@lifewin.co */
	// Just change the email id in the $email variable to whatever necessary
	
	// The mailer folder is added for the PHP Mailer Class which is required for sending mail 
	// So all the files in mailer folder are for the same purpose
	
	require 'mailer/PHPMailerAutoload.php';
	
	if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['query'])){
		die(msg(0,"Fill in all the fields."));
	}
	$name = strip_tags($_POST['name']);
	$email = strip_tags($_POST['email']);
	$query = strip_tags($_POST['query']);
	$target = "contact@lifewin.co";
	
				$mail = new PHPMailer;
		    	$mail->SetFrom($email, $name);
				$mail->addAddress($target,"Life Win");
				$mail->isHTML(true); 
				$mail->Subject = 'Query Mail from '.$name;
				$mail->Body = $query;
				if($mail->send()) { 
					die(msg(0,'Please check your mail'));
				}else{
						echo (msg(0,"There was a problem sending the mail.Please try again"));
				} 
	
	function msg($status,$txt){
		return '{"status":'.$status.',"txt":"'.$txt.'"}';
	}
?>