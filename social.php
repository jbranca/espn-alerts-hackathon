<?php

require_once 'lib/Alerts/Facebook.php';

$alertsFacebook = new Alerts_Facebook();

$facebookUser = $alertsFacebook->facebook->getUser();

if ($facebookUser) {
	try {
		$userProfile = $alertsFacebook->facebook->api('/me');
	} catch (FacebookApiException $e) {
		$facebookUser = null;
	}
}

if ($facebookUser) {
	$facebookUrl = $alertsFacebook->facebook->getLogoutUrl();
} else {
	$facebookUrl = $alertsFacebook->facebook->getLoginUrl();
}

?>
<!doctype html>
<html>
	
	<head>
		<title>Alerts 2.0</title>
		<meta name="HandheldFriendly" content="true" />
		<meta name="MobileOptimized" content="320"/>
		<meta name="viewport" id="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
		<link href="vendor/bootstrap-2.2.2/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
		<link rel='stylesheet' href='vendor/bootstrap-2.2.2/css/bootstrap-responsive.min.css'/>
		<link rel='stylesheet' href='css/common.css'>
		<link rel='stylesheet' href='http://a.espncdn.com/combiner/c?v=52&css=m/reset.css,m/fonts.css,m/base.css,m/layout/body.css,m/layout/navigation.css'/>
		<script src="vendor/js/handlebars-1.0.rc.1.js" type="text/javascript"></script>
		<script type="text/javascript" src="vendor/jquery-1.8.3.min.js"></script>
		<script src="vendor/js/jquery.pubsub.js" type="text/javascript"></script>
		<script src="js/common.js" type="text/javascript"></script>
		<script src="js/scoreUpdater.js" type="text/javascript"></script>
		<script type="text/javascript">
			$(document).ready(function() {

				espnAlerts.init();
				var loggedInFacebook = <?php echo $facebookUser; ?> > 0;
				var teamWinning = null;
				var lastDescription = null;

				function postFacebookWall(message)
				{
					$.ajax({
						type: 'POST',
						url: '/espn-alerts-hackathon/send-facebook-alert.php',
						data: 'message=' + message,
						success: function(data) {}
					})
				}

				function ordinal(number)
				{
					var s=["th","st","nd","rd"],
					v=number%100;
					return number+(s[(v-20)%10]||s[v]||s[0]);
				}

				$.subscribe("/score/update", function( e, data ) {
					if (loggedInFacebook == true) {
						currentScore = espnAlerts.getCurrentScore( data )

						description = '';

						homeTeam = data.competitors[0].team;
						awayTeam = data.competitors[1].team;
						homeScore = data.competitors[0].score;
						awayScore = data.competitors[1].score;

						postDescription = false;

						if (homeScore > awayScore
								&& homeTeam.id != teamWinning) {
							teamWinning = homeTeam.id;
							postDescription = true;
							description = homeTeam.location + ' ' + homeTeam.name
								+ ' have taken the lead over the ' + awayTeam.location
								+ ' ' + awayTeam.name + ' ' + homeScore
								+ ' - ' + awayScore;
						} else if (awayScore > homeScore
								&& awayTeam.id != teamWinning) {
							teamWinning = awayTeam.id;
							postDescription = true;
							description = awayTeam.location + ' ' + awayTeam.name
								+ ' have taken the lead over the ' + homeTeam.location
								+ ' ' + homeTeam.name + ' ' + awayScore
								+ ' - ' + homeScore;
						}

						if (postDescription == true) {
							description += ' with ' + data.clock + ' left in '
								+ ordinal(currentScore.period) + ' Quarter';

							postFacebookWall(description);

							$('.twitter-share-button').attr('data-text', description);
						}
					}
				});

				$.subscribe("/score/firstTime", function( e, competition ) {
					if (loggedInFacebook == true) {

						description = 'is now following the '
							+ competition.competitors[1].team.location
							+ ' ' + competition.competitors[1].team.name
							+ ' vs. ' + competition.competitors[0].team.location
							+ ' ' + competition.competitors[0].team.name
							+ ' game';

						postFacebookWall(description);
					}
				});
			});
		</script>
	</head>
	<body class="ncaa">
		<div id="container">
			<div id='nav'>
				<nav id="nav-bd">
					<ul>
						<li><a class="espnlogo" href="/index.html"><h1 class="nav-title">ESPN</h1></a>
						</li>
						<li class="sport-title"><a class="ellipsis" href="/ncb/"><strong>Alerts 2.0</strong></a></li>
					</ul>
				</nav>
			</div>
			<div id="content" class="clearfix"> 
				<div class="left-column-wrap col">
					<div id='left-column' class='col'>
						<div id="header" style="height:72px;"></div>
						<div style="clear:both;margin-bottom:15px;"></div>
						
						<img src="https://dl.dropbox.com/u/27261483/Work/Hackathon%20-%20Alerts%202.0/klout.png">
					</div>
					<br>
					<div id='left-column' class='col'>
						<div class='mod-wrap mod-news'>
							<form method="POST">
								<div style="margin-top: 15px;">
								<?php if (! $facebookUser): ?>
									<a href="<?php echo $facebookUrl; ?>"><div style="width:150px;height:20px; background: url('image/facebook_signin.png'); background-position: 150px 185px;"></div></a>
								<?php endif; ?>
								</div>
								<div style="margin-top: 15px;">
									<a href="https://twitter.com/share" class="twitter-share-button" data-lang="en" data-count="none" data-size="large">Tweet Last</a>
								</div>
								<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>