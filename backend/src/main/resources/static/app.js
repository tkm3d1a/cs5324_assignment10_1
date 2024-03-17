const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/gs-guide-websocket'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (greeting) => {
        showGreeting(JSON.parse(greeting.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    if (connected) {
        $("#sign-in-button")    .hide();
        $("#sign-in-username")  .hide();
        $("#username")          .hide();

        $("#sign-out-button")   .show();
        $("#conversation")      .show();
    }
    else {
        $("#sign-in-button")    .show();
        $("#sign-in-username")  .show();
        $("#username")          .show();

        $("#sign-out-button")   .hide();
        $("#conversation")      .hide();
    }
    $("#greetings").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({'name': $("#chat-msg").val()})
    });
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#sign-in-button" ).click(() => connect());
    $( "#sign-out-button" ).click(() => disconnect());
    $( "#send" ).click(() => sendName());
});