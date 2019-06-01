// npm i request
// create ./docs/.vuepress/public/assets/ directory
// node ./scripts/replace-image.js docs/

'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');

const download = function(uri, filename, callback) {
  request.head(uri, function(err, res) {
    if (err) {
      console.log(err);
    }
    console.log(uri);
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback);
  });
};

const prefix = '/macaca-datahub';

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(dir, fileList) {
  const files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      fileList = walkSync(dir + file + '/', fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  });
  return fileList;
};

if (process.argv.length <= 2) {
  console.log('Usage: ' + __filename + ' path/to/directory');
  process.exit(-1);
}

const targetPath = process.argv[2];

const fileList = walkSync(targetPath, []);
const mdList = fileList.filter(file => file.endsWith('.md'));

function replacer(match, p1, p2, p3, p4, p5, p6, p7) {
  console.log(p1, p2, p3, p4, p5, p6, p7, match);
  const imgId = p6.split('/').pop();
  download(
    match.startsWith('//') ? 'https:' + match : match,
    './docs/.vuepress/public/assets/' + [ imgId, p7 ].join('.'),
    function() {
      console.log(match + ' done');
    }
  );
  return prefix + '/assets/' + [ imgId, p7 ].join('.');
}

mdList.forEach(file => {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
    // console.log(file);
    // const matchRes = data.match(
    //   /(http(s?):)*\/\/([/.\w\s-])*(cdn\.nlark\.com\/)(yuque)\/(.*)\.(jpg|gif|png)/g,
    // );
    // console.log(matchRes);
    const result = data.replace(
      /(http(s?):)*\/\/([/.\w\s-])*(cdn\.nlark\.com\/)(yuque)\/(.*)\.(jpg|gif|png)/g,
      replacer
    );
    // console.log(result);
    fs.writeFile(file, result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
});
