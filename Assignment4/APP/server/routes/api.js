const express = require('express');
const router = express.Router();

const client_controller = require('../controllers/client_controller');
const staff_controller = require('../controllers/staff_controller');
const transaction_controller = require('../controllers/transaction_controller');
const loan_controller = require('../controllers/loan_controller');
const statement_controller = require('../controllers/statement_controller');

router.post('/client-login', client_controller.login);
router.post('/client', client_controller.create);
router.get('/client/:id', client_controller.findOne);
router.get('/clients', client_controller.findAll);
router.put('/client/:id', client_controller.update);
router.delete('/client/:id', client_controller.delete);

router.post('/staff-login', staff_controller.login);
router.post('/staff', staff_controller.create);
router.get('/staff/:id', staff_controller.findOne);
router.get('/staff', staff_controller.findAll);
router.put('/staff/:id', staff_controller.update);
router.delete('/staff/:id', staff_controller.delete);

router.post('/transfer', transaction_controller.transfer);
router.get('/transaction', transaction_controller.findAll);

router.post('/loan', loan_controller.create);

router.get('/statement', statement_controller.findAll);

module.exports = router;
