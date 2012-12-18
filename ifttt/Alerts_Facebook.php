<?php

require_once 'facebook-php-sdk/src/facebook.php';

class Alerts_Facebook 
{
    const APP_ID = '259665347494601';
    const APP_SECRET = '78c9a12d5aff0a2a36823cfee529e18d';

    public function __construct()
    {
        $this->facebook = new Facebook(array(
            'appId'  => self::APP_ID,
            'secret' => self::APP_SECRET,
            'cookie' => true
        ));
    }

    public function postWall($message)
    {
        $userId = $this->facebook->getUser();

        $parameters = array(
            'access_token'  => $this->facebook->getAccessToken(),
            'message'       => $message,
            'from'          => self::APP_ID,
            'to'            => $userId
        );

        $this->facebook->api("/" . $userId . "/feed", "post", $parameters);
    }
}