const { Router } = require('express');

const { change, create, getAll, remove, findOne } = require('../controllers/category-controller');

const isAdmin = require('../middlewares/is-admin-middleware');
const isAuth = require('../middlewares/is-auth-middleware');

const router = Router();

router.post('/category', isAdmin, create);
router.get('/category', isAuth, getAll);
router.get('/category/:id', isAuth, findOne);
router.put('/category/:id', isAdmin, change);
router.delete('/category/:id', isAdmin, remove);

module.exports = router;