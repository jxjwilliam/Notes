
function WebmdHeartbeat() {
  this.getConfigurationData() {
    return WebmdHeartbeat.config;
  }
}

WebmdHeartbeat.config = {
  heartbeat: {
    enabled: true,
    channel: '',
    ovp: '',
    sdk: '',
    trackingServer: '',
    publisher: '',
    configure: function(opts) {
    }
  },
  visitor: {
    marketingCloudOrgId: '',
    trackingServer: ''
  },
  account: '',
  trackingServer: '',
  pageName: '',
  visitorID: '',
};

//TODO:
// VisitorAPI.js:
WebmdHeartbeat.prototype.initialize = function() {
  var ahPlugin, appMeasurement, config, delegate, pluginConfig, plugins, visitor,
    _this = this;

  config = this.getConfigurationData();
  if (typeof Visitor !== "undefined" && Visitor !== null) {
    visitor = new Visitor(config.visitor.marketingCloudOrgId);
    visitor.trackingServer = config.visitor.trackingServer;
  }

  appMeasurement = new AppMeasurement();
  appMeasurement.account = config.account;
  appMeasurement.trackingServer = config.trackingServer;
  appMeasurement.visitor = visitor;
  appMeasurement.pageName = config.pageName;
  appMeasurement.charSet = "UTF-8";
  appMeasurement.visitorID = config.visitorID;
  delegate = this.createDelegate();
  this.playerPlugin = new ADB.va.plugins.videoplayer.VideoPlayerPlugin(delegate);
  pluginConfig = new ADB.va.plugins.videoplayer.VideoPlayerPluginConfig();
  pluginConfig.debugLogging = this.facade.logger.enabled;
  this.playerPlugin.configure(pluginConfig);
  delegate = new ADB.va.plugins.aa.AdobeAnalyticsPluginDelegate();
  delegate.onError = function(errorInfo) {
    _this.facade.logger.error("AdobeAnalyticsPlugin error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
  };

  this.aaPlugin = new ADB.va.plugins.aa.AdobeAnalyticsPlugin(appMeasurement, delegate);
  pluginConfig = new ADB.va.plugins.aa.AdobeAnalyticsPluginConfig();
  pluginConfig.channel = config.heartbeat.channel;
  pluginConfig.debugLogging = this.facade.logger.enabled;
  this.aaPlugin.configure(pluginConfig);
  delegate = new ADB.va.plugins.ah.AdobeHeartbeatPluginDelegate();
  delegate.onError = function(errorInfo) {
    _this.facade.logger.error("AdobeHeartbeatPlugin error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
  };

  ahPlugin = new ADB.va.plugins.ah.AdobeHeartbeatPlugin(delegate);
  pluginConfig = new ADB.va.plugins.ah.AdobeHeartbeatPluginConfig(config.heartbeat.trackingServer, config.heartbeat.publisher);
  pluginConfig.ovp = config.heartbeat.ovp;
  pluginConfig.sdk = config.heartbeat.sdk;
  pluginConfig.debugLogging = this.facade.logger.enabled;
  ahPlugin.configure(pluginConfig);
  plugins = [this.playerPlugin, this.aaPlugin, ahPlugin];
  delegate = new ADB.va.HeartbeatDelegate();
  delegate.onError = function(errorInfo) {
    _this.facade.logger.error("Heartbeat error: " + errorInfo.getMessage() + " | " + errorInfo.getDetails());
  };
  this.heartbeat = new ADB.va.Heartbeat(delegate, plugins);
  pluginConfig = new ADB.va.HeartbeatConfig();
  pluginConfig.debugLogging = this.facade.logger.enabled;
  this.heartbeat.configure(pluginConfig);
};

/**
*/
WebmdHeartbeat.prototype.createPlugin = function() {
  return ADB.va.VideoHeartbeat;
};

/**
*/
WebmdHeartbeat.prototype.createDelegate = function() {
  var delegate,
    _this = this;
  delegate = new ADB.va.plugins.videoplayer.VideoPlayerPluginDelegate();
  delegate.getVideoInfo = function() {
    var playbackCore, time, videoInfo;
    playbackCore = _this.getPlaybackCore();
    videoInfo = new ADB.va.plugins.videoplayer.VideoInfo();
    videoInfo.id = _this.media.getGUID() || _this.media.getTitle();
    videoInfo.playerName = _this.getPlayerName();
    videoInfo.name = _this.getMediaName();
    if (_this.media.getTemporalType() === "live") {
      videoInfo.length = -1;
      videoInfo.streamType = ADB.va.plugins.videoplayer.AssetType.ASSET_TYPE_LIVE;
    } else {
      videoInfo.length = _this.media.getDuration();
      videoInfo.streamType = ADB.va.plugins.videoplayer.AssetType.ASSET_TYPE_VOD;
    }
    time = playbackCore != null ? typeof playbackCore.getCurrentTime === "function" ? playbackCore.getCurrentTime() : void 0 : void 0;
    videoInfo.playhead = !(time != null) || isNaN(time) ? 0 : time;
    return videoInfo;
  };
  delegate.getAdInfo = function() {
    var adInfo, duration;
    adInfo = new ADB.va.plugins.videoplayer.AdInfo();
    if (!(_this.ad != null)) {
      return null;
    }
    adInfo.id = _this.ad.id;
    duration = _this.ad.duration;
    adInfo.length = isNaN(duration) || duration === 0 ? -1 : duration;
    adInfo.position = _this.ad.position;
    adInfo.name = _this.ad.title;
    return adInfo;
  };
  delegate.getAdBreakInfo = function() {
    var adBreakInfo;
    adBreakInfo = new ADB.va.plugins.videoplayer.AdBreakInfo();
    if (!(_this.ad != null)) {
      return null;
    }
    adBreakInfo.name = _this.ad.type;
    adBreakInfo.position = _this.ad.position;
    adBreakInfo.playerName = _this.getPlayerName();
    adBreakInfo.startTime = _this.getPlaybackCore().getCurrentTime();
    return adBreakInfo;
  };
  delegate.getChapterInfo = function() {
    var chapterInfo, currentScene;
    currentScene = _this.media.getScene(_this.getPlaybackCore().getCurrentTime());
    if (!(currentScene != null)) {
      return null;
    }
    chapterInfo = new ADB.va.plugins.videoplayer.ChapterInfo();
    chapterInfo.name = currentScene.title;
    chapterInfo.length = currentScene.end - currentScene.start;
    chapterInfo.position = currentScene.position;
    chapterInfo.startTime = currentScene.start;
    return chapterInfo;
  };
  delegate.onError = function(error) {
    _this.facade.logger.error("Heartbeat Error:", error);
  };
  delegate.getQoSInfo = function() {
    var qosInfo;
    qosInfo = new ADB.va.plugins.videoplayer.QoSInfo();
    return null;
  };
  return delegate;
};

/**
*/
WebmdHeartbeat.prototype.mediaChange = function() {
  var metadata, _ref;
  WebmdHeartbeat.__super__.mediaChange.call(this);
  metadata = (_ref = this.configurationData.value.heartbeat.metadata) != null ? _ref.video : void 0;
  if (metadata != null) {
    this.aaPlugin.setVideoMetadata(metadata);
  }
};

/**
*/
WebmdHeartbeat.prototype.start = function() {
  if (this.started === true) {
    return;
  }
  try {
    this.playerPlugin.trackVideoLoad();
    this.started = true;
  } catch (error) {
    this.error(error);
  }
  this.play();
};

/**
*/
WebmdHeartbeat.prototype.play = function() {
  if (this.started !== true) {
    this.start();
  }
  try {
    this.playerPlugin.trackPlay();
  } catch (error) {
    this.error(error);
  }
};

/**
*/
WebmdHeartbeat.prototype.pause = function() {
  try {
    this.playerPlugin.trackPause();
  } catch (error) {
    this.error(error);
  }
};

/**
*/
WebmdHeartbeat.prototype.seeking = function() {
  try {
    this.playerPlugin.trackSeekStart();
  } catch (error) {
    this.error(error);
  }
};

/**
*/
WebmdHeartbeat.prototype.seeked = function() {
  try {
    this.playerPlugin.trackSeekComplete();
  } catch (error) {
    this.error(error);
  }
};

/**
*/
WebmdHeartbeat.prototype.ended = function() {
  try {
    this.playerPlugin.trackComplete();
    this.playerPlugin.trackVideoUnload();
    this.started = false;
    this.aaPlugin.setVideoMetadata(null);
  } catch (error) {
    this.error(error);
  }
};

/**
*/
WebmdHeartbeat.prototype.adStart = function() {
  var metadata, _ref;
  if (this.started !== true) {
    metadata = (_ref = this.configurationData.value.heartbeat.metadata) != null ? _ref.ad : void 0;
    if (metadata != null) {
      this.aaPlugin.setAdMetadata(metadata);
    }
    this.start();
    setTimeout(this.adStart.bind(this), 0);
    return;
  }
  try {
    this.playerPlugin.trackAdStart();
  } catch (error) {
    this.error(error);
  }
};

/**
*/
WebmdHeartbeat.prototype.adEnded = function() {
  try {
    this.playerPlugin.trackAdComplete();
    this.aaPlugin.setAdMetadata(null);
  } catch (error) {
    this.error(error);
  }
};

WebmdHeartbeat.prototype.adPlay = function() {};

WebmdHeartbeat.prototype.adPause = function() {};
