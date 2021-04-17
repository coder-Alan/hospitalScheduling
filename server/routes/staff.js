var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var staff = require('../db/staffSql.js');
router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 查询单个员工
router.post('/querySingleStaff', function (req, res, next) {
    let params;
    if (req.body.yCode) {
        params = {
            yCode: req.body.yCode
        };
    } else if (req.body.uCode) {
        params = {
            uCode: req.body.uCode
        };
    }
    connection.query(staff.queryStaff(params), function (error, results, fields) {
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
                    message: error
                }
            })
        }
    })
})

// 查询员工列表
router.post('/queryStaffList', function (req, res, next) {
    let pageSize = req.body.pageSize
    let page = req.body.page
    let params = {
        yCode: req.body.yCode,
        yName: req.body.yName
    };
    params.page = (page - 1) * pageSize
    connection.query(staff.queryStaff(params), function (error, results, fields) {
        if (results.length > 0) {
            connection.query(staff.queryStaffTotal(), function (err, result) {
                if (result.length > 0) {
                    res.send({
                        data: {
                            code: 200,
                            data: results,
                            total: result[0]['COUNT(*)'],
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

//查询员工编号是否存在
router.post('/testYCode', function (req, res, next) {
    let params = {
        yCode: req.body.yCode
    };
    connection.query(staff.queryStaff(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该员工编号已存在"
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

//查询用户编号是否存在
router.post('/testUCode', function (req, res, next) {
    let params = {
        uCode: req.body.uCode
    };
    connection.query(staff.queryUCode(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该用户编号已存在"
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

// 添加员工信息
router.post('/addStaff', function (req, res, next) {
    let params = {
        yCode: req.body.yCode,
        uCode: req.body.uCode,
        yName: req.body.yName,
        ySex: req.body.ySex,
        yCategory: req.body.yCategory,
        yTitle: req.body.yTitle,
        yDepartment: req.body.yDepartment,
        yPhone: req.body.yPhone,
        yImgUrl: req.body.yImgUrl
    };
    connection.query(staff.inserStaffData(params), function (error, results, fields) {
        if (results) {
            connection.query(staff.queryStaff(params), function (err, result) {
                if (result.length > 0) {
                    res.send({
                        data: {
                            code: 200,
                            message: '添加成功',
                            data: result
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

// 修改员工信息
router.post('/updateStaff', function (req, res, next) {
    let params = {
        yCode: req.body.yCode,
        uCode: req.body.uCode,
        yName: req.body.yName,
        ySex: req.body.ySex,
        yCategory: req.body.yCategory,
        yTitle: req.body.yTitle,
        yDepartment: req.body.yDepartment,
        yPhone: req.body.yPhone,
        yImgUrl: req.body.yImgUrl
    };
    connection.query(staff.updateStaff(params), function (error, results, fields) {
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

// 删除员工信息
router.post('/deleteStaff', function (req, res, next) {
    let params = {
        yCode: req.body.yCode
    };
    connection.query(staff.deleteStaff(params), function (error, results, fields) {
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
