var places = {
    // 查询地点
    queryPlaces(param) {
        if (param.dName && param.kName) {
            return "SELECT * FROM table_places WHERE kName = '" + param.kName + "' OR dName = '" + param.dName + "'";
        } else if (param.dName) {
            return "SELECT * FROM table_places WHERE dName = '" + param.dName + "'";
        } else if (param.kName) {
            return "SELECT * FROM table_places WHERE kName = '" + param.kName + "'";
        } else if (param.dCode) {
            return "SELECT * FROM table_places WHERE dCode = '" + param.dCode + "'";
        } else {
            return "SELECT * FROM table_places LIMIT 10 OFFSET " + param.page + "";
        }
    },
    // 在科室表中查询科室名称
    queryAllKName() {
        // return "SELECT * FROM table_places INNER JOIN table_staff ON table_places.yCode = table_staff.yCode AND table_places.yCode = " + param.yCode + "";
        return "SELECT kName FROM table_room";
    },
    // 查询地点条数
    queryPlacesTotal() {
        return "SELECT COUNT(*) FROM table_places";
    },
    // 增加一条地点数据
    inserPlacesData(param) {
        let dCode = param.dCode;
        let dName = param.dName;
        let kName = param.kName || '';

        return "INSERT INTO table_places (dCode,dName,kName) VALUES ('" + dCode + "','" + dName + "','" + kName + "')";
    },
    // 修改地点信息
    updatePlaces(params) {
        return "UPDATE table_places SET dCode='" + params.dCode + "', dName='" + params.dName + "', kName='" + params.kName + "' WHERE dCode='" + params.dCode + "'";
    },
    deletePlaces(params) {
        return "DELETE FROM table_places WHERE dCode IN (" + params.dCode + ")";
    },
}

exports = module.exports = places;