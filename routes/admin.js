const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/admin', adminController.getAdmin);

router.post('/admin/api', adminController.postApi);

router.get('/dashboard', adminController.getDashboard);

router.get('/task-list', adminController.getTaskList);

router.get('/task-edit/:id', adminController.getTaskDetail);

router.get('/task-create', adminController.getTaskCreate);

module.exports = router;