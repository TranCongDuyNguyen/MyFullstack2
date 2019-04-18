require('dotenv').config();

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
client.subscribe('n/motor1', function (err) {
	if (err) {
		console.log(err);
	}
});
client.subscribe('n/motor2', function (err) {
	if (err) {
		console.log(err);
	}
})
//+status
client.subscribe('n/status', function (err) {
	if (err) {
		console.log(err);
	}
})
client.subscribe('n/motor2/status', function (err) {
	if (err) {
		console.log(err);
	}
})
//+receive Freq
client.subscribe('n/motor1/realFreq', function (err) {
	if (err) {
		console.log(err);
	}
})
//+Operate Time
client.subscribe('n/motor1/oTime', function (err) {
	if (err) {
		console.log(err);
	}
})
client.subscribe('n/motor2/oTime', function (err) {
	if (err) {
		console.log(err);
	}
})
//+ Image
client.subscribe('n/image', function (err) {
	if (err) {
		console.log(err);
	}
})

//initial variables----------------------------------------------------------------------------
//-Motor 1----------------------------------------------------------------------------
//+trend arr
let torque1Buffer = [{ torque: 0, time: "00:00:00" }]; let amp1Buffer = [{ amp: 0, time: "00:00:00" }];
let motor1TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive1TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power1Buffer = [{ power: 0, time: "00:00:00" }];
let amp1Store = [{ amp: 0, time: "00:00:00" }]; let amp1StoreCopy = [];
let torque1Store = [{ torque: 0, time: "00:00:00" }]; let torque1StoreCopy = [];
let motor1TStore = [{ motorT: 0, time: "00:00:00" }]; let motor1TStoreCopy = [];
let drive1TStore = [{ driveT: 0, time: "00:00:00" }]; let drive1TStoreCopy = [];
let power1Store = [{ power: 0, time: "00:00:00" }]; let power1StoreCopy = [];
//+notification arr
let notiesArr1 = [];
let notiesArr2 = []
//-Motor 2----------------------------------------------------------------------------
//+trend arr
let torque2Buffer = [{ torque: 0, time: "00:00:00" }]; let amp2Buffer = [{ amp: 0, time: "00:00:00" }];
let motor2TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive2TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power2Buffer = [{ power: 0, time: "00:00:00" }];
let amp2Store = [{ amp: 0, time: "00:00:00" }]; let amp2StoreCopy = [];
let torque2Store = [{ torque: 0, time: "00:00:00" }]; let torque2StoreCopy = [];
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
//+ count
let countAmp1 = 0; let countTor1 = 0; let countMotorT1 = 0; let countDriveT1 = 0; let countPower1 = 0;
let countAmp2 = 0; let countTor2 = 0; let countMotorT2 = 0; let countDriveT2 = 0; let countPower2 = 0;
//+ flags

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
//trending MQTT transfer
client.on("message", function (topic, message) {
	try {
		if (topic === "n/motor1") {
			let motorData = JSON.parse(message.toString());

			if (time) {
				let torque1Obj = createObj("torque", motorData.torque);
				let amp1Obj = createObj("amp", motorData.amp);
				let motor1TObj = createObj("motorT", motorData.motorT);
				let drive1TObj = createObj("driveT", motorData.driveT);
				let power1Obj = createObj("power", motorData.power);
				objToBuffer(torque1Obj, torque1Buffer, 10);
				objToBuffer(torque1Obj, torque1Store, 1000);
				objToBuffer(amp1Obj, amp1Buffer, 10);
				objToBuffer(amp1Obj, amp1Store, 1000);
				objToBuffer(motor1TObj, motor1TBuffer, 10);
				objToBuffer(motor1TObj, motor1TStore, 1000);
				objToBuffer(drive1TObj, drive1TBuffer, 10);
				objToBuffer(drive1TObj, drive1TStore, 1000);
				objToBuffer(power1Obj, power1Buffer, 10);
				objToBuffer(power1Obj, power1Store, 1000);


			}
			//create trend buffer

		}
	} catch (e) {
		console.log(e);
		console.log("because of undefined data from mqtt fake client");
	}
	try {
		if (topic === "n/motor2") {
			let motorData = JSON.parse(message.toString());

			if (time) {
				let torque2Obj = createObj("torque", motorData.torque);
				let amp2Obj = createObj("amp", motorData.amp);
				let motor2TObj = createObj("motorT", motorData.motorT);
				let drive2TObj = createObj("driveT", motorData.driveT);
				let power2Obj = createObj("power", motorData.power);
				//create trend buffer
				objToBuffer(torque2Obj, torque2Buffer, 10);
				objToBuffer(torque2Obj, torque2Store, 1000);
				objToBuffer(amp2Obj, amp2Buffer, 10);
				objToBuffer(amp2Obj, amp2Store, 1000);
				objToBuffer(motor2TObj, motor2TBuffer, 10);
				objToBuffer(motor2TObj, motor2TStore, 1000);
				objToBuffer(drive2TObj, drive2TBuffer, 10);
				objToBuffer(drive2TObj, drive2TStore, 1000);
				objToBuffer(power2Obj, power2Buffer, 10);
				objToBuffer(power2Obj, power2Store, 1000);
			}

		}
	} catch (e) {
		console.log(e);
		console.log("because of undefined data from mqtt fake client");
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
	//-fe client receiving----------------------------------------------------------------------------
	//+doughnut and warning
	client.on("message", function (topic, message) {
		if (topic === "n/motor1") {
			try {
				let motorData = JSON.parse(message.toString());
				let ampWarn, torWarn, motorTWarn, driveTWarn, powerWarn = null;
				generateAlarm("more", motorData.amp, ampWarn, 'Current is above 60%', 'Current is above 80%', notiesArr1);
				generateAlarm("more", motorData.torque, torWarn, 'Torque is above 60%', 'Torque is above 80%', notiesArr1);
				generateAlarm("more", motorData.motorT, motorTWarn, 'Motor Thermal is above 60', 'Motor Thermal is above 80', notiesArr1);
				generateAlarm("more", motorData.driveT, driveTWarn, 'Drive Thermal is above 60', 'Drive Thermal is above 80', notiesArr1);
				generateAlarm("less", motorData.power, powerWarn, 'Power is under 60%', 'Power is above 100%', notiesArr1);
				socket.emit("warnList1", notiesArr1);
				socket.emit("motor1DCData", motorData);
			} catch (e) {
				console.log("because of undefined data from mqtt fake client");
			}
		}
	});
	client.on("message", function (topic, message) {
		if (topic === "n/motor2") {
			try {
				let motorData = JSON.parse(message.toString());
				let ampWarn, torWarn, motorTWarn, driveTWarn, powerWarn = null;
				generateAlarm("more", motorData.amp, ampWarn, 'Current is above 60%', 'Current is above 80%', notiesArr2);
				generateAlarm("more", motorData.torque, torWarn, 'Torque is above 60%', 'Torque is above 80%', notiesArr2);
				generateAlarm("more", motorData.motorT, motorTWarn, 'Motor Thermal is above 60', 'Motor Thermal is above 80', notiesArr2);
				generateAlarm("more", motorData.driveT, driveTWarn, 'Drive Thermal is above 60', 'Drive Thermal is above 80', notiesArr2);
				generateAlarm("less", motorData.power, powerWarn, 'Power is under 60%', 'Power is above 100%', notiesArr2);
				socket.emit("warnList2", notiesArr2);
				socket.emit("motor2DCData", motorData);
			} catch (e) {
				console.log("because of undefined data from mqtt fake client");
			}
		}
	});
	//+status
	client.on("message", function (topic, message) {
		if (topic === "n/status") {
			socket.emit("motorStatus", JSON.parse(message.toString()));
		}
	})
	//+frequency
	client.on("message", function (topic, message) {
		if (topic === "n/motor1/realFreq") {
			socket.emit("realFrequency", message.toString());
		}
	})
	//+otime
	client.on("message", function (topic, message) {
		if (topic === "n/motor1/oTime") {
			socket.emit("motor1OTime", message.toString());
		}
	})
	client.on("message", function (topic, message) {
		if (topic === "n/motor2/oTime") {
			socket.emit("motor2OTime", message.toString());
		}
	})
	//+trending
	let id1 = setInterval(function () {
		//console.log(torqueBuffer);
		socket.emit("motor1TCTor", torque1Buffer);
		socket.emit("motor1TCAmp", amp1Buffer);
		socket.emit("motor1TCMotorT", motor1TBuffer);
		socket.emit("motor1TCDriveT", drive1TBuffer);
		socket.emit("motor1TCPower", power1Buffer);
	}, 10000);
	let id2 = setInterval(function () {
		//console.log(torqueBuffer);
		socket.emit("motor2TCTor", torque2Buffer);
		socket.emit("motor2TCAmp", amp2Buffer);
		socket.emit("motor2TCMotorT", motor2TBuffer);
		socket.emit("motor2TCDriveT", drive2TBuffer);
		socket.emit("motor2TCPower", power2Buffer);
	}, 10000);
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
			countAmp1 = 0;
			amp1StoreCopy = amp1Store.concat();
		}
		if (stopFlag === "torque1StopFlag") {
			countTor1 = 0;
			amp1StoreCopy = amp1Store.concat();
		}
	})
	socket.on("reviewStore", function (reviewFlag) {
		if (reviewFlag === "amp1ReviewFlag") {
			countAmp1+=9;
			let currentIdx = amp1StoreCopy.length;
			if (currentIdx > 10 && currentIdx >= countAmp1) {
				let reviewData = amp1StoreCopy.slice(currentIdx - countAmp1, currentIdx - countAmp1 + 9 );
				socket.emit("reviewAmp1", reviewData);
			}
		}
	})
	//-fe client publishing----------------------------------------------------------------------------
	//+ send freq
	socket.on("setFrequency", function (frequency) {
		client.publish("n/motor1/setFreq", frequency, function (err) {
			if (err) {
				console.log(err);
			}
			console.log(frequency);
		})
	})
	//+ virtual btn send for,rev,stop,service CMD
	socket.on("vCmdToPLC", function (cmd) {
		client.publish("n/virtualPLCCmd", cmd, function (err) {
			if (err) {
				console.log(err);
			}
			console.log(cmd);
		})
	})
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




