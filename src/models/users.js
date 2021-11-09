const mongoConnection = require('./connection');

const dbConnection = async () => {
  const db = await mongoConnection.getConnection().then((conn) => conn.collection('users'));

  return db;
};

const findEmail = async (email) => {
  const db = await dbConnection();
  const newEmail = await db.findOne({ email });
  return newEmail;
};

const createUser = async (name, email, password) => {
  const db = await dbConnection();
  const newUser = await db.insertOne({ name, email, password, role: 'user' });

  const { _id, role } = newUser.ops[0];
 
  return {
    user: {
      name,
      email,
      role,
      _id,
    },
  };
};

const createAdmin = async (name, email, password) => {
  const db = await dbConnection();
  const newAdmin = await db.insertOne({ name, email, password, role: 'admin' });

  const { _id, role } = newAdmin.ops[0];
 
  return {
    user: {
      name,
      email,
      role,
      _id,
    },
  };
};

module.exports = {
  findEmail,
  createUser,
  createAdmin,
};
