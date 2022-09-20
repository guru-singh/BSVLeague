const sql = require('mssql');
const dbConfig = require('./config');
const commonControl = require('./common');

exports.userLogin = (objParam) => {
  console.log('I am Here',objParam);
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
            console.log(resp)
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
  // return new Promise((resolve) => {
  //   var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
  //   dbConn
  //     .connect()
  //     .then(function () {
  //       var request = new sql.Request(dbConn);
  //       request
  //         .execute("USP_FETCH_TASK")
  //         .then(function (resp) {
  //           resolve(resp);
  //           dbConn.close();
  //         })
  //         .catch(function (err) {
  //           console.log(err);
  //           dbConn.close();
  //         });
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     });
  // });

}

exports.createTask = (objParam) => {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("taskName", sql.NVarChar, objParam.taskName)
          .input('points', sql.BigInt, objParam.taskPoint)
          .input("taskDescp", sql.NVarChar, objParam.tastDescription)
          .input("isDisable", sql.Bit, objParam.isDisabled)
          .execute("USP_INSERT_TASK")
          .then(function (resp) {
            console.log('Task Created1');
            console.log(resp);
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

exports.getTaskById = (objParam) => {
  console.log('Get Task By Id');
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("taskId", sql.Int, objParam.id)
          .execute("USP_FETCH_TASK_BY_ID")
          .then(function (resp) {
            console.log('Response Data');
            console.log(resp);
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

exports.updateTask = (objParam) => {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("taskId", sql.Int, objParam.id)
          .input("taskName", sql.NVarChar, objParam.taskName)
          .input('points', sql.BigInt, objParam.taskPoint)
          .input("taskDescp", sql.NVarChar, objParam.tastDescription)
          .input("isDisable", sql.Bit, objParam.isDisabled)
          .execute("USP_INSERT_TASK")
          .then(function (resp) {
            console.log('Task Updated');
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

exports.deleteTask = (objParam) => {
  console.clear();
  console.log('Task Deleted', objParam);
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("taskId", sql.Int, objParam.id)
          .input("taskName", sql.NVarChar, objParam.taskName)
          .input('points', sql.BigInt, objParam.taskPoint)
          .input("taskDescp", sql.NVarChar, objParam.tastDescription)
          .input("isDisable", sql.Bit, objParam.isDisabled)
          .execute("USP_INSERT_TASK")
          .then(function (resp) {
            console.log('Task Created');
            console.log(resp);
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

