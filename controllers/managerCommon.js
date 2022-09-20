const sql = require('mssql');
const dbConfig = require('./config');
const commonControl = require('./common');

exports.userLogin = (objParam) => {
  console.log('Manager Login Executed');
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
          .connect()
          .then(function () {
            var request = new sql.Request(dbConn);
            request
              .input("email", sql.NVarChar, objParam.username)
              .input("password", sql.NVarChar, objParam.password)
              .execute("USP_VALIDATE_USER")
              .then(function (resp) {
                resolve(resp);
                dbConn.close();
              })
              .catch(function (err) {
                //console.log(err);
                dbConn.close();
              });
          })
          .catch(function (err) {
            //console.log(err);
          });
      });
  };

  exports.getTaskList = (objParam) => {
    return commonControl.getTaskListData(objParam);
  }

  exports.createTask = (objParam) => {
    return new Promise((resolve) => {
      var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
      dbConn
        .connect()
        .then(function () {
          var request = new sql.Request(dbConn);
          request
            .input("empTaskId", sql.Int, null)
            .input("taskId", sql.Int, objParam.body.taskId)
            .input("empId", sql.Int, objParam.body.empId)
            .input("isApproved", sql.Bit, true)
            .execute("USP_ADD_NEW_EMP_TASK")
            .then(function (resp) {
              resolve(resp);
              dbConn.close();
            })
            .catch(function (err) {
              //console.log(err);
              dbConn.close();
            });
        })
        .catch(function (err) {
          //console.log(err);
        });
        
    });
  };

  exports.getMyPerfomedTask = (objParam) => {
    return new Promise((resolve) => {
      var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
      dbConn
        .connect()
        .then(function () {
          var request = new sql.Request(dbConn);
          request
            .input("empID", sql.Int, objParam.body.empId)
            .execute("USP_GET_MY_PERFORMED_TASK")
            .then(function (resp) {
              resolve(resp);
              dbConn.close();
            })
            .catch(function (err) {
              dbConn.close();
            });
        })
        .catch(function (err) {
          //console.log(err);
        });
    });
  }

  exports.getMyTeamTask = (objParam) => {
    return new Promise((resolve) => {
      var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
      dbConn
        .connect()
        .then(function () {
          var request = new sql.Request(dbConn);
          request
            .input("empID", sql.Int, objParam.body.empId)
            .execute("USP_GET_MY_TEAM_TASK")
            .then(function (resp) {
              resolve(resp.recordset);
              dbConn.close();
            })
            .catch(function (err) {
              dbConn.close();
            });
        })
        .catch(function (err) {
          //console.log(err);
        });
    });
  }

  exports.getMyDashboard = (objParam) => {
    return new Promise((resolve) => {
      var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
      dbConn
        .connect()
        .then(function () {
          var request = new sql.Request(dbConn);
          request
            .input("empID", sql.Int, objParam.body.empId)
            .execute("USP_GET_MY_LEAGUE_DASHBOARD")
            .then(function (resp) {
              resolve(resp.recordset);
              dbConn.close();
            })
            .catch(function (err) {
              dbConn.close();
            });
        })
        .catch(function (err) {
          //console.log(err);
        });
    });
  }

  exports.approvedTask = (objParam) => {
    return new Promise((resolve) => {
      var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
      dbConn
        .connect()
        .then(function () {
          var request = new sql.Request(dbConn);
          request
            .input("empTaskId", sql.Int, objParam.body.checkedId)
            .execute("USP_APPROVE_TASK_BY_TASKID")
            .then(function (resp) {
              resolve(resp.recordset);
              dbConn.close();
            })
            .catch(function (err) {
              dbConn.close();
            });
        })
        .catch(function (err) {
          //console.log(err);
        });
    });
  }


 