const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const User = require('../../models/User');

const dataPath = path.join(__dirname, '../../data/users.json');

// Helper function to reset users.json before each test
function resetData() {
  const initialData = [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ];
  fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2), 'utf-8');
}

describe('User Model', () => {
  beforeEach(() => {
    resetData();
  });

  describe('getAllUsers()', () => {
    it('should retrieve all users', () => {
      const users = User.getAllUsers();
      expect(users).to.be.an('array').that.has.lengthOf(1);
      expect(users[0]).to.include({ id: 1, name: 'John Doe', email: 'john@example.com' });
    });
  });

  describe('getUserById()', () => {
    it('should retrieve a user by valid ID', () => {
      const user = User.getUserById(1);
      expect(user).to.be.an('object').that.includes({ id: 1, name: 'John Doe', email: 'john@example.com' });
    });

    it('should return null for non-existent ID', () => {
      const user = User.getUserById(999);
      expect(user).to.be.null;
    });
  });

  describe('createUser()', () => {
    it('should create a new user', () => {
      const newUserData = { name: 'Jane Doe', email: 'jane@example.com' };
      const newUser = User.createUser(newUserData);

      expect(newUser).to.be.an('object').that.includes(newUserData);
      expect(newUser).to.have.property('id', 2);

      const users = User.getAllUsers();
      expect(users).to.have.lengthOf(2);
    });
  });

  describe('updateUser()', () => {
    it('should update an existing user', () => {
      const updatedData = { name: 'John Smith', email: 'john.smith@example.com' };
      const updatedUser = User.updateUser(1, updatedData);

      expect(updatedUser).to.be.an('object').that.includes(updatedData);
      expect(updatedUser).to.have.property('id', 1);

      const user = User.getUserById(1);
      expect(user).to.include(updatedData);
    });

    it('should return null when updating a non-existent user', () => {
      const updatedData = { name: 'Ghost User', email: 'ghost@example.com' };
      const result = User.updateUser(999, updatedData);
      expect(result).to.be.null;
    });
  });

  describe('deleteUser()', () => {
    it('should delete an existing user', () => {
      const result = User.deleteUser(1);
      expect(result).to.be.true;

      const users = User.getAllUsers();
      expect(users).to.be.an('array').that.is.empty;
    });

    it('should return false when deleting a non-existent user', () => {
      const result = User.deleteUser(999);
      expect(result).to.be.false;
    });
  });
});