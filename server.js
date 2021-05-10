const express = require("express")
const path = require("path")
const PORT = process.env.PORT || 3000

const app = express()
let obj = {}
let id = 0

app.use(express.static("static"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Server starting in: ${PORT}`)
});

app.get("/", (req, res) => {
    res.header('Content-Type: text/html; charset=utf-8')
    res.sendFile(path.join(__dirname, "static/index.html"))
})

app.get("/get-message", (req, res) => {
    res.send(JSON.stringify(obj))
    res.end("message sent")
})

app.post("/send-message", (req, res) => {
    obj = req.body
    obj.id = id
    id++
    res.end("message received")
})

app.post("/clear", (req, res) => {
    obj = {}
    res.end("cleared")
})