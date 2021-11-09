const router = require('express').Router();
const usersController = require('../controllers/users');
const validateJWT = require('../middlewares/validateJWT');
const validateNewUser = require('../middlewares/validateNewUser');

router.post('/admin', validateJWT, validateNewUser, usersController.createAdmin);
router.post('/', validateNewUser, usersController.createUser);

module.exports = router;
