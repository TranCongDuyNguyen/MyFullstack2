require('dotenv').config();
const MonitorNoties = require("./models/model.monitorNoties");

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const http = require('http').Server(app)
const io = require('socket.io')(http); //IO Socket
const mqtt = require('mqtt');
const path = require('path');

http.listen(port, function () {
	console.log(`Server starts on port ${port}`);
});

//Body-parser to read body req
app.use(express.json()); // for parsing application/json, express provide its own body-parser

//Use routes
app.use('/api/users', require('./routes/api/route.users'));
app.use('/api/items', require('./routes/api/route.items'));
app.use('/api/auth', require('./routes/api/route.auth'));
app.use('/api/maxscale1', require('./routes/api/route.maxscale1'));



//Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	//Set static folder
	app.use(express.static('frontend/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	})
}


//connect to mongoDB
mongoose.connect(process.env.mongo_url, {
	useNewUrlParser: true,
	useCreateIndex: true
})
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log(err));

/*<===========================================IO SOCKET=======================================================>*/
/*<============================================MQTT CONNECTION============================================> */

const client = mqtt.connect('mqtt://127.0.0.1:1883', {
	clientId: "my-client",
	username: "admin",
	password: "admin"
});

client.on("connect", function () {
	console.log("MQTT connected");
});

client.on("error", function (err) {
	if (err) {
		console.log(err);
	}
	client.end();
})
//-MQTT SUBSCRIBE----------------------------------------------------------------------------
//+data
client.subscribe('n/motorData', function (err) {
	if (err) {
		console.log(err);
	}
});
//+ Image
client.subscribe('n/image', function (err) {
	if (err) {
		console.log(err);
	}
})


//INITIAL VARIABLES----------------------------------------------------------------------------
//+height
let hBuffer = [{ h: 0, time: "00:00:00" }]; let hStore = [{ h: 0, time: "00:00:00" }]; let hStoreCopy = [];
//-Motor 1----------------------------------------------------------------------------
//+trend arr
let tor1Buffer = [{ tor: 0, time: "00:00:00" }]; let amp1Buffer = [{ amp: 0, time: "00:00:00" }];
let motor1TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive1TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power1Buffer = [{ power: 0, time: "00:00:00" }];
let amp1Store = [{ amp: 0, time: "00:00:00" }]; let amp1StoreCopy = [];
let tor1Store = [{ tor: 0, time: "00:00:00" }]; let tor1StoreCopy = [];
let motor1TStore = [{ motorT: 0, time: "00:00:00" }]; let motor1TStoreCopy = [];
let drive1TStore = [{ driveT: 0, time: "00:00:00" }]; let drive1TStoreCopy = [];
let power1Store = [{ power: 0, time: "00:00:00" }]; let power1StoreCopy = [];
//+notification arr
let notiesArr1 = [];
let notiesArr2 = [];
//-Motor 2----------------------------------------------------------------------------
//+trend arr
let tor2Buffer = [{ tor: 0, time: "00:00:00" }]; let amp2Buffer = [{ amp: 0, time: "00:00:00" }];
let motor2TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive2TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power2Buffer = [{ power: 0, time: "00:00:00" }];
let amp2Store = [{ amp: 0, time: "00:00:00" }]; let amp2StoreCopy = [];
let tor2Store = [{ tor: 0, time: "00:00:00" }]; let tor2StoreCopy = [];
let motor2TStore = [{ motorT: 0, time: "00:00:00" }]; let motor2TStoreCopy = [];
let drive2TStore = [{ driveT: 0, time: "00:00:00" }]; let drive2TStoreCopy = [];
let power2Store = [{ power: 0, time: "00:00:00" }]; let power2StoreCopy = [];

