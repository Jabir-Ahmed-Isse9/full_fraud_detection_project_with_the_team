const router = require('express').Router();
const controller = require('../controllers/dashboardController');
router.get('/summary', controller.summary);
router.get('/charts', controller.charts);
router.get('/models', controller.models);
module.exports = router;
