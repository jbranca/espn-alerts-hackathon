<?php

require_once 'Facebook.php';

$facebook = new Facebook();

$facebookUser = $facebook->getUser();

if ($facebookUser) {
	try {
		$userProfile = $facebook->api('/me');
	} catch (FacebookApiException $e) {
		$facebookUser = null;
	}
}

if ($facebookUser) {
	$facebookUrl = $facebook->getLogoutUrl();
} else {
	$facebookUrl = $facebook->getLoginUrl();
}

?>

<html>
	<head>
		<title>Social</title>
		<link href="../vendor/bootstrap-2.2.2/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="../vendor/jquery-1.8.3.min.js"></script>
		<script type="text/javascript">
			Alerts = {
				init: function()
				{
					var self = this;

					self.apiUrl = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/events/323530012';
					self.apiKey = 'k63bb77qjahygsjepf5qu7de';

					window.setTimeout(self.poll, 10000);
				},
				poll: function()
				{
					$.ajax({
						type: 'GET',
						url: self.apiUrl + '?apikey=?' + self.apiKey;
						success: function(response) {

						},
					})
				}
			};
		</script>
	</head>
	<body>
		<div class="container">
			<?php if ($facebookUser): ?>
			<div><a href="<?php echo $facebookUrl; ?>">Logout of Facebook</a></div>
			<?php else: ?>
			<div><a href="<?php echo $facebookUrl; ?>">Login with Facebook</a></div>
			<?php endif; ?>

			<form method="POST" action="send-alert.php">
				<textarea name="message">Example Text</textarea>
				<button type="submit" class="btn btn-primary">Send to Facebook</button>
				<button type="submit" class="btn btn-primary">Send to Twitter</button>
				<button type="submit" class="btn btn-primary">Send to Klout</button>
			</form>
		</div>
	</body>
</html>