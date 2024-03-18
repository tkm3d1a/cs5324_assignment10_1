const stompClient = new StompJs.Client({
  brokerURL: "ws://localhost:8080/gs-guide-websocket",
});

var loggedInUser = null;

stompClient.onConnect = (frame) => {
  setConnected(true);
  console.log("Connected: " + frame);

  stompClient.subscribe("/topic/user", (message) => {
    console.log(message);
  });

  stompClient.subscribe("/topic/chat", (message) => {
    console.log(message);
  });
};

stompClient.onWebSocketError = (error) => {
  console.error("Error with websocket", error);
};
stompClient.onStompError = (frame) => {
  console.error("Broker reported error: " + frame.headers["message"]);
  console.error("Additional details: " + frame.body);
};

function setConnected(connected) {
  if (connected) {
    $("#signed-out").hide();
    $("#signed-in").show();
  } else {
    $("#signed-out").show();
    $("#signed-in").hide();
  }
}

function connect() {
  loggedInUser = document.getElementById("username").value;
  stompClient.activate();
  login();
}

function disconnect() {
  setConnected(false);
  setAway(false);
  logout();
  stompClient.deactivate();
  console.log("Disconnected");
}

function login() {
  const user = {
    username: loggedInUser,
  };
  stompClient.publish({
    destination: "/app/user",
    body: JSON.stringify(user),
  });
}

function logout() {
  const user = {
    username: loggedInUser,
  };
  stompClient.publish({
    destination: "/app/logout",
    body: JSON.stringify(user),
  });
  loggedInUser = null;
}

function sendChatMsg() {
  //   stompClient.publish({
  //     destination: "/app/hello",
  //     body: JSON.stringify({ name: $("#chat-msg").val() }),
  //   });
  var form = document.getElementById("chat-msg");
  var chatJSON = JSON.stringify({
    content: $("#chat-msg-input").val(),
    user: loggedInUser,
  });
  console.log(chatJSON);
  form.reset();
}

function testMessage() {
  console.log("test message added");
  $("#messages").append(
    "<span class='row border-bottom'><span class='col-2 text-primary fw-bolder'>My text</span><span class='col'>My other text My other text My </span></span>"
  );
}

function testUser() {
  console.log("test user added");
  $("#users").append(
    "<tr><td>" + "user" + "</td><td>" + "status" + "</td></tr>"
  );
}

function showGreeting(message) {
  $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function doNotDisturb() {
  var dndJSON = JSON.stringify({
    name: loggedInUser,
    status: "do not disturb",
  });
  console.log(dndJSON);
  setAway(true);
}
function returnFromDND() {
  var dndJSON = JSON.stringify({
    name: loggedInUser,
    status: "online",
  });
  console.log(dndJSON);
  setAway(false);
}
function setAway(status) {
  if (status) {
    $("#online-user").hide();
    $("#away-user").show();
  } else {
    $("#online-user").show();
    $("#away-user").hide();
  }
}

$(function () {
  $("form").on("submit", (e) => e.preventDefault());
  $("#sign-in-button").click(() => connect());
  $("#sign-out-button").click(() => disconnect());
  $("#dnd-button").click(() => doNotDisturb());
  $("#dnd-return-button").click(() => returnFromDND());
  $("#send-chat-msg").click(() => sendChatMsg());
  $("#test-message").click(() => testMessage());
  $("#test-user").click(() => testUser());
});
