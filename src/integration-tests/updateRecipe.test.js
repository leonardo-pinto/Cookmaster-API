const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/PUT /recipes/:id', () => {
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('it is not possible to edit a recipe without a token', () => {
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

      const recipeId = await chai.request(server)
        .post('/recipes')
        .send({ 
          name: 'recipe name',
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        })
        .set('authorization', token)
        .then((res) => res.body.recipe._id);

      response = await chai.request(server)
        .put(`/recipes/${recipeId}`)
        .send({ 
          name: 'edited recipe name',
          ingredients: 'edited recipe ingredients',
          preparation: 'edited recipe preparation',
        });
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
  
    it('"message" property has the text: "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  describe('it is not possible to edit a recipe using an invalid token', () => {
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

      const recipeId = await chai.request(server)
        .post('/recipes')
        .send({ 
          name: 'recipe name',
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        })
        .set('authorization', token)
        .then((res) => res.body.recipe._id);

      response = await chai.request(server)
        .put(`/recipes/${recipeId}`)
        .send({ 
          name: 'edited recipe name',
          ingredients: 'edited recipe ingredients',
          preparation: 'edited recipe preparation',
        })
        .set('authorization', 'invalid token');
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
  
    it('"message" property has the text: "jwt malformed"', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('it is not possible to edit a recipe using an invalid id', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');

      await usersCollection.insertMany([
        {
          name: 'name',
          email: 'user@email.com',
          password: '123456',
          role: 'user',
        },
        {
          name: 'distinct name',
          email: 'distinctuser@email.com',
          password: '123456',
          role: 'user',
        }
      ]);

      const userToken = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)

      const recipeId = await chai.request(server)
        .post('/recipes')
        .send({ 
          name: 'recipe name',
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        })
        .set('authorization', userToken)
        .then((res) => res.body.recipe._id);

        const distinctUserToken = await chai.request(server)
        .post('/login')
        .send({
          email: 'distinctuser@email.com',
          password: '123456',
        })
        .then((res) => res.body.token)

      response = await chai.request(server)
        .put(`/recipes/${recipeId}`)
        .send({ 
          name: 'edited recipe name',
          ingredients: 'edited recipe ingredients',
          preparation: 'edited recipe preparation',
        })
        .set('authorization', distinctUserToken);
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
  
    it('"message" property has the text: "invalid id or role to update the recipe"', () => {
      expect(response.body.message).to.be.equal('invalid id or role to update the recipe');
    });
  });

  describe('it is possible to edit a recipe', () => {
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

      const recipeId = await chai.request(server)
        .post('/recipes')
        .send({ 
          name: 'recipe name',
          ingredients: 'recipe ingredients',
          preparation: 'recipe preparation',
        })
        .set('authorization', token)
        .then((res) => res.body.recipe._id);

      response = await chai.request(server)
        .put(`/recipes/${recipeId}`)
        .send({ 
          name: 'edited recipe name',
          ingredients: 'edited recipe ingredients',
          preparation: 'edited recipe preparation',
        })
        .set('authorization', token);
    });

    it('returns a 200 status code', () => {
      expect(response).to.have.status(200);
    });
  
    it('returns an object with a body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('the object has the attributes "_id", "name", "ingredients", "preparation", "userId"', () => {
      expect(response.body).to.include.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });

    it('the object contains the updated recipe', () => {
      expect(response.body.name).to.be.equal('edited recipe name');
      expect(response.body.ingredients).to.be.equal('edited recipe ingredients');
      expect(response.body.preparation).to.be.equal('edited recipe preparation');
    });
  });
});