const { response } = require('express');
const path = require('path');
const _allowedDesignaiton = ['ZBM', 'RBM', 'ADMIN', 'KAM', 'SR KAM'];
const managerController = require('./managerCommon');

exports.getLogin = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/login.html`);
};

exports.getDashboard = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/my-dashboard.html`);
};
exports.getPendingTask = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/pending-task.html`);
};

exports.getTaskPerfomed = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/perfomed-task.html`);
};

exports.getMyPerfomedTask = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/my-performed-task.html`);
};

exports.logMeOut = (req, res, next) => {
  req.session.destroy();
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/login.html`);
}

exports.clearSession = (req, res, next) => {
  req.session.destroy();
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/manager/clear.html`);
}


exports.postApi = (req, res, next) => {

  switch (req.body.method) {

    case 'managerLogin':
      managerController.userLogin(req.body).then((result) => {
        let response, success, msg, userDetiails, session;
        response = {
          success: true
        },
          session = req.session;

        if (result.recordset) {
          let rec = result.recordset[0];
          if (_allowedDesignaiton.includes(rec.Designation.toUpperCase())) {
            success = true;
            msg = 'Login successful'
            userDetiails = {
              empId: rec.EmpID,
              name: rec.firstName,
              post: rec.Designation,
              lastLogin: rec.lastLoginDate,
              targetLeft: 4
            }
          }
          else {
            success = false;
            msg = 'You are not authorized to login to the system';
          }

        }
        else {
          success = false;
          msg = 'Invalid Username or Password'
        }

        session.userDetiails = userDetiails;
        // console.log(req.session)

        response = {
          success, msg, userDetiails
        };

        session = req.session;
        session.userid = req.body.username;
        //    console.log('Manager 64',req.session);

        res.status(200).json(response);
      });
      break;

    case 'taskList':
      managerController.getTaskList(req.body).then((response) => {
        res.status(200).json(response.recordset);
      });
      break;

    case 'createPerfomTask':
      managerController.createTask(req).then((response) => {
        res.status(200).json(response);
      });
      break;

    case 'myPerfomedTask':
      managerController.getMyPerfomedTask(req).then((response) => {
        res.status(200).json(response);
      });
      break;

    case 'myTeamTask':
      if (req.session.myTeamTask) {
        //console.log('SESSION IS PRESENT, GET IT FROM SESSION')
        res.status(200).json(req.session.myTeamTask);
      } else {
        //console.log('HIT THE DATABASE')
        managerController.getMyTeamTask(req).then((response) => {
          req.session.myTeamTask = response;
          res.status(200).json(response);
        });
      }

      break;
    case 'myDashboard':
      managerController.getMyDashboard(req).then((response) => {
        res.status(200).json(response);
      });
      break;

    case 'approvedTask':
    managerController.approvedTask(req).then((response) => {
      res.status(200).json(response);
    });
    break;
  }

};