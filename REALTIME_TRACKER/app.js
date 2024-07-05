const { ECDH } = require("crypto");
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);    

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("user connected");  
  socket.on("send-location", (location) => {
    console.log(`Location received: ${location.latitude}, ${location.longitude}`);

     io.emit("receive-location", {id: socket.id ,...location});


  });


  socket.on("disconnect", () => {
    io.emit("user disconnected",socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
