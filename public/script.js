//source https://www.emqx.com/en/blog/connect-to-mqtt-broker-with-websocket
const clientId = "mqttjs_Bunny" + Math.random().toString(16).substr(2, 8);
const conectbt = document.getElementById("connect_button");
const MessageBox = document.getElementById("messageBox");
const loader = document.getElementById("rotateicon");
// const history = document.getElementById("lastwork");

const host = `ws://broker.thingsworld.cloud:9001`;
// const host = `ws://thingsworld.cloud:8083/tcp`
console.log(`host : ${host}`);
const ReceivedMsg = [];
// const TaskHistory = [];
const UploadMsg = [];
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "New Client",
    payload: "New connection Established",
    qos: 0,
    retain: false,
  },
};
 
console.log("Connecting mqtt client");
const client = mqtt.connect(host, options);

let pubbt = document.getElementById("pubbt");
let subbt = document.getElementById("subbt");
client.on("connect", () => {
  pubbt.disabled = false;
  subbt.disabled = false;
  console.log(`connected`);
  conectbt.innerHTML = `Connected`;
  conectbt.style.backgroundColor = "lightgreen";
});

client.on("error", (err) => {
  alert("Connection error: ", err);
  client.end();
});

// Create an object to store colors by topic
const colorsByTopic = {};
const checkid = () => {
  // Loop through the objects array and generate colors for each topic
  ReceivedMsg.forEach((obj) => {
    if (colorsByTopic[obj.topic]) {
      // Use the existing color for this topic
      obj.color = colorsByTopic[obj.topic];
    } else {
      // Generate a new color for this topic
      const color = randomColor();
      colorsByTopic[obj.topic] = color;
      obj.color = color;
    }
  });
};
// Received
client.on("message", (topic, message, packet) => {
  console.log(
    "Received Message: " + message.toString() + "\nOn topic: " + topic
  );
    console.log(topic, `\n`,message);
  //   console
  ReceivedMsg.push({
    topic: topic,
    message: message.toString(),
    color: "green",
    time: getDate(),
  });
  checkid();
  MessageBox.innerHTML = null;
  ReceivedMsg.map((msg, index) => {
    console.log(msg);
    // console.log(index)
    MessageBox.innerHTML = `<li class="msg" style="background:${msg.color}"> 
    <div style="color:grey;font-size:11px;display:flex;justify-content:space-between"><span>${msg.time.timeStamp} </span><span>${msg.time.dateStamp}</span> <span> TOPIC : ${msg.topic}  </span> </div> <div style="align-text:center ; width:100%;"> ${msg.message} <div></li>`+MessageBox.innerHTML;
  });
  // Set the scroll position to 500 pixels
});

client.on("reconnect", () => {
  console.log("Reconnecting...");
  pubbt.disabled = true;
  subbt.disabled = true;
  // conectbt.appendChild(`<div id="rotateicon">
  // </div>`)
  conectbt.innerHTML = `Reconnecting`;
  conectbt.style.backgroundColor = "yellow";
});

function randomColor() {
  const LightColors = [
    "LavenderBlush",
    "LightPink",
    "LemonChiffon",
    "LightCyan",
    "LightGoldenrodYellow",
    "AliceBlue",
    "Beige",
    "FloralWhite",
    "Gainsboro",
    "Honeydew",
    "Ivory",
    "Lavender",
    "LightBlue",
    "LightCoral",
    "LightGray",
    "LightGreen",
    "LightSalmon",
    "LightSeaGreen",
    "LightSkyBlue",
    "LightSlateGray",
  ];
  const randomIndex = Math.floor(Math.random() * LightColors.length);
  return LightColors[randomIndex];
}
const getDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const timeStamp = `  ${hours}:${minutes}:${seconds}  `;
  const dateStamp = `  ${year}-${month}-${day}`;
  return { timeStamp, dateStamp };
};
const PublishMsg = () => {
  let message = document.getElementById("message");
  let topic = document.getElementById("pubtopic");
  if (message.value.trim() === "" || topic.value.trim() === "") {
    alert(`Please Input the Topic / Message To Publish a Message`);
  } else {
    client.subscribe(topic.value, { qos: 0 });
    client.publish(
      topic.value,
      message.value,
      {
        qos: 0,
        retain: false,
      },
      () => {
        UploadMsg.push({
          id: UploadMsg.length,
          topic: topic.value,
          message: message.value,
        });
        // ids.push(UploadMsg.length);
      }
    );
  }
};

// const updateHistory = () => {
//   TaskHistory.map((msg) => {
//     history.innerHTML += ` <div id="${msg.index}" class="hisel">
//       <button onclick="removeelement(${msg.index})">X</button>
//       Published :Message = ${msg.message} to ${msg.topic}
//     </div>`;
//   });
// };
// const removeelement = (msg) => {
//   let rem = document.getElementById(`${msg}`);
//   rem.remove();
// };
const subscribeTopic = () => {
  let topic = document.getElementById("SubTopic").value;
  if (topic == "") {
    alert(`Write The Topic To Subscribe`);
  } else {
    client.subscribe(topic, { qos: 0 });
    alert(`Topic : ${topic} is Subscribed`);
  }
};
