const express = require('express');
const router = express.Router();

const managerController = require('../controllers/manager');

// router.get('/manager/*', (req, res) =>{
//     console.log('*******************************************')
//     console.log('i am here')
//     console.log('*******************************************')
// });

router.get('/manager/login', managerController.getLogin);
router.get('/manager/my-dashboard', managerController.getDashboard);

router.get('/manager/pending-task', managerController.getPendingTask);

router.get('/manager/perform-task', managerController.getTaskPerfomed);

router.get('/manager/my-task', managerController.getMyPerfomedTask);
router.get('/manager/logout', managerController.logMeOut);
router.get('/manager/clear-session', managerController.clearSession);

router.post('/manager/api', managerController.postApi);



module.exports = router;