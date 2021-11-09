const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rescue = require('express-rescue');
const usersRouter = require('../routes/usersRoutes');
const loginRouter = require('../routes/loginRoutes');
const recipesRouter = require('../routes/recipesRoutes');
const error = require('../middlewares/error');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, '../', 'uploads')));
app.use('/users', rescue(usersRouter));
app.use('/login', rescue(loginRouter));
app.use('/recipes', rescue(recipesRouter));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use(error);

module.exports = app;
