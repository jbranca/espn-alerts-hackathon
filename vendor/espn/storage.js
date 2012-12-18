/*global espn:true, TEAencrypt:true, TEAdecrypt:true, Modernizr:true */

//	Provides a simple API to window.name or window.sessionStorage

// List: Requirements
//		List of files required by this script
//
//		*	espn.core.js
//		* plugins/teacrypt.js
//		* plugins/json2.js

(function($,window,document,undefined){ // closure

	//  we need to use a try catch method to test for sessionStorage (thx to Modernizr)
	var supportsSessionStorage = function() {
		try {
			// we need to test actually setting a value, since "private browsing" may throw exceptions upon setting a value
			return ('sessionStorage' in window) && window.sessionStorage !== null && ((window.sessionStorage.__testSetter=1) || true);
		} catch(e) {
			return false;
		}
	}();

	var supportsLocalStorage = function() { 
		try{
			return !!localStorage.getItem;
		} catch(a){
			return false;
		}
	}();

	// 	Class: ESPN_WindowNameStorage
	//		This class is used to interface with window.name as a mock session storage facility
	//		It uses simple encryption to make data extraction more difficult
	//
	function ESPN_WindowNameStorage() {
		
		function __getKey() {
			var i=64, a=[], s = $.cookie('ESPN_WindowNameStorage') || '', 
				charMap = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
			
			// return the key in the cookie if we have one
			if('' !== s) { return s; }
			
			// else generate a new key
			while(i--) {
				var c = charMap[~~( Math.random() * charMap.length )];
				a.push( !!~~( Math.random() * 2 ) ? c.toUpperCase() : c );
			}
			s = a.join('');

			$.cookie( 'ESPN_WindowNameStorage', s, {"domain":".espn.go.com"} );
			return s;
		}
		
		// @TODO: use espn.core.SWID ?
		this.SWID = __getKey(); //this.SWID = espn.core.SWID || __getKey();

		// 	Private: _storedData	
		//		This is a simple utility to handle the JSON object stored in window.name
		//
		//	Returns:
		//		(Object) JSON object of window.name data
		//
		this._storedData = function() {
			var data = {};
			try {
				data = window.name.length ? TEAdecrypt(window.name, this.SWID) : '';
				if(data.length) {
					data = JSON.parse(data);
					// make sure the data is an object before returning it
					data = (typeof data === "object") ? data : {};
				}	
			} catch (e) {}
			return data;
		};
	}

	ESPN_WindowNameStorage.prototype = {

		//	Method: getItem
		//		This will retrieve a value for a specific key
		//
		//	Parameters:
		//		key - (String) the key you wish to look up
		//
		//	Returns:
		//		value - (String|Boolean|Number|Object|Array) the value stored in the key
		//
		getItem: function(key) {
			var data = this._storedData();
			return data[key] || null;
		},

		//	Method: setItem
		//		This will set a value for a specific key
		//
		//	Parameters:
		//		key - (String) the key you wish to look up
		//		value - (String|Boolean|Number|Object|Array) the data to store
		//
		setItem: function(key,val) {
			// get the current window.name data
			var data = this._storedData();
			data[key] = val;
			// store the data in window.name
			// maybe we should do this AFTER window.onbeforeunload?
			window.name = TEAencrypt(JSON.stringify(data), this.SWID);
		},

		//	Method: removeItem
		//		This will remove specific key from the stoage facility
		//
		//	Parameters:
		//		key - (String) the key you wish to remove
		//
		removeItem: function(key) {
			// get the current window.name data
			var data = this._storedData();
			try {
				delete data[key];
			} catch (e) {}
			// store the data in window.name
			window.name = TEAencrypt(JSON.stringify(data), this.SWID);
		}
		
	};


	// 	Class: ESPN_SessionStorage
	//		This class is used to interface with the window.sessionStorage facility
	//		Data is not encrypted here because it's stored based on domain name by the browser.
	//
	function ESPN_SessionStorage() {}

	ESPN_SessionStorage.prototype = {

		//	Method: getItem
		//		This will retrieve a value for a specific key
		//
		//	Parameters:
		//		key - (String) the key you wish to look up
		//
		//	Returns:
		//		value - (String|Boolean|Number|Object|Array) the value stored in the key
		//
		getItem: function(key) {
			var val = null;
			try {
				val = !!window.sessionStorage[key].value ? window.sessionStorage[key].value : window.sessionStorage[key];
				val = JSON.parse(val);
			} catch (e) {}
			return val;
		},
		
		//	Method: setItem
		//		This will set a value for a specific key
		//
		//	Parameters:
		//		key - (String) the key you wish to look up
		//		value - (String|Boolean|Number|Object|Array) value - the data to store
		//
		setItem: function(key,val) {
			window.sessionStorage[key] = JSON.stringify(val);
		},
		
		//	Method: removeItem
		//		This will remove specific key from the stoage facility
		//
		//	Parameters:
		//		key - (String) the key you wish to remove
		//
		removeItem: function(key) {		
			window.sessionStorage.removeItem(key);
		}

	};

	function ESPN_LocalStorage(){}
	var proto = {setItem:function(){},getItem:function(){},removeItem:function(){}};
	try {
		//if('localStorage' in window && window.localStorage !== null) {
		if(supportsLocalStorage) { 
			proto = {
				getItem: function(k) {
					var val = null;
					try {
						val = window.localStorage[k] || null;
						if(val) {
							val = JSON.parse(val);
						}
					} catch (e) {}
					return val;
				},
				setItem: function(k, v) {
					try { 
						window.localStorage[k] = JSON.stringify(v);
					} catch(e) {}
				},
				removeItem: function(k) {
					try {
						window.localStorage.removeItem(k);
					} catch(e) {}
				}
			};
		}
	} catch(e) { }
	ESPN_LocalStorage.prototype = proto;

	// 	Namespace: espn.storage
	//		The storage mechanism determines whether to use window.name or window.sessionStorage to store data.
	//		This should be the default gateway to storing session data.
	window.espn = window.espn || {};
	
	(function() {

		// 	where are we going to store our p13n data?
		//	cool clients get the cool toys all others use window.name
		var store = supportsSessionStorage ? new ESPN_SessionStorage() : new ESPN_WindowNameStorage(),
			permStore = new ESPN_LocalStorage();

		/**
		 * storage factory
		 *
		 * builder for storage objects
		 */
		espn.storageFactory = {
			/**
			 * Returns the most permanent storage type available
			 * for the device. If local storage is available, that is used
			 * otherwise a session storage instance is returned
			 */
			getSessionStorage: function() {
				return store;
			},
			getMostPermanent: function() {
				if(supportsLocalStorage) {
					return permStore;
				}
				return store;
			}
		};

		espn.storage = {
			/*
				Method: espn.storage.getItem
					Grab data from the storage mechanism for the key specified

				Parameters:
					key - (String) the key that corresponds to the data you wish to retrieve

				Returns:
					value - (Array|Boolean|Object|Number|String) the stored value for the specified key

			*/
			"getItem" : function(key) { return store.getItem(key); },

			/*
				Method: espn.storage.setItem
					Set data in storage mechanism for the key specified

				Parameters:
					key - (String) the key that corresponds to the data you wish to store
					value - (Array|Boolean|Object|Number|String) the value for the specified key

			*/
			"setItem" : function(key,val) { return store.setItem(key,val); },

			/*
				Method: espn.storage.removeItem
					Remove data in the storage mechanism for the key specified

				Parameters:
					key - (String) the key that corresponds to the data you wish to remove
			*/
			"removeItem" : function(key) { return store.removeItem(key); },
		};

	})();

})(this.jQuery,this,this.document); // end closure - `this` should be in global scope, thus window
