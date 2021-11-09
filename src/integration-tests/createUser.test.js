const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/POST /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('when the "name" is not in the requisiton body', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ email: 'email@email.com', password: 'password123'});
    });

    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('when the "email" is not in the requisiton body', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'name', password: 'password123'});
    });

    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('when the "password" is not in the requisiton body', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'name', email: 'email@email.com'});
    });

    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('when the "email" is not in the correct format', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'name', email: 'invalidEmail', password: 'password' });
    });

    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('when the user is created successfully', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'name', email: 'email@email.com', password: 'password' });
    });

    it('returns a 201 status code', () => {
      expect(response).to.have.status(201);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "user" attribute', () => {
      expect(response.body).to.have.property('user');
    });

    it('"user" property has the attributes "name", "email", "role", and "_id"', () => {
      expect(response.body.user).to.include.all.keys('name', 'email', 'role', '_id');
    });
  })

  describe('when the email already exists', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'new user',
        email: 'email@email.com',
        password: 'new password',
        role: 'user',
      });

      response = await chai.request(server)
        .post('/users')
        .send({ name: 'name', email: 'email@email.com', password: 'password' });
    });

    it('returns a 409 status code', () => {
      expect(response).to.have.status(409);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "Email already registered"', () => {
      expect(response.body.message).to.be.equal('Email already registered');
    });
  });
});
