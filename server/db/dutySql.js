var duty = {
    // 查询地点
    queryDuty(param) {
        if (param.zCode && param.zPeople) {
            return "SELECT * FROM table_duty WHERE zCode = '" + param.zCode + "' OR zPeople = '" + param.zPeople + "'";
        } else if (param.zPeople) {
            return "SELECT * FROM table_duty WHERE zPeople = '" + param.zPeople + "'";
        } else if (param.zCode) {
            return "SELECT * FROM table_duty WHERE zCode = '" + param.zCode + "'";
        } else {
            return "SELECT * FROM table_duty LIMIT 10 OFFSET " + param.page + "";
        }
    },
    // 查询地点条数
    queryDutyTotal() {
        return "SELECT COUNT(*) FROM table_duty";
    },
    // 查询所有班次
    queryAllBName() {
        return "SELECT bName FROM table_classes";
    },
    queryStaff(param) {
        return "SELECT * FROM table_staff WHERE yName = '" + param.zPeople + "'";
    },
    // 增加一条地点数据
    inserDutyData(param) {
        let zCode = param.zCode;
        let zPeople = param.zPeople;
        let zRoom = param.zRoom;
        let zPlaces = param.zPlaces;
        let zDay = param.zDay;
        let zClasses = param.zClasses;
        let remarks = param.remarks;

        return "INSERT INTO table_duty (zCode,zPeople,zRoom,zPlaces,zDay,zClasses,remarks) VALUES ('" + zCode + "','" + zPeople + "','" + zRoom + "','" + zPlaces + "','" + zDay + "','" + zClasses + "','"  + remarks + "')";
    },
    // 修改地点信息
    updateDuty(params) {
        return "UPDATE table_duty SET zCode='" + params.zCode + "', zPeople='" + params.zPeople + "', zRoom='" + params.zRoom + "', zPlaces='" + params.zPlaces + "', zDay='" + params.zDay + "', zClasses='" + params.zClasses + "', remarks='" + params.remarks + "' WHERE zCode='" + params.zCode + "'";
    },
    deleteDuty(params) {
        return "DELETE FROM table_duty WHERE zCode IN (" + params.zCode + ")";
    },
}

exports = module.exports = duty;