<?php

require_once 'lib/Alerts/Facebook.php';

$message = $_POST['message'];

$facebook = new Alerts_Facebook();
$facebook->postWall($message);