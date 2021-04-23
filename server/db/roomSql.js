var room = {
    // 查询科室
    queryRoom(param) {
        if(param.kCode && param.kName) {
            return "SELECT * FROM table_room WHERE kName = '" + param.kName + "' AND kCode = '" + param.kCode + "'";
        } else if (param.kCode) {
            return "SELECT * FROM table_room WHERE kCode = '" + param.kCode + "'";
        } else if (param.kName) {
            return "SELECT * FROM table_room WHERE kName = '" + param.kName + "'";
        } else if (param.yCode) {
            return "SELECT * FROM table_room WHERE yCode = '" + param.yCode + "'";
        } else {
            return "SELECT * FROM table_room LIMIT 10 OFFSET " + param.page + "";
        }
    },
    // 查询员工编号
    queryYCode(param) {
        // return "SELECT * FROM table_room INNER JOIN table_staff ON table_room.yCode = table_staff.yCode AND table_room.yCode = " + param.yCode + "";
        return "SELECT * FROM table_staff WHERE yCode = '" + param.yCode + "'";
    },
    // 查询科室条数
    queryRoomTotal() {
        return "SELECT COUNT(*) FROM table_room";
    },
    // 增加一条科室数据
    inserRoomData(param) {
        let kCode = param.kCode;
        let kName = param.kName;
        let yCode = param.yCode;
        let kBrief = param.kBrief || '';
        let remarks = param.remarks || '';

        return "INSERT INTO table_room (kCode,kName,yCode,kBrief,remarks) VALUES ('" + kCode + "','" + kName + "','" + yCode + "','" + kBrief + "','" + remarks + "')";
    },
    // 修改科室信息
    updateRoom(params) {
        return "UPDATE table_room SET kCode='" + params.kCode + "', kName='" + params.kName + "', yCode='" + params.yCode + "', kBrief='" + params.kBrief + "', remarks='" + params.remarks + "' WHERE kCode='" + params.kCode + "'";
    },
    deleteRoom(params) {
        return "DELETE FROM table_room WHERE kCode IN (" + params.kCode + ")";
    },
}

exports = module.exports = room;