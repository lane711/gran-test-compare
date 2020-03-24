let Parser = require('rss-parser');
let parser = new Parser();
fs = require('fs');
const url = "http://defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=945&max=20&isgovdelivery=1";

(async () => {
 
  let feed = await parser.parseURL(url);
  console.log(feed);

  fs.writeFile('files/1.txt', feed, function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });
 
  feed.items.forEach(item => {
    // console.log(item.title + ':' + item.link)
  });
 
})();