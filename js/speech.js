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
		homeTeamAbbrev,
		awayTeamAbbrev,
		awayTeamLogo,
		homeTeamLogo,
		homeLogo,
		awayLogo,
		alertsEnabled = true,
		scoringPlaysOnly = true,
		sportAbbrev = "ncaa",
		lastPlayId = 0;

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
		
		sportAbbrev = espnAlerts.getParameterByName("league");

		$.subscribe("/score/update", function(e, data) {
			
			var html = template(data);
			$("#header").html(template(data));
			
			if(data && data.competitors) {
			
				var homeTeam = data.competitors[0];
				var awayTeam = data.competitors[1];
				
				awayTeamLogo = getTeamLogo(awayTeam, {hash:{}});
				homeTeamLogo = getTeamLogo(homeTeam, {hash:{}});
				
				awayTeamId = parseInt(awayTeam.team.id, 10);
				homeTeamId = parseInt(homeTeam.team.id, 10);
				
				awayTeamLocation = awayTeam.team.location;
				awayTeamName = awayTeam.team.name;
				
				homeTeamLocation = homeTeam.team.location;
				homeTeamName = homeTeam.team.name;
				
				homeTeamNickname = homeTeam.team.nickname || homeTeam.team.name;
				awayTeamNickname = awayTeam.team.nickname || awayTeam.team.name;
				
				homeTeamAbbrev = homeTeam.team.abbreviation;
				awayTeamAbbrev = awayTeam.team.abbreviation;
			}
			
			var details = data.details;
			
			if(details) {
			
				var count = 0;
				var newPlays = [];
				
				//for(var i = details.length - 1; i >= 0; i--) {
				for(var i = 0; i < details.length; i++) {
				
					var id = parseInt(details[i].id, 10);
					
					if(id > lastPlayId) {
						newPlays.push(details[i]);
						lastPlayId = id;
						
						count++;
					}
					
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
	
	function getTeamLogo(teamObjApi, options) {
	
		var teamObj = teamObjApi.team;
		
		var sportId = parseInt(teamObj.sport, 10),
		sportAbbrev = (""+(options.hash.sportAbbrev || teamObjApi.sportAbbrev)).toLowerCase(),

		teamId = parseInt(teamObj.id, 10),
		teamName = teamObj.text,
		teamAbbrev = (""+teamObj.sw_abbrev).toLowerCase(),
		logoAbbrev = sportAbbrev === "wnba" && teamAbbrev === "con" ? "ct" : teamAbbrev,
		size = options.hash.size || "medium",
		collegeSports = {"mens-college-basketball":1,ncf:1,ncw:1},
		isCollegeSport = !!collegeSports[sportAbbrev],
		isSoccer = (sportId >= 600 && sportId < 800) || (sportId > 3900 && sportId < 3999),
		imgDims = {small:50, medium:50, large:50},
		imgDim = imgDims[size],
		imgURL,
		combinerParams = {w:imgDim, h:imgDim, scale:"crop", transparent:"true"},
		defaultImgURL,
		openContent = "<div class='logo-"+size+"'>",
		closeContent = "</div>";

		if(isCollegeSport) {
			imgURL = "/i/teamlogos/ncaa/500/"+teamId+(teamId === 2633 && sportId === 54 ? "_ncw" : "")+".png";
			delete combinerParams.scale;
		} 
		else if(isSoccer) {
			imgURL = "/soccernet/design05/i/clubhouse/badges/"+teamId+".gif";
			defaultImgURL = "http://a.espncdn.com/design05/i/clubhouse/badges/nobadge.gif";
		}
		else {
			logoAbbrev = teamObj.abbreviation;

			imgURL = "/i/teamlogos/"+sportAbbrev+"/500/"+logoAbbrev+".png";
		}
		imgURL = "http://a.espncdn.com/combiner/i?img=" + imgURL + "&w=" + imgDim + "&transparent=true&scale=crop"
 
		return imgURL;
	}
	
	function handleNewPlays(newPlays) {
	
		if(newPlays && newPlays.length > 0) {
	
			var newPlay = newPlays[0];
				
			var playText = newPlay.playText;
			var teamId = parseInt(newPlay.teamId, 10);
			var newClock = newPlay.clock;
			var newHomeScore = newPlay.homeScore;
			var newAwayScore = newPlay.awayScore;
			var period = newPlay.period;
			var mins;
			var secs;
			var isScoringPlay = false;
			var clockText = "";
			
			if(newClock != clock) {
				var tokens = (newClock + "").split(":");
				mins = parseInt(tokens[0], 10);
				secs = parseInt(tokens[1], 10);
				
				clockText = getClockText({league:sportAbbrev, period:period, mins:mins, secs:secs});
				
				clock = newClock;
			}
			
			if((homeScore != newHomeScore) || (awayScore != newAwayScore)) {
				playText += ", " + awayTeamNickname + " " + newAwayScore;
				playText += ", " + homeTeamNickname + " " + newHomeScore;
				
				homeScore = newHomeScore;
				awayScore = newAwayScore;
				
				isScoringPlay = true;
			} else if(mins === 0 && secs === 0 && isEndOfGame({period:period, league:sportAbbrev})) {
				// winning text
				var winningText = homeTeamNickname;
				if(newAwayScore > newHomeScore) {
					winningText = awayTeamNickname;
				}
				
				winningText += " wins!";
				
				playText += ", " + winningText;
				
				isScoringPlay = true;
			}
			
			if(clockText != "") {
				playText += ", " + clockText;
			}
			
			if(alertsEnabled === true) {
				if((scoringPlaysOnly === true && isScoringPlay === true) || scoringPlaysOnly === false) {
					displayPlay({playText: playText, teamId: teamId});
					var textToSpeak = getTextToSpeak(playText);
					if(window.Android) {
						if(Android.textToSpeech) {
							Android.textToSpeech(textToSpeak);
						} else if(Android.speek) {
							Android.speek(textToSpeak);
						} else {
							console.log("!!!speak: " + textToSpeak);
						}					
					} else {
						console.log("!!!speak: " + textToSpeak);
					}
				}
			}
			
			// newPlays array with one less el
			if(newPlays.length > 0) {
				var plays = [];
				for(var i = 1; i < newPlays.length; i++) {
					plays[i-1] = newPlays[i];
				}
			
				handleNewPlays(plays);
			}
			
		}
	}
	
	function displayPlay(obj) {
		var teamId = obj.teamId;
		var playText = obj.playText;
		
		var html = '<li style="padding:5px"><span style="padding:5px;">'
		if(teamId) {
			var logo;
			
			if(teamId === homeTeamId){
				logo = homeTeamLogo;
			} else {
				logo = awayTeamLogo;
			}
			html += '<img height="20" width="20" src="' + logo + '"/>'
		}
		html += '</span><span style="padding:5px">' + playText + '</span></li>'
		
		$("#plays").prepend(html);
	}
	
	function getClockText(obj) {
	
		var clockText = "";
	
		var mins = obj.mins;
		var secs = obj.secs;
		var league = obj.league;
		var period = obj.period;
		
		var clockText = "";
		
		if(mins > 0) {
			clockText += mins + ((mins === 1) ? "minute " : " minutes ");
		}
		
		if(secs > 0) {
			clockText += secs + ((secs === 1) ? " second " : " seconds ");
		}
		
		if(mins > 0 || secs > 0) {
		
			if(league == "mens-college-basketball"){
				clockText += "left in the " + ((period === 1) ? "first" : "second") + " half";
			} else if(league == "nba") {
				clockText += "left in "
				if(period === 1) { clockText += "the first quarter"; }
				else if(period === 2) { clockText += "the second quarter"; }
				else if(period === 3) { clockText += "the third quarter"; }
				else if(period === 4) { clockText += "the fourth quarter"; }
				else { clockText += "overtime";}
			}
		}
		
		return clockText;
	}
	
	function isEndOfGame(obj) {
		var league = obj.league;
		var period = obj.period;
		
		if(league == "mens-college-basketball") {
			return (period >= 2 && homeScore != awayScore);
		} else if(league == "nba") {
			return (period >= 4 && homeScore != awayScore);
		}
		
		return false;
	}
	
	function getTextToSpeak(playText) {
		playText = playText.replace("-", " ");
		playText = playText.replace("1st", "first");
		playText = playText.replace("2nd", "second");
		playText = playText.replace("3rd", "third");
		playText = playText.replace("4th", "fourth");
		playText = playText.replace("5th", "fifth");
		playText = playText.replace("6th", "sixth");
		playText = playText.replace("7th", "seventh");
		playText = playText.replace("8th", "eighth");
		playText = playText.replace("9th", "ninth");
		playText = playText.replace("End Game", "Game over");
		playText = playText.replace("End of Game", "Game over");
		
		playText = playText + ", , , ,";
		
		return playText;
	}
})(jQuery);
