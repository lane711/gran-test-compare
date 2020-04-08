const express = require('express');
const app = express();
require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')
let Parser = require('rss-parser');
let parser = new Parser();

const port = process.env.PORT || 3000;
const checkFeeInterval = process.env.CHECK_FEED_INTERVAL || 1 * 10 * 1000;
const doWriteFile = false;

// app.get("/", function(req, res) {
//   let today = new Date();
//   res.send(today + ' --> Mode:' + process.env.MODE);

//   setInterval(function() {
//     printAndWriteGoogleIndex();
//   }, checkFeeInterval); //1 minutes

// });

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

setInterval(async function() {
  printAndWriteGoogleIndex();
}, checkFeeInterval); //1 minutes

//==============================

const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const request = require("request");
require("colors");
const url = process.env.MODE === "dev" ? "http://10.211.55.3/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=2038&max=20&isgovdelivery=1" 
                                        : "https://defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=945&max=20&isgovdelivery=1";
var dateFormat = require("dateformat");
var jsdiff = require("diff");
var lastFile = "";
var lastFileContent = "";



const getContent = async() => {
  let content = "";
  let feed = await parser.parseURL(url);
  console.log(feed.title);

  feed.items.forEach(item => {
    content += item.content;
});

  return content;
};


// const getContent = () => {

//   // console.log('downloading from: ' + url);

//   const options = {
//     url: url,
//     rejectUnauthorized: false
//   };

//   return new Promise((resolve, reject) => {
//     request(options, function(error, response, html) {
//       if(error){
//         console.log(error);
//       }
//       console.log('status:' + response.statusCode );
//       if (!error && response.statusCode == 200) {
//         console.log(html);
//         resolve(html);
//       }
//     });
//   });
// };

// const fetchHTML = async(url) => {
//   const { data } = await axios.get(url)
//   return cheerio.load(data)
// };

const printAndWriteGoogleIndex = async () => {
  try {
    // const { data } = await axios.get(url)

    // let fileContent2 = await this.fetchHTML(url);

    let fileContent = await getContent();

    console.log('file length:' + fileContent.length);

    let fileName = generateFileName();
    let filePath = `${__dirname}/files/${fileName}`;

    if(doWriteFile){
      await writeFile(filePath, fileContent, "utf8");
    }
    // console.log(`${fileName} written`);
    compareFeeds(fileName, fileContent, lastFile, lastFileContent);
    lastFile = fileName;
    lastFileContent = fileContent;
  } catch (err) {
    console.log(err);
  }
};

function generateFileName() {
  var now = new Date();
  let nowFormatted = dateFormat(now, "yyyy-mm-dd--h:MM:ss-TT");
  // console.log(nowFormatted);
  return nowFormatted + ".txt";
}

function compareFeeds(fileName, fileContent, lastFile, lastFileContent) {
  if (lastFile) {
    console.log(`comparing: ${fileName}<-->${lastFile}`);

    var diff = jsdiff.diffChars(fileContent, lastFileContent);
    diff.forEach(function(part) {
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? "green" : part.removed ? "red" : "grey";
      if (color !== "grey") {
        if (part.value.length > 6) {
          process.stderr.write(part.value[color]);
        } else {
          // process.stderr.write("no major change\n");
        }
      }
    });
  }
}
