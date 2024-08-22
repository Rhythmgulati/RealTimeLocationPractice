const express = require("express")
const path = require("path")
const app = express()
const socket = require("socket.io")
const http = require("http")
const { log } = require("console")

const server = http.createServer(app)
const io = socket(server)

app.set("view engine","hbs")
console.log(path.join(__dirname,"/public"));
app.use(express.static(path.join(__dirname,"public/")))

io.on("connection",(socket)=>{
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,...data})
     })
     socket.on("disconnect",()=>{
        io.emit("user-disconnect",socket.id)    
     })
})

app.get("/",(req,res)=>{
    res.render("index");
})

server.listen(3000,()=>console.log("Listening"))