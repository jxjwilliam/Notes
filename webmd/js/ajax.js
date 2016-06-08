/*!
 * webmd.medscape - target and flight medscape ads to users on WebMD identified as medscape users.
 * https://confluence.webmd.net/pages/viewpage.action?spaceKey=ProfessionalDev&title=Target+medscape+users+on+webmd.com
 * https://jira.webmd.net/browse/PPE-56960
 * make a call to the api in medscape.com to get the user details and write the cookie with updated info.
 */

// Create a local scope and run on document ready
$(function() {

	// if in iframe, exit;
	if (window.top !== window.self) {
		webmd.debug('medscape beacon not fired in iframe.');
		return false;
	}

	// if inside of an https page or local, exit;
	if (location.protocol !== 'http:') {
		webmd.debug('medscape beacon not fired in https.');
		return false;
	}

	// allow other code to disable the beacon
	if (webmd.beaconDisable) {
		webmd.debug('medscape beacon not fired due to beaconDisable.');
		return false;
	}

	// we need to exclude fit, so doing a simple match on "fit." in the hostname
	if (window.location.hostname.indexOf('fit.') > -1) {
		webmd.debug('medscape beacon not fired on Fit');
		return false;
	}

	// we need to not fire these beacons on iOS or inside the WebMD app
	if (webmd.useragent.ua.appview) {
		webmd.debug('medscape beacon not fired in WebMD App');
		return false;
	}

	webmd.medscape = {

		/*
		 * medscape cookie
		 */
		medat: webmd.cookie.get('medat'),

		/*
		 * a mapping of key definitions for custom params we want to set in dfp.
		 * we need this mapping because the key names returned from the API do not necessarily match keys names used in DFP
		 */
		dfp_params_to_set: {
			'o':'occ',
			'c':'ct',
			'p':'pf',
			'st':'st',
			'tl':'tar',
			'ps':'usp',
			'tac':'tc'
		},

		/*
		 * the amount of time we will wait to get a response from the medscape API
		 */
		timeout: 3000,

		init: function () {
			var
			cookieParts,
			options,
			self = this;

			/*
			 * check if a medat cookie exists, if it does not, do nothing.
			 * if it does, then check if it is more than 60 minutes old and refresh the cookie if it is.
			 */
			if ( this.medat ) {
				cookieParts = this.parseCookie(this.medat, '&');

				// refresh the medscape cookie if it is more than 1 hour old.
				if ( cookieParts.dt && new Date() - new Date(cookieParts.dt) > (60 * 60 * 1000) ) {

					webmd.debug('refreshing medscape cookie...');

					$.ajax({
						url: 'http://api.qa01.medscape.com/servicegateway/medscapeuserdata',
						xhrFields: {
							withCredentials: true
						},
						timeout: self.timeout,
						success: function (d, status, xhr) {
							if (d) {
								// refresh the medscape cookie with latest user info
								$('<iframe/>').attr({
									id: 'medscapeBeacon',
									src: '//img.webmd.com/medscape/medscapebeacon.html?' + d,
									style: 'width:0px; height:0px; border:0px;'
								}).appendTo('body');

								options = self.parseStr(d, '&');

								// set custom params
								webmd.ads2.setPageTarget(options);

								// refresh ads
								webmd.ads2.refresh();
							} else {
								webmd.debug('==== empty response from medscape API ====');
							}
						},
						error: function (xhr, status, error) {
							webmd.debug('MEDSCAPE CONNECTION FAILED: ' + error);
						}
					});
				} else {

					// get the values we need from the cookie
					options = this.pluck(cookieParts);

					// set custom params
					webmd.ads2.setPageTarget(options);

					// refresh ads
					webmd.ads2.refresh();
				}
			} else {
				webmd.debug('medscape cookie not needed.');
			}
		},
		/*
		 * get a subset of an object containing custom params we want to set in DFP.
		 * @param {Object} obj: An object containing key/value pairs.
		 * @return {Object} a dictionary containing custom parameters to set in DFP.
		 */
		pluck: function (obj, o) {
			var
				options = {},
				key;

			o = o || this.dfp_params_to_set;
			for (key in obj) {
				if (key in o) {
					options[o[key]] = obj[key];
				}
			}

			return options;
		},
		/*
		 * parse a cookie string and returns an object containing key/value pairs
		 * @str {String} str: A delimeted string
		 * @delimeter {String} delimeter: A string used to separate parameters
		 * @return {Object} an object containing key/value pairs.
		 */
		parseCookie: function (str, delimeter) {
			var
				o,
				j,
				i,
				l,
				options = {};

			o = str.split(delimeter);
			l = o.length;

			for (i = 0; i < l; i++) {
				j = o[i].split('=');

				if ( j[0] ) {
					options[[j[0]]] = j[1] || '';
				}
			}

			return options;
		}
	};

	webmd.medscape.init();
});




$.ajax({
	url: 'http://api.qa01.medscape.com/servicegateway/medscapeuserdata',
	xhrFields: {
		withCredentials: true
	},
	timeout: 3000,
	success: function (result, status, xhr) {
		var d = JSON.stringify(result);
		console.log(d);
	},
	error: function (xhr, status, error) {
		console.log('MEDSCAPE CONNECTION FAILED: ' + error);
	}
});



/**
 * http://stackoverflow.com/questions/5436327/jquery-deferreds-and-promises-then-vs-done
 */
 // 1. jQuery’s $.ajax.done()
var jqxhr = $.ajax({
        url: 'http://api.qa01.medscape.com/servicegateway/medscapeuserdata',
        xhrFields: {withCredentials: true}
    })
    .done(function (data, textStatus, jqXHR) {
        alert("success 1");
        console.log('success 1:', data);
        return 'data 1';
    })
    .done(function (data, textStatus, jqXHR) {
        alert("success 2");
        console.log('success 2:', data);
        return 'data 2';
    })
    .done(function (data, textStatus, jqXHR) {
        alert("success 3");
        console.log('success 3:', data);
        return 'data 3';
    })
    .fail(function () {
        alert("error");
    })
    .always(function () {
        alert("complete");
    });

// Set another completion function for the request above
jqxhr.always(function () {
    alert("second complete");
});



// 2. jQuery’s $.ajax.then()
var jqxhr = $.ajax({
        url: 'http://api.qa01.medscape.com/servicegateway/medscapeuserdata',
        xhrFields: {withCredentials: true}
    })
    .then(function (data, textStatus, jqXHR) {
        alert("success 1");
        console.log('success 1:', data);
        return 'data 1';
    })
    .then(function (data, textStatus, jqXHR) {
        alert("success 2");
        console.log('success 2:', data);
        return 'data 2';
    })
    .then(function (data, textStatus, jqXHR) {
        alert("success 3");
        console.log('success 3:', data);
        return 'data 3';
    })
    .fail(function () {
        alert("error");
    })
    .always(function () {
        alert("complete");
    });


// Set another completion function for the request above
jqxhr.always(function () {
    alert("second complete");
});



//////////////////

webmd.setProps = function(key, cb) {
	var obj = {};
	obj[key] = cb.call(this);
	return obj;
}

webmd.setProps('abcd', function() {
	return 'omg';
});

Object {abcd: "omg"}