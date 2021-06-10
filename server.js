const express = require("express")
const path = require("path")
const PORT = process.env.PORT || 3000

const app = express()
let longpoll = require("express-longpoll")(app)
let obj = {}
let id = 0

app.use(express.static("static"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

longpoll.create("/poll")

app.listen(PORT, () => {
    console.log(`Server starting in: ${PORT}`)
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static/index.html"))
})

longpoll.publish("/poll", obj)

setInterval(function () {
    if (obj.message) {
        longpoll.publish("/poll", obj)
    }
}, 10)

app.post("/send-message", (req, res) => {
    obj = req.body
    obj.id = id
    id++
    console.log(obj)
    res.end("message received")
})

app.post("/clear", (req, res) => {
    obj = {}
    res.end("cleared")
})