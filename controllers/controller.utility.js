function getTime(option) {
	let now = new Date();
	let hours = (("0" + now.getHours()).slice(-2));
	let minutes = (("0" + now.getMinutes()).slice(-2));
	let seconds = (("0" + now.getSeconds()).slice(-2));
	let day = now.getDate();
	let month = now.getMonth() + 1;
	let year = now.getFullYear();
	if (option) {
		return day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds;
}

let time;
setInterval(() => {
	time = getTime(false);
}, 1000);
module.exports.getTime = getTime;

module.exports.createObj = function(type, data) {
	let obj = {};
	obj[type] = data;
	obj.time = time;
	return obj;
}

function objToBuffer(obj, arr, amount) {
	let buffer = arr;
	buffer.push(obj);
	if (amount) {
		if (buffer.length > amount) {
			buffer.splice(0, 1)
		}
	}
}
module.exports.objToBuffer = objToBuffer;

module.exports.generateAlarm = function(type, comparedData, warnObj, warnStr, dangerStr, notiesArr) {
	if (type == "more") {
		if (comparedData > 60 && comparedData <= 80) {
			warnObj = {
				type: "Warning",
				warnTime: null,
				warnMsg: warnStr
			}
		}
		else if (comparedData > 80) {
			warnObj = {
				type: "Danger",
				warnTime: null,
				warnMsg: dangerStr
			}
		}
	}
	else if (type == "less") {
		if (comparedData < 60) {
			warnObj = {
				type: "Warning",
				warnTime: null,
				warnMsg: warnStr
			}
		}
		else if (comparedData >= 60 && comparedData >= 100) {
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

module.exports.generateOperateNoties = function(notiObj, msg, arr) {
	notiObj = {};
	if (time) {
		notiObj.type = "Operation";
		notiObj.warnTime = time;
		notiObj.warnMsg = msg;
		objToBuffer(notiObj, arr, 200);
		let idx = arr.indexOf(notiObj);
		notiObj.notiId = `${idx}`;
	}
}

module.exports.maxFilter = function(arr, key) {
	let max = 0;
	for (let obj of arr) {
		if (obj[key] > max) {
			max = obj[key];
		}
	}
	return max;
}