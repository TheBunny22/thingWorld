const aedes = require("aedes")({
  mqttp: {
    // set MQTT version
    version: 5,
  },
});

const server = require("net").createServer(aedes.handle);
const httpServer = require("http").createServer();
const ws = require("websocket-stream");
const MQTT_Port = 1883;
const wsPort = 8884;

server.listen(MQTT_Port, function () {
  console.log("Aedes MQTT server started and listening on port", MQTT_Port);
});

ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(wsPort, function (req, res) {
  console.log("websocket server listening on port ", wsPort);
});
// emitted when a client connects to the broker
aedes.on("client", function (client) {
    console.log(
    `CLIENT_CONNECTED : MQTT Client ${
      client ? client.id : client
    } connected to aedes broker ${aedes.id}`
  );
});
// emitted when a client disconnects from the broker
aedes.on("clientDisconnect", function (client) {
  console.log(
    `CLIENT_DISCONNECTED : MQTT Client ${
      client ? client.id : client
    } disconnected from the aedes broker ${aedes.id}`
  );
});
// emitted when a client subscribes to a message topic
aedes.on("subscribe", function (subscriptions, client) {
  console.log(
    `TOPIC_SUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } subscribed to topic: ${subscriptions
      .map((s) => s.topic)
      .join(",")} on aedes broker ${aedes.id}`
  );
});
// emitted when a client unsubscribes from a message topic
aedes.on("unsubscribe", function (subscriptions, client) {
  console.log(
    `TOPIC_UNSUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } unsubscribed to topic: ${subscriptions.join(",")} from aedes broker ${
      aedes.id
    }`
  );
});
// emitted when a client publishes a message packet on the topic
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      `MESSAGE_PUBLISHED : MQTT Client ${
        client ? client.id : "AEDES BROKER_" + aedes.id
      } has published message "${packet.payload}" on ${
        packet.topic
      } to aedes broker ${aedes.id}`
    );
  }
});
httpServer.on('connect',(data)=>{
  console.log('client connected',data)
})
// Example of connecting a client using MQTT version 5
// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://localhost", {
//   protocolVersion: 5, // specify MQTT version
// });

// client.on("connect", () => {
//   console.log("Connected to MQTT server using version 5");
// });

// client.on("message", (topic, message) => {
//   console.log(`Received message on topic ${topic}: ${message}`);
// });

// client.subscribe("test");
// client.publish("test", "Hello, MQTT v5!");
