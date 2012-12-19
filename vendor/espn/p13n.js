/*global console:true, espn:true, P13N_ERROR_TIMEOUT:true, P13N_ERROR_NOT_LOGGED_IN:true, P13N_ERROR_NO_DATA:true, top:true */

// Namespace: espn.p13n
var espn = espn || {};

//  Constants: Error Codes
//              P13N_ERROR_NOT_LOGGED_IN - The fan is not logged in
//              P13N_ERROR_NO_DATA - No data was returned form the composer
//              P13N_ERROR_TIMEOUT - The action timed out

P13N_ERROR_NOT_LOGGED_IN = 401;
P13N_ERROR_NO_DATA = 404;
P13N_ERROR_TIMEOUT = 408;

espn.p13n = function(window, $) {

	var _cache, // cache the holds the fan's data
		_siteId = espn.l10n.siteId || 1,
		_cacheKey = 'p13n.'+_siteId,
		_storage = espn.storageFactory.getMostPermanent(),
		_initialized = false, // has the fan's data been initialized
		_timedOut = false,
		_initializedCallbackQueue = [],
		_initializedTimer,
		_host = ("https:" === top.window.location.protocol) ?
				"https://proxy.espn.go.com" : "http://espn.go.com",
		_composerDown = window.espnComposerDown === true,
		// local copies to allow for better minification
		ERR_NOT_LOGGED_IN = P13N_ERROR_NOT_LOGGED_IN,
		ERR_NO_DATA = P13N_ERROR_NO_DATA,
		ERR_TIMEOUT = P13N_ERROR_TIMEOUT;

	function handleSuccess(callback, scopeObj, data, statusCode) {
		if(callback && callback.success) {
			var args = [];
			if(data) { args.push(data); }
			if(statusCode) { args.push(statusCode); }
			callback.success.apply(scopeObj, args);
		}	
	}
	function handleError(callback, scopeObj, statusCode) {
		if(callback && callback.error) {
			callback.error.call(scopeObj, statusCode);
		}	
	}

	function getP13nData(callback) {
		if(_composerDown) {
			handleError(callback, this, ERR_NO_DATA);
			return;
		}

		// this might clobber other window.name storage
		$.ajax({
				'url': _host+'/composer/myespn',
				//'url': 'http://ec2-72-44-62-42.compute-1.amazonaws.com/espn-alerts-hackathon/static/mysports.json',
				'dataType': 'jsonp',
				'cache': false,
				'type': 'GET',
				'timeout': 5000, // is this too low/high?
				'data': { 'siteId': _siteId }, 
				'success': function(data,status) {
					// check to see if the object is empty
					data.expires = +new Date() + (60 * 20 * 1000); // 20 minute expiry
					handleSuccess(callback, this, data, status);
				},
				'error': function(data,status) {
					handleError(callback, this, ERR_NO_DATA);
				}
		});
	}

	function clearInitTimer() {
		if(_initializedTimer) {
			window.clearTimeout(_initializedTimer);
			_initializedTimer = null;
			_timedOut = false;
		}
	}

	function initP13nData() {
		if(_composerDown) {
			return;
		}

		clearInitTimer();

		// calls to espn.p13n.get before we've been initialized will queue up
		// and we need to call those once we are actually ready
		function callSuccessQueue(data) {
			var cb;
			while(_initializedCallbackQueue.length > 0) {
				cb = _initializedCallbackQueue.shift();
				handleSuccess(cb, espn.p13n, data);
			}
		}
		function callErrorQueue(status) {
			var cb;
			while(_initializedCallbackQueue.length > 0) {
				cb = _initializedCallbackQueue.shift();
				handleError(cb, espn.p13n, status);
			}
		}

		// let's initialize the fan's data if they are logged in
		//if(!!espn.core.loggedIn) {
		if(true) { // @TODO
			// grab the personalization data from the storage mechanism
			//_cache = espn.storage.getItem(_cacheKey);
			_cache = _storage.getItem(_cacheKey);
			// if the cache is empty or stale, let's load it from the composer service
			if( !_cache || (_cache && _cache.expires < + (new Date())) ) {
				_cache = null;
				// our cache might be stale
				_initialized = false;
				// get the p13n data from the server
				getP13nData({
					success: function(data) {
						if(!_timedOut) {
							clearInitTimer();
							_cache = data;
							_initialized = true;
							_storage.setItem('p13n',data);
							callSuccessQueue(data);
						}
					},
					error: function(data,status) {
						if(!_timedOut) { 
							clearInitTimer();
							_initialized = true;
							callErrorQueue(status);
						}
					}
				});
				// if we time out, then flag it and stop trying to get the data
				// we'll call any queued error callbacks at this time
				// if the ajax response actually comes back after this time, it will 
				// be ignored above due to the _timedOut flag
				_initializedTimer = window.setTimeout(function() {
					_initialized = true;
					_timedOut = true;
					callErrorQueue(ERR_TIMEOUT);
				}, 20000);
			} else {
				// let's announce that we're good to go
				_initialized = true;
				callSuccessQueue(_cache);
			}
		}
	}
	// execute the function to start the init process
	initP13nData();
   
	function postToComposer(action, data, callback) {
		if(_composerDown) {
			return;
		}

		var postFrame, eventFrame, process,
			guid = "p13n-frame-"+(+new Date().getTime());

		postFrame = $('<iframe style="display:none;">').appendTo('body');
		eventFrame = $('<iframe name="'+guid+'" id="'+guid+'" style="display:none;">').appendTo('body');
		eventFrame.bind('load', function(e) {
			// we lose the ability to get any data with this technique
			e.preventDefault();
			espn.p13n.reset();
			handleSuccess(callback, this);
			eventFrame.remove();
			postFrame.remove();
		}).bind('error', function(e) {
			// no real idea what the error is with the technique
			e.preventDefault();
			handleError(callback, this);
			eventFrame.remove();
			postFrame.remove();
		});

		process = postFrame.get(0).contentWindow.document;
		process.open();
		process.write('<form method="POST" action="https://proxy.espn.go.com/composer/favorites/'+action+'" target="'+guid+'">');
		$.each(data, function(key, value) {
			process.write('<input type="text" name="'+key+'" value="'+value+'"/>');    
		});
		process.write('</form>');
		process.write('<scr'+'ipt>window.onload=function(){document.forms[0].submit(); return false;}</scr'+'ipt>');
		process.close();
	}

	// return the public methods for this object
	return {
		//  Method: espn.p13n.get
		//              Returns the fan's personalization data
		//
		//      Parameters:
		//              callback - (Object) a Callback object containing a success and error function to be triggered
		//
		//      Usage:
		//      >       espn.p13n.get({
		//      >               success:function() {
		//      >                       // handle the fan's data
		//      >               },
		//      >               error:function() {
		//      >                       // handle the error gracefully
		//      >               }
		//      >       });
		//
		"get" : function(callback) {
			//if(!espn.core.loggedIn) {
			if(false) { // @TODO
				//  the user is not logged in.
				//      trigger the error handler.
				handleError(callback, this, ERR_NOT_LOGGED_IN);
				return;
			}

			// if already initialized, perform callback now
			if(!!_initialized) {
				if(_cache) {
					// call the success callback if it's available
					handleSuccess(callback, this, _cache);
				}
				else {
					if(_timedOut) { handleError(callback, this, ERR_TIMEOUT); }
					else { handleError(callback, this, ERR_NO_DATA); }
				}
			}
			// else wait until we are initialized to perform callback
			else {
				if(_composerDown) {
					handleError(callback, this, ERR_TIMEOUT);
				}
				else {
					_initializedCallbackQueue.push(callback);
				}
			}
		},

		//  Method: espn.p13n.add
		//              Add a new preference to the fan's data
		//
		//      Parameters:
		//              data - (Object) the data you are adding for the fan - this code will not format it for you
		//              callback - (Object) callback object with success and error functions
		//
		//      Usage:
		//      >       espn.p13n.add(
		//      >               {
		//      >                       "players": "10:312,28:764",
		//      >                       "sports": "10,28",
		//      >                       "teams": "10:20,28:7"
		//      >               },
		//      >               {
		//      >                       "success" : function() {
		//      >                               // handle the fan's data
		//      >                       },
		//      >                       "error" : function() {
		//      >                               // handle the error gracefully
		//      >                       }
		//      >               }
		//      >       );
		//
		"add" : function(data, callback) {
			//      POST /composer/favorites/add?sports=10,28&teams=10:20,28:7&players=10:312,28:764 HTTP/1.1
			postToComposer('add', data, callback);
		},

		//  Method: espn.p13n.update
		//              Update a preference in the fan's data
		//
		//      Parameters:
		//              data - (Object) the data you are adding for the fan - this code will not format it for you
		//              callback - (Object) callback object with success and error functions
		//
		//      Usage:
		//      >       espn.p13n.update(
		//      >               {
		//      >                       "players": "10:312,28:764",
		//      >                       "sports": "10,28",
		//      >                       "teams": "10:20,28:7"
		//      >               },
		//      >               {
		//      >                       "success" : function() {
		//      >                               // handle the fan's data
		//      >                       },
		//      >                       "error" : function() {
		//      >                               // handle the error gracefully
		//      >                       }
		//      >               }
		//      >       );
		//
		"update" : function(data, callback) {
			//      POST /composer/favorites/update?sports=10,28&teams=10:20,28:7&players=10:312,28:764 HTTP/1.1
			postToComposer('update', data, callback);
		},

		//  Method: espn.p13n.remove
		//              Remove preference(s) in the fan's data
		//
		//      Parameters:
		//              data - (Object) the data you are adding for the fan - this code will not format it for you
		//              callback - (Object) callback object with success and error functions
		//
		//      Usage:
		//      >       espn.p13n.remove(
		//      >               {
		//      >                       "players": "10:312,28:764",
		//      >                       "sports": "10,28",
		//      >                       "teams": "10:20,28:7"
		//      >               },
		//      >               {
		//      >                       "success" : function() {
		//      >                               // handle the fan's data
		//      >                       },
		//      >                       "error" : function() {
		//      >                               // handle the error gracefully
		//      >                       }
		//      >               }
		//      >       );
		//
		"remove": function(data, callback) {
			//      POST /composer/favorites/delete?sports=28&teams=28:7&players=28:764 HTTP/1.1
			postToComposer('delete', data, callback);
		},

		// DEPRECATED - USE REMOVE
		"delete": function(data, callback) {
			//      POST /composer/favorites/delete?sports=28&teams=28:7&players=28:764 HTTP/1.1
			espn.p13n.remove(data, callback);
		},

		//  Method: espn.p13n.reset
		//              Reload the fan's data from the composer service
		//
		//      Parameters:
		//              callback - (Object) callback object with success and error functions
		//
		//      Usage:
		//      >       espn.p13n.reset({
		//      >               success:function() {
		//      >                       // handle the fan's data
		//      >               },
		//      >               error:function() {
		//      >                       // handle the error gracefully
		//      >               }
		//      >       });
		//
		"reset" : function(callback) {
			// reset the p13n init vars
			_cache = undefined;
			_initialized = false;
			_timedOut = false;
			_storage.removeItem(_cacheKey);
			// restart the init process
			initP13nData();
			// regrab the p13n data
			espn.p13n.get(callback);
		},

		"emptyCache": function() {
			_storage.removeItem(_cacheKey);
		}
	};

}(this, this.jQuery);
