var espn = espn || {};

/**
 * Class: espn.client
 *
 * Manages logic to for determining varying client characteristics
 *
 */
espn.client = (function(window, document, navigator, screen) {

	return {

		/**
		 * Function: getDevicePixelRatio
		 *
		 * Get the device pixel ratio of the screen
		 *
		 * Returns:
		 *	int|float
		 */
		getDevicePixelRatio: function() {
			var memoized,
				resMatcher,
				ua = navigator && navigator.userAgent || "",
				dpr;

			if(window.devicePixelRatio === undefined) { // Unknown
				// IEMobile hack
				if(ua.toLowerCase().match(/\biemobile\b/)) {
					// see: http://windowsteamblog.com/windows_phone/b/wpdev/archive/2011/03/14/managing-the-windows-phone-browser-viewport.aspx
					dpr = 1.5;
				}
				else {
					// see: http://css-tricks.com/snippets/css/retina-display-media-query/
					//		http://www.brettjankord.com/2012/11/28/cross-browser-retinahigh-resolution-media-queries/
					resMatcher = function(dpi) { return window.matchMedia && window.matchMedia('only screen and (min-resolution: '+dpi+'dpi)').matches; };
					// just check for 1.5 and 2.0, the most common ratios
					dpr = resMatcher(192) && 2 || resMatcher(144) && 1.5 || 1;
				}
			}
			else {
				// webkit
				dpr = window.devicePixelRatio; 
			}
			memoized = function() { return dpr; };
			this.getDevicePixelRatio = memoized;
			return memoized.apply(this, arguments);
		}

	};

})(this, this.document, this.navigator, this.screen);
