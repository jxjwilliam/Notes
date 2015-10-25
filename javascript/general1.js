function log() {
  var local = /(localhost|127.0.0.1|192.168)/.test(location.href);
  if (local || typeof console.log === 'function') {
    console.log.apply(console, arguments);
  }
}

//1. namespace
var NS = NS || {
  Utils: {},
  Models: {},
  Views: {}
};

//2. Revealing Module Pattern:
NS.App = (function() {
  var init = function() {
    NS.Utils.log();
    this.welcome = new NS.Views.WelcomeScreen();
    this.welcome.showWelcome();
    this.news = new NS.Views.News();
    NS.Models.News.getNews();
  };
  return {
    init: init
  };
}());
NS.App.init();

(function($) {
  var m = 'private message';
  NS.Views.WelcomeScreen = function() {
    this.welcome = $('#welcome');
  };

  NS.Views.WelcomeScreen.prototype = {
    showWelcome: function(){
      this.welcome.html(m);
    }
  };
}(jQuery));

$(function() { NS.App.init(); });

// Observer pattern: pubsub
NS.Models.News = (function() {
  var url = '/some/news/';
  var getNews = function() {
    $.ajax({url:url,....success: newsRetrieved});
  };
  var newsRetrieved = function(news){
    AmplifyJS.publish('news-retrieved', news);
  }
  return {
    getNews: getNews
  }
}());

(function(){
  NS.Views.News = function(){
    this.news = $('#news');
    amplify.subscribe('news-retrieved', $.proxy(this.showNews));
  };

  NS.Views.prototype.showNews = function(news) {
    var self = this;
    $.each(news.function(article) { self.append(article); });
  }
}());


jQuery.fn.threeColumns = function(params, callback) {
  var opts = {
    fsize_step: 2,
    //will use for element.css(opts.adjust_box());
    adjust_box: function() {
      return {
        'margin': '20px',
        'padding': '20px',
        'height': 'auto'
      }
    }
  };
  jQuery.extend(opts, params);

  if(typeof opts.adjust_box === 'function') {
    console.log(opts.adjust_box());
  }
  callback(opts);
}

$('div.container').threeColumns({a:'b'}, function(params){
  console.log(params);
});

//Will display:
Object { margin="20px", padding="20px", height="auto"}
Object { fsize_step=2, a="b", adjust_box=function()}
