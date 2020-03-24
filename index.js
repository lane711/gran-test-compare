const { promisify } = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const request = require("request");
const url =
  "https://defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=400&Site=945&max=20&isgovdelivery=1";

const getGoogleIndexHTML = () => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => (err ? reject(err) : resolve(body)));
  });
};

const printAndWriteGoogleIndex = async () => {
  try {
    let googleIndexHTML = await getGoogleIndexHTML();
    console.log(googleIndexHTML);

    let fileName = generateFileName();
    let filePath = `${__dirname}/files/${fileName}`;
    await writeFile(filePath, googleIndexHTML, "utf8");
    console.log("google-index.html written.");
  } catch (err) {
    console.log(err);
  }
};

printAndWriteGoogleIndex();

// (async () => {

//   let fileName = generateFileName();
//   let filePath = `${__dirname}/files/${fileName}`;

//   // fs.writeFile(filePath, feed.toString(), function(err) {
//   //   if (err) return console.log(err);
//   // });

// })();

function generateFileName() {
  let now = new Date();
  return now + ".txt";
}
