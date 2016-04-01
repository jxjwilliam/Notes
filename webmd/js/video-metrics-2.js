/**
 * TODO: in perf environment, replace 'define' dependency with:
 define(['video2/1/api/video-ui-utils', 'video2/1/lib/AppMeasurement', 'video2/1/lib/VideoHeartbeat.min', 'video2/1/lib/VisitorAPI'],
 function (Utils, AppMeasurement, ADB, Visitor) {...});
 */

define(['video2/1/api/video-ui-utils'], function (Utils) {

    ////// 1. WebMD Adobe Heartbeat implementation //////
    function WebmdHeartbeat(player) {
        if (!player) {
            throw new Error("Illegal argument. Player reference cannot be null.")
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

        // 'Visitor' is a IIFE injected by require-js' define()
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
        var delegate = this.createPlayerDelegate(this._player);
        this._playerPlugin = new ADB.va.plugins.videoplayer.VideoPlayerPlugin(delegate);
        var pluginConfig = new ADB.va.plugins.videoplayer.VideoPlayerPluginConfig();
        pluginConfig.debugLogging = config.debugLogging;
        this._playerPlugin.configure(pluginConfig);

        delegate = new ADB.va.plugins.aa.AdobeAnalyticsPluginDelegate();
        delegate.onError = function (errorInfo) {
            console.error("AdobeAnalyticsPlugin error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
        };
        this._aaPlugin = new ADB.va.plugins.aa.AdobeAnalyticsPlugin(appMeasurement, delegate);
        pluginConfig = new ADB.va.plugins.aa.AdobeAnalyticsPluginConfig();
        pluginConfig.channel = config.heartbeat.channel;
        pluginConfig.debugLogging = config.debugLogging;
        this._aaPlugin.configure(pluginConfig);


        delegate = new ADB.va.plugins.ah.AdobeHeartbeatPluginDelegate();
        delegate.onError = function (errorInfo) {
            console.error("AdobeHeartbeatPlugin error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
        };
        var ahPlugin = new ADB.va.plugins.ah.AdobeHeartbeatPlugin(delegate);
        pluginConfig = new ADB.va.plugins.ah.AdobeHeartbeatPluginConfig(
            config.heartbeat.trackingServer,
            config.heartbeat.publisher);
        pluginConfig.ovp = config.heartbeat.ovp;
        pluginConfig.sdk = config.heartbeat.sdk;
        pluginConfig.debugLogging = config.debugLogging;
        ahPlugin.configure(pluginConfig);

        var plugins = [this._playerPlugin, this._aaPlugin, ahPlugin];

        delegate = new ADB.va.HeartbeatDelegate();
        delegate.onError = function (errorInfo) {
            console.error("Heartbeat error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
        };
        this._heartbeat = new ADB.va.Heartbeat(delegate, plugins);
        pluginConfig = new ADB.va.HeartbeatConfig();
        pluginConfig.debugLogging = config.debugLogging;
        this._heartbeat.configure(pluginConfig);

        var self = this;
        events.subscribe('trackPlay', function () {
            self._playerPlugin.trackPlay();
        });
        events.subscribe('trackPause', function () {
            self._playerPlugin.trackPause();
        });
        events.subscribe('trackSeekStart', function () {
            self._playerPlugin.trackSeekStart();
        });
        events.subscribe('trackSeekComplete', function () {
            self._playerPlugin.trackSeekComplete();
        });
        events.subscribe('trackComplete', function () {
            self._playerPlugin.trackComplete(function () {
                console.log("The completion of the content has been tracked.");
            });
        });
        events.subscribe('trackVideoUnload', function () {
            self._playerPlugin.trackVideoUnload();
        });
        events.subscribe('trackVideoLoad', function () {
            self._playerPlugin.trackVideoLoad();
        });
        events.subscribe('trackChapterStart', function () {
            self._playerPlugin.trackChapterStart();
        });
        events.subscribe('trackChapterComplete', function () {
            self._playerPlugin.trackChapterComplete();
        });
        events.subscribe('trackAdStart', function () {
            self._playerPlugin.trackAdStart();
        });
        events.subscribe('trackAdComplete', function () {
            self._playerPlugin.trackAdComplete();
        });
    }

    // this is guaranteed dynamic VideoInfo is injected.
    WebmdHeartbeat.prototype.createPlayerDelegate = function (player) {
        var playerDelegate = ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate;
        function F(video_player) {
            this._player = video_player;
        };
        F.prototype = Object.create(playerDelegate.prototype);
        F.prototype.constructor = F;
        F.prototype.getVideoInfo = function () {
            return this._player.getVideoInfo();
        };
        F.prototype.getAdBreakInfo = function () {
            return this._player.getAdBreakInfo();
        };
        F.prototype.getAdInfo = function () {
            return this._player.getAdInfo();
        };
        F.prototype.getChapterInfo = function () {
            return this._player.getChapterInfo();
        };
        F.prototype.getQoSInfo = function () {
            return this._player.getQoSInfo();
        };
        F.prototype.onError = function (error) {
            console.error("Heartbeat Error:", error);
        };
        return new F(player);
    };

    ////// 2. VideoPlayer: video data, video methods //////
    function VideoPlayer(player) {
        this.player = player;
        var self = this;

        this._playerName = 'WebMD flash media player';
        this._videoId = 'hb-' + player.getId();
        var playerConfig = player.getConfig();
        this._videoName = playerConfig.media.title;
        this._streamType = ADB.va.plugins.videoplayer.AssetType.ASSET_TYPE_VOD;

        this._videoLoaded = false;
        this._videoInfo = null;
        this._adBreakInfo = null;
        this._adInfo = null;
        this._chapterInfo = null;

        // Build a static/hard-coded QoS info here.
        this._qosInfo = new ADB.va.plugins.videoplayer.QoSInfo();
        this._qosInfo.bitrate = 50000;
        this._qosInfo.fps = 24;
        this._qosInfo.droppedFrames = 10;
        this._clock = null;

        this.player.addEventListener('play.hb', function (e) {
            console.log('====== play.hb ======');
            self._onPlay();
        });
        this.player.addEventListener('pause.hb', function (e) {
            console.log('====== pause.hb ======');
            self._onPause();
        });
        this.player.addEventListener('ended.hb', function (e) {
            console.log('====== ended.hb ======');
            self._onComplete();
        });
        this.player.addEventListener('seeking.hb', function (e) {
            console.log('====== seeking.hb ======');
            self._onSeekStart();
        });
        this.player.addEventListener('seeked.hb', function (e) {
            console.log('====== seeked.hb ======');
            self._onSeekComplete();
        });
    }

    /**
     * after initialize, get default properties:
     *   id, length, name, playerName, playhead, streamType
     */
    VideoPlayer.prototype.getVideoInfo = function () {
        var AssetType = ADB.va.plugins.videoplayer.AssetType;
        var videoInfo = new ADB.va.plugins.videoplayer.VideoInfo();
        videoInfo.id = 'hb-' + this.player.getId();
        videoInfo.length = this.player.getDuration();
        videoInfo.streamType = AssetType.ASSET_TYPE_VOD ? AssetType.ASSET_TYPE_VOD : 'vod';
        videoInfo.playhead = this.player.getCurrentTime();
        var playerConfig = this.player.getConfig();
        try {
            videoInfo.name = playerConfig.media.title;
        }
        catch (e) {
            videoInfo.name = s_assetname; //TODO friendlyName
        }
        videoInfo.playerName = this.player.getPlayerType();
        this._videoInfo = videoInfo;
        return videoInfo;
    };

    /**
     * adBreakInfo object: playerName, name, position, startTime
     */
    VideoPlayer.prototype.getAdBreakInfo = function () {
        return null; //TODO
        var adBreakInfo;
        adBreakInfo = new ADB.va.plugins.videoplayer.AdBreakInfo();
        if (self.ad === null) {
            return null;
        }
        adBreakInfo.name = self.ad.type;
        adBreakInfo.position = self.ad.position;
        //adBreakInfo.playerName = self.getPlayerName();
        //adBreakInfo.startTime = self.getPlaybackCore().getCurrentTime();
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
            }
        }
        adInfo.id = self.ad.id || 'webmdAdId';
        duration = self.ad.duration;
        adInfo.length = isNaN(duration) || duration === 0 ? -1 : duration;
        adInfo.position = self.ad.position;
        adInfo.name = self.ad.title;
        return adInfo;
    };

    /* name, length, position, startTime */
    VideoPlayer.prototype.getChapterInfo = function () {
        return null; // this.player === self.videoApi: true
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
            }
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
        return null;
    };

    VideoPlayer.prototype.onError = function () {
        return null;
    };

    /**
     * when Flash video events happen
     * 1. do flow logic check
     * 2. trigger heartbeat core.
     */
    VideoPlayer.prototype._onPlay = function (e) {
        this._openVideoIfNecessary();
        events.publish('trackPlay');
    };

    VideoPlayer.prototype._onPause = function (e) {
        events.publish('trackPause');
    };

    VideoPlayer.prototype._onSeekStart = function (e) {
        this._openVideoIfNecessary();
        events.publish('trackSeekStart');
    };

    VideoPlayer.prototype._onSeekComplete = function (e) {
        //this._doPostSeekComputations();
        events.publish('trackSeekComplete');
    };

    VideoPlayer.prototype._onComplete = function (e) {
        this._completeVideo();
    };

    VideoPlayer.prototype._openVideoIfNecessary = function () {
        if (!this._videoLoaded) {
            this._resetInternalState();
            this._startVideo();
            // Start the monitor timer.
            var _this = this;
            //this._clock = setInterval(function () {
            //    _this._onTick();
            //}, 500); //MONITOR_TIMER_INTERVAL);
        }
    };

    VideoPlayer.prototype._completeVideo = function () {
        if (this._videoLoaded) {
            // Complete the second chapter
            this._completeChapter();
            events.publish('trackComplete');
            this._unloadVideo();
        }
    };

    VideoPlayer.prototype._unloadVideo = function () {
        events.publish('trackVideoUnload');
        clearInterval(this._clock);
        this._resetInternalState();
    };

    VideoPlayer.prototype._resetInternalState = function () {
        this._videoLoaded = false;
        this._clock = null;
    };

    VideoPlayer.prototype._startVideo = function () {
        // Prepare the main video info.
        this._videoInfo = new ADB.va.plugins.videoplayer.VideoInfo();
        this._videoInfo.id = this._videoId;
        this._videoInfo.name = this._videoName;
        this._videoInfo.playerName = this._playerName;
        this._videoInfo.length = this.player.getDuration();
        this._videoInfo.streamType = this._streamType;
        this._videoInfo.playhead = this.getPlayhead();

        this._videoLoaded = true;
        //this.hb._aaPlugin.setVideoMetadata({
        //    isUserLoggedIn: "false",
        //    tvStation: "WebMD TV station",
        //    programmer: "WebMD programmer"
        //});
        events.publish('trackVideoLoad');
    };

    /*
     var currentTime = new Date(self.videoApi.getCurrentTime() * 1000);
     var totalTime = new Date(self.videoApi.getDuration() * 1000);
     */
    VideoPlayer.prototype.getPlayhead = function () {
        return this.player.getCurrentTime() * 1000;
    };

    VideoPlayer.prototype._startChapter1 = function () {
        // Prepare the chapter info.
        this._chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        this._chapterInfo.length = 15;
        this._chapterInfo.startTime = 0;
        this._chapterInfo.position = 1;
        this._chapterInfo.name = "First chapter";

        //this.hb._aaPlugin.setChapterMetadata({
        //    segmentType: "WebMD segment type"
        //});
        events.publish('trackChapterStart');
    };

    VideoPlayer.prototype._startChapter2 = function () {
        // Prepare the chapter info.
        this._chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
        this._chapterInfo.length = 30;
        this._chapterInfo.startTime = 30;
        this._chapterInfo.position = 2;
        this._chapterInfo.name = "Second chapter";

        //this.hb._aaPlugin.setChapterMetadata({
        //    segmentType: "WebMD segment type"
        //});
        events.publish('trackChapterStart');
    };

    VideoPlayer.prototype._completeChapter = function () {
        // Reset the chapter info.
        this._chapterInfo = null;
        events.publish('trackChapterComplete');
    };

    VideoPlayer.prototype._startAd = function () {
        // Prepare the ad break info.
        this._adBreakInfo = new ADB.va.plugins.videoplayer.AdBreakInfo();
        this._adBreakInfo.name = "First Ad-Break";
        this._adBreakInfo.position = 1;
        this._adBreakInfo.playerName = this._playerName;
        this._adBreakInfo.startTime = 15;

        // Prepare the ad info.
        this._adInfo = new ADB.va.plugins.videoplayer.AdInfo();
        this._adInfo.id = "webmd-ad-001";
        this._adInfo.name = "WebMd Ad";
        this._adInfo.position = 1;

        // Start the ad.
        //this.hb._aaPlugin.setAdMetadata({
        //    affiliate: "WebMD affiliate",
        //    campaign: "WebMD ad campaign"
        //});
        events.publish('trackAdStart');
    };

    VideoPlayer.prototype._completeAd = function () {
        // Complete the ad.
        events.publish('trackAdComplete');

        // Clear the ad and ad-break info.
        this._adInfo = null;
        this._adBreakInfo = null;
    };

    VideoPlayer.prototype._doPostSeekComputations = function () {
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

    VideoPlayer.prototype._onTick = function () {
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


    ////// 3. publisher/subscribe bridge for 1 and 2 //////
    var events = (function () {
        var topics = {};
        var hOP = topics.hasOwnProperty;

        return {
            subscribe: function (topic, listener) {
                // Create the topic's object if not yet created
                if (!hOP.call(topics, topic)) topics[topic] = [];

                // Add the listener to queue
                var index = topics[topic].push(listener) - 1;

                // Provide handle back for removal of topic
                return {
                    remove: function () {
                        delete topics[topic][index];
                    }
                };
            },
            publish: function (topic, info) {
                // If the topic doesn't exist, or there's no listeners in queue, just leave
                if (!hOP.call(topics, topic)) return;

                // Cycle through topics queue, fire!
                topics[topic].forEach(function (item) {
                    item(info != undefined ? info : {});
                });
            }
        };
    })();

    ////// 4. main //////
    var Metrics = function () {
        return {
            player: null,
            init: function (videoApi) {
                this.player = videoApi;
                this.utils = new Utils();
                this.utils.init(jQuery('#' + videoApi.getId()));
                this.heartbeat();
            },
            heartbeat: function () {
                var videoPlayer = new VideoPlayer(this.player);
                return new WebmdHeartbeat(videoPlayer);
            }
        }
    };

    return Metrics;
});