var shift = {
    // 查询调班
    queryShift(param) {
        if (param.tDay && param.tPeople) {
            return "SELECT * FROM table_shift WHERE tDay = '" + param.tDay + "' AND tPeople = '" + param.tPeople + "' LIMIT 10 OFFSET " + param.page + "";
        } else if (param.tPeople) {
            return "SELECT * FROM table_shift WHERE tPeople = '" + param.tPeople + "'";
        } else if (param.tDay) {
            return "SELECT * FROM table_shift WHERE tDay = '" + param.tDay + "'";
        } else {
            return "SELECT * FROM table_shift LIMIT 10 OFFSET " + param.page + "";
        }
    },
    // 查询调班条数
    queryShiftTotal() {
        return "SELECT COUNT(*) FROM table_shift";
    },
    // 查询所有班次
    queryAllBName() {
        return "SELECT bName FROM table_classes";
    },
    // 增加一条调班数据
    inserShiftData(param) {
        let tPeople = param.tPeople;
        let kName = param.kName;
        let tDate = param.tDate;
        let tDay = param.tDay;
        let tClasses = param.tClasses;

        return "INSERT INTO table_shift (tPeople,kName,tDate,tDay,tClasses) VALUES ('" + tPeople + "','" + kName + "','" + tDate + "','" + tDay + "','" + tClasses + "')";
    },
    // 修改调班信息
    updateShift(params) {
        return "UPDATE table_shift SET tPeople='" + params.tPeople + "', kName='" + params.kName + "', tDate='" + params.tDate + "', tDay='" + params.tDay + "', tClasses='" + params.tClasses + "' WHERE tCode='" + params.tCode + "'";
    },
    deleteShift(params) {
        return "DELETE FROM table_shift WHERE tPeople IN (" + params.tPeople + ")";
    },
}

exports = module.exports = shift;