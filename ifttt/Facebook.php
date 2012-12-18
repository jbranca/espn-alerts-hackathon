<?php

class Facebook 
{
	public function __construct()
	{}

	public function sendMail($message)
	{
		mail('jbranca@facebook.com', 'Subject', $message, "From: alerts2.0@espn.com");

		echo 'Email Sent';

	}
}