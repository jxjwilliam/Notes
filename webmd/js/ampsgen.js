var api = require('./api');
var dom = require('xmldom').DOMParser;
var xpath = require('xpath');
var helper = require('./helper');
var WebmdApi = require('../models/WebmdApi.js');
var fs = require("fs");
var configSettings = require("../configSettings");
var config = configSettings.getConfig();
var cheerio = require("cheerio");

exports.getAMPVersion = function (req, res) {

    api.getArticle(req.params.id, function (err, article) {

        if (article) {
            //generate AMP version
            try {
                generateAMPVersion(article.data.docs[0].wxml_content[0], res, req);

            } catch (e) {
                res.status(500);
                res.send("Server Error");
            } finally {

            }
        }
    });
};


function generateAMPVersion(xml, res, req) {
    var wapi = WebmdApi.init(xml, "xml"),
        output = [];

    var amp_levels = [
        '/8668145/consmobileweb/webmdmobileweb',         //perf + exist: work
        '/8668145/consampmobileweb/webmdampmobileweb',   //perf + amp-tag: not work
        '/4312434/consmobileweb/webmdmobileweb',         //live + exist: work
        '/4312434/consampmobileweb/webmdampmobileweb'   //live + amp-tag: not work
    ];

    wapi.done(function (api) {

        var amp_scp = {
            art: api.getArticleId(),
            env: config.env ? config.env : '1',
            pt: api.getTopic()
        };

        var getAmdAdTag_300x250 = function () {
            var ampAd = [
                '<div class="ad_div">',
                '<div class="ad_label">Advertisement</div>',
                '<amp-ad width=300 height=250 ',
                '  type="doubleclick" '
            ];
            return function (level, scp) {
                var str = ampAd.join('');
                if (level) {
                    str += '  data-slot="' + level + '" ';
                }
                else {
                    str += '  data-slot="' + amp_levels[1] + '" ';
                }
                if (scp) {
                    str += '  json=\'{ "targeting": ' + JSON.stringify(scp) + ' } \' ';
                }
                else {
                    str += '  json=\'{ "targeting": ' + JSON.stringify(amp_scp) + ' } \' ';
                }

                return str + '></amp-ad></div>';
            }
        }.call(null);

        var getAmdAdTag_320x50 = function () {
            var ampAd = [
                '<div class="ad_div">',
                '<div class="ad_label">Advertisement</div>',
                '<amp-ad width=320 height=50 ',
                '  type="doubleclick" '
            ];
            return function (level, scp) {
                var str = ampAd.join('');
                str += '  data-slot="' + level + '" ';
                str += '  json=\'{ "targeting": ' + JSON.stringify(scp) + ' } \' ';
                return str + '></amp-ad></div>';
            }
        }.call();


        var authors = api.getAuthors();

        if (typeof authors !== "object" || typeof authors.length === "undefined" || authors.length < 1) {
            authors = [];

            if (/HealthDay\s+News/i.test(api.getPublisherName())) {
                authors.push({
                    firstname: "HealthDay",
                    middlename: "",
                    lastname: "Reporter",
                    suffix: ""
                });
            }
        }

        var adContent = api.getData();

        var $ = cheerio.load(adContent[0]['body']);
        var ampAd = getAmdAdTag_300x250(amp_levels[1], amp_scp);
        $('p').last().after(ampAd);

        ampAd = getAmdAdTag_320x50(amp_levels[1], amp_scp);
        $('p').first().after(ampAd);

        ampAd = getAmdAdTag_320x50(amp_levels[1], amp_scp);
        $('p').first().after(ampAd);

        adContent[0]['body'] = $.html();

        // test the second amp-ad:
        $ = cheerio.load(adContent[1]['body']);
        ampAd = getAmdAdTag_300x250(amp_levels[1], amp_scp);
        $('p').first().after(ampAd);
        adContent[1]['body'] = $.html();


        output.push({
            title: api.getTitle(),
            subtitle: api.getSubtitle(),
            publisher: api.getPublisher(),
            data: adContent,
            authorsMeta: authors,
            authors: api.getAuthors(),
            reviewers: api.getReviewers(),
            pubdate: api.getPubDate(),
            citations: api.getCitations(),
            copyright: api.getCopyright(),
            copyrightlogo: api.getCopyrightLogo(),
            url: api.getUrl(),
            canurl: api.getDesktopUrl(),
            busref: api.getBusref(),
            topic: api.getTopic(),
            imgobj: api.getMediaAsset()
        });

        res.setHeader('Access-Control-Allow-Origin', '*');

        res.render('pages/index', {
            title: output[0].title,
            subtitle: output[0].subtitle,
            publisher: output[0].publisher,
            pubdate: output[0].pubdate,
            authorsMeta: output[0].authorsMeta,
            authors: output[0].authors,
            reviewers: output[0].reviewers,
            output: output,
            citations: output[0].citations,
            copyright: output[0].copyright,
            copyrightlogo: output[0].copyrightlogo,
            url: output[0].url,
            canurl: output[0].canurl,
            busref: output[0].busref,
            topic: output[0].topic,
            imgobj: output[0].imgobj,
            env: config.Env == "live" ? "" : config.Env,
            ampSocialShare: false //something is wrong with the amp-social-share module so using our own copy for now
        });
    });

};
