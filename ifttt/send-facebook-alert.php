<?php

require_once 'Alerts_Facebook.php';

$message = $_POST['message'];

$facebook = new Alerts_Facebook();
$facebook->postWall($message);