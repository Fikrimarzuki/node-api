// require("dotenv").config();
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT || 3000;

function serveStaticFile(res, filePath) {
  const extname = path.extname(filePath);
  const contentType = mime.getType(extname) || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File not found' }));
      } else {
        // Some server error
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

const server = http.createServer((req, res) => {
  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Enable CORS (Optional, useful for development)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Routing for Swagger Documentation
  if (pathname === '/docs' && method === 'GET') {
    const docsPath = path.join(__dirname, 'docs', 'index.html');
    serveStaticFile(res, docsPath);
    return;
  }

  if (pathname === '/swagger.json' && method === 'GET') {
    const swaggerPath = path.join(__dirname, 'docs', 'swagger.json');
    serveStaticFile(res, swaggerPath);
    return;
  }

  if (pathname.startsWith("/swagger-ui")) {
    const assetPath = path.join(__dirname, 'node_modules', 'swagger-ui-dist', pathname.replace('/swagger-ui', ''));
    serveStaticFile(res, assetPath);
    return;
  }

  // Delegate routing
  const { handler } = userRoutes.parseRoute(pathname, method);

  if (handler) {
    handler(req, res);
  } else {
    // Route not found
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
})

server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
  console.log(`Docs: ${PORT}/docs`);
})