var espn = espn || {};

(function(window) {

	var _isSSL = !!window.location.href.match(/^https/),
		_combinerPath = 'http'+(_isSSL ? 's' : '')+'://a.espncdn.com/combiner/';

	espn.combiner = {

		/**
		* Function: getImageUrl
		*
		* Get an image sourced through combiner
		*
		* Parameters:
		*	
		*  src - (string) The url to the original image
		*  params - (object) option set of params that combiner accepts for transforming the result image
		*
		* Returns:
		*  string
		*/
		getImageUrl: function(src, params) {
			var isDeportesSrc = src.match(/https?:\/\/espndeportes/),
				isSoccernetSrc = src.match(/https?:\/\/(i.espncdn.com|soccernet.espn.go.com)/),
				srcPath = src.replace(/https?:\/\/[^\/]+/,""),
				combinerSrcPath = (isDeportesSrc && !srcPath.match(/\/deportes\//) ? "/deportes/" : "") + (isSoccernetSrc && !srcPath.match(/\/soccernet\//) ? "/soccernet/" : "") + srcPath,
				out = _combinerPath + 'i?img=' + combinerSrcPath;
			if(params) {
				for(var k in params) {
					if(params.hasOwnProperty(k)) {
						out += "&" + k + "=" + encodeURIComponent(params[k]);
					}
				}
			}
			return out;
		},

		/**
		 * Function: getResizedImageUrl
		 *
		 * Get a url to a resized version of the image through combiner
		 *
		 * Parameters:
		 *
		 *	src - (string) The url to the original image
		 *	params - (object) Optional additional parameters to configure combiner
		 *		- w - (integer) width to scale to
		 *		- h - (integer) height to scale to
		 *		- scale - (string) scale mode ("crop" will crop the image keeping aspect ratio)
		 *	opts - (object) Additional options
		 *		- scaleByDPR - (bool) True if you want the device-pixel-ratio detected to affect
		 *						what size the image is resized to; You should be using this in
		 *						addition to specifying a width attribute for the img element
		 *						so that the device scales it appropriately; See Usage below
		 *
		 * Usage:
		 *
		 *	(start code)
		 *		var width = 100,
		 *			src = espn.combiner.getResizedImageUrl(fullSrc, {w:width,scale:"crop"}, {scaleByDPR:true}),
		 *			img = new Image();
		 *		img.width = width;
		 *		img.src = src; // on iOS this would load a 200px wide image scaled to 100px by the device
		 *	(end code)
		 *
		 * Returns:
		 *	string
		 */
		getResizedImageUrl: function(src, params, opts) {
			var query = {},
				dpr;
			if(params) {
				for(var k in params) {
					if(params.hasOwnProperty(k)) {
						query[k] = params[k];
					}
				}
			}
			if(opts && !!opts.scaleByDPR && query.w) {
				dpr = espn.client.getDevicePixelRatio();
				if(dpr > 1) {
					query.w = Math.round(parseInt(query.w,10) * dpr);
					if(query.h) {
						query.h = Math.round(parseInt(query.h,10) * dpr);
					}
				}
			}
			return this.getImageUrl(src, query);
		}

	};

})(this);
