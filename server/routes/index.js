var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var user = require('../db/UserSql.js');
// var jwt_decode = require('jwt-decode');

//验证码
// let code = '';
//接入短信的sdk
// var QcloudSms = require("qcloudsms_js");

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/index_list/data', function(req, res, next) {
  res.json({
    'a': 1
  });
});

//用户登录
router.post('/api/login', function(req, res, next) {
	//前端给后端的数据
	let params = {
		uName : req.body.uName,
    uPassword  : req.body.uPassword
	}
	//查询用户名存在不存在
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0 ){
      // 查询密码是否正确
			connection.query( user.queryUserPwd( params ) , function (err, result) {
				if(  result.length > 0 ){
            res.send({
                data:{
                  code: 200,
                  message: "登录成功",
                  data: result[0]
                }
            })
				}else{
          res.send({
            data:{
              code: -100,
              message: "密码不正确"
            }
          })
				}
			})
		}else{
			res.send({
				data:{
					code: -100,
					message: "用户名不存在"
				}
			})
		}
	})
});

//注册验证账号是否存在
router.post('/api/test/name', function(req, res, next) {
	// 前端给后端的数据
	let params = {
		uName : req.body.uName
	};
	// 查询账号是否存在
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0 ){
			res.send({
				data:{
					code: -100,
					message: "该账号已注册"
				}
			})
		}else{
			res.send({
				data:{
          code: 200,
          message: error
				}
			})
		}
	})
})

//注册验证用户名是否存在
router.post('/api/test/nickname', function(req, res, next) {
	// 前端给后端的数据
	let params = {
		uNickName : req.body.uNickName
	};
	// 查询用户名是否存在
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0 ){
			res.send({
				data:{
					code: -100,
					message: "该用户名已注册"
				}
			})
		}else{
			res.send({
				data:{
          code: 200,
          message: '该用户名可以注册'
				}
			})
		}
	})
})

// 注册-->数据库添加一条数据
router.post('/api/addUser', function(req, res, next) {
	// 前端给后端的数据
	let params = {
		uName: req.body.uName,
		uPassword: req.body.uPassword,
		uImgUrl: req.body.uImgUrl,
		uNickName: req.body.uNickName,
		uPhone: req.body.uPhone,
		registration: req.body.registration,
	};
  connection.query( user.inserData( params ) , function (error, results, fields) {
    if( results.length > 0 ){
      connection.query( user.queryUserName( params ) , function (err, result) {
        if( result.length > 0 ){
          res.send({
            data:{
              code: 200,
              message: '注册成功',
              data: result[0]
            }
          })
        } else {
          res.send({
            data:{
              code: -100,
              message: err
            }
          })
        }
      })
    } else {
      res.send({
        data:{
          code: -100,
          message: error
        }
      })
    }
  })
})

module.exports = router;
