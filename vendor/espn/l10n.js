// 	File: ESPN L10n - Localization Library
//		Provides basic key=value style translations for the core js
//	
//	File  Details:
//		ID - $Id: //vss_espneng/Templates/FrontEnd/scripts/espn.l10n.js#8 $
//		DateTime - $DateTime: 2010/10/27 10:26:15 $
//		Revision - $Revision: #8 $

/*
Object: espn.l10n
	This object provides the basic translations needed in the core javascript files

	Should you need or want to override any of the values you should use jQuery's extend functionality.

	Store your new translations in a file using a standard naming scheme like espn.l10n.es_MX.js and load it before the core.js

Extending:
(start code)
	jQuery.extend(
		true, 			// make sure we keep values we don't change
		espn.l10n,	// we want to extend the current l10n object
		// our new Spanish translations
		{
			dayNamesLong: 		'Domingo Lunes Martes Mi&eacute;rcoles Jueves Viernes S&aacute;bado'.split(' '),
			headlines: {
				edit: "<a href=\"http://espn.go.com/personalization/\">Editar myHeadlines &#187;</a>"
			},
			myEspnText: {
				welcometext: "Bienvenido"
			}
		}
	);
(end code)


Object Contents:
(start code)
espn.l10n = {
	dayNamesLong: 		'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
	dayNamesMedium: 	'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
	dayNamesShort: 		'Su Mo Tu We Th Fr Sa'.split(' '),
	monthNamesLong: 	'January February March April May June July August September October November December'.split(' '),
	monthNamesShort: 	'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
	headlines: {
			edit: "<a href=\"http://espn.go.com/personalization/\">Edit myHeadlines &#187;</a>",
			setup: "<p><a href=\"http://espn.go.com/personalization/\">Set up</a> your preferences and get news delivered about your favorite sports, teams and players.</p>",
			signin: "<p>Sign in above to set up your preferences and get news delivered about your favorite sports, teams and players.</p>",
			error: "<p>We could not retrieve your personalized options at this time. Please try again later.</p>",
			noHeadlines: "<p id=\"myheadlines\">There are no headlines currently for this topic. Please try another topic.</p>",
			sysError: "<p id=\"myheadlines\">We could not retrieve your headlines at this time. Please try again later.</p>"
	},
	myEspnText: {
		imgRef:"https://a248.e.akamai.net/f/12/621/5m/proxy.espn.go.com/prod",
		urlPrefix:"https://r.espn.go.com",
		isProd:"true",
		language:"en",
		welcometext:"Welcome,",
		register:"Register Now",
		myespntext:"myESPN",
		signin:"Sign In",
		heliumdown:"Login Temporarily Unavailable",
		myespnerrortext1:"We're sorry, an error has occurred during your request.",
		myespnerrortext2:"Please sign in on our",
		myespnerrortext3:"login page",
		mserrortext2:"We apologize for the inconvenience.",
		viewall:"View All",
		addlc:"Add",
		sportstext:"Sports",
		teamstext:"Teams",
		playerstext:"Players",
		columniststext:"Columnists",
		joininsider:"Join Insider",
		activate:"Activate",
		activateinsider:"Activate Insider",
		freemembership:"Free Membership",
		freefantasy:"Free Fantasy Football",
		playfantasy:"Play Fantasy Football",
		followyoursports:"Follow Your Sports",
		personalizenow:"Personalize Now"
	}
};
(end code)
*/
window.espn = window.espn || {};
espn.l10n = {
	lang: "en",
	siteId: 1,
	dayNamesLong: 		'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
	dayNamesMedium: 	'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
	dayNamesShort: 		'Su Mo Tu We Th Fr Sa'.split(' '),
	monthNamesLong: 	'January February March April May June July August September October November December'.split(' '),
	monthNamesShort: 	'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
};
