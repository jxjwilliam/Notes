var webmd = window.webmd || {};
webmd.infiniteScrollDebounce = webmd.infiniteScrollDebounce || {};
window.advBidxc = window.advBidxc || {};

(function ($) {

    webmd.infiniteScrollDebounce = {

        init: function (obj) {
            if (!this.hasPages()) {
                return false;
            }

            this.opts = $.extend({}, this.defaults, obj);

            this.setUpAdContainers();
        },

        // run just 1 time - using closure.
        getCurrentUrl: function () {
            return document.location.href.replace(/[\?#].*$/, '');
        },

        hasPages: function () {
            var pcount = $('section.page').length, self = this;
            var currentUrl = self.getCurrentUrl();

            // Only 1 mobile-page:
            if ((pcount === 1) || pcount === 0) {
                webmd.metrics.dpv({
                    iCount: 99,
                    pageName: currentUrl,
                    refresh: false
                });

                // append end-of-article ad since this is a 1-page article
                var adContainer = $('<div/>', {class: 'inStreamAd'});
                $('.article .attribution').append(adContainer);


                setTimeout(function () {
                    self.insertAd($('.attribution'));
                }, 1000);

                // cache the value of the pageview id so we can later use to update the pvid of the bottom ad call
                window.pvid = window.s_pageview_id;
                return false;
            }
            // Multiple mobile-pages:
            else {
                webmd.metrics.dpv({
                    iCount: 1,
                    pageName: currentUrl,
                    refresh: false
                });
                var dno = webmd.url.getParam('debounce');

                if (typeof dno !== 'undefined' && !isNaN(dno)) {
                    self.debounceNumber = dno;
                }
                return true;
            }
        },

        setUpAdContainers: function () {
            var self = this;

            var lastPageNum = $('section.page:last').data('page-number');

            $('section.page').each(function (i, elm) {
                var adContainer = $('<div/>', {class: 'inStreamAd'}),
                    $elm = $(elm),
                    pageNum = $elm.data('page-number');

                if ($elm.is('#page-1')) {
                    $elm.append(adContainer);
                    setTimeout(function () {
                        self.insertAd($('#page-1'), true);
                    }, 1000);
                }
                else if ($(elm).data('page-number') === lastPageNum) {
                    $(elm).addClass('last');
                    $('.article .attribution').append(adContainer);
                }
                else {
                    $elm.append(adContainer);
                }
            });
        },

        /**
         * Makes the metrics call to webmd.metrics.dpv
         * @param  {Objec} Object with params for the metrics call.
         */
        metricsCall: function(obj){
            webmd.metrics.dpv(obj);
        },

        insertAd: function (target, firstAd) {
            if (this.checkAdServerType() === 'defaultServer') {
                this.callDefaultAd(target);
            } else {
                this.callDFPHouseAd(target);
            }
        },

        callDefaultAd: function (target) {

            // Start function to create new pvid
            function replaceAdParam(srcStr, pName, pValue) {
                var paramRegEx = new RegExp("\\b" + pName + "=[^&#\"']*");

                srcStr = srcStr.replace(paramRegEx, pName + "=" + pValue);
                return srcStr;
            }

            // Random Num Generator for pvid
            function randomNum() {
                var randomNumber = Math.round(999999999 * Math.random());

                return randomNumber;
            }

            var pvid = this.s_pageview_id,
                adTag = $('#top_ad script')[1].src,
                transId = randomNum(),
                tileId = randomNum();

            // Reprocess AdTag
            adTag = adTag.replace(/amp;/g, '');
            adTag = adTag.replace('js.ng', 'html.ng');
            adTag = replaceAdParam(adTag, "pvid", pvid);
            adTag = replaceAdParam(adTag, "transactionID", transId);
            adTag = replaceAdParam(adTag, "tile", tileId);

            /**
             * Create an iFrame that will hold our ad
             * @type {Object}
             */
            var $iframe = $('<iframe/>').attr({
                src: adTag,
                height: 50,
                width: 320,
                margin: 0,
                padding: 0,
                marginwidth: 0,
                marginheight: 0,
                frameborder: 0,
                scrolling: 'no',
                marginLeft: '-20px',
                class: 'dynamic-house-ad'
            });

            if (target.is('.last')) {
                $('.attribution .inStreamAd').append('<div class="ad_label">Advertisement</div>');
                $('.attribution .inStreamAd').append($iframe);
            } else {
                $('.inStreamAd', target).append('<div class="ad_label">Advertisement</div>');
                $('.inStreamAd', target).append($iframe);
            }
        },

        checkAdServerType: function () {
            this.adServer = 'defaultServer';

            if (typeof webmd.ads2 != 'undefined' && webmd.ads2.isInitialized()) {
                this.adServer = 'dfp';
            } else {
                this.adServer = 'defaultServer';
            }

            return this.adServer;
        },

        callDFPHouseAd: function (target) {

            // avoid multiple <div class="ad_label">Advertisement</div><div id="infinite-ad-1"></div>.
            var container = $(target).find('div.ad_label');
            if (container.length > 0) {
                return;
            }

            var num = $(target).data('page-number') || 'ad-1',
                adId = 'infinite-ad-' + num,
                adContainer = $(target).find('.inStreamAd');

            if (target.is('.last')) {
                adContainer = $('.attribution .inStreamAd');

                // cache the value of the pageview id so we can later use to update the pvid of the bottom ad call
                window.pvid = window.s_pageview_id;
            }

            var domStr = '<div class="ad_label">Advertisement</div><div id="' + adId + '">';
            adContainer.append(domStr);

            window.ads2_ignore = {2026: false};

            // force a new co-relation id for dynamic ads calls
            if (typeof googletag != 'undefined') {
                googletag.cmd.push(function () {
                    googletag.pubads().updateCorrelator();
                });
            }

            /**
             * pass the number of the ad in the series.
             * example: for a page with seven 2026 ad units, setting pg = 4 tells the ad server that this is the fourth 2026 ad in the series
             */
            webmd.ads2.setPageTarget('pg', isNaN(num) ? 1 : num);

            webmd.ads2.defineAd({
                id: adId,
                pos: '2026',
                sizes: [[300, 50], [300, 51], [300, 250], [300, 253], [320, 50], [320, 51]],
                refresh: false,
                immediate: false
            });
        },

        defaults: {
            container: null,
            contentData: {},
            heightOffset: 0,
            scrollTarget: $(window),
            pageUrl: null,
            debounceNumber: 250
        }
    };

})(jQuery);


$(function () {

    if (window.s_topic && webmd.topicArray.indexOf(window.s_topic) !== -1 && !window.s_sponsor_program) {

        /**
         * This callback gets fired each time the document height changes.
         */
        window.onElementHeightChange = function (elm, callback) {
            var lastHeight = elm.clientHeight, newHeight;
            (function run() {
                newHeight = elm.clientHeight;
                if (lastHeight != newHeight) {
                    callback();
                }

                lastHeight = newHeight;
                if (elm.onElementHeightChangeTimer) {
                    clearTimeout(elm.onElementHeightChangeTimer);
                }

                elm.onElementHeightChangeTimer = setTimeout(run, 200);
            })();
        };
        window.onElementHeightChange(document.body, function () {
            jQuery.waypoints('refresh');
        });

        var articleInfiniteDebounce = Object.create(webmd.infiniteScrollDebounce);

        articleInfiniteDebounce.init({
            container: $('.article.infinite'),
            heightOffset: 200,
            pageUrl: webmd.infiniteScrollDebounce.getCurrentUrl()
        });

        $('section.page', 'article').fadeIn(100);

        var waypoint_opts = {
            offset: '50%',
            triggerOnce: true
        };

        var dnumber = articleInfiniteDebounce.opts.debounceNumber;

        if (articleInfiniteDebounce.debounceNumber || articleInfiniteDebounce.debounceNumber === 0) {
            dnumber = articleInfiniteDebounce.debounceNumber;
        }

        $('section.page', 'article').waypoint($.debounce(dnumber, function () {

            try {
                if (window.advBidxc.isLoaded) {
                    window.advBidxc.next();
                }
            } catch (e) {
            }

            var pid = $(this).prop('id');
            var pageNumber = $(this).data('page-number');

            // Michael suggested: only display in PERF-env. If in prod/staging, not display.
            if (webmd.url.getEnv() !== '') {
                webmd.debug.activate();
                $(this).css({color: 'blue'});
                webmd.debug('Page Number: ', pid, 'Debounce: ', dnumber);
                webmd.debug.deactivate();
            }


            webmd.infiniteScrollDebounce.metricsCall({
                moduleName: 'pg-n-swipe',
                pageName: document.location.href.replace(/[\?#].*/, ''),
                iCount: pageNumber,
                refresh: false
            });

            webmd.infiniteScrollDebounce.insertAd($('#' + pid), false);
            //articleInfiniteDebounce.callDFPHouseAd($('#' + pid));
        }));


        $('footer.attribution', 'article').waypoint(function () {

            try {
                if (window.advBidxc.isLoaded) {
                    window.advBidxc.next();
                }
            } catch (e) {
            }

            if (typeof googletag != 'undefined') {
                googletag.pubads().updateCorrelator();
            }

            webmd.ads2.setPageTarget({
                'pvid': window.pvid || window.s_pageview_id,
                'pg': $('section.page').length + 1,
                'al': 'cons_bot'
            });

            webmd.ads2.defineAd({
                id: 'ads2-pos-2026-ad_btm',
                pos: 2026,
                sizes: [[300, 50], [300, 51], [300, 250], [300, 253], [320, 50], [320, 51]],
                refresh: false,
                immediate: false
            });

            if (webmd.ads2.pageTargets.hasOwnProperty('al')) {
                delete webmd.ads2.pageTargets.al;
                googletag.pubads().clearTargeting('al');
            }

        }, waypoint_opts);
    }
});