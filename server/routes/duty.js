var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var duty = require('../db/dutySql.js');
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

//查询所有员工对应的值班列表
router.post('/queryAllDutyList', function (req, res, next) {
    let staffList = req.body.staffList
    new Promise(async (ress, rej) => {
        let dutyList = []
        for (let i = 0; i < staffList.length; i++) {
            await connection.query(duty.queryDuty({ zPeople: staffList[i] }), function (error, results, fields) {
                if (results.length > 0) {
                    let oneObj = {
                        yName: '',
                        kName: '',
                        dutyList: []
                    }
                    for (let j = 0; j < results.length; j++) {
                        if (j === 0) {
                            oneObj.yName = results[j].zPeople
                            oneObj.kName = results[j].zRoom
                        }
                        oneObj.dutyList.push({
                            zDay: results[j].zDay,
                            zClasses: results[j].zClasses
                        })
                    }
                    dutyList.push(oneObj)
                }
            })
            await connection.query(duty.queryShift({ tPeople: staffList[i] }), function (error, results, fields) {
                if (results.length > 0) {
                    let isHas = false
                    for (let k = 0; k < dutyList.length; k++) {
                        if (results[0].tPeople == dutyList[k].yName) {
                            for (let j = 0; j < results.length; j++) {
                                dutyList[k].dutyList.push({
                                    zDay: results[j].tDay,
                                    zClasses: results[j].tClasses + '(调)'
                                })
                            }
                            isHas = true
                            break;
                        }
                    }
                    if (!isHas) {
                        let oneObj = {
                            yName: '',
                            kName: '',
                            dutyList: []
                        }
                        for (let j = 0; j < results.length; j++) {
                            if (j === 0) {
                                oneObj.yName = results[j].tPeople
                                oneObj.kName = results[j].kName
                            }
                            oneObj.dutyList.push({
                                zDay: results[j].tDay,
                                zClasses: results[j].tClasses + '(调)'
                            })
                        }
                        dutyList.push(oneObj)
                    }
                }
            })
        }
        setTimeout(() => {
            ress(dutyList)
        }, 500)
    }).then(ress => {
        if (ress.length > 0) {
            res.send({
            data: {
                code: 200,
                data: ress
            }
        })
        } else {
            res.send({
                data: {
                    code: 201,
                    message: "暂无排班信息"
                }
            })
        }
    })
})

// 查询单个值班
router.post('/querySingleDuty', function (req, res, next) {
    let params = {
        zCode: req.body.zCode
    };
    connection.query(duty.queryDuty(params), function (error, results, fields) {
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

// 查询值班列表
router.post('/queryDutyList', function (req, res, next) {
    let pageSize = req.body.pageSize
    let page = req.body.page
    let params = {
        zCode: req.body.zCode,
        zPeople: req.body.zPeople,
    };
    params.page = (page - 1) * pageSize
    connection.query(duty.queryDuty(params), function (error, results, fields) {
        if (results.length > 0) {
            connection.query(duty.queryDutyTotal(), function (err, result) {
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

// 查询所有班次
router.get('/queryAllBName', function (req, res, next) {
    connection.query(duty.queryAllBName(), function (error, results, fields) {
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

//查询值班编号是否存在
router.post('/testZCode', function (req, res, next) {
    let params = {
        zCode: req.body.zCode
    };
    connection.query(duty.queryDuty(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 201,
                    message: "该值班编号已存在"
                }
            })
        } else if (results.length == 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该值班编号可以添加"
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

//查询员工是否存在
router.post('/testZPeople', function (req, res, next) {
    let params = {
        zPeople: req.body.zPeople
    };
    connection.query(duty.queryStaff(params), function (error, results, fields) {
        if (results && results.length > 0) {
            res.send({
                data: {
                    code: 200,
                    data: results[0],
                    message: "该员工存在"
                }
            })
        } else if (results && results.length == 0) {
            res.send({
                data: {
                    code: 201,
                    message: "该员工不存在"
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

// 添加值班信息
router.post('/addDuty', function (req, res, next) {
    let params = {
        zCode: req.body.zCode,
        zPeople: req.body.zPeople,
        zRoom: req.body.zRoom,
        zPlaces: req.body.zPlaces,
        zDay: req.body.zDay,
        zClasses: req.body.zClasses,
        remarks: req.body.remarks,
    };
    connection.query(duty.inserDutyData(params), function (error, results, fields) {
        if (results) {
            connection.query(duty.queryDuty(params), function (err, result) {
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

// 修改值班信息
router.post('/updateDuty', function (req, res, next) {
    let params = {
        zCode: req.body.zCode,
        zPeople: req.body.zPeople,
        zRoom: req.body.zRoom,
        zPlaces: req.body.zPlaces,
        zDay: req.body.zDay,
        zClasses: req.body.zClasses,
        remarks: req.body.remarks,
    };
    connection.query(duty.updateDuty(params), function (error, results, fields) {
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

// 删除值班信息
router.post('/deleteDuty', function (req, res, next) {
    let params = {
        zCode: req.body.zCode
    };
    connection.query(duty.deleteDuty(params), function (error, results, fields) {
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
