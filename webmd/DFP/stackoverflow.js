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