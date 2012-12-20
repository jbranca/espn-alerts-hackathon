(function($) {

	var _sportsData;

	var _p13nData = {"mySports":[{"id":41,"text":"NCB","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"id":10,"text":"MLB","sportAbbrev":"MLB","sportName":"Major League Baseball"},{"id":28,"text":"NFL","sportAbbrev":"NFL","sportName":"National Football League"},{"id":90,"text":"NHL","sportAbbrev":"NHL","sportName":"National Hockey League"},{"id":46,"text":"NBA","sportAbbrev":"NBA","sportName":"National Basketball Association"},{"id":700,"text":"English Soccer","sportName":"English Soccer","isTournament":false},{"id":23,"text":"NCF","sportAbbrev":"NCF","sportName":"NCAA - Football"},{"id":600,"text":"Soccer","sportAbbrev":"Soccer","sportName":"Soccer"},{"id":2020,"text":"NASCAR","sportAbbrev":"NASCAR","sportName":"NASCAR"},{"id":770,"text":"Major League Soccer","sportName":"Major League Soccer","isTournament":false}],"myGroups":[{"sport":41,"id":999},{"sport":41,"id":4,"text":"Big East Conference","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":41,"id":8,"text":"Big 12 Conference","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":41,"id":100},{"sport":41,"id":56},{"sport":41,"id":55},{"sport":41,"id":50,"text":"NCAA Division I","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":41,"id":45,"text":"Horizon League","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":41,"id":3,"text":"Atlantic 10 Conference","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":23,"id":10,"text":"Big East Conference","sportAbbrev":"NCF","sportName":"NCAA - Football"},{"sport":41,"id":2,"text":"Atlantic Coast Conference","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":41,"id":7,"text":"Big Ten Conference","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":41,"id":23,"text":"Southeastern Conference","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"}],"myTeams":[{"sport":41,"id":2507,"abbrev":"PROV","isFav":true,"text":"Providence Friars","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"},{"sport":10,"id":10,"abbrev":"NYY","isFav":false,"text":"New York Yankees","sw_abbrev":"nyy","sportAbbrev":"MLB","sportName":"Major League Baseball"},{"sport":28,"id":19,"abbrev":"nyg","isFav":false,"text":"New York Giants","sw_abbrev":"nyg","sportAbbrev":"NFL","sportName":"National Football League"},{"sport":46,"id":18,"abbrev":"NY","isFav":false,"text":"New York Knicks","sw_abbrev":"nyk","sportAbbrev":"NBA","sportName":"National Basketball Association"},{"sport":90,"id":11,"abbrev":"NJ","isFav":false,"text":"New Jersey Devils","sw_abbrev":"njd","sportAbbrev":"NHL","sportName":"National Hockey League"},{"sport":600,"id":190,"abbrev":"Red Bull","isFav":false,"text":"New York Red Bulls","sw_abbrev":"USA.NEW_YORK","sportName":"Major League Soccer","isNational":false},{"sport":600,"id":660,"isFav":false,"text":"United States","sw_abbrev":"USA","sportName":"Gold Cup","isNational":true},{"sport":46,"id":17,"abbrev":"BKN","isFav":false,"text":"Brooklyn Nets","sw_abbrev":"bkn","sportAbbrev":"NBA","sportName":"National Basketball Association"},{"sport":90,"id":5,"abbrev":"Det","isFav":false,"text":"Detroit Red Wings","sw_abbrev":"det","sportAbbrev":"NHL","sportName":"National Hockey League"},{"sport":41,"id":2250,"abbrev":"GONZ","isFav":false,"text":"Gonzaga Bulldogs","sw_abbrev":"GON","sportAbbrev":"NCB","sportName":"NCAA - Men's Basketball"}],"myPlayers":[{"sport":10,"id":3246,"text":"Derek Jeter","isFav":false},{"sport":28,"id":5526,"text":"Eli Manning","isFav":false},{"sport":10,"id":3171,"text":"Andy Pettitte","isFav":false}],"myColumnists":[{"id":"simmons_bill","text":"simmons bill"},{"id":"katz_andy","text":"katz andy"},{"id":"karabell_eric","text":"karabell eric"},{"id":"stark_jayson","text":"stark jayson"},{"id":"olney_buster","text":"olney buster"},{"id":"bilas_jay","text":"bilas jay"},{"id":"oneil_dana","text":"oneil dana"},{"id":"fraschilla_fran","text":"fraschilla fran"}],"mySettings":{"videoAutoStart":"2"},"myModules":[{"id":1,"text":"Insider","url":"http://insider.espn.go.com"}],"myLocker":[{"shelfType":"RadioStation","shelfId":2,"text":"ESPNRADIO.Favorites"},{"shelfType":"Game23","shelfId":1,"text":"322452426"},{"shelfType":"RadioStation","shelfId":1,"text":"Providence Friars","metadata":[{"sequenceId":1,"seeds":"Providence Friars~Andy Pettitte~Martin Brodeur"}]}]};

	function renderNav(data) {
		var _data = {myTeams: data.myTeams || []},
			templateData = {},
			templateSource = $('#nav-list-template').html(),
			template = Handlebars.compile(templateSource),
			myGames = [],
			seenGames = {};

		$.extend(true, templateData, _data);

		$(_data.myTeams).each(function(i, team) {
			$(_sportsData || []).each(function(z, sport) {
				$(sport.leagues || []).each(function(j, league) {
					if(league.id == team.sport && (""+league.abbreviation).toLowerCase() == (""+team.sportAbbrev).toLowerCase()) {
						$(league.events || []).each(function(k, ev) {
							$(ev.competitions || []).each(function(l, competition) {
								$(competition.competitors || []).each(function(m, competitor) {
									if((competitor.team || {}).id == team.id) {
										if(!seenGames[competition.id]) { 
											var myGame = {};
											$.extend(true, myGame, competition);
											myGame.league = league;
											myGames.push(myGame);				
											seenGames[competition.id] = true;
										}
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
		callback(_p13nData);
		/*
		espn.p13n.get({
			success: function(data) {
				callback(data || {});
			},
			error: function() {
			
			}
		});	
		*/
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
