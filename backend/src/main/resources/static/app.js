const stompClient = new StompJs.Client({
    brokerURL: "ws://localhost:8080/gs-guide-websocket",
});

let loggedInUser = null;
let subIdBase = null;
let subIdUser = null;
let subIdChat = null;

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log("Connected: " + frame);

    stompClient.subscribe("/topic/user", (user) => {
        console.log("/topic/user new message");
        updateUser(user);
    }, {"id":subIdUser});

    stompClient.subscribe("/topic/chat", (chatMessage) => {
        console.log("/topic/chat new message");
        updateChat(chatMessage);
    }, {"id":subIdChat});
    login();
};

stompClient.onWebSocketError = (error) => {
    console.error("Error with websocket", error);
};
stompClient.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
};


async function setConnected(connected) {
    if (connected) {
        $("#signed-out").hide();
        $("#signed-in").show();
        await populateUsersCall();
    } else {
        $("#signed-out").show();
        $("#signed-in").hide();
        $("#users").html("");
        $("#messages").html("");
    }
}

async function populateUsersCall() {
    await fetch("http://localhost:8080/api/v1/users").then(
        result => {
            result.json().then(
                prom => {
                    populateUsers(prom);
                }
            )
        }
    );
}

function populateUsers(listOfUsers){
    const listLen = listOfUsers.length;
    for(let i = 0;i<listLen;i++){
        console.log(listOfUsers[i].username);
        updateUser(listOfUsers[i]);
    }
}

function connect() {
    loggedInUser = document.getElementById("username").value;
    subIdBase = "subId-for-" + loggedInUser;
    subIdUser = subIdBase + "-user";
    subIdChat = subIdBase + "-chat";
    stompClient.activate();
}

function disconnect() {
    setConnected(false);
    setAway(false);
    logout();
    stompClient.deactivate().then(() => {
        console.log("disconnected");
    });
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
    subIdBase = null;
    subIdChat = null;
    subIdUser = null;
}

function sendChatMsg() {
    const form = document.getElementById("chat-msg");
    const chatJSON = JSON.stringify({
        content: $("#chat-msg-input").val(),
        username: loggedInUser,
    });
    console.log(chatJSON);
    stompClient.publish({
        destination: "/app/chat",
        body: chatJSON,
    });
    form.reset();
}

function updateChat(chatMessage) {
    const parseChat = JSON.parse(chatMessage.body);
    console.log(parseChat);
    $("#messages").append(
        "<span class='row border-bottom'><span class='col-2 text-primary fw-bolder'>" +
        parseChat.username +
        "</span><span class='col'>" +
        parseChat.content +
        "</span></span>"
    );
}

function doNotDisturb() {
    const dndJSON = JSON.stringify({
        username: loggedInUser,
        status: "do_not_disturb",
    });
    console.log(dndJSON);
    stompClient.publish({
        destination: "/app/status",
        body: dndJSON,
    });
    stompClient.unsubscribe(subIdChat);
    setAway(true);
}
function returnFromDND() {
    stompClient.subscribe("/topic/chat", (chatMessage) => {
        console.log("/topic/chat new message");
        updateChat(chatMessage);
    }, {"id":subIdChat});
    const dndJSON = JSON.stringify({
        username: loggedInUser,
        status: "online",
    });
    console.log(dndJSON);
    stompClient.publish({
        destination: "/app/status",
        body: dndJSON,
    });
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

function updateUser(user) {
    let parseUser;
    if(typeof user.body !== 'undefined'){
        console.log(user.body);
        parseUser = JSON.parse(user.body);
    } else {
        parseUser = user;
    }
    const element = document.getElementById(parseUser.username);
    if(parseUser.status === "offline"){
        element.parentNode.removeChild(element);
    } else if(parseUser.status === "do_not_disturb") {
        element.parentNode.removeChild(element);
        $("#users").append(
            "<tr id='"+parseUser.username+"'><td>" + parseUser.username + "</td><td>" + parseUser.status + "</td></tr>"
        );
    } else {
        if(element){
            element.parentNode.removeChild(element);
        }
        $("#users").append(
            "<tr id='"+parseUser.username+"'><td>" + parseUser.username + "</td><td>" + parseUser.status + "</td></tr>"
        );
    }

}

$(function () {
    $("form").on("submit", (e) => e.preventDefault());
    $("#sign-in-button").click(() => connect());
    $("#sign-out-button").click(() => disconnect());
    $("#dnd-button").click(() => doNotDisturb());
    $("#dnd-return-button").click(() => returnFromDND());
    $("#send-chat-msg").click(() => sendChatMsg());
    // $("#test-message").click(() => testMessage());
    // $("#test-user").click(() => testUser());
});
