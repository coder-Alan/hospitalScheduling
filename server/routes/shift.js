var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var shift = require('../db/shiftSql.js');
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

// 查询单个调班
router.post('/querySingleShift', function (req, res, next) {
    let params = {
        tPeople: req.body.tPeople
    };
    connection.query(shift.queryShift(params), function (error, results, fields) {
        if (results) {
            res.send({
                data: {
                    code: 200,
                    data: results[0],
                    message: "查询成功"
                }
            })
        } else if (error) {
            res.send({
                data: {
                    code: -100,
                    message: error
                }
            })
        }
    })
})

// 查询调班列表
router.post('/queryShiftList', function (req, res, next) {
    let pageSize = req.body.pageSize
    let page = req.body.page
    let params = {
        tPeople: req.body.tPeople,
        tDay: req.body.tDay,
    };
    params.page = (page - 1) * pageSize
    connection.query(shift.queryShift(params), function (error, results, fields) {
        if (results && results.length > 0) {
            connection.query(shift.queryShiftTotal(), function (err, result) {
                if (result) {
                    res.send({
                        data: {
                            code: 200,
                            data: results,
                            total: result[0]['COUNT(*)'],
                            message: "查询成功"
                        }
                    })
                } else if (err) {
                    res.send({
                        data: {
                            code: -100,
                            message: err
                        }
                    })
                }
            })
        } else if (results && results.length == 0) {
            res.send({
                data: {
                    code: 200,
                    data: results,
                    total: 0,
                    message: "查询成功"
                }
            })
        } else if (error) {
            res.send({
                data: {
                    code: -100,
                    error: error
                }
            })
        }
    })
})

// 查询所有班次
router.get('/queryAllBName', function (req, res, next) {
    connection.query(shift.queryAllBName(), function (error, results, fields) {
        if (results) {
            res.send({
                data: {
                    code: 200,
                    data: results,
                    message: "查询成功"
                }
            })
        } else if (error) {
            res.send({
                data: {
                    code: -100,
                    message: error
                }
            })
        }
    })
})

// 添加调班信息
router.post('/addShift', function (req, res, next) {
    let params = {
        tPeople: req.body.tPeople,
        kName: req.body.kName,
        tDate: req.body.tDate,
        tDay: req.body.tDay,
        tClasses: req.body.tClasses,
    };
    params.page = 0;
    connection.query(shift.inserShiftData(params), function (error, results, fields) {
        if (results) {
            connection.query(shift.queryShift(params), function (err, result) {
                if (result && result.length > 0) {
                    res.send({
                        data: {
                            code: 200,
                            message: '添加成功',
                            data: result
                        }
                    })
                } else if (result && result.length == 0) {
                    res.send({
                        data: {
                            code: 201,
                            message: result
                        }
                    })
                } else if (err) {
                    res.send({
                        data: {
                            code: -100,
                            message: err
                        }
                    })
                }
            })
        } else if (error) {
            res.send({
                data: {
                    code: -100,
                    message: error
                }
            })
        }
    })
})

// 修改调班信息
router.post('/updateShift', function (req, res, next) {
    let param = {tPeople: req.body.oldTName}
    connection.query(shift.queryShift(param), function (err, results) {
        if (results) {
            let params = {
                tPeople: req.body.tPeople,
                kName: req.body.kName,
                tDate: req.body.tDate,
                tDay: req.body.tDay,
                tClasses: req.body.tClasses,
                tCode: results[0].tCode,
            };
            connection.query(shift.updateShift(params), function (error, result, fields) {
                if (result) {
                    res.send({
                        data: {
                            code: 200,
                            data: result,
                            message: "修改成功"
                        }
                    })
                } else if (error) {
                    res.send({
                        data: {
                            code: -100,
                            message: error
                        }
                    })
                }
            })
        } else if (err) {
            res.send({
                data: {
                    code: -100,
                    message: err
                }
            })
        }
    })
})

// 删除调班信息
router.post('/deleteShift', function (req, res, next) {
    let params = {
        tPeople: req.body.tPeople
    };
    connection.query(shift.deleteShift(params), function (error, results, fields) {
        if (results) {
            res.send({
                data: {
                    code: 200,
                    data: results,
                    message: "删除成功"
                }
            })
        } else if (error) {
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
