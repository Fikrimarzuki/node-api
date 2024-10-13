const fs = require("fs");
const path = require("path");

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  
  /**
   * Get the path to the users.json file.
   * @returns {string} The file path.
  */
  static getFilePath() {
    return path.join(__dirname, '..', 'data', 'users.json');
  }

  /**
   * Read users data from the JSON file.
   * @returns {Array} Array of user objects.
  */
  static readData() {
    try {
      const data = fs.readFileSync(User.getFilePath(), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users data:', error);
      return [];
    }
  }

  /**
   * Write users data to the JSON file.
   * @param {Array} data - Array of user objects.
  */
  static writeData(data) {
    try {
      fs.writeFileSync(User.getFilePath(), JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing users data:', error);
    }
  }

  /**
   * Retrieve all users.
   * @returns {Array} List of users.
  */
  static getAllUsers() {
    return User.readData();
  }

  /**
   * Retrieve a user by ID.
   * @param {number} id - User ID.
   * @returns {Object|null} User object or null if not found.
  */
  static getUserById(id) {
    const users = User.readData();
    const user = users.find((u) => u.id === id);
    return user ? new User(user.id, user.name, user.email) : null;
  }

  /**
   * Create a new user.
   * @param {Object} userData - Data for the new user.
   * @returns {Object} The created user.
  */
  static createUser(userData) {
    const users = User.readData();
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    const newUser = new User(newId, userData.name, userData.email);
    users.push(newUser);
    User.writeData(users);
    return newUser;
  }

  /**
   * Update an existing user.
   * @param {number} id - User ID.
   * @param {Object} updatedData - Updated user data.
   * @returns {Object|null} The updated user or null if not found.
  */
 static updateUser(id, updatedData) {
  const users = User.readData();
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { id, ...updatedData };
    User.writeData(users);
    return new User(users[index].id, users[index].name, users[index].email);
  }
  return null;
 }

 /**
   * Delete a user by ID.
   * @param {number} id - User ID.
   * @returns {boolean} True if deletion was successful, else false.
  */
  static deleteUser(id) {
    const users = User.readData();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      User.writeData(users);
      return true;
    }
    return false;
  }
}

module.exports = User;
