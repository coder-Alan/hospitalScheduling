var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var room = require('../db/roomSql.js');
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

// 查询单个科室
router.post('/querySingleRoom', function (req, res, next) {
    let params = {
        kCode: req.body.kCode
    };
    connection.query(room.queryRoom(params), function (error, results, fields) {
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

// 查询科室列表
router.post('/queryRoomList', function (req, res, next) {
    let pageSize = req.body.pageSize
    let page = req.body.page
    let params = {
        kCode: req.body.kCode,
        kName: req.body.kName
    };
    params.page = (page - 1) * pageSize
    connection.query(room.queryRoom(params), function (error, results, fields) {
        if (results.length > 0) {
            connection.query(room.queryRoomTotal(), function (err, result) {
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

//查询科室编号是否存在
router.post('/testKCode', function (req, res, next) {
    let params = {
        kCode: req.body.kCode
    };
    connection.query(room.queryRoom(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该科室编号已存在"
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
    connection.query(room.queryYCode(params), function (error, results, fields) {
        if (results.length > 0) {
            // 在员工信息表中存在该员工编号
            connection.query(room.queryRoom(params), function (err, result, fields) {
                if (result.length > 0) {
                    res.send({
                        data: {
                            code: 201,
                            data: result,
                            message: "该员工编号已是其他科室的负责人"
                        }
                    })
                } else if (result.length == 0) {
                    res.send({
                        data: {
                            code: 200,
                            message: "该员工编号可以添加"
                        }
                    })
                } else {
                    res.send({
                        data: {
                            code: -100,
                            error: err
                        }
                    })
                }
            })
        } else if (results.length == 0) {
            res.send({
                data: {
                    code: 300,
                    error: results,
                    message: '在员工信息表中不存在该员工编号'
                }
            })
        } else {
            res.send({
                data: {
                    code: -100,
                    error: error,
                    data: results
                }
            })
        }
    })
})

// 添加科室信息
router.post('/addRoom', function (req, res, next) {
    let params = {
        kCode: req.body.kCode,
        kName: req.body.kName,
        yCode: req.body.yCode,
        kBrief: req.body.kBrief,
        remarks: req.body.remarks
    };
    connection.query(room.inserRoomData(params), function (error, results, fields) {
        if (results) {
            connection.query(room.queryRoom(params), function (err, result) {
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

// 修改科室信息
router.post('/updateRoom', function (req, res, next) {
    let params = {
        kCode: req.body.kCode,
        kName: req.body.kName,
        yCode: req.body.yCode,
        kBrief: req.body.kBrief,
        remarks: req.body.remarks
    };
    connection.query(room.updateRoom(params), function (error, results, fields) {
        if (results) {
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

// 删除科室信息
router.post('/deleteRoom', function (req, res, next) {
    let params = {
        kCode: req.body.kCode
    };
    connection.query(room.deleteRoom(params), function (error, results, fields) {
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
