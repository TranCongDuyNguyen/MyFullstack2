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

//trending initial var
//+Motor 1
let torque1Buffer = [{ torque: 0, time: "00:00:00" }]; let amp1Buffer = [{ amp: 0, time: "00:00:00" }];
let motor1TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive1TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power1Buffer = [{ power: 0, time: "00:00:00" }];
//+Motor 2
let torque2Buffer = [{ torque: 0, time: "00:00:00" }]; let amp2Buffer = [{ amp: 0, time: "00:00:00" }];
let motor2TBuffer = [{ motorT: 0, time: "00:00:00" }]; let drive2TBuffer = [{ driveT: 0, time: "00:00:00" }];
let power2Buffer = [{ power: 0, time: "00:00:00" }];
let torqueObj = {};
let ampObj = {};
let motorTObj = {};
let driveTObj = {};
let powerObj = {};
var time;

function getTime() {
	let now = new Date();
	let hours = (("0" + now.getHours()).slice(-2));
	let minutes = (("0" + now.getMinutes()).slice(-2));
	let seconds = (("0" + now.getSeconds()).slice(-2));
	return hours + ":" + minutes + ":" + seconds;
}

setInterval(() => {
	time = getTime();
}, 200);

//trending MQTT transfer
client.on("message", function (topic, message) {
	try {
		if (topic === "n/motor1") {

			let torque1Obj = {
				...torqueObj,
				torque: JSON.parse(message.toString()).torque,
				time: ''
			};

			let amp1Obj = {
				...ampObj,
				amp: JSON.parse(message.toString()).amp,
				time: ''
			};

			let motor1TObj = {
				...motorTObj,
				motorT: JSON.parse(message.toString()).motorT,
				time: ''
			};

			let drive1TObj = {
				...driveTObj,
				driveT: JSON.parse(message.toString()).driveT,
				time: ''
			};

			let power1Obj = {
				...powerObj,
				power: JSON.parse(message.toString()).power,
				time: ''
			};

			if (time) {
				torque1Obj.time = time;
				amp1Obj.time = time;
				motor1TObj.time = time;
				drive1TObj.time = time;
				power1Obj.time = time;
			}

			torque1Buffer.push(torque1Obj);
			if (torque1Buffer.length > 10) {
				torque1Buffer.splice(0, 1)
			}

			amp1Buffer.push(amp1Obj);
			if (amp1Buffer.length >= 10) {
				amp1Buffer.splice(0, 1)
			}

			motor1TBuffer.push(motor1TObj);
			if (motor1TBuffer.length > 10) {
				motor1TBuffer.splice(0, 1)
			}

			drive1TBuffer.push(drive1TObj);
			if (drive1TBuffer.length >= 10) {
				drive1TBuffer.splice(0, 1)
			}

			power1Buffer.push(power1Obj);
			if (power1Buffer.length >= 10) {
				power1Buffer.splice(0, 1)
			}
		}
	} catch (e) {
		console.log(e);
		console.log("because of undefined data from mqtt fake client");
	}
	try {
		if (topic === "n/motor2") {

			let torque2Obj = {
				...torqueObj,
				torque: JSON.parse(message.toString()).torque,
				time: ''
			};

			let amp2Obj = {
				...ampObj,
				amp: JSON.parse(message.toString()).amp,
				time: ''
			};

			let motor2TObj = {
				...motorTObj,
				motorT: JSON.parse(message.toString()).motorT,
				time: ''
			};

			let drive2TObj = {
				...driveTObj,
				driveT: JSON.parse(message.toString()).driveT,
				time: ''
			};

			let power2Obj = {
				...powerObj,
				power: JSON.parse(message.toString()).power,
				time: ''
			};

			if (time) {
				torque2Obj.time = time;
				amp2Obj.time = time;
				motor2TObj.time = time;
				drive2TObj.time = time;
				power2Obj.time = time;
			}

			torque2Buffer.push(torque2Obj);
			if (torque2Buffer.length > 10) {
				torque2Buffer.splice(0, 1)
			}

			amp2Buffer.push(amp2Obj);
			if (amp2Buffer.length >= 10) {
				amp2Buffer.splice(0, 1)
			}

			motor2TBuffer.push(motor2TObj);
			if (motor2TBuffer.length > 10) {
				motor2TBuffer.splice(0, 1)
			}

			drive2TBuffer.push(drive2TObj);
			if (drive2TBuffer.length >= 10) {
				drive2TBuffer.splice(0, 1)
			}

			power2Buffer.push(power2Obj);
			if (power2Buffer.length >= 10) {
				power2Buffer.splice(0, 1)
			}
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
	//doughnut
	client.on("message", function (topic, message) {
		if (topic === "n/motor1") {
			try {
				socket.emit("motor1DCData", JSON.parse(message.toString()));
			} catch (e) {
				console.log("because of undefined data from mqtt fake client");
			}
		}
	});
	client.on("message", function (topic, message) {
		if (topic === "n/motor2") {
			try {
				socket.emit("motor2DCData", JSON.parse(message.toString()));
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
		console.log("Disconnect");
	});
});




