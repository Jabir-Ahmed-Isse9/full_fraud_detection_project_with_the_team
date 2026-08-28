const router = require('express').Router();
const controller = require('../controllers/modelController');

router.get('/performance', controller.performance);

module.exports = router;
