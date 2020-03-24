const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const request = require("request");
require('colors');
const url =
  "http://10.211.55.3/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=2038&max=20&isgovdelivery=1";
// "https://defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=945&max=20&isgovdelivery=1";
var dateFormat = require("dateformat");
var jsdiff = require('diff');
var lastFile = "";
var lastFileContent = "";

const getContent = () => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => (err ? reject(err) : resolve(body)));
  });
};

const printAndWriteGoogleIndex = async () => {
  try {
    let fileContent = await getContent();
    // console.log(googleIndexHTML);

    let fileName = generateFileName();
    let filePath = `${__dirname}/files/${fileName}`;
    await writeFile(filePath, fileContent, "utf8");
    console.log(`${fileName} written`);
    compareFeeds(fileName, fileContent, lastFile, lastFileContent);
    lastFile = fileName;
    lastFileContent = fileContent;
  } catch (err) {
    console.log(err);
  }
};

time = setInterval(function() {
  printAndWriteGoogleIndex();
}, 1 * 10 * 1000); //5 minutes

function generateFileName() {
  var now = new Date();
  let nowFormatted = dateFormat(now, "yyyy-MM-dd--h:MM:ss-TT");
  // console.log(nowFormatted);
  return nowFormatted + ".txt";
}

function compareFeeds(fileName, fileContent, lastFile, lastFileContent) {
  if (lastFile) {
    console.log(`comparing: ${fileName}<-->${lastFile}`);

    var diff = jsdiff.diffChars(fileContent, lastFileContent);
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'grey';
      process.stderr.write(part.value[color]);
    });
  }
}
