function handleError(res, error, statusCode = 500) {
  console.error("Error:", error);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
}

module.exports = { handleError }
