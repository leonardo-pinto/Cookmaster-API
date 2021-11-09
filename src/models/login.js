const mongoConnection = require('./connection');

const dbConnection = async () => {
  const db = await mongoConnection.getConnection().then((conn) => conn.collection('users'));

  return db;
};

const findUserByEmail = async (email) => {
  const db = await dbConnection();
  const user = await db.findOne({ email });
  return user;
};

module.exports = {
  findUserByEmail,
};
