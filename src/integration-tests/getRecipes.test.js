const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

const { expect } = chai;

const server = require('../api/app');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');

describe('/GET /recipes', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('returns an array with the created recipes', () => {
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

      response = await chai.request(server)
        .get('/recipes');
    });
    
    it('returns a 200 status code', () => {
      expect(response).to.have.status(200);
    })
    
    it('returns an array', () => {
      expect(response.body).to.be.an('array');
    });
    
    it('the array is not empty', () => {
      expect(response.body).to.be.not.empty;
    });
  });
});
