"use strict";

//Twitterオブジェクトのコンストラクタ・プロトタイプ定義
function Twitter() {}
Twitter.prototype = {
        consumerKey:    "CT0K1CufZIY0w3Ir2PbYzQ",
        consumerSecret: "zgbjko7BrZE9Y23jTMMvksrk7L72311kIBVUHTrj6Gg",
        accessToken:    "304458004-XcX6oCqw2oUr8FnoZElLDng5veBCB8jY6EJ2CiRn",
        tokenSecret:    "W9JPu0kbf2VDqlPjBUEEgmBGLWGc7HSnEiMwCd1kGw"
};
Twitter.prototype.get = function(api, content) {
    var accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: this.tokenSecret
    };

    var message = {
        method: "GET",
        action: api,
        parameters: {
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.consumerKey,
            oauth_token: this.accessToken
        }
    };
    for (var key in content) {
        message.parameters[key] = content[key];
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var target = OAuth.addToURL(message.action, message.parameters);
 
    var options = {
        type: message.method,
        url: target,
        dataType: "jsonp",
        jsonp: false,
        cache: true
    };
    $.ajax(options);
}

function update(data){
      var root = jQuery('#news');
      if (data.length) {
        root.empty();
        jQuery.each(data.slice(0,5), function(idx, item) {
          var cDate = new Date(Date.parse(item.created_at.replace(/( \+)/, ' UTC$1')));
          root.append('<h3>' + jQuery.datepicker.formatDate('yy.mm.dd', cDate) + '</h3>');
          root.append('<p>' + item.text + '</p>');
        });
      }
      else {
        root.text('最新情報はありません。');
      }
}

var feeds = feeds || {};

jQuery.extend(feeds,
  (function() {
    var twitter = new Twitter(),
        f = function getnewsfor(feed) {
        //オプションとコールバック関数の指定
        var content = {count: "5", callback: "update"};
        //Twitter APIの呼び出し
        twitter.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name="+feed+"&exclude_replies=true&trim_user=true&include_rts=false&since_id=168970566731173888", content)
    }, twitter_feed = 'restaurantlaine';

    return {
      get_latest_news: function() {
        f(twitter_feed);
      }
    };
  })()
);
