<?php

class Facebook 
{
	public function __construct()
	{}

	public function sendMail($message)
	{
		mail('jbranca@facebook.com', 'Subject', $message, "From: john.branca@gmail.com");

		echo 'Email Sent';

	}
}