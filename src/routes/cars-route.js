const { Router } = require('express');

const { change, create, getAll, remove, getOne, get } = require('../controllers/cars-controller');

const isAdmin = require('../middlewares/is-admin-middleware');
const isAuth = require('../middlewares/is-auth-middleware');

const router = Router();

router.post('/cars', isAdmin, create);
router.get('/cars', isAuth, getAll);
router.get('/cars/one/:id', isAuth, getOne);
router.get('/cars/:id', isAuth, get);
router.put('/cars/:id', isAdmin, change);
router.delete('/cars/:id', isAdmin, remove);

module.exports = router;