(function($) {

	var playId = 0,
		MAX = 5, 
		homeScore = 0,
		awayScore = 0,
		clock = 0,
		homeTeamId,
		homeTeamName,
		homeTeamLocation,
		awayTeamId,
		awayTeamName,
		awayTeamLocation,
		homeTeamNickname,
		awayTeamNickname,
		homeLogo,
		awayLogo,
		alertsEnabled = true;

	$(document).ready(function() {
		
		$("#alerts-toggle").on("click", function() {
			alertsEnabled = !alertsEnabled;
			
			if(alertsEnabled) {
				$(this).text("Stop")
				.addClass("btn-danger")
				.removeClass("btn-success");
			} else {
				$(this).text("Start")
				.removeClass("btn-danger")
				.addClass("btn-success");
			}
		});

		espnAlerts.init();

		$.subscribe("/score/update", function(e, data) {
			
			var html = template(data);
			$("#header").html(template(data));
			
			if(data && data.competitors) {
				var awayTeam = data.competitors[1];
				var homeTeam = data.competitors[0];
				
				awayTeamId = awayTeam.id
				homeTeamId = homeTeam.id
				
				awayTeamLocation = awayTeam.team.location;
				awayTeamName = awayTeam.team.name;
				
				homeTeamLocation = homeTeam.team.location;
				homeTeamName = homeTeam.team.name;
				
				homeTeamNickname = homeTeam.team.nickname;
				awayTeamNickname = awayTeam.team.nickname;
			}
			
			var details = data.details;
			
			if(details) {
			
				var count = 0;
				var newPlays = [];
				
				for(var i = details.length - 1; i >= 0; i--) {
				
					var id = details[i].id;
					
					if(id > playId) {
						newPlays.push(details[i]);
					}
					
					count++;
					
					if(count >= MAX){
						break;
					}
				}
				
				if(newPlays && newPlays.length > 0) {
					// update our id to the latest one received
					playId = newPlays[0].id;
					handleNewPlays(newPlays);
				} else {
					console.log("!!!no new plays");
				}
			}
		});
	});
	
	function getTeamLogo(id) {
		return "http://a.espncdn.com/combiner/i?img=" + "/i/teamlogos/ncaa/500/" + id + ".png" + "&w=50&transparent=true&scale=crop";
				
	}
	
	function handleNewPlays(newPlays) {
	
		if(newPlays && newPlays.length > 0) {
	
			var newPlay = newPlays[newPlays.length-1];
				
			var playText = newPlay.playText;
			var teamId = newPlay.teamId;
			var newClock = newPlay.clock;
			var newHomeScore = newPlay.homeScore;
			var newAwayScore = newPlay.awayScore;
			var period = newPlay.period;
			var mins;
			var secs;
			
			if(playText.toLowerCase() === "end game"){
				playText = "Game Over";
			}
			
			if(newClock != clock) {
				var tokens = (newClock + "").split(":");
				mins = parseInt(tokens[0], 10);
				secs = parseInt(tokens[1], 10);
				
				var clockText = "";
				
				if(mins > 0) {
					clockText += mins + ((mins === 1) ? "minute " : " minutes ")
				}
				
				if(secs > 0) {
					clockText += secs + " seconds "
				}
				
				if(mins > 0 || secs > 0) {
					clockText += "left in " + ((period === 1) ? "first" : "second") + " half";
				}
				
				if(clockText != "") {
					playText += ", " + clockText;
				}
				
				clock = newClock;
			}
			
			if((homeScore != newHomeScore) || (awayScore != newAwayScore)) {
				playText += ", " + awayTeamNickname + " " + newAwayScore;
				playText += ", " + homeTeamNickname + " " + newHomeScore;
				
				homeScore = newHomeScore;
				awayScore = newAwayScore;
			} else if(mins === 0 && secs === 0) {
				// winning text
				var winningText = homeTeamNickname;
				if(newAwayScore > newHomeScore) {
					winningText = awayTeamNickname;
				}
				
				winningText += " wins!";
				
				playText += ", " + winningText
			}
			
			if(alertsEnabled === true) {
				if(window.Android) {
					if(Android.textToSpeech) {
						Android.textToSpeech(playText);
					} else if(Android.speek) {
						Android.speek(playText);
					} else {
						console.log("!!!speak: " + playText);
					}					
				} else {
					console.log("!!!speak: " + playText);
				}
			}
			
			var html = '<li style="padding:5px"><span style="padding:5px;">'
			if(teamId) {
				html += '<img height="20" width="20" src="' + getTeamLogo(teamId) + '"/>'
			}
			html += '</span><span style="padding:5px">' + playText + '</span></li>'
			
			$("#plays").prepend(html);
			
			// newPlays array with one less el
			var plays = [];
			for(var i = 0; i < newPlays.length - 1; i++) {
				plays[i] = newPlays[i];
			}
			
			handleNewPlays(plays);
		}
	}
	
})(jQuery);
