var staff = {
    // 查询员工
    queryStaff(param) {
        if (param.yCode) {
            return "SELECT * FROM table_staff WHERE yCode = '" + param.yCode + "'";
        } else if (param.yName) {
            return "SELECT * FROM table_staff WHERE yName = '" + param.yName + "'";
        } else {
            return "SELECT yCode,uCode,yName,ySex,yCategory,yTitle,yDepartment,yPhone,yImgUrl FROM table_staff LIMIT 10 OFFSET " + param.page + "";
        }
    },
    // 查询用户编号
    queryUCode(param) {
        return "SELECT * FROM table_staff INNER JOIN table_user ON table_staff.uCode = table_user.uCode AND table_staff.uCode = " + param.uCode + "";
    },
    // 查询员工条数
    queryStaffTotal() {
        return "SELECT COUNT(*) FROM table_staff";
    },
    // 增加一条员工数据
    inserStaffData(param) {
        let yCode = param.yCode;
        let uCode = param.uCode;
        let yName = param.yName;
        let ySex = param.ySex || '';
        let yCategory = param.yCategory || '';
        let yTitle = param.yTitle || '';
        let yDepartment = param.yDepartment || '';
        let yPhone = param.yPhone || '';
        let yImgUrl = param.yImgUrl || '../../static/img/logo.jpg';

        return "INSERT INTO table_staff (yCode,uCode,yName,ySex,yCategory,yTitle,yDepartment,yPhone,yImgUrl) VALUES ('" + yCode + "','" + uCode + "','" + yName + "','" + ySex + "','" + yCategory + "','" + yTitle + "','" + yDepartment + "','" + yPhone + "','" + yImgUrl + "')";
    },
    // 修改员工信息
    updateStaff(params) {
        return "UPDATE table_staff SET yCode='" + params.yCode + "', uCode='" + params.uCode + "', yName='" + params.yName + "', ySex='" + params.ySex + "', yCategory='" + params.yCategory + "', yTitle='" + params.yTitle + "', yDepartment='" + params.yDepartment + "', yPhone='" + params.yPhone + "', yImgUrl='" + params.yImgUrl + "' WHERE yCode='" + params.yCode + "'";
    },
    deleteStaff(params) {
        return "DELETE FROM table_staff WHERE yCode IN (" + params.yCode + ")";
    },
}

exports = module.exports = staff;