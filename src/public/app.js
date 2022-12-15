import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import "/socket.io/socket.io.js"

const server = io()

server.on("user_connected", (username) => {
    if(!app.users.includes(username)) {
        app.users.push(username)
    }
})

server.on("new_message", (data) => {
    app.messages.push(data)
    localStorage.setItem("messagems", JSON.stringify(app.messages))
    console.log(data)
})

const app = createApp({
    data() {
        return {
            messages: [],
            message: 'Hello Vue!',
            receiver: null,
            sender: null,
            name: null,
            users: []
        }
    },
    mounted() {
        if(localStorage.getItem("messagems")) {
            this.messages = JSON.parse(localStorage.getItem("messagems"))
        }
        this.getLocalUser()
    },
  methods: {
    getLocalUser() {
        const user = localStorage.getItem("myUser")

        if(user) {
            server.emit("user_connected", user)
            this.sender = user
        }
    },
    enterName() {
        server.emit("user_connected", this.name)
        localStorage.setItem("myUser", this.name)
        this.sender = this.name
    },
    selectedUser(username) {
        this.receiver = username
        console.log(username)
    },
    sendMessage() {
        const msg = {
            sender: this.sender,
            receiver: this.receiver,
            message: this.message
        }
        server.emit("send_message", msg)
        this.messages.push(msg)
        localStorage.setItem("messagems", JSON.stringify(this.messages))
    },
    verifyUser(sender) {
        if(sender === this.sender) {
            return "msg sender"
        } else {
            return "msg receiver"
        }
    }
  }
}).mount('#app')
