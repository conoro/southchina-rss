// Cowtools RSS - Copyright Conor O'Neill 2020, conor@conoroneill.com
// LICENSE Apache-2.0
// Invoke like https://url.of.serverless.function/dev/rss

module.exports.check = (event, context, callback) => {
  var request = require("request");
  var cheerio = require("cheerio");
  var RSS = require("rss");
  var URL = "https://www.scmp.com/sport/outdoor/trail-running";

  var feed = new RSS({
    title: "South China RSS",
    description: "Return latest ttrail running news from the SCMP",
    feed_url: "http://example.com/rss.xml",
    site_url: URL,
    image_url:
      "https://www.scmp.com/sport/outdoor/desktop/images/favicons/android-icon-192x192.png",
    docs: "http://example.com/rss/docs.html",
    managingEditor: "conor@conoroneill.com",
    webMaster: "conor@conoroneill.com",
    copyright: "2020 Conor ONeill",
    language: "en",
    pubDate: "Jan 01, 2020 06:00:00 GMT",
    ttl: "60"
  });

  request(URL, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $(".article-lv3__header").each(function () {
        var link = "https://www.scmp.com" + $(this).find("a").attr("href");
        var title = $(this).text() || "No caption";
        var currentDate = new Date();
        var description = title;
        feed.item({
          title: title,
          description: description,
          url: link,
          author: "SCMP",
          date: currentDate
        });
      });
      var xml = feed.xml();
      context.succeed(xml);
    }
  });
};
