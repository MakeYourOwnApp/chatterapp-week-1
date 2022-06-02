console.log("App is alive");

let channels = [];
let messages = [];
let selectedChannel = null;

/* change which channel is selected in the channel list */
function switchChannel(selectedChannelID) {
    console.log(selectedChannelID);
    if (!!selectedChannel) {
        document.getElementById(selectedChannel.id).classList.remove("selected");
    }
    document.getElementById(selectedChannelID).classList.add("selected");
    channels.forEach((channel) => {
        if (channel.id === selectedChannelID) {
            selectedChannel = channel;
        }
    });
    showHeader();
    showMessages();
}

function showHeader() {
    document.getElementById('chat-title').innerHTML = selectedChannel.channelName;
    document.getElementById('favorite-button').innerHTML = (selectedChannel.favorite)? "favorite" : "favorite_border";
}

function sendMessage() {
    const messageText = document.getElementById("message-input").value;
    console.log(messageText);
    if (!!messageText) {
        const myUserName = "Emma";
        const message = new Message(myUserName, new Date(), selectedChannel.id, true, messageText);
        console.log("New message: " + message.toString());
        selectedChannel.messages.push(message);
        console.log(selectedChannel.messages);
        document.getElementById("message-input").value="";
        selectedChannel.latestMessage = new Date();
        showMessages();
        displayChannels();
    }
}

function showMessages() {
    document.getElementById("chat-area").innerHTML = "";
    selectedChannel.messages.forEach((message) => {
        let direction = "incoming";
        if (message.own) direction = "outgoing";
        let messageStringStart = `<div class="message ` + direction + `">
            <div class="message-wrapper">`;
        let messageStringIcon = `<i class="account-pfp material-icons">account_circle</i>`;
        let messageStringContentOwn = `
            <div class="message-content">
                <p>` + message.text + `</p>
            </div>`;
        let messageStringContent = `
            <div class="message-content">
                <h2>` + message.createdBy + `</h2>
                <p>` + message.text + `</p>
            </div>`;
        let messageStringEnd = `
            </div>
            <span class="timestamp">` + messageTime(message) + `</span>
        </div`;
        let fullMessage = messageStringStart + messageStringIcon + messageStringContent + messageStringEnd;
        if (message.own) {
            fullMessage = messageStringStart + messageStringContentOwn + messageStringIcon + messageStringEnd;
        }
        console.log(fullMessage);
        document.getElementById("chat-area").innerHTML += fullMessage;
    });
}

function messageTime(message) {
    let time = message.createdOn;
    if (new Date().getDate() - message.createdOn.getDate() > 1) {
        return message.createdOn.toLocaleDateString();
    } else return message.createdOn.toLocaleTimeString();
}


function init() {
    console.log("App is initialized");
    getChannels();
    getMessages();
    loadMessagesIntoChannel();
    displayChannels();
    loadEmojis();
    document.getElementById("send-button").addEventListener("click", sendMessage());
    document.getElementById("message-input").onkeyup = function(e) {
        if (e.key == "Enter") sendMessage();
    }
    document.getElementById("emoticon-button").addEventListener("click", toggleEmojiArea);
    document.getElementById("close-emoticon-button").addEventListener("click", toggleEmojiArea);
}


/*load existing channels from channels.js into an array variable*/
function getChannels() {
    channels = mockChannels;
}

/*load exisitng messages from messages.js into an array variable*/
function getMessages() {
    messages = mockMessages;
}

function displayChannels() {
    sortChannels();
    const favoriteList = document.getElementById('favorite-channels');
    const regularList = document.getElementById('regular-channels');
    favoriteList.innerHTML = "";
    regularList.innerHTML = "";
    channels.forEach((channel) => {
        const currentChannelHtmlString = 
        `   <li id="` + channel.id + `" onclick="switchChannel(this.id)">
                <i class="material-icons">group</i>
                <span class="channel-name">` + channel.channelName + `</span>
                <span class="timestamp">` + channelTimeStamp(channel) + `</span>
            </li>`;
        if (channel.favorite) {
            favoriteList.innerHTML += currentChannelHtmlString;
        } else {
            regularList.innerHTML += currentChannelHtmlString;
        }
    });
    if (selectedChannel != null) switchChannel(selectedChannel.id);
}

function channelTimeStamp(channel) {
    let today = new Date().getDate();
    if (channel.messages.length == 0) {
        return "No Messages";
    }
    let latest = new Date(channel.latestMessage);
    if (today - latest.getDate() < 1 ) {
        return channel.latestMessage.toLocaleTimeString();
    } else if (today - latest.getDate() < 2) {
        return "Yesterday";
    } else return latest.toLocaleDateString();
}

function loadMessagesIntoChannel() {
    channels.forEach((channel) => {
        messages.forEach((message) => {
            if (message.channel == channel.id) {
                channel.messages.push(message);
            }
        });
        let num = channel.messages.length;
        console.log(num);
        if (channel.messages.length != 0) {
            channel.latestMessage = channel.messages[num-1].createdOn;
        }
    });
}


function Message(createdBy, createdOn, channel, own, text) {
    this.createdBy= createdBy;
    this.createdOn= createdOn;
    this.channel= channel;
    this.own= own;
    this.text= text;
}

function loadEmojis() {
    for (let i = 0; i < emojis.length; i++) {
        document.getElementById("emoji-list").innerHTML += `<span class="button">` + emojis[i] + `</span>`;
    }
    const emojisInArea = document.getElementById("emoji-list").childNodes;
    for (let i = 0; i < emojisInArea.length; i++) {
        emojisInArea[i].addEventListener('click', function() {
            document.getElementById('message-input').value += this.innerHTML;
        });
    }
}

function toggleEmojiArea() {
    const emojiArea = document.getElementById('emoji-area');
    const chatArea = document.getElementById('chat-area');
    emojiArea.classList.toggle('toggle-area');
    console.log(emojiArea.classList);
    chatArea.style.height = (emojiArea.classList.contains('toggle-area')) ? "calc(100vh - 120px - 250px)" : "calc(100vh - 120px)";
    chatArea.scrollTop = chatArea.scrollHeight;
    if (emojiArea.classList.contains('toggle-area')) {
        emojiArea.style.display = "inline";
        console.log("displaying emojis");
    } else {
        emojiArea.style.display = "none";
    }
}

let fab = document.getElementById("channel-fab");
let modal = document.querySelector(".modal");
let cancel = document.getElementById("cancel-button");

fab.onclick = function() {
    modal.style.display = "block";
}

cancel.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(e) {
    if(e.target == modal) {
        modal.style.display = "none";
    }
}
function createChannel() {
    let channelName = document.getElementById("new-channel-name").value;
    let newChannel = new Channel(channelName);
    mockChannels.push(newChannel);
    displayChannels();
    modal.style.display = "none";
    switchChannel(newChannel.id);
    document.getElementById("new-channel-name").value = "";
}


function Channel(name) {
    this.id = Math.random().toString(36).substring(2,10);
    this.channelName = name;
    this.favorite = false;
    this.messages= [];
    this.latestMessage= null;
}

let favbtn = document.getElementById("favorite-button");

favbtn.onclick = function() {
    favoriteChannel();
}

function favoriteChannel() {
    selectedChannel.favorite = (selectedChannel.favorite) ? false : true;
    displayChannels();
}

function sortChannels() {
    mockChannels.sort(function(a,b) {
        if (a.latestMessage == null) return 1;
        if (b.latestMessage == null) return -1;
        return (b.latestMessage.valueOf() - a.latestMessage.valueOf());
    });
}

