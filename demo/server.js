const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const { parse } = path;

// maps file extension to MIME types
const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
};

const searchPaths = ['./public', '../metadata/images'];

const fsExistPromise = fileName => new Promise((resolve, reject) => {
    try {
        fs.exists(fileName, (exist) => {
            resolve(exist);
        });
    } catch (err) {
        reject(err);
    }
});

const fsReadFilePromise = fileName => new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            return reject(err);
        }
        resolve(data);
    });
});

const locateFile = async (filePath, currentIdx = 0) => {
    if (currentIdx >= searchPaths.length) {
        return null;
    }
    const fileName = `${searchPaths[currentIdx]}/${filePath}`;
    const found = await fsExistPromise(fileName);
    if (!found) {
        return locateFile(filePath, currentIdx + 1);
    }
    // if is a directory search for index file matching the extension
    if (fs.statSync(fileName).isDirectory()) {
        return locateFile(`${filePath}/index.html`, currentIdx);
    }
    return fileName;
};

http.createServer(async (req, res) => {
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    const fileName = await locateFile(parsedUrl.pathname);
    if (!fileName) {
        res.statusCode = 404;
        res.end(`File ${parsedUrl.pathname} not found!`);
        return;
    }
    const parseResult = parse(fileName);
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    let { ext } = parseResult;
    ext = ext || '.html';

    // read file from file system
    try {
        const data = await fsReadFilePromise(fileName);
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain');
        res.end(data);
    } catch (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
    }
}).listen(port);

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

console.log(`Server listening on port ${port}`);