//+get real time
function getTime() {
	let now = new Date();
	let hours = (("0" + now.getHours()).slice(-2));
	let minutes = (("0" + now.getMinutes()).slice(-2));
	let seconds = (("0" + now.getSeconds()).slice(-2));
	return hours + ":" + minutes + ":" + seconds;
}
let time;
setInterval(() => {
	time = getTime();
}, 1000);
//+ counter
let counter = {
	countAmp1: 0,
	countAmp2: 0,
	countTor1: 0,
	countTor2: 0,
	countMotor1T: 0,
	countMotor2T: 0,
	countDrive1T: 0,
	countDrive2T: 0,
	countPower1: 0,
	countPower2: 0,
	countH: 0
}
//+data to send to PLC
let toPLCData = [false, false, false, false, 0, 0, 0, 0, 0, 0, 0];
//+ max perfomance paras
let mp1 = [0, 0, 0, 0, 0];
let mp2 = [0, 0, 0, 0, 0];
//-EXECUTING FUNCTIONS----------------------------------------------------------------------------
//+ create trend buffer
function createObj(type, data) {
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
//+ create alarm list
function generateAlarm(type, comparedData, warnObj, warnStr, dangerStr, notiesArr) {
	if (type == "more") {
		if (comparedData > 60 && comparedData <= 80) {
			warnObj = {
				notiId: '',
				type: "Warning",
				warnTime: null,
				warnMsg: warnStr
			}
		}
		else if (comparedData > 80) {
			warnObj = {
				notiId: '',
				type: "Danger",
				warnTime: null,
				warnMsg: dangerStr
			}
		}
	}
	else if (type == "less") {
		if (comparedData < 60) {
			warnObj = {
				notiId: '',
				type: "Warning",
				warnTime: null,
				warnMsg: warnStr
			}
		}
		else if (comparedData >= 60 && comparedData >= 100) {
			warnObj = {
				notiId: '',
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
//+ max performance filter
function maxFilter(arr, key) {
	let max = 0;
	for (let obj of arr) {
		if (obj[key] > max) {
			max = obj[key];
		}
	}
	return max;
}
//- RECEIVE DATA FROM PLC VIA MQTT
client.on("message", function (topic, message) {
	if (topic === "n/motorData") {
		let motorData = JSON.parse(message.toString());
		//+create trend buffer
		if (time) {
			try {
				let tor1Obj = createObj("tor", motorData.tor1);
				let amp1Obj = createObj("amp", motorData.amp1);
				let motor1TObj = createObj("motorT", motorData.motor1T);
				let drive1TObj = createObj("driveT", motorData.drive1T);
				let power1Obj = createObj("power", motorData.power1);
				objToBuffer(tor1Obj, tor1Buffer, 10);
				objToBuffer(tor1Obj, tor1Store, 1000);
				objToBuffer(amp1Obj, amp1Buffer, 10);
				objToBuffer(amp1Obj, amp1Store, 1000);
				objToBuffer(motor1TObj, motor1TBuffer, 10);
				objToBuffer(motor1TObj, motor1TStore, 1000);
				objToBuffer(drive1TObj, drive1TBuffer, 10);
				objToBuffer(drive1TObj, drive1TStore, 1000);
				objToBuffer(power1Obj, power1Buffer, 10);
				objToBuffer(power1Obj, power1Store, 1000);
				mp1[0] = maxFilter(amp1Buffer, "amp"); mp1[1] = maxFilter(tor1Buffer, "tor");
				mp1[2] = maxFilter(motor1TBuffer, "motorT"); mp1[3] = maxFilter(drive1TBuffer, "driveT");
				mp1[4] = maxFilter(power1Buffer, "power");
				let tor2Obj = createObj("tor", motorData.tor2);
				let amp2Obj = createObj("amp", motorData.amp2);
				let motor2TObj = createObj("motorT", motorData.motor2T);
				let drive2TObj = createObj("driveT", motorData.drive2T);
				let power2Obj = createObj("power", motorData.power2);
				objToBuffer(tor2Obj, tor2Buffer, 10);
				objToBuffer(tor2Obj, tor2Store, 1000);
				objToBuffer(amp2Obj, amp2Buffer, 10);
				objToBuffer(amp2Obj, amp2Store, 1000);
				objToBuffer(motor2TObj, motor2TBuffer, 10);
				objToBuffer(motor2TObj, motor2TStore, 1000);
				objToBuffer(drive2TObj, drive2TBuffer, 10);
				objToBuffer(drive2TObj, drive2TStore, 1000);
				objToBuffer(power2Obj, power2Buffer, 10);
				objToBuffer(power2Obj, power2Store, 1000);
				mp2[0] = maxFilter(amp2Buffer, "amp"); mp2[1] = maxFilter(tor2Buffer, "tor");
				mp2[2] = maxFilter(motor2TBuffer, "motorT"); mp2[3] = maxFilter(drive2TBuffer, "driveT");
				mp2[4] = maxFilter(power2Buffer, "power");
				let hObj = createObj("h", motorData.h);
				objToBuffer(hObj, hBuffer, 10);
				objToBuffer(hObj, hStore, 1000);

			}
			catch (e) {
				console.log(e);
				console.log("because of undefined data from mqtt fake client");
			}
		}
		//+ Create monitor warning list
		try {
			let ampWarn1, torWarn1, motorTWarn1, driveTWarn1, powerWarn1 = null;
			generateAlarm("more", motorData.amp1, ampWarn1, 'Current is above 60%', 'Current is above 80%', notiesArr1);
			generateAlarm("more", motorData.tor1, torWarn1, 'Torque is above 60%', 'Torque is above 80%', notiesArr1);
			generateAlarm("more", motorData.motor1T, motorTWarn1, 'Motor Thermal is above 60', 'Motor Thermal is above 80', notiesArr1);
			generateAlarm("more", motorData.drive1T, driveTWarn1, 'Drive Thermal is above 60', 'Drive Thermal is above 80', notiesArr1);
			generateAlarm("less", motorData.power1, powerWarn1, 'Power is under 60%', 'Power is above 100%', notiesArr1);
			updateMonitorNoties(1, notiesArr1);
			let ampWarn2, torWarn2, motorTWarn2, driveTWarn2, powerWarn2 = null;
			generateAlarm("more", motorData.amp2, ampWarn2, 'Current is above 60%', 'Current is above 80%', notiesArr2);
			generateAlarm("more", motorData.tor2, torWarn2, 'Torque is above 60%', 'Torque is above 80%', notiesArr2);
			generateAlarm("more", motorData.motor2T, motorTWarn2, 'Motor Thermal is above 60', 'Motor Thermal is above 80', notiesArr2);
			generateAlarm("more", motorData.drive2T, driveTWarn2, 'Drive Thermal is above 60', 'Drive Thermal is above 80', notiesArr2);
			generateAlarm("less", motorData.power2, powerWarn2, 'Power is under 60%', 'Power is above 100%', notiesArr2);
			updateMonitorNoties(2, notiesArr2);
		} catch (e) {
			console.log(e);
			console.log("because of undefined data from mqtt fake client");
		}
	}
})
// +monitor noties API
function fetchMonitorNoties(req, res, next) {
	if(req.params.id === "1") {
		let currentPage = parseInt(req.query.page);
		let pageLimit = parseInt(req.query.limit);
		const offset = (currentPage - 1) * pageLimit;
		MonitorNoties.findOne({_id: req.params.id}, 'noties', { lean: true })
		.then(noties => {
			let noties1 = noties.noties;
			let tempArr = [];
			for(let obj of noties1) {
				tempArr.push(obj);
			}
			const currentNoties = tempArr.slice(offset, offset + pageLimit);
			res.json({noties: currentNoties, length: tempArr.length});
		});
	}
	else if(req.params.id === "2") {
		let currentPage = parseInt(req.query.page);
		let pageLimit = parseInt(req.query.limit);
		const offset = (currentPage - 1) * pageLimit;
		MonitorNoties.findOne({_id: req.params.id}, 'noties', { lean: true })
		.then(noties => {
			let noties2 = noties.noties;
			let tempArr = [];
			for(let obj of noties2) {
				tempArr.push(obj);
			}
			const currentNoties = tempArr.slice(offset, offset + pageLimit);
			res.json({noties: currentNoties, length: tempArr.length});
		});
	}
}
function updateMonitorNoties(id, data) {
    MonitorNoties.updateOne({ _id: id}, {$set: {noties: data}}, {upsert:true},
        function(err){
            if(err){
                console.error(err);
            } 
        });
}
app.get('/api/monitorNoties/:id', fetchMonitorNoties);
//TRANSFER BETWEEN FE AND PLC WITH IO & MQTT----------------------------------------------------------------------------
io.on('connection', function (socket) {

	console.log('server-side socket connected');
	socket.on("error", (err) => {
		if (err) {
			console.log(err);
		}
		socket.disconnect();
	})
	//-send to fe client-----------------------------------------------------------------------------------------
	client.on("message", function (topic, message) {
		if (topic === "n/motorData") {
			let motorData = JSON.parse(message.toString());
			//+send dcData, warn, info to fe
			try {
				socket.emit("warnList1", notiesArr1);
				socket.emit("motor1DCData", motorData);
				socket.emit("motor1Info", {
					amp: motorData.amp1,
					torque: motorData.tor1,
					motorT: motorData.motor1T,
					driveT: motorData.drive1T,
					power: motorData.power1
				});
				socket.emit("warnList2", notiesArr2);
				socket.emit("motor2DCData", motorData);
				socket.emit("motor2Info", {
					amp: motorData.amp2,
					torque: motorData.tor2,
					motorT: motorData.motor2T,
					driveT: motorData.drive2T,
					power: motorData.power2
				});
			} catch (e) {
				console.log("because of undefined data from mqtt fake client");
			}
			//+status
			socket.emit("motorStatus", {
				run: motorData.run,
				rev: motorData.rev,
				stop: motorData.stop,
				maint: motorData.maint,
				service: motorData.service,
				fault: motorData.fault
			});
		}
	});

	//+trending
	let id1 = setInterval(function () {
		socket.emit("motor1TCTor", tor1Buffer);
		socket.emit("motor1TCAmp", amp1Buffer);
		socket.emit("motor1TCMotorT", motor1TBuffer);
		socket.emit("motor1TCDriveT", drive1TBuffer);
		socket.emit("motor1TCPower", power1Buffer);
		socket.emit("mp1", mp1);
		socket.emit("motor2TCTor", tor2Buffer);
		socket.emit("motor2TCAmp", amp2Buffer);
		socket.emit("motor2TCMotorT", motor2TBuffer);
		socket.emit("motor2TCDriveT", drive2TBuffer);
		socket.emit("motor2TCPower", power2Buffer);
		socket.emit("mp2", mp2);
	}, 10000);
	let id2 = setInterval(function () {
		socket.emit("heightAmount", hBuffer);
	}, 1000);

	//+image
	client.on("message", function (topic, message) {
		if (topic === "n/image") {
			console.log("sent");
			socket.emit("picture", message.toString());
		}
	})
	//+flag
	socket.on("stopStoring", function (stopFlag) {
		if (stopFlag === "amp1StopFlag") {
			counter.countAmp1 = 0;
			amp1StoreCopy = amp1Store.concat();
		}
		if (stopFlag === "tor1StopFlag") {
			counter.countTor1 = 0;
			tor1StoreCopy = tor1Store.concat();
		}
		if (stopFlag === "motor1TStopFlag") {
			counter.countMotor1T = 0;
			motor1TStoreCopy = motor1TStore.concat();
		}
		if (stopFlag === "drive1TStopFlag") {
			counter.countDrive1T = 0;
			drive1TStoreCopy = drive1TStore.concat();
		}
		if (stopFlag === "power1StopFlag") {
			counter.countPower1 = 0;
			power1StoreCopy = power1Store.concat();
		}
		if (stopFlag === "amp2StopFlag") {
			counter.countAmp2 = 0;
			amp2StoreCopy = amp2Store.concat();
		}
		if (stopFlag === "tor2StopFlag") {
			counter.countTor2 = 0;
			tor2StoreCopy = tor2Store.concat();
		}
		if (stopFlag === "motor2TStopFlag") {
			counter.countMotor2T = 0;
			motor2TStoreCopy = motor2TStore.concat();
		}
		if (stopFlag === "drive2TStopFlag") {
			counter.countDrive2T = 0;
			drive2TStoreCopy = drive2TStore.concat();
		}
		if (stopFlag === "power2StopFlag") {
			counter.countPower2 = 0;
			power2StoreCopy = power2Store.concat();
		}
		if (stopFlag === "hStopFlag") {
			countH = 10;
			hStoreCopy = hStore.concat();
		}
	})
	//-----------------------------------------------xFUNCTIONx------------------------------------------------
	let firstForwFlag = null;
	function slideBackTrend(type, countName, counter, copyStore) {
		let currentIdx = copyStore.length;
		if (firstForwFlag === 1) {
			firstForwFlag = null;
			counter[countName] += 20;
		} else if ((currentIdx - counter[countName]) >= 0) {
			counter[countName] += 10;
		}
		console.log(counter[countName]);
		if (currentIdx >= 10 && ((currentIdx - counter[countName]) >= 0)) {
			let reviewData = copyStore.slice(currentIdx - counter[countName], currentIdx - counter[countName] + 10);
			socket.emit(type, reviewData);
		}
		else if (currentIdx >= 10 && ((currentIdx - counter[countName]) < 0)) {
			let reviewData = copyStore.slice(0, 11);
			socket.emit(type, reviewData);
		}
		else if (currentIdx < 10) {
			socket.emit(type, copyStore);
		}
	}
	function slideForwTrend(type, countName, counter, copyStore) {
		let currentIdx = copyStore.length;
		counter[countName] -= 10;

		if (counter[countName] <= 0) {
			counter[countName] = 0;
			let reviewData = copyStore.slice(currentIdx - 10, currentIdx);
			firstForwFlag = 1;
			socket.emit(type, reviewData);
		}
		else if (currentIdx >= 10 && currentIdx >= counter[countName]) {
			let reviewData = copyStore.slice(currentIdx - counter[countName], currentIdx - counter[countName] + 10);
			socket.emit(type, reviewData);
		}
		else if (currentIdx >= 10 && (currentIdx < counter[countName])) {
			let reviewData = copyStore.slice(0, currentIdx - counter[countName] + 10);
			socket.emit(type, reviewData);
		}

		if (currentIdx < 10) {
			socket.emit(type, copyStore);
		}
	}
	//------------------------------------------------------x--------------------------------------------------
	socket.on("reviewStore", function (reviewFlag) {
		if (reviewFlag === "hReviewFlag") {
			slideBackTrend("reviewH", "countH", counter, hStoreCopy);
		}
		if (reviewFlag === "hForwFlag") {
			slideForwTrend("reviewH", "countH", counter, hStoreCopy);
		}
		if (reviewFlag === "amp1ReviewFlag") {
			slideBackTrend("reviewAmp1", "countAmp1", counter, amp1StoreCopy);
		}
		if (reviewFlag === "amp1ForwFlag") {
			slideForwTrend("reviewAmp1", "countAmp1", counter, amp1StoreCopy);
		}
		if (reviewFlag === "tor1ReviewFlag") {
			slideBackTrend("reviewTor1", "countTor1", counter, tor1StoreCopy);
		}
		if (reviewFlag === "tor1ForwFlag") {
			slideForwTrend("reviewTor1", "countTor1", counter, tor1StoreCopy);
		}
		if (reviewFlag === "motor1TReviewFlag") {
			slideBackTrend("reviewMotor1T", "countMotor1T", counter, motor1TStoreCopy);
		}
		if (reviewFlag === "motor1TForwFlag") {
			slideForwTrend("reviewMotor1T", "countMotor1T", counter, motor1TStoreCopy);
		}
		if (reviewFlag === "drive1TReviewFlag") {
			slideBackTrend("reviewDrive1T", "countDrive1T", counter, drive1TStoreCopy);
		}
		if (reviewFlag === "drive1TForwFlag") {
			slideForwTrend("reviewDrive1T", "countDrive1T", counter, drive1TStoreCopy);
		}
		if (reviewFlag === "power1ReviewFlag") {
			slideBackTrend("reviewPower1", "countPower1", counter, power1StoreCopy);
		}
		if (reviewFlag === "power1ForwFlag") {
			slideForwTrend("reviewPower1", "countPower1", counter, power1StoreCopy);
		}
		if (reviewFlag === "amp2ReviewFlag") {
			slideBackTrend("reviewAmp2", "countAmp2", counter, amp2StoreCopy);
		}
		if (reviewFlag === "amp2ForwFlag") {
			slideForwTrend("reviewAmp2", "countAmp2", counter, amp2StoreCopy);
		}
		if (reviewFlag === "tor2ReviewFlag") {
			slideBackTrend("reviewTor2", "countTor2", counter, tor2StoreCopy);
		}
		if (reviewFlag === "tor2ForwFlag") {
			slideForwTrend("reviewTor2", "countTor2", counter, tor2StoreCopy);
		}
		if (reviewFlag === "motor2TReviewFlag") {
			slideBackTrend("reviewMotor2T", "countMotor2T", counter, motor2TStoreCopy);
		}
		if (reviewFlag === "motor2TForwFlag") {
			slideForwTrend("reviewMotor2T", "countMotor2T", counter, motor2TStoreCopy);
		}
		if (reviewFlag === "drive2TReviewFlag") {
			slideBackTrend("reviewDrive2T", "countDrive2T", counter, drive2TStoreCopy);
		}
		if (reviewFlag === "drive2TForwFlag") {
			slideForwTrend("reviewDrive2T", "countDrive2T", counter, drive2TStoreCopy);
		}
		if (reviewFlag === "power2ReviewFlag") {
			slideBackTrend("reviewPower2", "countPower2", counter, power2StoreCopy);
		}
		if (reviewFlag === "power2ForwFlag") {
			slideForwTrend("reviewPower2", "countPower2", counter, power2StoreCopy);
		}
	})
	//-fe client publishing----------------------------------------------------------------------------
	//- PLC
	//+ send freq
	socket.on("setFrequency", function (frequency) {
		toPLCData[10] = parseInt(frequency);
		client.publish("n/toPLC", toPLCData.toString(), function (err) {
			if (err) {
				console.log(err);
			}
		})
		console.log(toPLCData);
	})
	//+ send Kp, Ki, Kd
	socket.on("setKp", function (Kp) {
		toPLCData[4] = parseInt(Kp);
		client.publish("n/toPLC", toPLCData.toString(), function (err) {
			if (err) {
				console.log(err);
			}
		})
		console.log(toPLCData);
	})
	socket.on("setKi", function (Ki) {
		toPLCData[5] = parseInt(Ki);
		client.publish("n/toPLC", toPLCData.toString(), function (err) {
			if (err) {
				console.log(err);
			}
		})
		console.log(toPLCData);
	})
	socket.on("setKd", function (Kd) {
		toPLCData[6] = parseInt(Kd);
		client.publish("n/toPLC", toPLCData.toString(), function (err) {
			if (err) {
				console.log(err);
			}
		})
		console.log(toPLCData);
	})
	//+ send height
	socket.on("setHeight", function (height) {
		toPLCData[9] = parseFloat(height);
		client.publish("n/toPLC", toPLCData.toString(), function (err) {
			if (err) {
				console.log(err);
			}
			console.log(toPLCData);
		})
	})
	//+ virtual btn send for,rev,stop,service CMD
	socket.on("vCmdToPLC", function (cmd) {
		if (cmd === "onForward") {
			if (!toPLCData[0]) {
				toPLCData[0] = true;
			} else {
				toPLCData[0] = false;
			}
		}
		else if (cmd === "onStop") {
			if (!toPLCData[1]) {
				toPLCData[1] = true;
			} else {
				toPLCData[1] = false;
			}
		}
		else if (cmd === "onReverse") {
			if (!toPLCData[2]) {
				toPLCData[2] = true;
			} else {
				toPLCData[2] = false;
			}
		}
		else if (cmd === "onService") {
			if (!toPLCData[3]) {
				toPLCData[3] = true;
			} else {
				toPLCData[3] = false;
			}
		}
		client.publish("n/toPLC", toPLCData.toString(), function (err) {
			if (err) {
				console.log(err);
			}
		})
		console.log(toPLCData);
	})
	//- NX
	socket.on("vCmdToNX", function (cmd) {
		client.publish("n/virtualNXCmd", cmd, function (err) {
			if (err) {
				console.log(err);
			}
			console.log(cmd);
		})
	})
	socket.on("disconnect", (reason) => {
		if (reason === 'io server disconnect') {
			// the disconnection was initiated by the server, you need to reconnect manually
			socket.connect();
		}
		time = 0;
		clearInterval(id1);
		clearInterval(id2);
		notiesArr1 = [];
		notiesArr2 = [];
		console.log("Disconnect");
	});
});

