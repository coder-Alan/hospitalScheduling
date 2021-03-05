var User = {
	// 查询用户
	queryUser(param) {
		if (param.uName) {
			return "select * from user where uName = '"+param.uName+"'";
		} else if (param.uNickName) {
			return "select * from user where uNickName = '"+param.uNickName+"'";
		} else {
			return "select uName,uNickName,uPassword,uPhone,uPower,registration,uImgUrl from user where uCode not in(1) limit 10 offset "+param.page+"";
		}
	},
	// 查询用户条数
	queryUserTotal() {
		return "SELECT COUNT(*) FROM user where uCode not in(1)";
	},
	// 查询权限
	queryUserPower(param) {
		if (param.uPower) {
			return "select * from table_power where FIND_IN_SET(id, '" + param.uPower + "')";
		}
	},
	// 验证用户名和密码
	queryUserPwd(param) {
		return "select * from user where uName = '"+param.uName+"' and uPassword = '"+param.uPassword+"' ";
	},
	// 增加一条用户数据
	inserData(param) {
		// 利用jsonwebtoken生成token
		const jwt = require('jsonwebtoken');
		let uName = param.uName;
		let uPassword = param.uPassword;
		let uNickName = param.uNickName || '默认昵称';
		let uPhone = param.uPhone || '';
		let uPower = param.uPower || '';
		let uImgUrl = param.uImgUrl || '../../static/img/logo.jpg';
		// *****timeStart
		Date.prototype.Format = function (time) {
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(time))
                time = time.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(time)) time = time.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return time;
        }
        let time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		let registration = time;
		// *****timeEnd
		// *****tokenStart
		let payload = {name:uName}; // 用户名
		let secret = 'yiyuanpaiban'; // 口令
		// 生成token
		let uToken = jwt.sign(payload,secret);
		// *****tokenEnd
		
		return "insert into user (uName,uPassword,uNickName,uPhone,uPower,uImgUrl,registration,uToken) values ('"+uName+"','"+uPassword+"','"+uNickName+"','"+uPhone+"','"+uPower+"','"+uImgUrl+"','"+registration+"','"+uToken+"')";
	}
}

exports = module.exports = User;