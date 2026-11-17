const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { employeeBody, employeeIdParam, employeeIdQuery, searchQuery } = require('../validators/employeeValidators');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

// every employee route requires a valid JWT
router.use(auth);

router.get('/employees', employeeController.getAll);
// must be registered before /employees/:eid, otherwise "search" is treated as an id
router.get('/employees/search', searchQuery, validate, employeeController.search);
router.post('/employees', employeeBody, validate, employeeController.create);
router.get('/employees/:eid', employeeIdParam, validate, employeeController.getById);
router.put('/employees/:eid', employeeIdParam, employeeBody, validate, employeeController.update);
router.delete('/employees', employeeIdQuery, validate, employeeController.remove);

module.exports = router;