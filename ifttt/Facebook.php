<?php

require_once 'sendgrid-php/SendGrid_loader.php';

class Facebook 
{
	private $sendgrid;

	public function __construct()
	{
		$this->sendgrid = new SendGrid('jbranca', 'chowthis');
	}

	public function sendMail()
	{
		$mail = new SendGrid\Mail();
		$mail->addTo('jbranca@facebook.com')
			->setFrom('alerts2.0@espn.com')
			->setSubject('Gunt')
			->setText('hey')
			->setHtml('<strong>Alerts</strong>');

		$this->sendgrid->web->send($mail);

		echo 'Email Sent';

	}
}