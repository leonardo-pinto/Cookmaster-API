const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/POST /recipes', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('it is not possible to create a new recipe without a token', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });

      await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)

      response = await chai.request(server)
        .post('/recipes')
        .send({ 
          name: 'recipe name',
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        });
    });

    it('returns a 401 status code', () => {
      expect(response).to.have.status(401);
    })

    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });

    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('it is not possible to create a new recipe using an invalid token', () => {
    let response;
  
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });
  
      await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)
  
      response = await chai.request(server)
        .post('/recipes')
        .send({ 
          name: 'recipe name',
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        })
        .set('authorization', 'invalid token');
    });
  
    it('returns a 401 status code', () => {
      expect(response).to.have.status(401);
    })
  
    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });
  
    it('"message" property has the text: "jst malformed"', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('when the name is not in the requisition body', () => {
    let response;
  
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });
  
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)
  
      response = await chai.request(server)
        .post('/recipes')
        .send({ 
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        })
        .set('authorization', token);
    });
  
    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    })
  
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

  describe('when the ingredients is not in the requisition body', () => {
    let response;
  
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });
  
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)
  
      response = await chai.request(server)
        .post('/recipes')
        .send({
          name: 'recipe name',
          preparation: 'recipe preparation',
        })
        .set('authorization', token);
    });
  
    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    })
  
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

  describe('when the preparation is not in the requisition body', () => {
    let response;
  
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });
  
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)
  
      response = await chai.request(server)
        .post('/recipes')
        .send({
          name: 'recipe name',
          ingredients: 'ingredients name',
        })
        .set('authorization', token);
    });
  
    it('returns a 400 status code', () => {
      expect(response).to.have.status(400);
    })
  
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

  describe('when the recipe is created successfully', () => {
    let response;
  
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@email.com',
        password: '123456',
        role: 'user',
      });
  
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)
  
      response = await chai.request(server)
        .post('/recipes')
        .send({
          name: 'recipe name',
          ingredients: 'ingredients name',
          preparation: 'preparation steps'
        })
        .set('authorization', token);
    });
  
    it('returns a 201 status code', () => {
      expect(response).to.have.status(201);
    })
  
    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('the object has a "recipe" attribute', () => {
      expect(response.body).to.have.property('recipe');
    });
  
    it('"recipe" property has the attributes "name", "ingredients", "preparation", "userId", "_id"', () => {
      expect(response.body.recipe).to.include.all.keys('name', 'ingredients', 'preparation', 'userId', '_id');
    });
  });
});
