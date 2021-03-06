var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var user = require('../db/UserSql.js');
router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 查询单个用户
router.post('/querySingleUser', function (req, res, next) {
  let params = {
    uName: req.body.uName
  };
  connection.query(user.queryUser(params), function (error, results, fields) {
    if (results.length > 0) {
          res.send({
            data: {
              code: 200,
              data: results[0],
              message: "查询成功"
            }
          })
    } else {
      res.send({
        data: {
          code: -100,
          message: err
        }
      })
    }
  })
})

// 修改用户信息
router.post('/updateUser', function (req, res, next) {
  let params = {
    uName: req.body.uName,
    uPassword: req.body.uPassword,
    uNickName: req.body.uNickName,
    uPhone: req.body.uPhone,
    uPower: req.body.uPower
  };
  connection.query(user.updateUser(params), function (error, results, fields) {
    if (results.protocol41) {
      res.send({
        data: {
          code: 200,
          data: results,
          message: "修改成功"
        }
      })
    } else {
      res.send({
        data: {
          code: -100,
          message: error
        }
      })
    }
  })
})

router.post('/deleteUser', function (req, res, next) {
  let params = {
    uName: req.body.uName
  };
  connection.query(user.deleteUser(params), function (error, results, fields) {
    if (results) {
      res.send({
        data: {
          code: 200,
          data: results,
          message: "删除成功"
        }
      })
    } else {
      res.send({
        data: {
          code: -100,
          message: error
        }
      })
    }
  })
})

module.exports = router;
