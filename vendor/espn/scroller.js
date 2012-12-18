var espn = espn || {};

espn.scroller = (function($) { 

	// @TODO: should we adjust the scroll upong resize/orientation change? if so scroll to what, the start of the carousel, or to a certain carousel item?
	return {
		/**
		* Function: scrollPaneLeft
		*
		* scroll a pane to the left (i.e. reveal more of the right side)
		*
		* Parameters:
		*  containerEl - (Element|jQuery|string) The container element of the pane to be scrolled (i.e. this element is the overflown and obscures the scrolled element)
		*  scrollerEl - (Element|jQuery|string) The element to be scrolled left or right (i.e. the element that is partially obscured and you wish to display more/less to the left/right)
		*  scrollerItems - (Element[]|jQuery|string) The scroll container "slides" or individual items that determine the next/prev scrolling position when scrolling left/right
		*  navPrevEl - (Element|jQuery|string) The element that acts as the control for scrolling to the left, the activeClass will be automatically managed for you depending on the resulting scroll
		*  navNextEl - (Element|jQuery|string) The element that acts as the control for scrolling to the right, the activeClass will be automatically managed for you depending on the resulting scroll
		*  activeClass - (string) The className to add/remove to the navPrevEl/navNextEl elements depending on whether more scrolling is possible in those directions
		*/
		scrollPaneLeft: function(containerEl, scrollerEl, scrollerItems, navPrevEl, navNextEl, activeClass) {
			var container = $(containerEl),
				containerWidth = container.width(),
				scroller = $(scrollerEl),
				scrollerWidth = scroller.width(),
				currLeft = (parseInt(scroller.css('margin-left'), 10) || 0),
				nextLeft = currLeft, //(currLeft - containerWidth),
				absNextLeft = Math.abs(currLeft - containerWidth),
				itemsLeft = 0;
			// determine the next partially obscured scrolled item, 
			// the next scoll position will be to the start of that element
			$(scrollerItems).each(function() {
				var elWidth = $(this).outerWidth(true);
				itemsLeft += elWidth;
				if(itemsLeft > absNextLeft) {
					nextLeft = (itemsLeft - elWidth) * -1;
					return false;
				}
			});
			// scroll the container
			scroller.css('margin-left', nextLeft + "px");
			// manage the active class for the navigation controls
			if(activeClass) { 
				if(navNextEl && Math.abs(nextLeft - containerWidth) > scrollerWidth) {
					$(navNextEl).removeClass(activeClass);
				}
				if(navPrevEl) { 
					$(navPrevEl).addClass(activeClass);
				}
			}
		},

		/**
		* Function: scrollPaneRight
		*
		* scroll a pane to the right (i.e. reveal more of the left side)
		*
		* Parameters:
		*  containerEl - (Element|jQuery|string) The container element of the pane to be scrolled (i.e. this element is the overflown and obscures the scrolled element)
		*  scrollerEl - (Element|jQuery|string) The element to be scrolled left or right (i.e. the element that is partially obscured and you wish to display more/less to the left/right)
		*  scrollerItems - (Element[]|jQuery|string) The scroll container "slides" or individual items that determine the next/prev scrolling position when scrolling left/right
		*  navPrevEl - (Element|jQuery|string) The element that acts as the control for scrolling to the left, the activeClass will be automatically managed for you depending on the resulting scroll
		*  navNextEl - (Element|jQuery|string) The element that acts as the control for scrolling to the right, the activeClass will be automatically managed for you depending on the resulting scroll
		*  activeClass - (string) The className to add/remove to the navPrevEl/navNextEl elements depending on whether more scrolling is possible in those directions
		*/
		scrollPaneRight: function(containerEl, scrollerEl, scrollerItems, navPrevEl, navNextEl, activeClass) {
			var container = $(containerEl),
				containerWidth = container.width(),
				scroller = $(scrollerEl),
				scrollerWidth = scroller.width(),
				currLeft = (parseInt(scroller.css('margin-left'), 10) || 0),
				absCurrLeft = Math.abs(currLeft),
				nextLeft = currLeft, //Math.min(currLeft + containerWidth, 0),
				itemsLeft = 0;
			// we want to scroll the container one container's width back (i.e. a "page" back)
			// but to the point that doesnt leave us partially obscuring the first shown element
			$(scrollerItems).each(function() {
				if(itemsLeft + containerWidth > absCurrLeft) {
					nextLeft = Math.min(itemsLeft * -1, 0);
					return false;
				}
				var elWidth = $(this).outerWidth(true);
				itemsLeft += elWidth;
			});
			// scroll the element
			scroller.css('margin-left', nextLeft + "px");
			// manage the active class for the navigation controls
			if(activeClass) { 
				if(navPrevEl && nextLeft === 0) {
					$(navPrevEl).removeClass(activeClass);
				}
				if(navNextEl && scrollerWidth > containerWidth) {
					$(navNextEl).addClass(activeClass);
				}
			}
		}
	};

})(this.jQuery);
