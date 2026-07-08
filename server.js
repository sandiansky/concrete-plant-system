const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });

  const ip = req.socket.remoteAddress?.replace('::ffff:', '');
  const ts = new Date().toLocaleString('zh-CN');
  console.log(`[${ts}] ${ip} ${req.method} ${req.url}`);
}).listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const ifaces = os.networkInterfaces();
  let localIP = '127.0.0.1';
  Object.keys(ifaces).forEach(name => {
    ifaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) localIP = iface.address;
    });
  });
  console.log(`\n  混凝土拌合站经营系统 已启动`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  本地访问:  http://localhost:${PORT}`);
  console.log(`  局域网:    http://${localIP}:${PORT}`);
  console.log(`  公网:     http://你的公网IP:${PORT}`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  注意: 公网访问需在路由器做端口转发`);
  console.log(`  或使用 ngrok: ngrok http ${PORT}\n`);
});
