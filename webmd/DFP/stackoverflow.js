// 1.
googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    if (event.slot.getSlotElementId() == "div-gpt-ad-123456789-0") {
        var containsAd = !event.isEmpty;     
    }
});


// 2.
var tries = 0; // Set your variable here...
googletag.pubads().addEventListener('slotRenderEnded', function(event) {
  // ...and not here. Otherwise it will always reset to 0 when the event triggers.
  // "tries" will still be available in here though as a closure so you can still use it
  if (tries<=2 && event.isEmpty==true) {
    googletag.pubads().refresh([slot1]);
    tries++;
  }
});


///////// broker.js /////////////
// http://siterecruit.comscore.com/sr/synvisc/broker.js
// https://siterecruit.comscore.com/sr/synvisc/broker.js
// http://siterecruit.comscore.com/sr/synvisc/broker.js
// https://siterecruit.comscore.com/sr/synvisc/broker.js


// -------- original: broker.js --------

function addEvent(elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
    elem.attachEvent("on" + event, function() {
        // set the this pointer same as addEventListener when fn is called
        return(fn.call(elem, window.event));   
    });
  }
}
// event, fn are undefined.


// ------------- new: broker.js -------------

function addEvent(elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
      if (/msie (8|7)/i.test(navigator.userAgent)) { 
        elem.attachEvent("on" + event, function() {
            // set the this pointer same as addEventListener when fn is called
            return(fn.call(elem, window.event));   
        });
      }
    }
}


// ------------- updated: broker.js -------------

function addEvent(elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
        if (typeof event !== 'undefined' && typeof fn !== 'undefined') {
            elem.attachEvent("on" + event, function () {
                // set the this pointer same as addEventListener when fn is called
                return (fn.call(elem, window.event));
            });
        }
    }
}