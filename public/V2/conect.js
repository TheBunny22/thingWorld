const SubscribeTopics = [];
window.RemoveSUb = (element, id, topic) => {
  // console.log(`Remove : ${element} \n Id : ${id}`);
  // alert(` Unsubscribed The Topic ${topic}`);
  unSubcribe(topic,element)
SubscribeTopics.map((data)=>{
  if(data.id == id){
    SubscribeTopics.splice(id,1);
    DomSub();
  }
  else{
    client.subscribe(data.topic,{
      qos:data.qos,
      retain:false,
    })
  }
});
};
const unSubcribe = (topic,element) =>{
  client.unsubscribe(topic, () => {
    console.log("Unsubscribed");
  });
}
window.onload = () => {
  let conectionStatus = false;
  const ConHideBt = document.getElementById("conectHide");
  const PubHideBt = document.getElementById("pubHide");
  const SubHideBt = document.getElementById("subHide");
  const MsgHideBt = document.getElementById("msgHide");
  const conectPanel = document.getElementById("conectpanel");
  const publishPanel = document.getElementById("publishpanel");
  const subPanel = document.getElementById("subPanel");
  const msgPanel = document.getElementById("msgPanel");
  //inputs
  const hostValue = document.getElementById("host");
  const portValue = document.getElementById("port");
  const clientidValue = document.getElementById("ClientID");
  const username = document.getElementById("username");
  const Password = document.getElementById("Password");
  const keepalive = document.getElementById("keepAlive");
  const willTopic = document.getElementById("willTopic");
  const willqos = document.getElementById("willqos");
  const willmsg = document.getElementById("willmsg");
  //conection indicator
  const indicator = document.getElementById("conectindi");
  const MessageBox = document.getElementById("messageBox");
  //Publish data
  const pubtopic = document.getElementById("pubtopic");
  const pubMsg = document.getElementById("pubMsg");
  const pubQos = document.getElementById("pubQos");

  // subscribe data
  const SubTopic = document.getElementById("subscribeTopic");
  const SubQos = document.getElementById("SubQos");
  const subcolor = document.getElementById("Rcolor");
  const SubList = document.getElementById("subscribeTopicPanel");
  //unscribe button
  const UnSubBts = document.querySelectorAll(".unSubcribe");
  //buttons
  const PublishBt = document.getElementById("PublishBt");
  const connectbt = document.getElementById("conectbt");
  const AddSub = document.getElementById("AddSub");
  const SubBt = document.getElementById("SubTopicBt");
  //client id
  const clientId = "Bunny-" + Math.random().toString(16).substr(2, 8);
  clientidValue.value = clientId;
  let option;
  const ReceivedMsg = [];
  const PublishedMsg = [];

  const topicList = [];

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  // date time stamp
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
    return `${dateStamp}${timeStamp}`;
  };
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
  //unsubscribe function
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
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
  // When the user clicks the button, open the modal
  let tempc;
  AddSub.onclick = function () {
    tempc = randomColor();
    modal.style.display = "block";
    subcolor.style.background = tempc;
  };
  //subscribe Bt
  SubBt.onclick = () => {
    let topic = SubTopic.value;
    let qos = parseInt(SubQos.value);
    if (conectionStatus) {
      if (SubTopic.value == "") {
        alert(`Fill The Topic to Subscribe`);
      } else {
        client.subscribe(topic, { qos: qos });
        SubscribeTopics.push({
          id: SubscribeTopics.length,
          topic: topic,
          time: getDate(),
          qos: qos,
          color: tempc,
        });
        colorsByTopic[topic] = tempc;
        modal.style.display = "none";

        // alert(`Subcribed Topic : ${SubTopic.value} \nQos : ${SubQos.value} `);
        DomSub();
      }
    } else {
      alert(`Connect to Broker First`);
    }
  };
  window.DomSub = () => {
    SubList.innerHTML = null;

    SubscribeTopics.map((data) => {
      SubList.innerHTML =
        `
      <div class="submessage" id="subBlock${data.id}">
      <div class="color" style="background: ${data.color}">&nbsp;</div>
      <div class="inerSub" style="padding:0 .5rem">
        <div class="inersubTitle2" >
          <h6>Qos : ${data.qos}</h6>
          <h6>-</h6>
          <button class="unSubcribe" id="topic${data.id}" onclick="RemoveSUb('subBlock${data.id}',${data.id},'${data.topic}')" style="color: blue">x</button>
        </div>
        <div style="text-align: left;">${data.topic}</div>
      </div>
    </div>
      ` + SubList.innerHTML;
    });
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  ConHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
  PubHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
  SubHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
  MsgHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;

  ConHideBt.addEventListener("click", (e) => {
    if (conectPanel.style.display == "none") {
      // conectPanel.style.display = "block";
      $(conectPanel).slideDown(500);
      ConHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
    } else {
      ConHideBt.style.backgroundImage = `url("../icons/down.png")`;
      $(conectPanel).slideUp(500);
      // conectPanel.style.display = "none";
    }
  });
  PubHideBt.addEventListener("click", (e) => {
    if (publishPanel.style.display == "none") {
      $(publishPanel).slideDown(500);
      PubHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
    } else {
      $(publishPanel).slideUp(500);
      PubHideBt.style.backgroundImage = `url("../icons/down.png")`;
      // publishPanel.style.display = "none";
    }
  });
  SubHideBt.addEventListener("click", (e) => {
    if (subPanel.style.display == "none") {
      //   subPanel.style.display = "block";
      $(subPanel).slideDown(500);
      SubHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
    } else {
      SubHideBt.style.backgroundImage = `url("../icons/down.png")`;
      $(subPanel).slideUp(500);
    }
  });
  MsgHideBt.addEventListener("click", (e) => {
    if (msgPanel.style.display == "none") {
      // msgPanel.style.display = "block";
      $(msgPanel).slideDown(500);
      MsgHideBt.style.backgroundImage = `url("../icons/upArrow.png")`;
    } else {
      $(msgPanel).slideUp(500);
      // msgPanel.style.display = "none";
      MsgHideBt.style.backgroundImage = `url("../icons/down.png")`;
    }
  });
 
  $(publishPanel).slideUp(500);
  $(subPanel).slideUp(500);
  $(msgPanel).slideUp(500);
  //eventlistner for buttons
  connectbt.addEventListener("click", (e) => {
    if (conectionStatus) {
      location.reload();
    } else {
      connectToBroker();
    }
  });
  PublishBt.addEventListener("click", () => {
    let topic = pubtopic.value;
    let qos = parseInt(pubQos.value);
    let message = pubMsg.value;
    if (conectionStatus) {
      if (topic == "") {
        alert(`Enter Topic / Message to Publish`);
      } else {
        client.subscribe(topic, { qos: qos });
        client.publish(topic, message, {
          qos: qos,
          retain: false,
        });
        let tcolor = randomColor();
        PublishedMsg.push({
          id: PublishedMsg.length,
          topic: topic,
          message: message,
          qos: qos,
          color: tcolor,
        });
        topicList.push(topic);
        PublishedMsg.forEach((msg) => {
          if (!topicList.includes(msg.topic)) {
            colorsByTopic[topic] = tcolor;
          }
        });
        // console.log(PublishedMsg);
      }
    } else {
      alert(`Connect To Broker First`);
    }
  });

  const connectToBroker = () => {
    const host = `ws://${hostValue.value}:${portValue.value}`;
    // const host = `ws://thingsworld.cloud:9001`
    console.log(host);
    const options = {
      keepalive: parseInt(keepalive.value),
      clientId: clientId,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: willTopic.value,
        payload: willmsg.value,
        qos: parseInt(willqos.value),
        retain: false,
      },
    };
    window.client = mqtt.connect(host, options);
    console.log(options);

    console.log("Connecting mqtt client......");
    client.on("connect", () => {
      conectionStatus = true;
      console.log(`conected`);
      $(ConHideBt).trigger("click");
      $(PubHideBt).trigger("click");
      $(SubHideBt).trigger("click");
      $(MsgHideBt).trigger("click");
      indicator.style.background = "green";
      connectbt.value = `Disconect`;
    });

    client.on("error", (err) => {
      console.log("Connection error: ", err);
      client.end();
    });

    client.on("reconnect", () => {
      console.log("Reconnecting...");
    });
    client.on("message", (topic, message, packet) => {
      // console.log(
      //   "Received Message: " +
      //     message.toString() +
      //     "\nOn topic: " +
      //     topic +
      //     "\n Packet :" +
      //     packet
      // );
      ReceivedMsg.push({
        id: ReceivedMsg.length,
        topic: topic,
        message: message.toString(),
        date: getDate(),
        color: "green",
      });
      checkid();
      PrintMessage();
      // console.log(ReceivedMsg);
    });
  };

  const PrintMessage = () => {
    MessageBox.innerHTML = null;
    ReceivedMsg.map((msg) => {
      MessageBox.innerHTML =
        `
      <div class="submessage income">
          <div class="color" style="background: ${msg.color}">&nbsp;</div>
          <div class="inerSub">
                <div class="inersubTitle" >
                  <h6>${msg.date}</h6>
                  <h6>Topic : ${msg.topic}</h6>
                  
                </div>
                <div style="text-align: left;margin-left:.5rem;font-size:18px;">${msg.message}</div>
          </div>
       </div>
      ` + MessageBox.innerHTML;
    });
  };
};
