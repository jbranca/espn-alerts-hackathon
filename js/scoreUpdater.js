$(document).ready(function() {
 
		espnAlerts.init();

		$.subscribe("/score/update", function( e, data ) {
			 
		   template = Handlebars.compile(espnAlerts.getHeaderTemplate( ))
		   $("#header").html( template( data ) )
		});


});