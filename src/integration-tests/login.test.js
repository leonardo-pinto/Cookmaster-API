const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/POST /login', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('when the "email" is not in the requisiton body', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({ password: 'password123'});
    });

    it('returns a 401 status code', () => {
      expect(response).to.have.status(401);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('when the "password" is not in the requisiton body', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({ email: 'email@email.com'});
    });

    it('returns a 401 status code', () => {
      expect(response).to.have.status(401);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('when the "email" is not in the correct format', () => {
    let response;

    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({ email: 'invalidEmail', password: 'password' });
    });

    it('returns a 400 status code', () => {
      expect(response).to.have.status(401);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('when the email and password are not found in db or are incorrect', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'email@email.com',
        password: '123456',
        role: 'user',
      });

      response = await chai.request(server)
        .post('/login')
        .send({ email: 'differentEmail@email.com', password: '654321' });
    });

    it('returns a 401 status code', () => {
      expect(response).to.have.status(401);
    });
    
    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });
    
    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });
    
    it('"message" property has the text: "Incorrect username or password"', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password');
    });
  });

  describe('when the login is successfull', () => {
    let response;
  
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });
  
      response = await chai.request(server)
        .post('/login')
        .send({ email: 'user@email.com', password: '123456' });
    });
  
    it('returns a 200 status code', () => {
        expect(response).to.have.status(200);
    });
      
    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });
      
    it('the object has a "token" attribute', () => {
      expect(response.body).to.have.property('token');
    });
      
    it('"token" property is not empty"', () => {
      expect(response.body.token).to.be.not.empty;
    });
  });
});
