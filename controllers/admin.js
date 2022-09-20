const { response } = require('express');
const path = require('path');

const adminCommonCtrl = require('./adminCommon');

const _allowedDesignaiton = ['ZBM', 'RBM', 'ADMIN', 'Sr KAM', 'KAM'];

exports.getAdmin = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/admin/login.html`);
};

exports.getDashboard = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/admin/dashboard.html`);
};

exports.getTaskCreate = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/admin/task-create.html`);
};

exports.getTaskList = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/admin/task-list.html`);
};

exports.getTaskDetail = (req, res, next) => {
  res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/admin/task-edit.html`);
};

exports.postApi = (req, res, next) => {
  switch (req.body.method) {

    case 'login':
      adminCommonCtrl.userLogin(req.body).then((result) => {
        let response, success, msg, userDetiails, session
        response = {
          success: true
        },
          session = req.session;
        if (result.recordset) {
          let rec = result.recordset[0]
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
        //console.log(req.session)

        response = {
          success, msg, userDetiails
        };

        session = req.session;
        session.userid = req.body.username;
       // console.log(req.session)
        res.status(200).json(response);
      });
      break;

    case 'taskList':
      adminCommonCtrl.getTaskList(req.body).then((response) => {
        res.status(200).json(response.recordsets);
      });
      break;

    case 'taskcreate':
      adminCommonCtrl.createTask(req.body).then((response) => {
        res.status(200).json(response);
      });
      break;

    case 'taskGetById':
      adminCommonCtrl.getTaskById(req.body).then((response) => {
        res.status(200).json(response);
      });
      break;

    case 'taskupdate':
      adminCommonCtrl.updateTask(req.body).then((response) => {
        res.status(200).json(response);
      });
      break;

    case 'taskdelete':
      adminCommonCtrl.deleteTask(req.body).then((response) => {
        res.status(200).json(response);
      });
      break;
  }
};

