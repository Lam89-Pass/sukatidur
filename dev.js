const http = require('http');
const fs = require('fs');
const path = require('path');
const build = require('./build');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'text/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.webp': 'image/webp',
};

build();

let rebuildTimeout = null;
fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (filename) {
        clearTimeout(rebuildTimeout);
        rebuildTimeout = setTimeout(() => {
            console.log(`\n[WATCH] Change detected in ${filename}, rebuilding...`);
            try {
                build();
            } catch (err) {
                console.error('[ERROR] Rebuild failed:', err.message);
            }
        }, 100);
    }
});

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';

    const filePath = path.join(ROOT_DIR, reqUrl);

    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 [SERVER] Server running at http://localhost:${PORT}`);
    console.log(`📁 [WATCH] Watching src/ for edits... Auto-compiling to index.html`);
    console.log(`💡 Tekan Ctrl+C untuk menghentikan server.\n`);
});
