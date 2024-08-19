const { Router } = require('express');

const { uploadPhoto } = require('../controllers/uploate');

const router = Router();

router.post('/photo', uploadPhoto);

module.exports = router;