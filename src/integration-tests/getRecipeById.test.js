const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/GET /recipes/:id', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('when there is a recipe with the given id', () => {
    let response;
    
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@user.com',
        password: '123456',
        role: 'user',
      });
    
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@user.com',
          password: '123456',
        })
        .then((res) => res.body.token)
    
      const recipe = await chai.request(server)
        .post('/recipes')
        .send({
          name: 'recipe name',
          ingredients: 'ingredients name',
          preparation: 'preparation steps'
        })
        .set('authorization', token);

      const { _id } = recipe.body.recipe
 
      response = await chai.request(server)
        .get(`/recipes/${_id}`);
    });
    
    it('returns a 200 status code', () => {
      expect(response).to.have.status(200);
    })
    
    it('returns an object', () => {
      expect(response.body).to.be.an('object');
    });
    
    it('the object has the attributes "_id", "name", "ingredients", "preparation", and "userId"', () => {
      expect(response.body).to.include.all.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });
  });

  describe('when there is not a recipe with the given id', () => {
    let response;
    
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne({
        name: 'name',
        email: 'user@user.com',
        password: '123456',
        role: 'user',
      });
    
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@user.com',
          password: '123456',
        })
        .then((res) => res.body.token)
    
      await chai.request(server)
        .post('/recipes')
        .send({
          name: 'recipe name',
          ingredients: 'ingredients name',
          preparation: 'preparation steps'
        })
        .set('authorization', token);

      const _id = 'invalid recipe id';
 
      response = await chai.request(server)
        .get(`/recipes/${_id}`);
    });
    
    it('returns a 404 status code', () => {
      expect(response).to.have.status(404);
    })
    
    it('returns an object', () => {
      expect(response.body).to.be.an('object');
    });
    
    it('the object has a "message" attribute', () => {
      expect(response.body).to.have.property('message');
    });

    it('"message" property has the text: "recipe not found"', () => {
      expect(response.body.message).to.be.equal('recipe not found');
    });
  });
});
