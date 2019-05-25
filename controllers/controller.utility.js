var moment = require('moment');

function getTime(option) {
	if (option) {
		return moment().utcOffset(7).format('DD/MM/YYYY hh:mm:ss');
	}
	return moment().utcOffset(7).format('HH:mm:ss')
}

let time;
setInterval(() => {
	time = getTime(false);
}, 1000);
module.exports.getTime = getTime;

module.exports.createObj = function (type, data) {
	let obj = {};
	if(data) {	
		obj[type] = data;
		obj.time = time;
		return obj;
	}
	else  {
		obj[type] = 0;
		obj.time = time;
		return obj;
	}
}

function objToBuffer(obj, arr, amount) {
	arr.push(obj);
	if (amount) {
		if (arr.length > amount) {
			arr.splice(0, 1)
		}
	}
}
module.exports.objToBuffer = objToBuffer;

module.exports.generateAlarm = function (type, comparedData, warnObj, dangerStr, warnStr, notiesArr, faultLvl, warnLvl) {
	if(comparedData) {
		if (type == "more") {
			if (comparedData > warnLvl && comparedData <= faultLvl) {
				warnObj = {
					type: "Warning",
					warnTime: null,
					warnMsg: warnStr
				}
			}
			else if (comparedData > faultLvl) {
				warnObj = {
					type: "Danger",
					warnTime: null,
					warnMsg: dangerStr
				}
			}
		}
		else if (type == "less") {
			if (comparedData < warnLvl) {
				warnObj = {
					type: "Warning",
					warnTime: null,
					warnMsg: warnStr
				}
			}
			else if (comparedData >= faultLvl) {
				warnObj = {
					type: "Danger",
					warnTime: null,
					warnMsg: dangerStr
				}
			}
		}
		if (warnObj && time) {
			warnObj.warnTime = time;
			objToBuffer(warnObj, notiesArr, 200);
			let index = notiesArr.indexOf(warnObj);
			warnObj.notiId = `Alarm ${index}`;
		}
	}
}

module.exports.generateOperateNoties = function (notiObj, msg, arr) {
	notiObj = {};
	if (time) {
		notiObj.type = "Operation";
		notiObj.warnTime = time;
		notiObj.warnMsg = msg;
		objToBuffer(notiObj, arr, 200);
		let idx = arr.indexOf(notiObj);
		notiObj.notiId = `Noti ${idx}`;
	}
}

module.exports.maxFilter = function (arr, key) {
	let max = 0;
	for (let obj of arr) {
		if(obj) {
			if (obj[key] > max) {
				max = obj[key];
			}
		}
	}
	return max;
}

module.exports.ArrToPLCMsg = function(arr) {
	let msg = arr.join(";") + ";";
	return msg;
}
module.exports.PLCStrToObj = function(message) {
	plcStr = message.toString();
	
	let plcArr = plcStr.split("+");
	console.log(plcArr);
	plcStr = plcArr.join("");
	//console.log(plcArr);
	let plcObj = JSON.parse(plcStr);
	//console.log(plcObj);
	return plcObj;
}

module.exports.averageCal = function(arr) {
	let avg = 0;
	let sum = 0;
	for(let i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	avg = parseFloat(sum/arr.length);
	return avg;
}

module.exports.averageObjCal = function (arr, props) {
	let avg = 0;
	let sum = 0;
	for(let i = 0; i < arr.length; i++) {
		sum += arr[i][props];
	}
	avg = parseFloat(sum/arr.length);
	return avg;
}