var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
var $googleloaded;

(function () {
    var notLoadGPT = (function() {
        var domainBlackList = [
            /fit\.(\w+\.){0,1}webmd\.com/i,
            /\w+\.(m\.)?webmd\.boots\.com/i
        ];
        var wmdDomain = document.domain;

        for(var i=0; i<domainBlackList.length; i++) {
            if(domainBlackList[i].test(wmdDomain)) {
                return true;
            }
        }
        return false;
    })();

    if (notLoadGPT) {
        $googleloaded = false;
        return false;
    }

    $googleloaded = true;
    window.advBidxc = window.advBidxc || {};
    window.advBidxc.renderAd = function () {
    };
    window.advBidxc.startTime = new Date().getTime();
    window.advBidxc.timeout = 300;
    window.advBidxc.version = 2.4;

    var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    if (ismobile) {
        window.advBidxc.customerId = '8CUF3O331';
    }
    else {
        window.advBidxc.customerId = '8CU66J63J';
    }

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

    function loadGPT() {
        if (!window.advBidxc.isAdServerLoaded) {
            loadScript('//www.googletagservices.com/tag/js/gpt.js');
            window.advBidxc.isAdServerLoaded = true;
        }
    }

    function loadGPTAfterDelay(MAX_DELAY) {
        window.advBidxc.isWebmdGptInit = true;
        setTimeout(window.advBidxc.loadGPT, MAX_DELAY || window.advBidxc.timeout);//Default 300MS
    }

    window.advBidxc.loadGPT = loadGPT;
    window.advBidxc.loadGPTAfterDelay = loadGPTAfterDelay;

    var mnSrc = ('https:' == document.location.protocol ? 'https:' : 'http:') +
            '//contextual.media.net/bidexchange.js?cid=' + window.advBidxc.customerId + '&version=' +
            window.advBidxc.version;
    document.write('<scr' + 'ipt type="text/javascript" src="' + mnSrc + '"></scr' + 'ipt>');

    window.advBidxc.loadGPTAfterDelay(0);

})();