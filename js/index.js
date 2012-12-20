(function($) {

	var _p13nData,
		_sportsData;

	function renderNav(data) {
		var _data = {myTeams: data.myTeams || []},
			templateData = {},
			templateSource = $('#nav-list-template').html(),
			template = Handlebars.compile(templateSource),
			myGames = [];

		$.extend(true, templateData, _data);

		$(_data.myTeams).each(function(i, team) {
			$(_sportsData || []).each(function(z, sport) {
				$(sport.leagues || []).each(function(j, league) {
					if(league.id == team.sport && (""+league.abbreviation).toLowerCase() == (""+team.sportAbbrev).toLowerCase()) {
						$(league.events || []).each(function(k, ev) {
							$(ev.competitions || []).each(function(l, competition) {
								$(competition.competitors || []).each(function(m, competitor) {
									if((competitor.team || {}).id == team.id) {
										var myGame = {};
										$.extend(true, myGame, competition);
										myGame.league = league;
										myGames.push(myGame);				
										return false; //break loop
									}
								});
							});
						});
						return false; //break loop
					}
				});
			});
		});

		templateData.myGames = myGames;
		$('#nav-list-container').html(template(templateData));
	}

	function getMyTeams(callback) {
		espn.p13n.get({
			success: function(data) {
				callback(data || {});
			},
			error: function() {
			
			}
		});	
	}

	function getEventsData(callback) {
		window.api.getSports(callback);
	}

	function init() {
		function checkReady() {
			if(_p13nData !== undefined && _sportsData !== undefined) {
				renderNav(_p13nData);	
			}
		};
		getMyTeams(function(p13nData) {
			_p13nData = p13nData;
			checkReady();
		});
		getEventsData(function(sportsData) { 
			_sportsData = sportsData;
			checkReady();
		});
	};

	$(document).ready(init);

})(jQuery);
