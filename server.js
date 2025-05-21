const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const articlesRouter = require("./api/articles/articles.router");
const usersController = require("./api/users/users.controller");
const authMiddleware = require("./middlewares/auth");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  transports: ['websocket', 'polling']
});

const socketHandler = (socket) => {
  console.log("a user connected");

  if (process.env.NODE_ENV !== 'test') {
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  }
};

io.on("connection", socketHandler);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/users", authMiddleware, userRouter);
app.post("/login", usersController.login);

app.use("/api/articles", articlesRouter);

app.use("/", express.static("public"));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status);
  res.json({
    status,
    message,
  });
});

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = {
  app,
  server,
};