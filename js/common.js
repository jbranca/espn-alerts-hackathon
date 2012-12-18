// Comparison Helper for handlebars.js
// Pass in two values that you want and specify what the operator should be
// e.g. {{#compare val1 val2 operator="=="}}{{/compare}}
Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

	if (arguments.length < 3) {
		throw new Error("Handlebars Helper 'compare' needs 2 parameters");
	}

	var operator = options.hash.operator || "==";
	var operators = {
		'==':       function(l,r) { return l == r; },
		'===':      function(l,r) { return l === r; },
		'!=':       function(l,r) { return l != r; },
		'<':        function(l,r) { return l < r; },
		'>':        function(l,r) { return l > r; },
		'<=':       function(l,r) { return l <= r; },
		'>=':       function(l,r) { return l >= r; },
		'typeof':   function(l,r) { return typeof l == r; }
	};

	if (!operators[operator]) {
		throw new Error("Handlebars Helper 'compare' doesn't know the operator "+operator);
	}

	var result = operators[operator](lvalue,rvalue);

	if( result ) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("logoContainer", function(teamObjApi, options) {
	teamObj = teamObjApi.team;

	var sportId = parseInt(teamObj.sport, 10),
		sportAbbrev = (""+teamObjApi.sportAbbrev).toLowerCase(),

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
			imgURL = "/i/teamlogos/"+sportAbbrev+"/500/"+logoAbbrev+".png";
		}
		imgURL = "http://a.espncdn.com/combiner/i?img=" + imgURL + "&w=" + imgDim + "&transparent=true&scale=crop"
 
	 
		return imgURL;
});



var espnAlerts = (function () {

	var apiKey = "s5xerbqgn96xdyzwckgyzu9p";
	var sportName = "";


	return {

		getParameterByName: function(name){
		  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  var regexS = "[\\?&]" + name + "=([^&#]*)";
		  var regex = new RegExp(regexS);
		  var results = regex.exec(window.location.search);
		  if(results == null){
		    return "";
		  }else{
		    return decodeURIComponent(results[1].replace(/\+/g, " "));
		   }
		},

		init: function(){

			espnAlerts.getScoreUpdate();
			var myVar=setInterval(
				function(){
					espnAlerts.getScoreUpdate()
				},5000);
		},

		getScoreUpdate:function(){
			console.log( "get Score Update")
			 $.ajax({
		            url: 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/events/' + espnAlerts.getParameterByName("gameId") + '/?apiKey=' + apiKey,
		            jsonpCallback: 'Test',
		            cache: false,
		            dataType: 'jsonp',
		            success: function (data) {
		            	if( data ){
		            		
		            		if( data.sports && data.sports.length > 0){
		            			sport = data.sports[0];
		            			sportName = sport.name;
		            			sportId = sport.id;
		            			
		            			
		            			if( sport && sport.leagues.length > 0 ){
			      					league = sport.leagues[0]
			      					abbrev = league.abbreviation;
		            				if( league && league.events ){
		            					gameEvent = league.events[0];

		            					if( gameEvent && gameEvent.competitions ){
		            						for( var x = 0; x <= gameEvent.competitions.length -1; x++){
		            							if( gameEvent.competitions[x].competitors ){
		            								for( var y = 0; y <= gameEvent.competitions[x].competitors.length - 1; y++){
		            									gameEvent.competitions[x].competitors[y].sportAbbrev = abbrev;
		            								}
		            								
		            							}
		            							 
		            						}

		            						$.publish("/score/update", gameEvent.competitions);
		            					}
		            				}
			            		} 
		            		}
		            	}
		                  
		            }
		      });
		}
	}

})();