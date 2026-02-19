require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const mqtt_loraserver = process.env.MQTT_LORASERVER || 'mqtt://loraserver'
const applicationId = process.env.APPLICATION_ID || '15'
const chirpstackVersion = process.env.CHIRPSTACK_VERSION || '3'
var expressWs = require('express-ws')(app);

var mqtt = require('mqtt')
const http = require('http')

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

var aWss = expressWs.getWss('/');

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    //var eui, cmd;
    var arr = msg.split(",");
    console.log("ws:"+arr[1]);


    var configobj = { "confirmed": false,  "fPort": 2 };

    // Check if fPort is provided (arr[2])
    if (arr[2] && !isNaN(parseInt(arr[2]))) {
      var fport = parseInt(arr[2]);
      // Validate fPort is in valid range (1-223)
      if (fport >= 1 && fport <= 223) {
        configobj.fPort = fport;
      } else {
        console.log('Invalid fPort value:', fport, '- using default fPort 2');
      }
    }
    // cli support for hex data, convert to base64
    if ( arr[1] ) {
      configobj.data = hexToBase64(arr[1]);

    }
    /*else {
      configobj.data = hexToBase64("08"); //default pull upp link (dragino)

    }*/


    // Determine topic based on ChirpStack version
    var topic;
    if (chirpstackVersion === '4') {
      // ChirpStack v4 uses: application/{app_id}/device/{dev_eui}/command/down
      topic = 'application/' + applicationId + '/device/' + arr[0] + '/command/down';
    } else {
      // ChirpStack v3 uses: application/{app_id}/node/{dev_eui}/tx
      topic = 'application/' + applicationId + '/node/' + arr[0] + '/tx';
    }

    console.log('Publishing to topic:', topic);
    client.publish(topic, JSON.stringify(configobj))
  });
  console.log('socket', req.testing);
});

app.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
});

app.post('/cmd', (req, res) => {
  res.send('Hello World!')
})
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port} check README.md for instructions`)
})

aWss.clients.forEach(function (client) {
  client.send("upp");
});

var client  = mqtt.connect(mqtt_loraserver)

client.on('error', function (err) {
  console.error('MQTT connection error:', err);
  wspub("MQTT Error: " + err.message);
});

client.on('connect', function (expressWs) {
     /* client.subscribe('gateway/#', function (err) {
        if (err) {
        console.log("no conn");
        }
      })*/
      client.subscribe(["application/" + applicationId + "/#"], function (err) {
        if (err) {
            console.log("no conn");
            wspub("no mqtt");
        }
      })

})

function wspub (msg) {
  //console.log(msg);
  aWss.clients.forEach(function (client) {
    client.send(msg);
  });
}



/*
01  Transmit Time Interval (4b)
04  Reset (2)
08 Pull a uplink
A8  Modbus commando devcfg
*/
//configobj.data = hexToBase64("04FF")

/*
a9 = set command1
00 = no crc / 01 add crc16
06 = modbus addr
04 = funccode read inbup reg
00
01 = pressure reg


*/
//configobj.data = hexToBase64("a8000400010200")

//configobj.data = hexToBase64("a8000400010200")
//configobj.data = hexToBase64("08ff")
//configobj.data = hexToBase64("ae06")
//         | Modbus
// a8 00 06 06 04 00 01 00 00 04
// a8 00 05 06 04 00 01 02 02

//AT+CFGDEV=06 04 00 01 00 01,1

//get temp
//AT+CFGDEV=06 04 00 17 00 01,1
//AT+CFGDEV=06 04 00 19 00 02,1
/*
AT+CFGDEV=06 03 00 0a 00 01,1
AT+CFGDEV=06 06 00 15 00 01 00 01,1

AT+CFGDEV=06 04 00 03 00 03,1


AT+CFGDEV=06 04 00 00 00 01,1

//conf device
AT+DATAUP=0
AT+PAYVER=7
AT+COMMAND1=06 04 00 00 00 01,1
AT+DATACUT1=7,1,4+5
AT+COMMAND2=06 04 00 00 00 01,1
AT+DATACUT2=7,1,4+5

AT+CHS=0
AT+TDC
AT+CFG

//get mode
//AT+CFGDEV=06 04 00 14 00 01,1

*/
//AT+CFGDEV=06 04 00 02 00 0a,1
//configobj.data = hexToBase64("a80105060400010103")

//a9000102000108

//AT+CFGDEV=06 04 00 0E 01,1


// set baud rate 9600
//configobj.data = hexToBase64("A7010060")

// after v3.11
//client.publish('application/15/device/a84041725182c91b/command/down', configobj )

// before v3.11
//client.publish('application/15/device/a84041725182c91b/tx', configobj )


client.on('message', function (topic, message) {

    o = JSON.parse(message.toString())

    //if ( o.payload_fields.motion === 1 ) {

   //   console.log( "Motiondetect" )
    //  const { exec } = require('child_process');
      //if (err) {
        // node couldn't execute the command
      //  return;
     // }

     // Pretty print JSON for communication log
     var prettyJson = JSON.stringify(o, null, 2);
     wspub(topic + " => \n" + prettyJson )
    console.log(o.data +":"+ Base64Tohex( o.data) );


//aWss.clients.forEach(function (client) {
  //client.send(topic + " => " + message.toString());
//});

})



function hexToBase64( hexString ){
    return Buffer.from(hexString, 'hex').toString('base64')
}

function Base64Tohex( b64String ){
  return Buffer.from(b64String, 'base64').toString('hex')
}
