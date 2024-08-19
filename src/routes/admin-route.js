const { Router } = require('express');

const { login, changeUser, getUsers } = require('../controllers/admin-controller');

const isAdmin = require('../middlewares/is-admin-middleware')

const router = Router();

router.post('/admin/login', login);
router.get('/admin/users', isAdmin, getUsers);
router.put('/admin/change/:id', isAdmin, changeUser);

module.exports = router;