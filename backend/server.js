// server.js

const Koa = require("koa");
const dotenv = require("dotenv");
const Router = require("koa-router");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("@koa/cors");
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const server = http.createServer(app.callback());
const router = new Router();

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

// CORS
app.use(bodyParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowMethods: ["POST"],
  })
);

router.post("/push-data", async (ctx) => {
  const { data } = ctx.request.body;
  console.log(data);
  io.emit("data", data);

  ctx.status = 200;
  ctx.body = "Data pushed to WebSocket clients";
});

app.use(router.routes());
app.use(router.allowedMethods());

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
