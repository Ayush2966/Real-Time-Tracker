const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const helmet = require('helmet');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        scriptSrc: [
          "*"
        ],
        imgSrc: [
            "*"
        ]
      },
    })
  );

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle incoming messages from the client
    socket.on("send-location", function(data){
     io.emit("received-location", {id: socket.id, ...data});
    });
    
    socket.on("disconnect", function(){
      io.emit("user-disconnected", socket.id);
    })
});

app.get("/", (req, res) => {
    res.render("index");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});