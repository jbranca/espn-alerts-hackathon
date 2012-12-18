<?php

require_once 'sendgrid-php/SendGrid_loader.php';

class Facebook 
{
	private $sendgrid;

	public function __construct()
	{
		$this->sendgrid = new SendGrid('jbranca', 'chowthis');
	}

	public function sendMail($message)
	{
		$mail = new SendGrid\Mail();
		$mail->addTo('john.branca@gmail.com')
			->setFrom('alerts2.0@espn.com')
			->setSubject('Gunt')
			->setText($message)
			->setHtml($message);

		$this->sendgrid->smtp->send($mail);

		echo 'Email Sent';

	}
}