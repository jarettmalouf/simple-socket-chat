const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = process.env.PORT || 3000;

let users = [];
let connections = [];

server.listen(port, () => console.log("server running..."));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

io.sockets.on("connection", (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} socket(s) connected`);

  // disconnect
  socket.on("disconnect", (data) => {
    users.splice(users.indexOf(socket.username), 1);
    udpateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} socket(s) connected`);
  });

  // send message
  socket.on("send message", (data) => {
    console.log(data);
    io.sockets.emit("new message", { msg: data, user: socket.username });
  });

  // new user
  socket.on("new user", (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    udpateUsernames();
  });

  udpateUsernames = () => {
    io.sockets.emit("get users", users);
  };
});
