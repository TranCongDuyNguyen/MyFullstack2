require('dotenv').config();
const MaxScale1 = require('./models/model.maxscale1');
const utility = require("./controllers/controller.utility");
const monitorNotiesFunc = require("./controllers/controller.monitorNoties");
const operateNotiesFunc = require("./controllers/controller.operateNoties");

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
app.get('/api/monitorNoties/:id', monitorNotiesFunc.fetchMonitorNoties);
app.get('/api/operateNoties/:id', operateNotiesFunc.fetchOperateNoties);

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
let notiesArr1 = []; let operateNoties = [];
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

let time;
setInterval(() => {
	time = utility.getTime(false);
	fullTime = utility.getTime(true);
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
//- RECEIVE DATA FROM PLC VIA MQTT

client.on("message", function (topic, message) {
	if (topic === "n/motorData") {
		let motorData = JSON.parse(message.toString());
		//+create trend buffer
		if (time) {
			try {
				let tor1Obj = utility.createObj("tor", motorData.tor1);
				let amp1Obj = utility.createObj("amp", motorData.amp1);
				let motor1TObj = utility.createObj("motorT", motorData.motor1T);
				let drive1TObj = utility.createObj("driveT", motorData.drive1T);
				let power1Obj = utility.createObj("power", motorData.power1);
				utility.objToBuffer(tor1Obj, tor1Buffer, 10);
				utility.objToBuffer(tor1Obj, tor1Store, 1000);
				utility.objToBuffer(amp1Obj, amp1Buffer, 10);
				utility.objToBuffer(amp1Obj, amp1Store, 1000);
				utility.objToBuffer(motor1TObj, motor1TBuffer, 10);
				utility.objToBuffer(motor1TObj, motor1TStore, 1000);
				utility.objToBuffer(drive1TObj, drive1TBuffer, 10);
				utility.objToBuffer(drive1TObj, drive1TStore, 1000);
				utility.objToBuffer(power1Obj, power1Buffer, 10);
				utility.objToBuffer(power1Obj, power1Store, 1000);
				mp1[0] = utility.maxFilter(amp1Buffer, "amp"); mp1[1] = utility.maxFilter(tor1Buffer, "tor");
				mp1[2] = utility.maxFilter(motor1TBuffer, "motorT"); mp1[3] = utility.maxFilter(drive1TBuffer, "driveT");
				mp1[4] = utility.maxFilter(power1Buffer, "power");
				let tor2Obj = utility.createObj("tor", motorData.tor2);
				let amp2Obj = utility.createObj("amp", motorData.amp2);
				let motor2TObj = utility.createObj("motorT", motorData.motor2T);
				let drive2TObj = utility.createObj("driveT", motorData.drive2T);
				let power2Obj = utility.createObj("power", motorData.power2);
				utility.objToBuffer(tor2Obj, tor2Buffer, 10);
				utility.objToBuffer(tor2Obj, tor2Store, 1000);
				utility.objToBuffer(amp2Obj, amp2Buffer, 10);
				utility.objToBuffer(amp2Obj, amp2Store, 1000);
				utility.objToBuffer(motor2TObj, motor2TBuffer, 10);
				utility.objToBuffer(motor2TObj, motor2TStore, 1000);
				utility.objToBuffer(drive2TObj, drive2TBuffer, 10);
				utility.objToBuffer(drive2TObj, drive2TStore, 1000);
				utility.objToBuffer(power2Obj, power2Buffer, 10);
				utility.objToBuffer(power2Obj, power2Store, 1000);
				mp2[0] = utility.maxFilter(amp2Buffer, "amp"); mp2[1] = utility.maxFilter(tor2Buffer, "tor");
				mp2[2] = utility.maxFilter(motor2TBuffer, "motorT"); mp2[3] = utility.maxFilter(drive2TBuffer, "driveT");
				mp2[4] = utility.maxFilter(power2Buffer, "power");
				let hObj = utility.createObj("h", motorData.h);
				utility.objToBuffer(hObj, hBuffer, 10);
				utility.objToBuffer(hObj, hStore, 1000);
			}
			catch (e) {
				console.log(e);
				console.log("because of undefined data from mqtt fake client");
			}
		}
		//+ Create monitor warning list
		try {
			let ampWarn1, torWarn1, motorTWarn1, driveTWarn1, powerWarn1, freWarn1;
			let curFLvl1 = 0; let torFLvl1 = 0; let motorTFLvl1 = 0; let driveTFLvl1 = 0; let powFLvl1 = 0;
			let curWLvl1 = 0; let torWLvl1 = 0; let motorTWLvl1 = 0; let driveTWLvl1 = 0; let powWLvl1 = 0;
			let freFLvl1 = 0; let freWLvl1 = 0;
			MaxScale1.findOne({ _id: 1 }, "maxscale1").select('-_id')
				.then(payload => {
					let maxscale1 = payload.maxscale1;
					curFLvl1 = maxscale1[0].fault; curWLvl1 = maxscale1[0].warn;
					torFLvl1 = maxscale1[1].fault; torWLvl1 = maxscale1[1].warn;
					motorTFLvl1 = maxscale1[2].fault; motorTWLvl1 = maxscale1[2].warn;
					driveTFLvl1 = maxscale1[3].fault; driveTWLvl1 = maxscale1[3].warn;
					powFLvl1 = maxscale1[4].fault; powWLvl1 = maxscale1[4].warn;
					freFLvl1 = maxscale1[5].fault; freWLvl1 = maxscale1[5].warn;
					utility.generateAlarm("more", motorData.amp1, ampWarn1, `Current is above ${curFLvl1}`, `Current is above ${curWLvl1}`, notiesArr1, curFLvl1, curWLvl1);
					utility.generateAlarm("more", motorData.tor1, torWarn1, `Torque is above ${torFLvl1}`, `Torque is above ${torWLvl1}`, notiesArr1, torFLvl1, torWLvl1);
					utility.generateAlarm("more", motorData.motor1T, motorTWarn1, `Motor Thermal is above ${motorTFLvl1}`, `Motor Thermal is above ${motorTWLvl1}`, notiesArr1, motorTFLvl1, motorTWLvl1);
					utility.generateAlarm("more", motorData.drive1T, driveTWarn1, `Drive Thermal is above ${driveTFLvl1}`, `Drive Thermal is above ${driveTWLvl1}`, notiesArr1, driveTFLvl1, driveTWLvl1);
					utility.generateAlarm("less", motorData.power1, powerWarn1, `Power is above ${powFLvl1}`, `Power is under ${powWLvl1}`, notiesArr1, powFLvl1, powWLvl1);
					utility.generateAlarm("more", motorData.fre1, freWarn1, `Speed is above ${freFLvl1}`, `Power is above ${freWLvl1}`, operateNoties, freFLvl1, freWLvl1);
					monitorNotiesFunc.updateMonitorNoties(1, notiesArr1);
				})
				
			let ampWarn2, torWarn2, motorTWarn2, driveTWarn2, powerWarn2, freWarn2;
			let curFLvl2 = 0; let torFLvl2 = 0; let motorTFLvl2 = 0; let driveTFLvl2 = 0; let powFLvl2 = 0;
			let curWLvl2 = 0; let torWLvl2 = 0; let motorTWLvl2 = 0; let driveTWLvl2 = 0; let powWLvl2 = 0;
			let freFLvl2 = 0; let freWLvl2 = 0;
			MaxScale1.findOne({_id: 2}, "maxscale1").select('-_id')
			.then(payload => {
				let maxscale1 = payload.maxscale1;
					curFLvl2 = maxscale1[0].fault; curWLvl2 = maxscale1[0].warn;
					torFLvl2 = maxscale1[1].fault; torWLvl2 = maxscale1[1].warn;
					motorTFLvl2 = maxscale1[2].fault; motorTWLvl2 = maxscale1[2].warn;
					driveTFLvl2 = maxscale1[3].fault; driveTWLvl2 = maxscale1[3].warn;
					powFLvl2 = maxscale1[4].fault; powWLvl2 = maxscale1[4].warn;
					freFLvl2 = maxscale1[5].fault; freWLvl2 = maxscale1[5].warn;
					utility.generateAlarm("more", motorData.amp2, ampWarn2, `Current is above ${curFLvl2}`, `Current is above ${curWLvl2}`, notiesArr2, curFLvl2, curWLvl2);
					utility.generateAlarm("more", motorData.tor2, torWarn2, `Torque is above ${torFLvl2}`, `Torque is above ${torWLvl2}`, notiesArr2, torFLvl2, torWLvl2);
					utility.generateAlarm("more", motorData.motor2T, motorTWarn2, `Motor Thermal is above ${motorTFLvl2}`, `Motor Thermal is above ${motorTWLvl2}`, notiesArr2, motorTFLvl2,  motorTWLvl2);
					utility.generateAlarm("more", motorData.drive2T, driveTWarn2, `Drive Thermal is above ${driveTFLvl2}`, `Drive Thermal is above ${driveTWLvl2}`, notiesArr2, driveTFLvl2, driveTWLvl2);
					utility.generateAlarm("less", motorData.power2, powerWarn2, `Power is above ${powFLvl2}`, `Power is under ${powWLvl2}`, notiesArr2, powFLvl2, powWLvl2);
					utility.generateAlarm("more", motorData.fre2, freWarn2, `Speed is above ${freFLvl2}`, `Power is above ${freWLvl2}`, operateNoties, freFLvl2, freWLvl2);
					monitorNotiesFunc.updateMonitorNoties(2, notiesArr2);
			})
			if (motorData.run) {
				let noti = null;
				utility.generateOperateNoties(noti, `Forward at ${fullTime}`, operateNoties);
			}
			if (motorData.stop) {
				let noti = null;
				utility.generateOperateNoties(noti, `Stop at ${fullTime}`, operateNoties);
			}
			if (motorData.rev) {
				let noti = null;
				utility.generateOperateNoties(noti, `Reverse at ${fullTime}`, operateNoties);
			}
			if (motorData.service) {
				let noti = null;
				utility.generateOperateNoties(noti, `Turn service mode at ${fullTime}`, operateNoties);
			}
			if (motorData.maint) {
				let noti = null;
				utility.generateOperateNoties(noti, `Reach maintenance at ${fullTime}`, operateNoties);
			}
			if (motorData.fault) {
				let noti = null;
				utility.generateOperateNoties(noti, `Fault at ${fullTime}`, operateNoties);
			}
			operateNotiesFunc.updateOperateNoties(1, operateNoties);
		} catch (e) {
			console.log(e);
			console.log("because of undefined data from mqtt fake client");
		}
	}
})

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
				socket.emit("operationNoties", operateNoties);
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
				let noti = null;
				utility.generateOperateNoties(noti, `Forward at ${fullTime}`, operateNoties);
				console.log(operateNoties);
			} else {
				toPLCData[0] = false;
			}
		}
		else if (cmd === "onStop") {
			if (!toPLCData[1]) {
				toPLCData[1] = true;
				let noti = null;
				utility.generateOperateNoties(noti, `Stop at ${fullTime}`, operateNoties);
				console.log(operateNoties);
			} else {
				toPLCData[1] = false;
			}
		}
		else if (cmd === "onReverse") {
			if (!toPLCData[2]) {
				toPLCData[2] = true;
				let noti = null;
				utility.generateOperateNoties(noti, `Reverse at ${fullTime}`, operateNoties);
				console.log(operateNoties);
			} else {
				toPLCData[2] = false;
			}
		}
		else if (cmd === "onService") {
			if (!toPLCData[3]) {
				toPLCData[3] = true;
				let noti = null;
				utility.generateOperateNoties(noti, `Turn service mode at ${fullTime}`, operateNoties);
				console.log(operateNoties);
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
		console.log("Disconnect");
	});
});

//Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	//Set static folder
	app.use(express.static('frontend/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	})
}

