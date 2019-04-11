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
app.use('/api/motors', require('./routes/api/route.motors'));


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
/*<============================================MQTT CONNECTION AND SUBSCRIBE==================================> */

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
//-SUBSCRIBE
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
client.subscribe('n/motor1/status', function (err) {
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

//initial variables
//-Motor 1
//+trend arr
let torque1Buffer = [{ torque: 0, time: "00:00:00" }]; let amp1Buffer = [{ amp: 0, time: "00:00:00" }];
let motor1TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive1TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power1Buffer = [{ power: 0, time: "00:00:00" }];
//+notification arr
let notiesArr1 = [];
let notiesArr2 = []
//-Motor 2
//+trend arr
let torque2Buffer = [{ torque: 0, time: "00:00:00" }]; let amp2Buffer = [{ amp: 0, time: "00:00:00" }];
let motor2TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive2TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power2Buffer = [{ power: 0, time: "00:00:00" }];


//get real time
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
//-FUNCTION
//+ create trend buffer
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
		if (comparedData < 60 ) {
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
			let torque1Obj = {
				torque: motorData.torque,
				time: ''
			};
			let amp1Obj = {
				amp: motorData.amp,
				time: ''
			};

			let motor1TObj = {
				motorT: motorData.motorT,
				time: ''
			};

			let drive1TObj = {
				driveT: motorData.driveT,
				time: ''
			};

			let power1Obj = {
				power: motorData.power,
				time: ''
			};

			if (time) {
				torque1Obj.time = time;
				amp1Obj.time = time;
				motor1TObj.time = time;
				drive1TObj.time = time;
				power1Obj.time = time;
			}
			//create trend buffer
			objToBuffer(torque1Obj, torque1Buffer, 10);

			objToBuffer(amp1Obj, amp1Buffer, 10);

			objToBuffer(motor1TObj, motor1TBuffer, 10);

			objToBuffer(drive1TObj, drive1TBuffer, 10);

			objToBuffer(power1Obj, power1Buffer, 10);
		}
	} catch (e) {
		console.log(e);
		console.log("because of undefined data from mqtt fake client");
	}
	try {
		if (topic === "n/motor2") {
			let motorData = JSON.parse(message.toString());
			let torque2Obj = {
				torque: motorData.torque,
				time: ''
			};

			let amp2Obj = {
				amp: motorData.amp,
				time: ''
			};

			let motor2TObj = {
				motorT: motorData.motorT,
				time: ''
			};

			let drive2TObj = {
				driveT: motorData.driveT,
				time: ''
			};

			let power2Obj = {
				power: motorData.power,
				time: ''
			};

			if (time) {
				torque2Obj.time = time;
				amp2Obj.time = time;
				motor2TObj.time = time;
				drive2TObj.time = time;
				power2Obj.time = time;
			}
			//create trend buffer
			objToBuffer(torque2Obj, torque2Buffer, 10);

			objToBuffer(amp2Obj, amp2Buffer, 10);

			objToBuffer(motor2TObj, motor2TBuffer, 10);

			objToBuffer(drive2TObj, drive2TBuffer, 10);

			objToBuffer(power2Obj, power2Buffer, 10);
		}
	} catch (e) {
		console.log(e);
		console.log("because of undefined data from mqtt fake client");
	}



})
//doughnut MQTT, io transfer and trend io transfer
io.on('connection', function (socket) {
	console.log('server-side socket connected');
	socket.on("error", (err) => {
		if (err) {
			console.log(err);
		}
		socket.disconnect();
	})
	//doughnut and warning

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
	//status
	client.on("message", function (topic, message) {
		if (topic === "n/motor1/status") {
			socket.emit("motor1Status", JSON.parse(message.toString()));
		}
	})
	client.on("message", function (topic, message) {
		if (topic === "n/motor2/status") {
			socket.emit("motor2Status", JSON.parse(message.toString()));
		}
	})
	//frequency
	client.on("message", function (topic, message) {
		if (topic === "n/motor1/realFreq") {
			socket.emit("realFrequency", message.toString());
		}
	})
	//otime
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
	//trending
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
	//client publishing
	socket.on("setFrequency", function (frequency) {
		client.publish("n/motor1/setFreq", frequency, function (err) {
			if (err) {
				console.log(err);
			}
			console.log(frequency);
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




