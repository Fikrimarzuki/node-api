const UserController = require("../controllers/UserController");

/**
 * Parse the URL to extract the user ID if present.
 * @param {string} pathname - The request pathname.
 * @returns {Object} An object containing the route handler and extracted ID.
*/
function parseRoute(pathname, method) {
  const userIdMatch = pathname.match(/^\/users\/(\d+)$/);
  
  if (pathname === '/users') {
    if (method === 'GET') {
      return { handler: UserController.getUsers };
    } else if (method === 'POST') {
      return { handler: UserController.createUser };
    }
  } else if (userIdMatch) {
    const id = parseInt(userIdMatch[1]);
    if (method === 'GET') {
      return { handler: (req, res) => UserController.getUser(req, res, id) };
    } else if (method === 'PUT') {
      return { handler: (req, res) => UserController.updateUser(req, res, id) };
    } else if (method === 'DELETE') {
      return { handler: (req, res) => UserController.deleteUser(req, res, id) };
    }
  }

  return { handler: null };
}

module.exports = { parseRoute }
