<?php

require_once 'Facebook.php';

$message = $_POST['message'];

$facebook = new Facebook();
$facebook->sendMail($message);