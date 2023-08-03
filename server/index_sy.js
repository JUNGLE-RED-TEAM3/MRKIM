// ---- env
require("dotenv").config(!!process.env.CONFIG ? { path: process.env.CONFIG } : {});
// ---- dependencies
const OpenVidu = require("openvidu-node-client").OpenVidu;
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const express = require("express");
const app = express();
const server = http.createServer(app);

// Environment variable: PORT where the node server is listening
const SERVER_PORT = process.env.SERVER_PORT || 5050;
// Environment variable: URL where our OpenVidu server is listening
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:8443';
// Environment variable: secret shared with our OpenVidu server
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'NAMANMU';
// mongoDB
const { MONGO_URI } = process.env;

// ---- openvidu env
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// ---- middleware
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- MongoDB connect
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(e => console.error(e));

// ---- socket io
const io = socketIO(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('startDrawing', (data) => {
    console.log(data);
    socket.broadcast.emit('startDrawing', data);  // Broadcast 'startDrawing' event
  });

  socket.on('drawing', (data) => {
    console.log(data);
    socket.broadcast.emit('drawing', data);
  });

  socket.on('endDrawing', () => {
    socket.broadcast.emit('endDrawing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas');
  });
});

// ---- public 안에 있는 static 파일들을 '/' 루트 기준으로 제공
app.use(express.static(__dirname + '/public'));

// ---- Server Application Connect
server.listen(SERVER_PORT, () => {
  console.log("Application started on port: ", SERVER_PORT);
  console.warn('Application server connecting to OpenVidu at ' + OPENVIDU_URL);
});

// ---- Create Sessions
app.post("/api/sessions", async (req, res) => {
  const session = await openvidu.createSession(req.body);
  res.send(session.sessionId);
});

app.post("/api/sessions/:sessionId/connections", async (req, res) => {
  const session = openvidu.activeSessions.find(
    (s) => s.sessionId === req.params.sessionId
  );
  if (!session) {
    res.status(404).send();
  } else {
    const connection = await session.createConnection(req.body);
    res.send(connection.token);
  }
});

process.on('uncaughtException', err => console.error(err));