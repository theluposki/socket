import express from "express"
import http from "node:http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const users = []

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    socket.on("user_connected", (username) => {
        users[username] = socket.id

        io.emit("user_connected", username)
        console.log(users)
    })

    socket.on("send_message", (data) => {
        console.log(data)
        const socketId = users[data.receiver]

        io.to(socketId).emit("new_message", data)
    })






    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

app.use("/", express.static("./src/public"))

server.listen(3000, () => {
    console.log(`App running at http://localhost:3000`)
})