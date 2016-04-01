var heartbeat_ary = ['video2/1/lib/VideoHeartbeat.min'];
if (typeof AppMeasurement !== 'function') {
    heartbeat_ary.push('video2/1/lib/AppMeasurement');
}
if (typeof Visitor !== 'function') {
    heartbeat_ary.push('video2/1/lib/VisitorAPI.js');
}

/**
 * use global s_md appMeasurement object instead of new instance.
 */
define(heartbeat_ary, function () {

    ////// 1. WebMD Adobe Heartbeat implementation //////
    function WebmdHeartbeat(webmdHBObj) {
        if (!webmdHBObj) {
            throw new Error("Illegal argument. VideoApi object cannot be null.");
        }
        this._webmdHBObj = webmdHBObj;

        // get default settings.
        this.defaults = {
            debugLogging: false,
            heartbeat: {
                //trackingServer: the server to which all the heartbeat calls are sent. Mandatory. Use the value provided by your Adobe consultant.
                //TODO: trackingServer: webmd.hb.omtrdc.net, http://heartbeats.omtrdc.net, std.o.webmd.com?
                trackingServer: 'http://heartbeats.omtrdc.net',
                trackingServer1: "std.o.webmd.com",
                trackingServerSecure: "ssl.o.webmd.com",

                jobId: 'sc_va',
                //channel: the name of the syndication channel. Optional. Default value: the empty string
                channel: "webmd-channel", //default: empty string
                //ovp: the name of the online video platform through which content gets distributed. Optional. Default value: "unknown"
                ovp: "unknown", //TODO: what is OVP?
                //sdk: the version of the video player app/SDK. Optional. Default value: "unknown"
                sdk: 'Heartbeats V-1.5.2',
                //quietMode: activates the "quiet" mode of operation, in which all output HTTP calls are suppressed. Default value: false
                quietMode: false, // No Network Calls Sent When True
                //ssl: Indicates whether the heartbeat calls should be made over HTTPS. Optional. Default value: false
                ssl: false
            },
            visitor: {
                marketingCloudOrgId: '16AD4362526701720A490D45@AdobeOrg',
                trackingServer: 'std.o.webmd.com',
                dpid: 'dpid',
                dpuuid: 'dpuuid'
            },
            appMeasurement: {
                account: 'sc_va',
                trackingServer: "std.o.webmd.com",
                trackingServer1: 'webmd.hb.omtrdc.net',
                pageName: 'WebMD Page Name'
            }
        };

        var config = this.defaults;

        // Set-up the AppMeasurement component.
        var appMeasurement = this.createAppMeasurement();

        // Setup the video-player plugin
        //var delegate = new ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate();
        var delegate = this.createPlayerDelegate();

        this._playerPlugin = new ADB.va.plugins.videoplayer.VideoPlayerPlugin(delegate);
        var playerPluginConfig = new ADB.va.plugins.videoplayer.VideoPlayerPluginConfig();
        playerPluginConfig.debugLogging = config.debugLogging;
        this._playerPlugin.configure(playerPluginConfig);

        // Setup the AppMeasurement plugin.
        delegate = new ADB.va.plugins.aa.AdobeAnalyticsPluginDelegate();

        delegate.onError = function (error) {
        };

        this._aaPlugin = new ADB.va.plugins.aa.AdobeAnalyticsPlugin(appMeasurement, delegate);
        var aaPluginConfig = new ADB.va.plugins.aa.AdobeAnalyticsPluginConfig();
        aaPluginConfig.channel = config.heartbeat.channel;
        aaPluginConfig.debugLogging = config.debugLogging;
        this._aaPlugin.configure(aaPluginConfig);

        // Setup the AdobeHeartbeat plugin.
        delegate = new ADB.va.plugins.ah.AdobeHeartbeatPluginDelegate();

        delegate.onError = function (error) {
        };

        var ahPlugin = new ADB.va.plugins.ah.AdobeHeartbeatPlugin(delegate);

        /**
         * second param is publisher: Mandatory.
         * Note: Existing customers using the Publisher ID can continue using it, but we recommend that you start using your Marketing Cloud Org ID instead.
         */
        var ahPluginConfig = new ADB.va.plugins.ah.AdobeHeartbeatPluginConfig(
            config.heartbeat.trackingServer,
            config.visitor.marketingCloudOrgId);

        ahPluginConfig.ovp = config.heartbeat.ovp;
        ahPluginConfig.sdk = config.heartbeat.sdk;
        ahPluginConfig.debugLogging = config.debugLogging;
        ahPlugin.configure(ahPluginConfig);

        var plugins = [this._playerPlugin, this._aaPlugin, ahPlugin];

        // Setup and configure the Heartbeat lib.
        delegate = new ADB.va.HeartbeatDelegate();
        delegate.onError = function (error) {
            console.error("Heartbeat error: " + error.getMessage() + " | " + error.getDetails());
        };
        this._heartbeat = new ADB.va.Heartbeat(delegate, plugins);
        var configData = new ADB.va.HeartbeatConfig();
        configData.debugLogging = config.debugLogging;
        this._heartbeat.configure(configData);
    }

    WebmdHeartbeat.prototype.getAccount = function () {
        var s_account;
        if (window.s_account) {
            s_account = window.s_account;
        }
        else {
            s_account = "webmddev";
        }
        return s_account;
    };

    /**
     * implement the logic:
     *   visitor is inherited from global-visitor, or create new instance?
     */
    WebmdHeartbeat.prototype.getVisitorInstance = function () {
        var visitor;
        var config = this.defaults;

        // TODO: 'Visitor' is injected by require-js' define()? or inherit from window.visitor?
        if (window.visitor) {
            visitor = window.visitor;
        }
        else {
            visitor = Visitor.getInstance(config.visitor.marketingCloudOrgId);
        }

        visitor.trackingServer = config.visitor.trackingServer;
        visitor.setCustomerIDs({
            "userId": {
                "id": config.visitor.dpid
            },
            "puuid": {
                "id": config.visitor.dpuuid
            }
        });
        return visitor;
    };

    /**
     * implement the logic:
     *   appMeasurement is inherited from s_md, or create new instance?
     */
    WebmdHeartbeat.prototype.createAppMeasurement = function () {
        var appMeasurement;
        var visitor = this.getVisitorInstance();
        var config = this.defaults;

        if (typeof window.s_md === 'object') {
            appMeasurement = window.s_md;
        }
        else {
            var account = this.getAccount();
            //appMeasurement = new AppMeasurement();
            appMeasurement = s_gi(account);
            appMeasurement.visitor = visitor;
            appMeasurement.trackingServer = config.appMeasurement.trackingServer;
            appMeasurement.account = config.appMeasurement.account;
            appMeasurement.pageName = config.appMeasurement.pageName;
            appMeasurement.charSet = "UTF-8";
            appMeasurement.visitorID = visitor.getMarketingCloudVisitorID();
        }
        return appMeasurement;
    };

    /**
     *  this is the bridge to fetch dynamic data into heartbeat-api calls.
     */
    WebmdHeartbeat.prototype.createPlayerDelegate = function () {
        var self = this;
        var playerDelegate = ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate;

        function F(videoApiObj) {
            this._webmdHBObj = videoApiObj;
        }

        F.prototype = Object.create(playerDelegate.prototype);
        F.prototype.constructor = F;
        F.prototype.getVideoInfo = function () {
            return this._webmdHBObj.getVideoInfo();
        };
        F.prototype.getAdBreakInfo = function () {
            return this._webmdHBObj.getAdBreakInfo();
        };
        F.prototype.getAdInfo = function () {
            return this._webmdHBObj.getAdInfo();
        };
        F.prototype.getChapterInfo = function () {
            return this._webmdHBObj.getChapterInfo();
        };
        F.prototype.getQoSInfo = function () {
            return this._webmdHBObj.getQoSInfo();
        };
        F.prototype.onError = function (error) {
            console.error("Heartbeat Error:" + error.getMessage() + " | " + error.getDetails());
        };
        return new F(self._webmdHBObj);
    };

    /**
     * From Robert's Metric document:
     * 11. Pass the following prop values in the Heartbeat “open” call (pe=ms_s): props 3, 6, 33, 47, 48, 50 for Core, OO, Professional, and Connect.
     *  1.  Additionally, for Professional, pass props channel, 19, 37, 38. If the video is sponsored, pass props 29, 30.
     *  2.  Additionally, for Core and OO, if the video is sponsored, pass prop28, 29, 30, 31.

     1.  Site Name (c3) section 2.1.1 #11 in the metric document
     2.  Embedded Asset flag (c26) section 2.1.1 #6 in the metric document
     3.  Sponsor Client-Brand (c28) This is no longer needed because of changes to the metric architecture.
     4.  Sponsor Program Name (c29) section 2.1.1 #11.2 in the metric document
     5.  Sponsor Package (c30) section 2.1.1 #11.2 in the metric document
     6.  Sponsor Package Name (c31) This is no longer needed because of changes to the metric architecture.
     7.  Audio Flag (c64) 2.1.1 #12 in the metric document
     8.  Registered User ID (c47) 2.1.1 #11 in the metric document
     9.  Mobile Display flag (c48) 2.1.1 #11 in the metric document
     10. Report Suite (c50) RB: This is no longer needed because of the Global report suite consolidation.

     For Professional only:
     11.  Channel 2.1.1 #11.1 in the metric document
     12.  User Profession (c19) section 2.1.1 #11.1 in the metric document
     13.  User Country (c37) section 2.1.1 #11.1 in the metric document
     14.  User Occupation (c38) section 2.1.1 #11.1 in the metric document
     */
    WebmdHeartbeat.prototype.getCustomVariables = function () {
        var customData = {};
        if (typeof s_md === 'object') {
            try {
                customData = {
                    SiteName: s_site,
                    EmbeddedAssetFlag: s_eRef,
                    SponsorProgramName: s_sponsor_program,
                    SponsorPakcage: s_package_type,
                    AudioFlag: s_md.prop64,
                    RegisteredUserID: Array.isArray(buID) ? buID[0] : s_md.prop47,
                    MobileDisplayFlag: s_md.prop48,
                    ReportSuite: _suit
                };
                if (/professional/i.test(s_site)) {
                    customData.UserProfession = s_user_group;
                    customData.UserCountry = s_channel_super_portal;
                    customData.UserOccupation = s_channel_health;

                }
            } catch (e) {
                customData = {
                    SiteName: s_md.prop3,
                    EmbeddedAssetFlag: s_md.prop26,
                    SponsorProgramName: s_md.prop29,
                    SponsorPakcage: s_md.prop30,
                    AudioFlag: s_md.prop64,
                    RegisteredUserID: s_md.prop47,
                    MobileDisplayFlag: s_md.prop48,
                    ReportSuite: s_md.prop50
                };
                if (/professional/i.test(s_md.prop3)) {
                    customData.UserProfession = s_md.prop19;
                    customData.UserCountry = s_md.prop37;
                    customData.UserOccupation = s_md.prop38;
                }
            }
        }
        return customData;
    };

    WebmdHeartbeat.prototype.destroy = function () {
        if (this._webmdHBObj) {
            this._heartbeat.destroy();
            this._heartbeat = null;

            this._webmdHBObj = null;
        }
    };

    // Heartbeat handlers.
    WebmdHeartbeat.prototype._onLoad = function () {
        var WebMdVariables = this.getCustomVariables();
        var customData = WebMdVariables;
        customData.isUserLoggedIn = false;
        customData.tvStation = 'WebMD TV station';

        // Before calling trackVideoLoad():
        this._aaPlugin.setVideoMetadata(customData);

        this._playerPlugin.trackVideoLoad();
    };

    WebmdHeartbeat.prototype._onUnload = function () {
        this._playerPlugin.trackVideoUnload();
    };

    WebmdHeartbeat.prototype._onPlay = function () {
        this._playerPlugin.trackPlay();
    };

    WebmdHeartbeat.prototype._onPause = function () {
        this._playerPlugin.trackPause();
    };

    WebmdHeartbeat.prototype._onSeekStart = function () {
        this._playerPlugin.trackSeekStart();
    };

    WebmdHeartbeat.prototype._onSeekComplete = function () {
        this._playerPlugin.trackSeekComplete();
    };

    WebmdHeartbeat.prototype._onBufferStart = function () {
        this._playerPlugin.trackBufferStart();
    };

    WebmdHeartbeat.prototype._onBufferComplete = function () {
        this._playerPlugin.trackBufferComplete();
    };

    WebmdHeartbeat.prototype._onAdStart = function () {
        var WebMdVariables = this.getCustomVariables();
        WebMdVariables.affiliate = 'WebMD affiliate';
        WebMdVariables.campaign = 'WebMD ad campaign';

        // Before calling trackAdStart():
        this._aaPlugin.setAdMetadata(WebMdVariables);

        this._playerPlugin.trackAdStart();
    };

    WebmdHeartbeat.prototype._onAdComplete = function () {
        this._playerPlugin.trackAdComplete();
    };

    WebmdHeartbeat.prototype._onChapterStart = function () {

        var WebMdVariables = this.getCustomVariables();
        WebMdVariables.segmentType = "WebMD segment type";

        // Before calling trackChapterStart():
        this._aaPlugin.setChapterMetadata(WebMdVariables);

        this._playerPlugin.trackChapterStart();
    };

    WebmdHeartbeat.prototype._onChapterComplete = function () {
        this._playerPlugin.trackChapterComplete();
    };

    WebmdHeartbeat.prototype._onComplete = function () {
        this._playerPlugin.trackComplete();
    };

    ////// 2. WebmdHBVideo: video data, video methods //////
    function WebmdHBVideo(webmdHbObj) {
        this.webmdHbObj = webmdHbObj;

        this._videoLoaded = false;

        this._videoInfo = null;
        this._adBreakInfo = null;
        this._adInfo = null;
        this._chapterInfo = null;
        this._qosInfo = null;

        this._clock = null;
        this.AssetType = ADB.va.plugins.videoplayer.AssetType;
    }

    /**
     * after initialize, get default properties:
     *   id, name, length, playerName, playhead, streamType,
     *   getVideoId, getVideoName, getVideoLength, getName, getCurrentPlayhead
     */
    WebmdHBVideo.prototype.getVideoInfo = function () {
        var videoInfo = new ADB.va.plugins.videoplayer.VideoInfo();

        videoInfo.id = 'hb-' + this.webmdHbObj.getId();
        videoInfo.playerName = this.getPlayerName();
        videoInfo.length = this.webmdHbObj.getDuration();
        videoInfo.streamType = this.AssetType.ASSET_TYPE_VOD || 'vod';
        videoInfo.playhead = this.webmdHbObj.getCurrentTime();
        videoInfo.name = this.getVideoName();
        return videoInfo;
    };

    /**
     * adBreakInfo object: playerName, name, position, startTime
     */
    WebmdHBVideo.prototype.getAdBreakInfo = function () {
        return null;
        var adBreakInfo;
        adBreakInfo = new ADB.va.plugins.videoplayer.AdBreakInfo();
        if (this.ad === null) {
            return null;
        }
        adBreakInfo.name = this.ad.type;
        adBreakInfo.position = this.ad.position;
        //adBreakInfo.playerName = this.getAdBreakPlayerName();
        //adBreakInfo.startTime = this.webmdHbObj.getCurrentTime();
        this._adBreakInfo = adBreakInfo;
        return adBreakInfo;
    };

    // adInfo object: id, length, position, name need to be filled.
    WebmdHBVideo.prototype.getAdInfo = function () {
        return null;
        var adInfo, duration;
        adInfo = new ADB.va.plugins.videoplayer.AdInfo();
        if (!this.ad) {
            this.ad = {
                id: 'webmdAdId',
                length: 0,
                position: 0,
                name: null,
                cpm: null
            };
        }
        adInfo.id = this.ad.id || 'webmdAdId';
        duration = this.ad.duration;
        adInfo.length = isNaN(duration) || duration === 0 ? -1 : duration;
        adInfo.position = this.ad.position;
        adInfo.name = this.ad.title;
        this._adInfo = adInfo;
        return adInfo;
    };

    /* name, length, position, startTime */
    WebmdHBVideo.prototype.getChapterInfo = function () {
        return null;
        // this.player === this.videoApi: true
        var chapterInfo, currentScene, chapters;
        //currentScene = this.media.getScene(this.getPlaybackCore().getCurrentTime());
        try {
            chapters = this.webmdHbObj.getConfig().webmd.chapterData;
        } catch (e) {
        }

        if (chapters) {
            currentScene = {
                name: "hb-" + this.webmdHbObj.getId() + '-chapter' + currentChapter,
                length: this.webmdHbObj.getCurrentTime(),
                position: currentChapter,
                startTime: chapters[currentChapter].startSeconds
            };
        } else {
            currentScene = {
                name: null,
                length: 0,
                position: 0,
                startTime: 0
            };
        }
        chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        chapterInfo.name = currentScene.title;
        chapterInfo.length = currentScene.end - currentScene.start;
        chapterInfo.position = 0; //currentScene.position;
        chapterInfo.startTime = 0; //currentScene.start;
        return chapterInfo;
    };

    WebmdHBVideo.prototype.getQoSInfo = function () {
        var qosInfo;
        qosInfo = new ADB.va.plugins.videoplayer.QoSInfo();
        // TODO: Build a static/hard-coded QoS info here, will replace with real-data.
        qosInfo.bitrate = null;
        qosInfo.fps = null;
        qosInfo.droppedFrames = null;
        qosInfo.startupTime = null;
        return null;
    };

    WebmdHBVideo.prototype.onError = function (error) {
        console.error("Heartbeat error: " + error.getMessage() + " | " + error.getDetails());
        return null;
    };

    /**
     * when Flash video events happen
     * 1. do flow logic check
     * 2. trigger heartbeat core.
     */
    WebmdHBVideo.prototype._onPlay = function (hb) {
        this._openVideoIfNecessary(hb);
        hb._onPlay();
    };

    WebmdHBVideo.prototype._onPause = function (hb) {
        hb._onPause();
    };

    WebmdHBVideo.prototype._onSeekStart = function (hb) {
        this._openVideoIfNecessary(hb);
        hb._onSeekStart();
    };

    WebmdHBVideo.prototype._onSeekComplete = function (hb) {
        this._doPostSeekComputations(hb);
        hb._onSeekComplete();
    };

    WebmdHBVideo.prototype._onComplete = function (hb) {
        this._completeVideo(hb);
    };

    WebmdHBVideo.prototype._openVideoIfNecessary = function (hb) {
        if (!this._videoLoaded) {
            this._resetInternalState();

            this._startVideo(hb);
            // Start the monitor timer.

            // This is for Ad and Chapter process, test later.
            var _this = this;
            this._clock = setInterval(function () {
                _this._onTick();
            }, 500);
        }
    };

    WebmdHBVideo.prototype._completeVideo = function (hb) {
        if (this._videoLoaded) {
            // Complete the second chapter
            this._completeChapter(hb);

            hb._onComplete();

            this._unloadVideo(hb);
        }
    };

    WebmdHBVideo.prototype._unloadVideo = function (hb) {
        hb._onUnload();

        clearInterval(this._clock);

        this._resetInternalState();
    };

    WebmdHBVideo.prototype._resetInternalState = function (hb) {
        this._videoLoaded = false;
        this._clock = null;
    };

    WebmdHBVideo.prototype._startVideo = function (hb) {
        // Prepare the main video info.
        this._videoInfo = this.getVideoInfo();
        this._videoLoaded = true;
        hb._onLoad();
    };

    /**
     * TODO: what's the difference of getPlayhead and getCurrentTime?
     */
    WebmdHBVideo.prototype.getPlayhead = function () {
        return this.webmdHbObj.getCurrentTime() * 1000;
    };

    WebmdHBVideo.prototype._startChapter1 = function (hb) {
        // Prepare the chapter info.
        this._chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        this._chapterInfo.length = 15;
        this._chapterInfo.startTime = 0;
        this._chapterInfo.position = 1;
        this._chapterInfo.name = "First chapter";

        hb._onChapterStart();
    };

    WebmdHBVideo.prototype._startChapter2 = function (hb) {
        // Prepare the chapter info.
        this._chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        this._chapterInfo.length = 30;
        this._chapterInfo.startTime = 30;
        this._chapterInfo.position = 2;
        this._chapterInfo.name = "Second chapter";

        hb._onChapterStart();
    };

    WebmdHBVideo.prototype._completeChapter = function (hb) {
        // Reset the chapter info.
        this._chapterInfo = null;

        hb._onChapterComplete();
    };

    WebmdHBVideo.prototype._startAd = function (hb) {
        // Prepare the ad break info.
        this._adBreakInfo = new ADB.va.plugins.videoplayer.AdBreakInfo();
        this._adBreakInfo.name = "First Ad-Break";
        this._adBreakInfo.position = 1;
        this._adBreakInfo.playerName = 'flash media player'; //this._playerName;
        this._adBreakInfo.startTime = 15;

        // Prepare the ad info.
        this._adInfo = new ADB.va.plugins.videoplayer.AdInfo();
        this._adInfo.id = "webmd-ad-001";
        this._adInfo.name = "WebMd Ad";
        this._adInfo.position = 1;

        // Start the ad.
        hb._onAdStart();
    };

    WebmdHBVideo.prototype._completeAd = function (hb) {
        // Complete the ad.
        hb._onAdComplete();

        // Clear the ad and ad-break info.
        this._adInfo = null;
        this._adBreakInfo = null;
    };

    WebmdHBVideo.prototype._doPostSeekComputations = function (hb) {
        var vTime = this.getPlayhead();
        // Seek inside the first chapter.
        if (vTime < 0) {
            // If we were not inside the first chapter before, trigger a chapter start
            if (!this._chapterInfo || this._chapterInfo.position != 1) {
                this._startChapter1();

                // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
                if (this._adInfo) {
                    this._adInfo = null;
                    this._adBreakInfo = null;
                }
            }
        }
        // Seek inside the ad.
        else if (vTime >= 15 && vTime < 30) {
            // If we were not inside the ad before, trigger an ad-start
            if (!this._adInfo) {
                this._startAd();

                // Also, clear the chapter info, without sending the CHAPTER_COMPLETE event.
                this._chapterInfo = null;
            }
        }
        // Seek inside the second chapter.
        else {
            // If we were not inside the 2nd chapter before, trigger a chapter start
            if (!this._chapterInfo || this._chapterInfo.position != 2) {
                this._startChapter2();

                // If we were in the ad, clear the ad and ad-break info, but don't send the AD_COMPLETE event.
                if (this._adInfo) {
                    this._adInfo = null;
                    this._adBreakInfo = null;
                }
            }
        }
    };

    WebmdHBVideo.prototype._onTick = function (hb) {
        var vTime = this.getPlayhead();

        // If we're inside the ad content:
        if (vTime >= 15 && vTime < 30) {
            if (this._chapterInfo) {
                // If we were inside a chapter, complete it.
                this._completeChapter();
            }

            if (!this._adInfo) {
                // Start the ad (if not already started).
                this._startAd();
            }
        }
        // Otherwise, we're outside the ad content:
        else {
            if (this._adInfo) {
                // Complete the ad (if needed).
                this._completeAd();
            }
            if (vTime < 15) {
                if (this._chapterInfo && this._chapterInfo.position != 1) {
                    // If we were inside another chapter, complete it.
                    this._completeChapter();
                }

                if (!this._chapterInfo) {
                    // Start the first chapter.
                    this._startChapter1();
                }
            } else {
                if (this._chapterInfo && this._chapterInfo.position != 2) {
                    // If we were inside another chapter, complete it.
                    this._completeChapter();
                }

                if (!this._chapterInfo) {
                    // Start the second chapter.
                    this._startChapter2();
                }
            }
        }
    };

    WebmdHBVideo.prototype.getVideoName = function () {
        var name = '';
        // friendlyName
        if (typeof s_assetname !== "undefined") {
            name = s_assetname;
        }
        else {
            name = window.location.pathname;
        }
        return name;
    };

    WebmdHBVideo.prototype.getPlayerName = function () {
        var playerName = 'default';
        var self = this;
        var playerConfig = self.webmdHbObj.getConfig();
        try {
            playerName = playerConfig.media.title;
        }
        catch (e) {
            // this works. playerName: 'flash', 'html5'? or video-url-name?
            playerName = self.webmdHbObj.getPlayerType();
        }
        return playerName;
    };

    ////// 4. main //////
    var heartbeat152 = function () {
        return {
            videoApi: null,
            playerName: '',
            init: function (videoApi) {
                this.videoApi = videoApi;
                this.heartbeat();
            },
            setPlayerName: function (playerName) {
                var playerConfig = this.videoApi.getConfig();
                try {
                    playerConfig.media.title = playerName;
                    this.playerName = playerName;
                }
                catch (e) {
                }
            },
            getPlayerName: function () {
                if (this.playerName) {
                    return this.playerName;
                }
                else {
                    try {
                        this.playerName = this.videoApi.getConfig().media.title;
                        return this.playerName;
                    }
                    catch (e) {
                        return 'default';
                    }
                }
            },
            heartbeat: function () {

                var webmdHBObj = new WebmdHBVideo(this.videoApi);
                var hb = new WebmdHeartbeat(webmdHBObj);

                this.videoApi.addEventListener('play.hb', function (e) {
                    webmdHBObj._onPlay(hb);
                });
                this.videoApi.addEventListener('seeking.hb', function (e) {
                    webmdHBObj._onSeekStart(hb);
                });
                this.videoApi.addEventListener('seeked.hb', function (e) {
                    webmdHBObj._onSeekComplete(hb);
                });
                this.videoApi.addEventListener('pause.hb', function (e) {
                    webmdHBObj._onPause(hb);
                });
                this.videoApi.addEventListener('ended.hb', function (e) {
                    webmdHBObj._onComplete(hb);
                });
            }
        }
    };

    return heartbeat152;
});
