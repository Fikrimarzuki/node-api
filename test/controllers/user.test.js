// test/controllers/user.test.js

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const User = require('../../models/User');
const userController = require('../../controllers/UserController');

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

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    resetData();

    req = {
      on: sinon.stub()
    };
    res = {
      setHeader: sinon.stub(),
      writeHead: sinon.stub(),
      end: sinon.stub()
    };
    // statusStub = sinon.stub(res, 'writeHead').callsFake(() => {});
    // jsonStub = sinon.stub();
    // endStub = sinon.stub(res, 'end').callsFake(() => {});
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getUsers()', () => {
    it('should retrieve all users and send a 200 response', () => {
      userController.getUsers(req, res);

      expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
      expect(res.writeHead.calledWith(200)).to.be.true;
      expect(res.end.calledOnce).to.be.true;

      const expectedData = JSON.stringify(User.getAllUsers());
      expect(res.end.firstCall.args[0]).to.equal(expectedData);
    });
  });

  describe('getUser()', () => {
    it('should retrieve a user by ID and send a 200 response', () => {
      const userId = 1;
      userController.getUser(req, res, userId);

      expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
      expect(res.writeHead.calledWith(200)).to.be.true;
      expect(res.end.calledOnce).to.be.true;

      const expectedData = JSON.stringify(User.getUserById(userId));
      expect(res.end.firstCall.args[0]).to.equal(expectedData);
    });

    it('should send a 404 response if user not found', () => {
      const userId = 999;
      userController.getUser(req, res, userId);

      expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
      expect(res.writeHead.calledWith(404)).to.be.true;
      expect(res.end.calledOnce).to.be.true;

      const expectedData = JSON.stringify({ message: 'User not found' });
      expect(res.end.firstCall.args[0]).to.equal(expectedData);
    });
  });

  describe('createUser()', () => {
    it('should create a new user and send a 201 response', (done) => {
      const userData = { name: 'Jane Doe', email: 'jane@example.com' };
      const reqData = JSON.stringify(userData);

      // Mock req.on('data') and req.on('end')
      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(reqData));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.createUser(req, res);

      // Allow asynchronous code to execute
      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(201)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const newUser = User.getUserById(2);
        const expectedData = JSON.stringify(newUser);
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });

    it('should send a 400 response for invalid JSON', (done) => {
      const invalidJSON = "{ name: 'Jane Doe', email: 'jane@example.com' "; // Missing closing }

      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(invalidJSON));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.createUser(req, res);

      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(400)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const expectedData = JSON.stringify({ message: 'Invalid JSON' });
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });

    it('should send a 400 response if name or email is missing', (done) => {
      const incompleteData = { name: 'Jane Doe' }; // Missing email
      const reqData = JSON.stringify(incompleteData);

      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(reqData));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.createUser(req, res);

      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(400)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const expectedData = JSON.stringify({ message: 'Name and email are required' });
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });
  });

  describe('updateUser()', () => {
    it('should update an existing user and send a 200 response', (done) => {
      const userId = 1;
      const updatedData = { name: 'John Smith', email: 'john.smith@example.com' };
      const reqData = JSON.stringify(updatedData);

      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(reqData));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.updateUser(req, res, userId);

      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(200)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const updatedUser = User.getUserById(userId);
        const expectedData = JSON.stringify(updatedUser);
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });

    it('should send a 404 response if user not found', (done) => {
      const userId = 999;
      const updatedData = { name: 'Ghost User', email: 'ghost@example.com' };
      const reqData = JSON.stringify(updatedData);

      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(reqData));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.updateUser(req, res, userId);

      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(404)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const expectedData = JSON.stringify({ message: 'User not found' });
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });

    it('should send a 400 response for invalid JSON', (done) => {
      const userId = 1;
      const invalidJSON = "{ name: 'John Smith', email: 'john.smith@example.com' "; // Missing closing }

      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(invalidJSON));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.updateUser(req, res, userId);

      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(400)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const expectedData = JSON.stringify({ message: 'Invalid JSON' });
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });

    it('should send a 400 response if name or email is missing', (done) => {
      const userId = 1;
      const incompleteData = { name: 'John Smith' }; // Missing email
      const reqData = JSON.stringify(incompleteData);

      req.on.withArgs('data').callsFake((event, callback) => {
        callback(Buffer.from(reqData));
      });
      req.on.withArgs('end').callsFake((event, callback) => {
        callback();
      });

      userController.updateUser(req, res, userId);

      setImmediate(() => {
        expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
        expect(res.writeHead.calledWith(400)).to.be.true;
        expect(res.end.calledOnce).to.be.true;

        const expectedData = JSON.stringify({ message: 'Name and email are required' });
        expect(res.end.firstCall.args[0]).to.equal(expectedData);
        done();
      });
    });
  });

  describe('deleteUser()', () => {
    it('should delete an existing user and send a 204 response', () => {
      const userId = 1;
      userController.deleteUser(req, res, userId);

      expect(res.writeHead.calledWith(204)).to.be.true;
      expect(res.end.calledOnce).to.be.true;

      const user = User.getUserById(userId);
      expect(user).to.be.null;
    });

    it('should send a 404 response if user not found', () => {
      const userId = 999;
      userController.deleteUser(req, res, userId);

      expect(res.setHeader.calledWith('Content-Type', 'application/json')).to.be.true;
      expect(res.writeHead.calledWith(404)).to.be.true;
      expect(res.end.calledOnce).to.be.true;

      const expectedData = JSON.stringify({ message: 'User not found' });
      expect(res.end.firstCall.args[0]).to.equal(expectedData);
    });
  });
});
