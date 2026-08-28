const router = require('express').Router();
const controller = require('../controllers/predictionController');
const { validate } = require('../middleware/validationMiddleware');
const { predictionSchema, historyQuerySchema } = require('../validators/predictionValidator');
const csvUpload = require('../middleware/csvUploadMiddleware');

router.post('/csv', csvUpload, controller.batch);
router.route('/').post(validate(predictionSchema), controller.create).get(validate(historyQuerySchema, 'query'), controller.list);
router.route('/:id').get(controller.getOne).delete(controller.remove);
module.exports = router;
