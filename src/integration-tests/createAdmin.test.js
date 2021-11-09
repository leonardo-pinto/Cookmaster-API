const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/POST /users/admin', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('is not possible to create a new admin when the "role" is not "admin"', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user1@email.com',
        password: '123456',
        role: 'user',
      });
    
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user1@email.com',
          password: '123456',
        })
        .then((res) => res.body.token);

      response = await chai.request(server)
          .post('/users/admin')
          .send({
            name: 'admin name',
            email: 'admin@email.com',
            password: '123456',
          })
          .set('authorization', token);
    });

    it('returns a 403 status code', () => {
      expect(response).to.have.status(403);
    });

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "Only admins can register new admins"', () => {
      expect(response.body.message).to.be.equal('Only admins can register new admins');
    });
  });

  describe('is not possible to create a new admin when the email already exists', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'admin',
        email: 'repeatedemail@email.com',
        password: '123456',
        role: 'admin',
      });
    
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'repeatedemail@email.com',
          password: '123456',
        })
        .then((res) => res.body.token);

      response = await chai.request(server)
          .post('/users/admin')
          .send({
            name: 'admin name',
            email: 'repeatedemail@email.com',
            password: '123456',
          })
          .set('authorization', token);
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
  })

  describe('when the admin is created successfully', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'admin',
        email: 'admin@email.com',
        password: '123456',
        role: 'admin',
      });
    
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'admin@email.com',
          password: '123456',
        })
        .then((res) => res.body.token);

      response = await chai.request(server)
          .post('/users/admin')
          .send({
            name: 'admin name',
            email: 'newadmin@email.com',
            password: '123456',
          })
          .set('authorization', token);
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
});
