var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var places = require('../db/placesSql.js');
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

// 查询单个地点
router.post('/querySinglePlaces', function (req, res, next) {
    let params = {
        dCode: req.body.dCode
    };
    connection.query(places.queryPlaces(params), function (error, results, fields) {
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

// 查询地点列表
router.post('/queryPlacesList', function (req, res, next) {
    let pageSize = req.body.pageSize
    let page = req.body.page
    let params = {
        dCode: req.body.dCode,
        dName: req.body.dName,
        kName: req.body.kName || ''
    };
    params.page = (page - 1) * pageSize
    connection.query(places.queryPlaces(params), function (error, results, fields) {
        if (results.length > 0) {
            connection.query(places.queryPlacesTotal(), function (err, result) {
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

//查询地点编号是否存在
router.post('/testDCode', function (req, res, next) {
    let params = {
        dCode: req.body.dCode
    };
    connection.query(places.queryPlaces(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 201,
                    message: "该地点编号已存在"
                }
            })
        } else if (results.length == 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该地点编号可以添加"
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

//查询地点名称是否存在
router.post('/testDName', function (req, res, next) {
    let params = {
        dName: req.body.dName
    };
    connection.query(places.queryPlaces(params), function (error, results, fields) {
        if (results.length > 0) {
            res.send({
                data: {
                    code: 201,
                    message: "该地点名称已存在"
                }
            })
        } else if (results.length == 0) {
            res.send({
                data: {
                    code: 200,
                    message: "该地点名称可以添加"
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

// 在科室表中查询所有科室名称
router.get('/queryAllKName', function (req, res, next) {
    connection.query(places.queryAllKName(), function (error, results, fields) {
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

// 添加地点信息
router.post('/addPlaces', function (req, res, next) {
    let params = {
        dCode: req.body.dCode,
        dName: req.body.dName,
        kName: req.body.kName,
    };
    connection.query(places.inserPlacesData(params), function (error, results, fields) {
        if (results) {
            connection.query(places.queryPlaces(params), function (err, result) {
                if (result.length > 0) {
                    res.send({
                        data: {
                            code: 200,
                            message: '添加成功',
                            data: result
                        }
                    })
                } else if (result.length == 0) {
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

// 修改地点信息
router.post('/updatePlaces', function (req, res, next) {
    let params = {
        dCode: req.body.dCode,
        dName: req.body.dName,
        kName: req.body.kName
    };
    connection.query(places.updatePlaces(params), function (error, results, fields) {
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

// 删除地点信息
router.post('/deletePlaces', function (req, res, next) {
    let params = {
        dCode: req.body.dCode
    };
    connection.query(places.deletePlaces(params), function (error, results, fields) {
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
