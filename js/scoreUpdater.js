$(document).ready(function() {
 
		espnAlerts.init();

		$.subscribe("/score/update", function( e, data ) {
			 
		   template = Handlebars.compile(espnAlerts.getHeaderTemplate( ) )

		   currentScore = espnAlerts.getCurrentScore(data)
		   for( var x = 0; x <= data.competitors.length - 1; x++ ){
				if( data.competitors[x].homeAway == "home" ){
					data.competitors[x].score = currentScore.home;
				}
				if( data.competitors[x].homeAway == "away" ){
					data.competitors[x].score = currentScore.away;
				}

			}
			
		   $("#header").html( template( data ) )
		});


});