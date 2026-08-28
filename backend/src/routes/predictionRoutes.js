const router = require('express').Router();
const controller = require('../controllers/predictionController');
const { validate } = require('../middleware/validationMiddleware');
const { predictionSchema, historyQuerySchema } = require('../validators/predictionValidator');

router.route('/').post(validate(predictionSchema), controller.create).get(validate(historyQuerySchema, 'query'), controller.list);
router.route('/:id').get(controller.getOne).delete(controller.remove);
module.exports = router;
