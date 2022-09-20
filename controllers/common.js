const sql = require('mssql');
const dbConfig = require('./config');

exports.getTaskListData = (objParam) => {
    return new Promise((resolve) => {
      var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
      dbConn
        .connect()
        .then(function () {
          var request = new sql.Request(dbConn);
          request
            .input("showAll", sql.Bit, objParam.showAll)
            .execute("USP_FETCH_TASK")
            .then(function (resp) {
              resolve(resp);
           //   console.log('Manager Task List Page');
            //  console.log(resp);
              dbConn.close();
            })
            .catch(function (err) {
              console.log(err);
              dbConn.close();
            });
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  }