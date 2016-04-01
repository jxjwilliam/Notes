/**
 * TODO:
 * http://img.perf.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/amd_modules/video2/1/lib/AppMeasurement.js?_=1
 define(['video2/1/api/video-ui-utils', 'video2/1/lib/AppMeasurement', 'video2/1/lib/VideoHeartbeat.min', 'video2/1/lib/VisitorAPI'],
 function (Utils, AppMeasurement, ADB, Visitor) {...});
 */

define(['video2/1/api/video-ui-utils'], function (Utils) {

    ////// 1. WebMD Adobe Heartbeat implementation //////
    function WebmdHeartbeat(player) {
        if (!player) {
            throw new Error("Illegal argument. Player reference cannot be null.");
        }
        this._player = player;

        // get default settings.
        this.defaults = {
            debugLogging: false,
            heartbeat: {
                trackingServer: 'http://heartbeats.omtrdc.net',
                trackingServer1: "std.o.webmd.com",
                trackingServerSecure: "ssl.o.webmd.com",
                jobId: 'sc_va',
                publisher: 'WebMD',
                channel: "webmd-channel",
                ovp: "webmd-ovp", //TODO: what is OVP?
                sdk: 'Heartbeats 1.5.2',
                quietMode: false, // No Network Calls Sent When True
                ssl: 'webmd-ssl'
            },
            visitor: {
                marketingCloudOrgId: '16AD4362526701720A490D45@AdobeOrg',
                trackingServer: 'std.o.webmd.com',
                visitorID: 'wembd-visitorId',
                dpid: 'webmd-dpid',
                dpuuid: 'webmd-dpuuid'
            },
            appMeasurement: {
                account: 'webmd-account',
                trackingServer: "std.o.webmd.com",
                trackingServer1: 'webmd.hb.omtrdc.net',
                pageName: 'WebMD Page Name'
            }
        };
        var config = this.defaults;

        // 'Visitor' is injected by require-js' define()
        var visitor = new Visitor(config.visitor.marketingCloudOrgId);
        visitor.trackingServer = config.visitor.trackingServer;
        visitor.setCustomerIDs({
            "userId": {
                "id": config.visitor.dpid
            },
            "puuid": {
                "id": config.visitor.dpuuid
            }
        });

        // Set-up the AppMeasurement component.
        var appMeasurement = new AppMeasurement();
        appMeasurement.visitor = visitor;
        appMeasurement.trackingServer = config.appMeasurement.trackingServer;
        appMeasurement.account = config.appMeasurement.account;
        appMeasurement.pageName = config.appMeasurement.pageName;
        appMeasurement.charSet = "UTF-8";
        appMeasurement.visitorID = config.visitor.visitorID;

        // Setup the video-player plugin
        //var delegate = new ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate();
        var delegate = this.createPlayerDelegate(this._player);

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
        var ahPluginConfig = new ADB.va.plugins.ah.AdobeHeartbeatPluginConfig(
            config.heartbeat.trackingServer,
            config.heartbeat.publisher);
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

    WebmdHeartbeat.prototype.createPlayerDelegate = function (player) {
        var self = this;
        var PlayerDelegate = ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate;
        var obj = Object.create(PlayerDelegate.prototype);
        obj._player = player;
        obj.getVideoInfo = function () {
            return self._player.getVideoInfo();
        };
        obj.getAdBreakInfo = function () {
            return self._player.getAdBreakInfo();
        };
        obj.getAdInfo = function () {
            return self._player.getAdInfo();
        };
        obj.getChapterInfo = function () {
            return self._player.getChapterInfo();
        };
        obj.getQoSInfo = function () {
            return self._player.getQoSInfo();
        };
        obj.onError = function (error) {
            console.error("Heartbeat Error:", error);
        };
        return obj;
    };

    WebmdHeartbeat.prototype.destroy = function () {
        if (this._player) {
            this._heartbeat.destroy();
            this._heartbeat = null;

            this._player = null;
        }
    };

    // Heartbeat handlers.
    WebmdHeartbeat.prototype._onLoad = function () {
        this._aaPlugin.setVideoMetadata({
            isUserLoggedIn: "false",
            tvStation: "WebMD TV station",
            programmer: "WebMD programmer"
        });
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
        this._aaPlugin.setAdMetadata({
            affiliate: "WebMD affiliate",
            campaign: "WebMD ad campaign"
        });
        this._playerPlugin.trackAdStart();
    };

    WebmdHeartbeat.prototype._onAdComplete = function () {
        this._playerPlugin.trackAdComplete();
    };

    WebmdHeartbeat.prototype._onChapterStart = function () {
        this._aaPlugin.setChapterMetadata({
            segmentType: "WebMD segment type"
        });
        this._playerPlugin.trackChapterStart();
    };

    WebmdHeartbeat.prototype._onChapterComplete = function () {
        this._playerPlugin.trackChapterComplete();
    };

    WebmdHeartbeat.prototype._onComplete = function () {
        this._playerPlugin.trackComplete(function () {
            console.log("The completion of the content has been tracked.");
        });
    };

    ////// 2. VideoPlayer: video data, video methods //////
    function VideoPlayer(player) {
        this.player = player;

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
    VideoPlayer.prototype.getVideoInfo = function () {
        var videoInfo = new ADB.va.plugins.videoplayer.VideoInfo();
        videoInfo.id = 'hb-' + this.player.getId();
        videoInfo.length = this.player.getDuration();
        videoInfo.streamType = this.AssetType.ASSET_TYPE_VOD || 'vod';
        videoInfo.playhead = this.player.getCurrentTime();
        var playerConfig = this.player.getConfig();
        try {
            videoInfo.name = playerConfig.media.title;
        }
        catch (e) {
            videoInfo.name = 'friendlyName'; /// TODO: find friendlyName
        }
        videoInfo.playerName = this.player.getPlayerType(); //'flash media player';
        this._videoInfo = videoInfo;
        return videoInfo;
    };

    /**
     * adBreakInfo object: playerName, name, position, startTime
     */
    VideoPlayer.prototype.getAdBreakInfo = function () {
        return null;
        var adBreakInfo;
        adBreakInfo = new ADB.va.plugins.videoplayer.AdBreakInfo();
        if (self.ad === null) {
            return null;
        }
        adBreakInfo.name = self.ad.type;
        adBreakInfo.position = self.ad.position;
        //adBreakInfo.playerName = self.getPlayerName();
        //adBreakInfo.startTime = self.getPlaybackCore().getCurrentTime();
        this._adBreakInfo = adBreakInfo;
        return adBreakInfo;
    };

    // adInfo object: id, length, position, name need to be filled.
    VideoPlayer.prototype.getAdInfo = function () {
        return null;
        var adInfo, duration;
        adInfo = new ADB.va.plugins.videoplayer.AdInfo();
        if (!self.ad) {
            self.ad = {
                id: 'webmdAdId',
                length: 0,
                position: 0,
                name: null,
                cpm: null
            };
        }
        adInfo.id = self.ad.id || 'webmdAdId';
        duration = self.ad.duration;
        adInfo.length = isNaN(duration) || duration === 0 ? -1 : duration;
        adInfo.position = self.ad.position;
        adInfo.name = self.ad.title;
        this._adInfo = adInfo;
        return adInfo;
    };

    /* name, length, position, startTime */
    VideoPlayer.prototype.getChapterInfo = function () {
        return null;
        // this.player === self.videoApi: true
        var chapterInfo, currentScene, chapters;
        //currentScene = self.media.getScene(self.getPlaybackCore().getCurrentTime());
        try {
            chapters = this.player.getConfig().webmd.chapterData;
        } catch (e) {
        }

        if (chapters) {
            currentScene = {
                name: "hb-" + this.player.getId() + '-chapter' + currentChapter,
                length: this.player.getCurrentTime(),
                position: currentChapter,
                startTime: chapters[currentChapter].startSeconds
            };
        } else {
            currentScene = {
                name: '',
                length: 0,
                position: 0,
                startTime: 0
            };
        }
        chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        chapterInfo.name = currentScene.title;
        chapterInfo.length = currentScene.end - currentScene.start;
        chapterInfo.position = 0;//currentScene.position;
        chapterInfo.startTime = 0;//currentScene.start;
        return chapterInfo;
    };

    VideoPlayer.prototype.getQoSInfo = function () {
        var qosInfo;
        qosInfo = new ADB.va.plugins.videoplayer.QoSInfo();
        // TODO: Build a static/hard-coded QoS info here, will replace with real-data.
        qosInfo.bitrate = 50000;
        qosInfo.fps = 24;
        qosInfo.droppedFrames = 10;
        return null; //qosInfo;
    };

    VideoPlayer.prototype.onError = function (error) {
        return null;
    };

    /**
     * when Flash video events happen
     * 1. do flow logic check
     * 2. trigger heartbeat core.
     */
    VideoPlayer.prototype._onPlay = function (hb) {
        this._openVideoIfNecessary(hb);
        hb._onPlay();
    };

    VideoPlayer.prototype._onPause = function (hb) {
        hb._onPause();
    };

    VideoPlayer.prototype._onSeekStart = function (hb) {
        this._openVideoIfNecessary(hb);
        hb._onSeekStart();
    };

    VideoPlayer.prototype._onSeekComplete = function (hb) {
        this._doPostSeekComputations(hb);
        hb._onSeekComplete();
    };

    VideoPlayer.prototype._onComplete = function (hb) {
        this._completeVideo(hb);
    };

    VideoPlayer.prototype._openVideoIfNecessary = function (hb) {
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

    VideoPlayer.prototype._completeVideo = function (hb) {
        if (this._videoLoaded) {
            // Complete the second chapter
            this._completeChapter(hb);

            hb._onComplete();

            this._unloadVideo(hb);
        }
    };

    VideoPlayer.prototype._unloadVideo = function (hb) {
        hb._onUnload();

        clearInterval(this._clock);

        this._resetInternalState();
    };

    VideoPlayer.prototype._resetInternalState = function (hb) {
        this._videoLoaded = false;
        this._clock = null;
    };

    VideoPlayer.prototype._startVideo = function (hb) {
        // Prepare the main video info.
        this._videoInfo = this.getVideoInfo();
        this._videoLoaded = true;
        hb._onLoad();
    };

    /**
     * TODO: what's the difference of getPlayhead and getCurrentTime?
     */
    VideoPlayer.prototype.getPlayhead = function () {
        return this.player.getCurrentTime() * 1000;
    };

    VideoPlayer.prototype._startChapter1 = function (hb) {
        // Prepare the chapter info.
        this._chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        this._chapterInfo.length = 15;
        this._chapterInfo.startTime = 0;
        this._chapterInfo.position = 1;
        this._chapterInfo.name = "First chapter";

        hb._onChapterStart();
    };

    VideoPlayer.prototype._startChapter2 = function (hb) {
        // Prepare the chapter info.
        this._chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        this._chapterInfo.length = 30;
        this._chapterInfo.startTime = 30;
        this._chapterInfo.position = 2;
        this._chapterInfo.name = "Second chapter";

        hb._onChapterStart();
    };

    VideoPlayer.prototype._completeChapter = function (hb) {
        // Reset the chapter info.
        this._chapterInfo = null;

        hb._onChapterComplete();
    };

    VideoPlayer.prototype._startAd = function (hb) {
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

    VideoPlayer.prototype._completeAd = function (hb) {
        // Complete the ad.
        hb._onAdComplete();

        // Clear the ad and ad-break info.
        this._adInfo = null;
        this._adBreakInfo = null;
    };

    VideoPlayer.prototype._doPostSeekComputations = function (hb) {
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

    VideoPlayer.prototype._onTick = function (hb) {
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

    ////// 4. main //////
    var Metrics = function () {
        return {
            player: null,
            init: function (videoApi) {
                this.videoApi = videoApi;
                this.utils = new Utils();
                this.utils.init(jQuery('#' + videoApi.getId()));
                this.heartbeat();
            },
            heartbeat: function () {
                //var video_id = this.player.getId();
                //var el = document.getElementById(video_id);
                //el.addEventListener === videoPlayer.addEventListener

                var player = new VideoPlayer(this.player);
                var hb = new WebmdHeartbeat(player);

                this.player.addEventListener('play.hb', function (e) {
                    console.log('PLAY:', e.type, new Date(e.timeStamp));
                    player._onPlay(hb);
                });
                this.player.addEventListener('seeking.hb', function (e) {
                    console.log('SEEKING:', e.type, new Date(e.timeStamp));
                    player._onSeekStart(hb);
                });
                this.player.addEventListener('seeked.hb', function (e) {
                    console.log('SEEKED:', e.type, new Date(e.timeStamp));
                    player._onSeekComplete(hb);
                });
                this.player.addEventListener('pause.hb', function (e) {
                    console.log('PAUSE:', e.type, new Date(e.timeStamp));
                    player._onPause(hb);
                });
                this.player.addEventListener('ended.hb', function (e) {
                    console.log('ENDED:', e.type, new Date(e.timeStamp));
                    player._onComplete(hb);
                });
            }
        };
    };

    return Metrics;
});
