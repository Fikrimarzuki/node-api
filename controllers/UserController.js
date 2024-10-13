const User = require("../models/User");
const { handleError } = require("../utils/errorHandler");
const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

class UserController {
  /**
   * Handle retrieving all users.
   * @param {Object} req - HTTP request.
   * @param {Object} res - HTTP response.
  */
  static getUsers(req, res) {
    try {
      const users = User.getAllUsers();
      sendResponse(res, 200, users);
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      handleError(res, error);
    }
  }

  /**
   * Handle retrieving a user by ID.
   * @param {Object} req - HTTP request.
   * @param {Object} res - HTTP response.
   * @param {number} id - User ID.
  */
  static getUser(req, res, id) {
    try {
      const user = User.getUserById(id);
      if (user) {
        sendResponse(res, 200, user);
      } else {
        sendResponse(res, 404, { message: 'User not found' });
      }
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      sendResponse(res, 500, { message: 'Internal Server Error' });
    }
  }

  /**
   * Handle creating a new user.
   * @param {Object} req - HTTP request.
   * @param {Object} res - HTTP response.
  */
  static createUser(req, res) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        if (!userData.name || !userData.email) {
          sendResponse(res, 400, { message: 'Name and email are required' });
          return;
        }
        const newUser = User.createUser(userData);
        sendResponse(res, 201, newUser);
      } catch (error) {
        console.error('Error creating user:', error);
        sendResponse(res, 400, { message: 'Invalid JSON' });
      }
    });

    req.on('error', (error) => {
      console.error('Error receiving data:', error);
      sendResponse(res, 500, { message: 'Internal Server Error' });
    });
  }

  /**
   * Handle updating an existing user.
   * @param {Object} req - HTTP request.
   * @param {Object} res - HTTP response.
   * @param {number} id - User ID.
  */
  static updateUser(req, res, id) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const updatedData = JSON.parse(body);
        if (!updatedData.name || !updatedData.email) {
          sendResponse(res, 400, { message: 'Name and email are required' });
          return;
        }
        const updatedUser = User.updateUser(id, updatedData);
        if (updatedUser) {
          sendResponse(res, 200, updatedUser);
        } else {
          sendResponse(res, 404, { message: 'User not found' });
        }
      } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        sendResponse(res, 400, { message: 'Invalid JSON' });
      }
    });

    req.on('error', (error) => {
      console.error('Error receiving data:', error);
      sendResponse(res, 500, { message: 'Internal Server Error' });
    });
  }

  /**
   * Handle deleting a user.
   * @param {Object} req - HTTP request.
   * @param {Object} res - HTTP response.
   * @param {number} id - User ID.
  */
  static deleteUser(req, res, id) {
    try {
      const success = User.deleteUser(id);
      if (success) {
        sendResponse(res, 204);
      } else {
        sendResponse(res, 404, { message: 'User not found' });
      }
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      sendResponse(res, 500, { message: 'Internal Server Error' });
    }
  }
}

module.exports = UserController;
