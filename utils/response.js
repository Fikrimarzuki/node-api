/**
 * Send a standardized HTTP response.
 * @param {Object} res - HTTP response object.
 * @param {number} statusCode - HTTP status code.
 * @param {Object} [data] - Response data.
*/
function sendResponse(res, statusCode, data = null) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
}

module.exports = { sendResponse }
