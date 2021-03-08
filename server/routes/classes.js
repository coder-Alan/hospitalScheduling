var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var classes = require('../db/classesSql.js');
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

// 查询单个班次
router.post('/querySingleClasses', function (req, res, next) {
    let params = {
        bCode: req.body.bCode
    };
    connection.query(classes.queryClasses(params), function (error, results, fields) {
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

// 查询班次列表
router.post('/queryClassesList', function (req, res, next) {
    let pageSize = req.body.pageSize
    let page = req.body.page
    let params = {
        bCode: req.body.bCode,
        bName: req.body.bName,
    };
    params.page = (page - 1) * pageSize
    connection.query(classes.queryClasses(params), function (error, results, fields) {
        if (results.length > 0) {
            connection.query(classes.queryClassesTotal(), function (err, result) {
                if (result.length >= 0) {
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
        } else if (results.length == 0) {
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
                    message: error
                }
            })
        }
    })
})

//查询班次编号是否存在
router.post('/testBCode', function (req, res, next) {
    let params = {
        bCode: req.body.bCode
    };
    connection.query(classes.queryClasses(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 201,
                    message: "该班次编号已存在"
                }
            })
        } else if (results.length == 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该班次编号可以添加"
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

//查询班次名称是否存在
router.post('/testBName', function (req, res, next) {
    let params = {
        bName: req.body.bName
    };
    connection.query(classes.queryClasses(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 201,
                    message: "该班次名称已存在"
                }
            })
        } else if (results.length == 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该班次名称可以添加"
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

// 添加班次信息
router.post('/addClasses', function (req, res, next) {
    let params = {
        bCode: req.body.bCode,
        bName: req.body.bName,
        bStartTime: req.body.bStartTime,
        bEndTime: req.body.bEndTime,
        remarks: req.body.remarks,
    };
    connection.query(classes.inserClassesData(params), function (error, results, fields) {
        if (results) {
            connection.query(classes.queryClasses(params), function (err, result) {
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
                            data: result,
                            message: '添加失败'
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

// 修改班次信息
router.post('/updateClasses', function (req, res, next) {
    let params = {
        bCode: req.body.bCode,
        bName: req.body.bName,
        bStartTime: req.body.bStartTime,
        bEndTime: req.body.bEndTime,
        remarks: req.body.remarks,
    };
    connection.query(classes.updateClasses(params), function (error, results, fields) {
        if (results) {
            res.send({
                data: {
                    code: 200,
                    data: results,
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
})

// 删除班次信息
router.post('/deleteClasses', function (req, res, next) {
    let params = {
        bCode: req.body.bCode
    };
    connection.query(classes.deleteClasses(params), function (error, results, fields) {
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
