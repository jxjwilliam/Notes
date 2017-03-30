
Object.prototype.toString.call(obj) == "[object Object]" && Object.keys(obj).length>0

// recursive
function deepEqual(x, y) {
    return
    (x && y && typeof x === 'object' && typeof y === 'object') ?
    (Object.keys(x).length === Object.keys(y).length) &&
    Object.keys(x).reduce((isEqual, key) =>  isEqual && deepEqual(x[key], y[key]), true) : (x === y);
}

// event callback:
function addEvent(elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    }
    else {
        if (/msie (8|7)/i.test(navigator.userAgent)) {
            elem.attachEvent("on" + event, () => fn.call(elem, window.event));
        }
    }
}

// console
$($0).on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.info('event:', JSON.stringify(e));
    return false;
});

// debounce:
// debounce(googletag.pubads().refresh, 1000).apply(googletag.pubads());
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


// parse webmd.com -> ads?gdfp= -> cust_params query-string
// getDFP()('cui'), getDFP()('dmp')
function getDFP(wmdurl) {
    return (key) => {
        var qs = wmdurl.split('&').filter(item => {
            return item.indexOf(key) >= 0;
        })[0].split('=')[1];
        return decodeURIComponent(qs);
    }
}

// IIFE: Immediately Invoked Function Expression
(function(exports) {
    var ads2 = {};
    var ads2Consumer = {};

    exports.ads2 = ads2;
    exports.ads2Consumer = ads2Consumer;
})(window);

webmd.debug = (function() {
    var debug=/(localhost|192\.168\.|127\.0\.0)/.test(location.host) && !!window.console;
    return function() {
        return debug ? console.log.apply(console, arguments) : null;
    }
})();
