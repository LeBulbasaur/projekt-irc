$(document).ready(function () {

    let msgObj
    let msgID
    let lastMsgId

    getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    writeMessage = (obj) => {
        lastMsgId = obj.id
        const msgValue = `<${obj.time}> <@${obj.nick.fontcolor(obj.color)}> `
        const msg = document.createElement("div")
        msg.setAttribute("class", "message")
        msg.innerHTML = msgValue
        msgSpan = document.createElement("span")
        msgSpan.setAttribute("class", "message-span")
        msgSpan.innerText = `${obj.message}`
        msg.append(msgSpan)
        chatBox.append(msg)
        // $('.message-span').emoticonize();
        form.message.value = ""
    }

    async function getMessages() {
        const response = await fetch("/get-message");
        const message = await response.json();
        if (Object.keys(message).length != 0) {
            msgObj = message
            msgID = message.id
        }
        await getMessages();
    }
    getMessages();

    const form = document.getElementById("form")
    const chatBox = document.getElementById("chat-area")

    const interval = setInterval(() => {
        if (msgID != lastMsgId) {
            writeMessage(msgObj)
        }
    }, 500)

    if (!getCookie("nick")) {
        const nickname = window.prompt("Enter nickname:")
        document.cookie = `nick=${nickname}; expires=${new Date(Date.now() + 1000 * 60 * 60)}`
        document.cookie = `color=${Math.floor(Math.random() * 16777215).toString(16)}; expires=${new Date(Date.now() + 1000 * 60 * 60)}`
    }

    form.onsubmit = (e) => {
        e.preventDefault()
        if (form.message.value && form.message.value[0] != "/") {
            const date = new Date();
            date.getMinutes() < 10 ? time = `${date.getHours()}:0${date.getMinutes()}` : time = `${date.getHours()}:${date.getMinutes()}`
            const obj = { nick: getCookie("nick"), color: getCookie("color"), time: time, message: form.message.value }
            fetch("/send-message", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(obj)
            })
            window.setTimeout(() => {
                fetch("/clear", {
                    method: "POST",
                })
            }, 750)
        } else if (form.message.value) {
            let msgText = form.message.value
            switch (msgText) {
                case "/color":
                    const color = Math.floor(Math.random() * 16777215).toString(16)
                    document.cookie = `color=${color}; expires=${new Date(Date.now() + 1000 * 60 * 60)}`
                    msgText = `color has been changed to: ${color.fontcolor(color)}`
                    break
                case "/nick":
                    const nickname = window.prompt("Enter nickname:")
                    document.cookie = `nick=${nickname}; expires=${new Date(Date.now() + 1000 * 60 * 60)}`
                    msgText = `nickname has been changed to: ${nickname}`
                    break
                case "/chungus":
                    document.getElementById("background-img").style.backgroundImage = "url('./gfx/chungus.png')"
                    msgText = "yes"
                    break
                case "/clear":
                    location.reload()
                    break
                case "/help":
                    msgText = "avaiable commands: /color, /nick, /clear, /chungus"
                    break
            }
            const msgValue = `${msgText.fontcolor("red")}`
            const msg = document.createElement("div")
            msg.setAttribute("class", "message")
            msg.innerHTML = msgValue
            chatBox.append(msg)
            form.message.value = ""
        }
    }
});
