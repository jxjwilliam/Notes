/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function (b, c) {
    var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}), a;
    $.throttle = a = function (e, f, j, i) {
        var h, d = 0;
        if (typeof f !== "boolean") {
            i = j;
            j = f;
            f = c
        }
        function g() {
            var o = this, m = +new Date() - d, n = arguments;

            function l() {
                d = +new Date();
                j.apply(o, n)
            }

            function k() {
                h = c
            }

            if (i && !h) {
                l()
            }
            h && clearTimeout(h);
            if (i === c && m > e) {
                l()
            } else {
                if (f !== true) {
                    h = setTimeout(i ? k : l, i === c ? e - m : e)
                }
            }
        }

        if ($.guid) {
            g.guid = j.guid = j.guid || $.guid++
        }
        return g
    };
    $.debounce = function (d, e, f) {
        return f === c ? a(d, e, false) : a(d, f, e !== false)
    }
})(this);

/**
 * Set up the object that will hold our infinte scroll code
 * @type {Object}
 */
var webmd = window.webmd || {};

// run just 1 time - using closure.
webmd.getCurrentUrl = webmd.getCurrentUrl || (function () {
        var url = document.location.href.replace(/[\?#].*$/, '');
        return function () {
            return url;
        };
    }.call());

webmd.Scrolling = {
    Debounce: 'Debounce',
    DebounceNumber: 500
};

webmd.getDebounceNumber = function (str) {
    var qs = unescape(str).split('&').filter(function (param) {
        return param.indexOf(webmd.Scrolling.Debounce) !== -1;
    })[0];
    var no = 0;
    if (qs) {
        no = parseInt(qs.replace(/^[\?#]?\w+=/, ''));
    }
    return no;
};


(function ($) {
    /**
     * Doing some checks here. If the program is sponsored or a special report we add
     * a class so we can handle it in a custom manner
     */
    if ((typeof window.s_sponsor_program != 'undefined' && window.s_sponsor_program)) {
        $('html').addClass('inProgram');
    }

    webmd.infiniteScroll = webmd.infiniteScroll || {

            index: 0,

            init: function (obj) {
                // If there aren't any pages in the
                // article, then we don't need to start
                // an infinite article
                if (!this.hasPages()) {
                    return false;
                }

                // Start a count of DFP ads so we can
                // give each one a unique ID
                this.dfpAdNumber = 0;

                this.opts = $.extend({}, this.defaults, obj);

                this.enableInfiniteScroll();
                this.setUpAdContainers();
                this.bindEvents();
            },

            /**
             * Handles initial pageview on load. If there
             * is only one page, we pass 99, otherwise, we
             * pass the page number we are on
             * @return {Boolean} If there ARE pages, return False,
             * otherwise, return true.
             */
            hasPages: function () {
                var pcount = $('section.page').length, self = this;

                if ((pcount === 1) || pcount === 0) {
                    webmd.metrics.dpv({
                        iCount: 99,
                        pageName: webmd.getCurrentUrl(),
                        refresh: false
                    });

                    // append end-of-article ad since this is a 1-page article
                    var adContainer = $('<div/>', {class: 'inStreamAd'});
                    $('.article .attribution').append(adContainer);

                    // cache the value of the pageview id so we can later use to update the pvid of the bottom ad call
                    window.pvid = window.s_pageview_id;
                    return false;
                }
                else {
                    webmd.metrics.dpv({
                        iCount: 1,
                        pageName: webmd.getCurrentUrl(),
                        refresh: false
                    });
                    // william:
                    var dno = webmd.getDebounceNumber(document.location.search);
                    if (!isNaN(dno)) {
                        webmd.Scrolling.DebounceNumber = dno;
                    }
                    console.log('hasPages should be here: ', webmd.Scrolling.DebounceNumber);
                    return true;
                }
            },

            /**
             * Pretty self explanatory here. We do all of our binding
             * in here, in an up front manner, so we can keep it organized
             * and clean.
             */
            bindEvents: function () {
                var self = this;

                /**
                 * Attach listener to scroll event so we can do our infinite
                 * scroll stuff.
                 */
                self.opts.scrollTarget.on('scroll', function () {
                    /**
                     * The container that is defined in the init config has a
                     * data attr [data-infinite-scroll]. This data attr is a
                     * bool value and will tell you if inifinite scroll is enabled
                     * or disabled.
                     * Refere to -> enableInfiniteScroll function
                     */
                    if (self.opts.container.data('infinite-scroll')) {
                        /**
                         * This checks to see if we have scrolled far enough
                         * down the page to start loading in the next page.
                         */
                        self.checkForLoad();
                    }
                });

                self.opts.container.on('loadContent', function () {
                    /**
                     * Temporarily disable infinite scroll so we don't
                     * keep firing it while we load the content we need.
                     * This is expecially helpful when loading in AJAX content.
                     */
                    self.disableInfiniteScroll();
                    /**
                     * Currently uses non ajax call by default, but this
                     * can be set up to use an ajax call.
                     */
                    self.loadContent();
                });

                /**
                 * When we have the content we need, have the ads loaded, and
                 * we have fired a page view call, the contentLoaded event gets
                 * fired. When it's fired we know it's ok to re-enable infnite scroll
                 * and get ready to do the next page.
                 */
                self.opts.container.on('contentLoaded', function () {
                    self.enableInfiniteScroll();
                });

                /**
                 * Disables infinite scrolling when the content is loading
                 * or when there are no pages left to load.
                 */
                self.opts.container.on('disableInfinite', function () {
                    self.disableInfiniteScroll();
                });
            },

            /**
             * Iterate through the pages and insert ad container divs
             * so we can later populate those divs with ads as we scroll
             */
            setUpAdContainers: function () {
                var self = this;

                var lastPageNum = $('section.page:last').data('page-number');

                /**
                 * Loop through all the pages and add an Ad container to them
                 * This lets us easily give the container an ID to target them
                 * later. COULD PROB BE IN THE XSL, but we did it here bc
                 * the number of ads was changing a lot.
                 */
                $('section.page').each(function (i, elm) {
                    var adContainer = $('<div/>', {class: 'inStreamAd'}),
                        $elm = $(elm),
                        pageNum = $elm.data('page-number');

                    /**
                     * if it's the first page, go ahead and put an ad
                     * in since the page is already showing.
                     */
                    if ($elm.is('#page-1')) {
                        $elm.append(adContainer);
                        setTimeout(function () {
                            self.insertAd($('#page-1'), true);
                        }, 0);
                        /**
                         * we have to put the ad in a different place if
                         * it's the last page.
                         */
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
             * Set up so Infinite scroll is backwards compatible
             * with DE.
             * ------ NOT REALLY NEEDED NOW FOR CORE SINCE WE ROLLED OUT DFP ------
             * @return {String} The ad server type, Either DFP or Default
             */
            checkAdServerType: function () {
                this.adServer = 'defaultServer';

                if (typeof webmd.ads2 != 'undefined' && webmd.ads2.isInitialized()) {
                    this.adServer = 'dfp';
                } else {
                    this.adServer = 'defaultServer';
                }

                return this.adServer;
            },

            /**
             * We check the amount we have scrolled and see if
             * that is far enough to load the next piece of infinite
             * content.
             */
            checkForLoad: function () {
                var target = this.opts.scrollTarget,
                    container = this.opts.container,
                    windowHeight = window.innerHeight ? window.innerHeight : $(window).height(),
                    contentTop = $(this.opts.content + ':visible:last').offset().top,
                    diff = windowHeight - $(this.opts.content + ':visible:last').height(),
                    mayLoadContent = $(window).scrollTop() >= (contentTop - diff - this.opts.heightOffset);

                /**
                 * If we've scrolled far enough, trigger the load content event
                 * signaling that it's ok to load content.
                 */
                if (mayLoadContent) {
                    this.opts.container.trigger('loadContent');
                }
            },

            /**
             * Used to make sure the content is loaded before
             * a page is faded in. Goes with the next function that
             * disables infinite scroll. Useful when Ajaxing content in
             */
            enableInfiniteScroll: function () {
                this.opts.container.data('infinite-scroll', true);
            },

            /**
             * Disables infinite scrolling when the content is loading
             * or when there are no pages left to load.
             */
            disableInfiniteScroll: function () {
                this.opts.container.data('infinite-scroll', false);
            },

            /**
             * Gets called when the page is a scroll
             * position that is ready to load content.
             * It calls a default of nonAjaxCall since we currently
             * have all the pages upfront.
             */
            loadContent: function () {
                this.nonAjaxCall();
            },

            /**
             * Shows the next page
             * @param  {Object} $elm jquery object of current page
             */
            showNext: function ($elm) {
                $elm.next().show();
            },

            /**
             * Makes the metrics call to webmd.metrics.dpv
             * @param  {Objec} Object with params for the metrics call.
             */
            metricsCall: function (obj) {
                webmd.metrics.dpv(obj);
            },

            /**
             * Checks to see which ad system we are using and
             * then inserts the add into the appropriate page
             * @param  {Object} target jQuery object
             */
            insertAd: function (target, firstAd) {
                if (this.checkAdServerType() === 'defaultServer') {
                    this.callDefaultAd(target);
                } else {
                    this.callDFPHouseAd(target);
                }
            },

            /**
             * Creates a default ad with the DE server
             * @param  {Object} target jQuery selector object
             */
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
                    $('.attribution .inStreamAd')
                        .append('<div class="ad_label">Advertisement</div>')
                        .append($iframe);
                } else {
                    $('.inStreamAd', target)
                        .append('<div class="ad_label">Advertisement</div>')
                        .append($iframe);
                }
            },

            /**
             * Creates an ad call that goes with DFP ad server
             * @param  {Object}} target jQuery selector object for
             * where the ad will get inserted
             */
            callDFPHouseAd: function (target) {
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
                    sizes: [[300, 50], [300, 51], [300, 250], [300, 253], [320, 50], [320, 51]]
                });

                // keep track of the current page number
                this.index = num;
            },

            /**
             * We need a new pvid for each infinite page
             * ad call. This creates that.
             * @return {Number}
             */
            createInfinitePageviewId: function () {
                var self = this;

                // getting the date, getting the seconds from epoch, slicing off the first two characters as we only want 11 here
                var timestamp = new Date().getTime().toString().slice(2),

                // making an 8 digit random number (using toFixed to make sure it's always 8)
                    randomNumber = Math.random().toFixed(8).substr(2, 8);

                // set the global variable to the 19 digit page view id
                self.s_pageview_id = timestamp + randomNumber;
            },

            /**
             * If we are not making an Ajax call for the content,
             * then we just used the content that is on the page but
             * hidden on page load.
             * ---- IT'S CURRENTLY THE DEFAULT ----
             */
            nonAjaxCall: function () {
                var self = this;

                if (self.opts.beforeLoad !== null) {
                    self.opts.beforeLoad(self.opts.content);
                }

                if (self.opts.afterLoad !== null) {
                    self.opts.afterLoad($(self.opts.content));
                }
            },

            defaults: {
                moduleCount: -1,
                loadPattern: null,
                afterLoad: null,
                beforeLoad: null,
                container: null,
                content: 'page.html',
                contentData: {},
                heightOffset: 0,
                scrollTarget: $(window),
                pageUrl: null
            }

        };

})(jQuery);

// Init for Infinite Scroll Plugin

$(function () {

    /**
     * Get the list of funded urls for which we want to allow in-article placements.
     * https://jira.webmd.net/browse/PPE-23261
     * @param {string} dctmId The documentum id of the shared module containing list of funded urls
     */
    var url = 'http://www' + webmd.url.getLifecycle() + '.m.webmd.com/modules/sponsor-box?id=091e9c5e812b356a';

    $.ajax({
        dataType: 'html',
        url: url,
        success: function (data) {
            var exclusionsList = $(data).find('.exception-list').html();

            //create a new script tag in the DOM
            var s = document.createElement("script");
            s.type = "text/javascript";
            //put the exclusions object in the new script tag
            s.innerHTML = exclusionsList;

            //append nativeAdObj to the DOM
            $('head').append(s);
        },
        error: function (xhr, status, error) {
            webmd.debug(xhr, status);
        },
        complete: function () {
            webmd.nativeAd.init({container: '#page-1'});
        }
    });

    /**
     * huge if statement to see if we are going to run the infinite
     * code. This is used since revenue products are still paginated
     * as well as some special reports.
     * The first part of the if statement handles what happens when
     * we don't run infinite. Instead we build out pagination dynamically
     */

    /** JIRA PPE-8670: added an extra condition to use infinite layout if article is sponsored & topic-targeted **/

    if ((window.s_sponsor_program && window.s_package_type.indexOf('topic targeted') < 0) || window.s_package_name == "Mobile Ebola Virus Infection") {

        webmd.debug('Dont do infinite bc we are sponsored or special report');

        webmd.infiniteScroll.hasPages();

        //Get the url params so we can see what page
        //number we are on. Used to build out pagination links
        var urlParam = webmd.url.getParams(),
            lastPage = $('.page:last').data('page-number'),
            curPage = urlParam.page,
            prevPage,
            nextPage;

        //HTML for our pagination
        var paginationTemplate = '<div class="pagination"><div class="previous icon-arrow-left"><a href="#"></a></div><div class="next icon-arrow-right"><a href="#"></a></div><div class="pagination-wrapper"><div class="pagination-title">Page 1 of 4</div></div></div>';

        //Insert our pagination after all the article text
        $('#textArea').after($(paginationTemplate));

        if (typeof curPage === 'undefined' || curPage === 1 || location.search.indexOf('page=1') !== -1) {
            $('#textArea .loading_medium_png').remove();
            $('.pagination').find('.previous').addClass('disabled');
            $('.pagination').find('.previous a').on('click', function (e) {
                e.preventDefault();
            });
            $('.pagination').find('.pagination-title').text('Page 1' + ' of ' + lastPage);
            $('.pagination').find('.next a').attr('href', '?page=2');
        }
        else {
            prevPage = parseInt(curPage) - 1;
            nextPage = parseInt(curPage) + 1;

            $('.pagination').find('.pagination-title').text('Page ' + parseInt(curPage) + ' of ' + lastPage);
            $('.pagination').find('.previous a').attr('href', '?page=' + prevPage);
            $('.pagination').find('.next a').attr('href', '?page=' + nextPage);

            if (parseInt(curPage) === lastPage) {
                $('.pagination').find('.next').addClass('disabled');
                $('.pagination').find('.next a').on('click', function (e) {
                    e.preventDefault();
                });
            }
        }

        var pageNumber = 1;

        if (typeof webmd.url.getParam('page') != 'undefined') {
            pageNumber = webmd.url.getParam('page');
        }

        // hide from app view
        if (!webmd.useragent.ua.appview) {
            webmd.nativeAd.init({container: '#page-' + pageNumber});
        }

    } else {

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

        /**
         * We need to recalculate the trigger point for every waypoint as we update the dom.
         */
        window.onElementHeightChange(document.body, function () {
            jQuery.waypoints('refresh');
        });

        var articleInfinite = Object.create(webmd.infiniteScroll);

        articleInfinite.init({
            container: $('.article.infinite'),
            content: '.page',
            heightOffset: 200,
            pageUrl: webmd.getCurrentUrl(),

            beforeLoad: function (contentClass) {
                $('.infinite .page:visible:last').next();
            },

            afterLoad: function (elementsLoaded) {
                var target = $('.infinite .page:visible:last'),
                    targetNext = $(elementsLoaded).filter(':visible:last').next('.page'),
                    hasAdhesive = false;

                if (targetNext.length === 0) {
                    articleInfinite.opts.container.trigger('disableInfinite');
                    return;
                }

                var targetNextNumber = targetNext.data('page-number');

                webmd.infiniteScroll.showNext(target);

                var pageNumber = parseInt(targetNext.attr('id').slice(-1));

                if (!webmd.useragent.ua.appview) {
                    webmd.nativeAd.init({container: '#' + targetNext.attr('id')});
                }

                clearTimeout(window.pageViewTimeout);

                $(targetNext).waypoint(function () {
                        window.pageViewTimeout = setTimeout(function () {

                            webmd.infiniteScroll.metricsCall({
                                moduleName: 'pg-n-swipe',
                                pageName: this.pageUrl,
                                iCount: targetNextNumber,
                                refresh: false
                            });

                            if (!$('body').hasClass('adhesive_ad')) {
                                if (targetNext.find('.inStreamAd').length > 0 || targetNext.is('.last')) {
                                    webmd.infiniteScroll.insertAd(targetNext, false);
                                }
                            }
                        }, 0);
                    },
                    {
                        offset: '50%',
                        triggerOnce: true
                    });

                this.container.trigger('contentLoaded');
            }
        });

        $('footer.attribution').waypoint(function () {

            setTimeout(function () {
                // force a new co-relation id
                if (typeof googletag != 'undefined') {
                    googletag.pubads().updateCorrelator();
                }

                /**
                 * we need to manually update the pvid for the bottom ad to match the pvid of the top ad since technically they are on same page.
                 * Also pass ad identifier to DFP (see https://jira.webmd.net/browse/PPE-53106).
                 */
                webmd.ads2.setPageTarget({
                    'pvid': window.pvid || window.s_pageview_id,
                    'pg': $('.page').length + 1,
                    'al': 'cons_bot'
                });

                webmd.ads2.defineAd({
                    id: 'ads2-pos-2026-ad_btm',
                    pos: '2026',
                    sizes: [[300, 50], [300, 51], [300, 250], [300, 253], [320, 50], [320, 51]],
                });

                /**
                 * clear the 'al' page target here after the bottom ad call so it doesn't get passed in subsequent ad calls.
                 */
                if (webmd.ads2.pageTarget.hasOwnProperty('al')) {
                    delete webmd.ads2.pageTargets.al;
                    googletag.pubads().clearTargeting('al');
                }

            }, 500);
        }, {
            offset: '50%',
            triggerOnce: true
        });
    }
});