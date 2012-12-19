(function($) {

	var apiKey = "apikey=d33p8cps2gztazst76784r5j";
    var api = {},
		sports;
	
	api.getSports = function(callback) {
	
		var baseUrl = "http://api.espn.com/v1/sports/events";
		
		var url = baseUrl + "?" + apiKey;
		
		$.ajax({
		    url: url,
			dataType: "jsonp",
			success: function(resp) {

                if(resp && resp.sports && resp.sports.length > 0) {
					sports = resp.sports;
					if(typeof callback === "function") {
						callback(sports);
					}
                }
			}
		});
	};
	
	api.getLeaguesBySportId = function(sportId) {
	
		if(sports) {
			for(var i = 0; i < sports.length; i++) {
				var sport = sports[i];
				
				if(sport.id === sportId) {
					return sport.leagues;
				}
			}
		}
	};

    api.getEvents = function(sportId, leagueId) {
		var leagues = api.getLeaguesBySportId(sportId);
		
		if(leagues && leagues.length > 0) {
			for(var i = 0; i < leagues.length; i++) {
				var league = leagues[i];
				
				if(league.id === leagueId) {
					return league.events;
				}
			}
		}
    };

    window.api = api;
})(jQuery);
