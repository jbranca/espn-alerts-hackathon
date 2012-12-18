<?php

require_once 'facebook-php-sdk/src/facebook.php';

class Alerts_Facebook 
{
	const APP_ID = '259665347494601';
	const APP_SECRET = '78c9a12d5aff0a2a36823cfee529e18d';

	public function __construct()
	{
		return new Facebook(array(
			'appId'  => self::APP_ID,
			'secret' => self::APP_SECRET,
			'cookie' => true
		));
	}
}