const router = require('express').Router();
const controller = require('../controllers/analyticsController');

router.get('/dashboard', controller.dashboard);
router.get('/dataset', controller.dataset);
router.get('/risk', controller.risk);
router.get('/transaction-types', controller.transactionTypes);
router.get('/amount-tiers', controller.amountTiers);

module.exports = router;
