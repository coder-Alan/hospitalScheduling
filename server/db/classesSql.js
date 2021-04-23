var classes = {
    // 查询地点
    queryClasses(param) {
        if (param.bCode && param.bName) {
            return "SELECT * FROM table_classes WHERE bCode = '" + param.bCode + "' AND bName = '" + param.bName + "'";
        } else if (param.bName) {
            return "SELECT * FROM table_classes WHERE bName = '" + param.bName + "'";
        } else if (param.bCode) {
            return "SELECT * FROM table_classes WHERE bCode = '" + param.bCode + "'";
        } else {
            return "SELECT * FROM table_classes LIMIT 10 OFFSET " + param.page + "";
        }
    },
    // 查询地点条数
    queryClassesTotal() {
        return "SELECT COUNT(*) FROM table_classes";
    },
    // 增加一条地点数据
    inserClassesData(param) {
        let bCode = param.bCode;
        let bName = param.bName;
        let bStartTime = param.bStartTime;
        let bEndTime = param.bEndTime;
        let remarks = param.remarks;

        return "INSERT INTO table_classes (bCode,bName,bStartTime,bEndTime,remarks) VALUES ('" + bCode + "','" + bName + "','" + bStartTime + "','" + bEndTime + "','" + remarks + "')";
    },
    // 修改地点信息
    updateClasses(params) {
        return "UPDATE table_classes SET bCode='" + params.bCode + "', bName='" + params.bName + "', bStartTime='" + params.bStartTime + "', bEndTime='" + params.bEndTime + "', remarks='" + params.remarks + "' WHERE bCode='" + params.bCode + "'";
    },
    deleteClasses(params) {
        return "DELETE FROM table_classes WHERE bCode IN (" + params.bCode + ")";
    },
}

exports = module.exports = classes;