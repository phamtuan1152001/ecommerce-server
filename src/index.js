const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const route = require("./routes");
const db = require("./config/db");
const scheduler = require("./scheduler")

/*  */
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});

///Handle khi có connect từ client tới
socketIo.on("connection", (socket) => {
  // console.log("New client connected " + socket.id);

  socket.on('clientAcceptAdminOfferCustomizedProduct', (data) => {
    socketIo.emit('notification', data)
  });

  socket.on('reviewCustomizedProduct', (data) => {
    // console.log("reviewCustomizedProduct")
    socketIo.emit('notiForReviewCustomizedProduct', data)
  });

  socket.on('createCustomizedProductClient', (data) => {
    // console.log("createCustomizedProductClient")
    socketIo.emit('notification', data)
  });

  socket.on('createOrder', (data) => {
    socketIo.emit('notification', data)
  });

  socket.on('updateStatusOrderClient', (data) => {
    // console.log("data", data)
    socketIo.emit('getNewNotificationsInClient', data)
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Khi client disconnect thì log ra terminal.
  });
});
/*  */

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// const bodyParser = require("body-parser");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Connect db mongoose
db.connect();

// Set up cors
app.use(
  cors({
    origin: "*",
    // origin: 'http://localhost:5173',
    // credentials: true
  })
);

// Middlewares
app.use(morgan("dev"));

// HTTP logger
app.use(morgan("combined"));

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(express.json({ limit: "50mb" }));

// Routes
route(app);

// scheduler
scheduler()

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Set up localhost
server.listen(process.env.PORT || 3002, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
