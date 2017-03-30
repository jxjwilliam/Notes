// chrome://net-internals/#events
// chrome://extensions/

window.location.hostname
window.top !== window.self // in iframe


document.getElementsByTagName("meta");
var element = document.querySelector('meta[property="og:type"]');
var content = element.getAttribute("content");


//<script type='text/javascript'></script>
 (function() {
   var useSSL = 'https:' == document.location.protocol;
   var src = (useSSL ? 'https:' : 'http:') +
       '//www.googletagservices.com/tag/js/gpt.js';
   document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
 })();


// loadScript('//www.googletagservices.com/tag/js/gpt.js');
function loadScript(tagSrc) {
    if (tagSrc.substr(0, 4) !== 'http') {
        var isSSL = 'https:' == document.location.protocol;
        tagSrc = (isSSL ? 'https:' : 'http:') + tagSrc;
    }
    var scriptTag = document.createElement('script'),
        placeTag = document.getElementsByTagName("script")[0];
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = tagSrc;
    placeTag.parentNode.insertBefore(scriptTag, placeTag);
}

(function() {
    if (window.navigator.userAgent.indexOf('mobile') !== -1) { // mobile
    }
    else { // desktop
    }
}());

/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i)) {
        return 'iOS';
    } else if( userAgent.match( /Android/i)) {
        return 'Android';
    } else {
        return 'unknown';
    }
}

// window.navigator.userAgent

/**
 responsive - screen size:
  > 1239
  1024- 1239
  768 - 1023
  640 - 767
  <640
 */