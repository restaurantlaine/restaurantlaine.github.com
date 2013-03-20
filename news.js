"use strict";

var feeds = feeds || {};

jQuery.extend(feeds,
  (function() {
    var f = function getnewsfor(feed) {
      jQuery.getJSON(
        'http://search.twitter.com/search.json?q=from:'+feed+'+&callback=?&format=json',
        function (data) {
          var root = jQuery('#news');
          if (data.results && data.results.length) {
            root.empty();
            jQuery.each(data.results.slice(0,5), function(idx, item) {
              var cDate = new Date(item.created_at);
    		        root.append('<h3>' + jQuery.datepicker.formatDate('yy.mm.dd', cDate) + '</h3>');
    		        root.append('<p>' + item.text + '</p>');
    		      });
          }
          else if (data.results) {
            root.text('最新情報はありません。');
          }
          else {
            root.text('最新情報の読み込みに失敗しました。');
          }
        }
      );
    }, twitter_feed = 'yo_and_mi';
  
    return {
      get_latest_news: function() {
        f(twitter_feed);
      }
    };
  })()
);
