const express = require("express");
const path = require("path");

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 4000;

//const debug = require('debug')('myApp:someComponent');
//debug('Here is a pretty object %o', { someObject: true });

// Multi-process to utilize alnpml CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${
        worker.process.pid
      } exited: code ${code}, signal ${signal}`
    );
  });
} else {
  // Priority serve any static files.

  /*jshint esversion: 6 */
  const mongoose = require("mongoose");
  const express = require("express");
  const bodyParser = require("body-parser");
  const logger = require("morgan");
  const fs = require("fs");
  const path = require("path");
  const validator = require("validator");
  const crypto = require("crypto");
  const cookie = require("cookie");
  const session = require("express-session");

  const app = express();
  const router = express.Router();

  // adding longpoll
  const longpoll = require("express-longpoll")(router);
  var longpollWithDebug = require("express-longpoll")(app, { DEBUG: true });

  const User = require("./models/users");
  const Rooms = require("./models/rooms");
  app.use(express.static(path.resolve(__dirname, "../react-ui/build")));

  // this is our MongoDB database
  const dbRoute =
    "mongodb+srv://jun:linjun9@facelook-jwbju.mongodb.net/facelook";

  // connects our back end code with the database
  mongoose.connect(dbRoute, { useNewUrlParser: true });

  let db = mongoose.connection;

  db.once("open", () => console.log("connected to the database"));

  // checks if connection with the database is successful
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  // (optional) only made for logging and
  // bodyParser, parses the request body to be a readable json format
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger("dev"));

  app.use(function(req, res, next) {
    var allowedOrigins = [
      "https://hidden-cliffs-49484.herokuapp.com",
      "http://localhost:3001",
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:4000"
    ];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  // ------------------------
  app.use(function(req, res, next) {
    console.log("HTTPS request", req.method, req.url, req.body);
    next();
  });

  // security
  function generateSalt() {
    return crypto.randomBytes(16).toString("base64");
  }

  function generateHash(password, salt) {
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    return hash.digest("base64");
  }

  app.use(
    session({
      secret: "please change this secret",
      resave: false,
      saveUninitialized: true
    })
  );

  let isAuthenticated = function(req, res, next) {
    if (!req.session.user) return res.status(401).end("access denied");
    next();
  };

  let checkUsername = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username))
      return res.status(400).end("bad input");
    next();
  };

  let sanitizeContent = function(req, res, next) {
    req.body.content = validator.escape(req.body.content);
    next();
  };

  let checkId = function(req, res, next) {
    if (!validator.isAlphanumeric(req.params.id))
      return res.status(400).end("bad input");
    next();
  };

  app.use(function(req, res, next) {
    console.log("req session ", req.session);
    req.user = "user" in req.session ? req.session.user : null;

    let username = req.user ? req.user._id : "";
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
      })
    );
    console.log("HTTP request", username, req.method, req.url, req.body);
    next();
  });

  // adding longpolling
  //longpoll.create("/poll");
  app.get("/", function(req, res) {
    console.log("hello");
    res.render("index");
  });

  router.get("/rooms/", isAuthenticated, function(req, res, next) {
    // find the last room in the DB.
    Rooms.find({})
      .sort({ time: -1 })
      .limit(6)
      .exec(function(err, rooms) {
        if (err) return res.status(500).end(err);

        return res.json(rooms);
      });
  });

  // add room
  router.post("/room/", isAuthenticated, function(req, res) {
    let id = req.user._id; // id is the owner id
    let users = [];
    Rooms.insertMany({ _id: id, users: users }, function(err, insertedRoom) {
      if (err) return res.status(500).end("Failed creating new room");
      return res.json(insertedRoom[0]);
    });
  });

  router.delete("/room/:id/", isAuthenticated, function(req, res, next) {
    let id = req.params.id;
    // find the last room in the DB.
    Rooms.find({ _id: id }, function(err, room) {
      if (err) return res.status(500).end(err);
      if (!room)
        return res.status(401).end("We do not find the matched room id.");
      if (id !== req.user._id) return res.status(401).end("Access denied.");
      Rooms.deleteOne({ _id: id }, function(err, deleted) {
        if (err) return res.status(500).end(500);

        return res.json("room deleted");
      });
    });
  });

  router.post("/register", function(req, res, next) {
    if (!("username" in req.body))
      return res.status(400).end("username is missing");
    if (!("password" in req.body))
      return res.status(400).end("password is missing");
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var salt = generateSalt();
    var hash = generateHash(password, salt);

    // insert new user into the database
    User.findOne({ _id: username }, function(err, user) {
      if (err) return res.status(500).end(err);
      if (user)
        return res
          .status(401)
          .end(username + " exists already, try another name");
      User.insertMany(
        [
          {
            _id: username,
            hash: hash,
            salt: salt,
            email: email,
            first_name: first_name,
            last_name: last_name
          }
        ],
        function(err, result) {
          if (err) {
            return res.status(500).end("insertion error");
          }
          return res.json(user);
        }
      );
    });
  });

  router.post("/signin/", function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ _id: username }, function(err, user) {
      if (err)
        return res.status(500).end("server error, please try again later.");
      if (!user) return res.status(401).end("user does not exist");
      if (user.hash !== generateHash(password, user.salt))
        return res.status(401).end("username and password do not match");
      req.session.user = user;

      // initialize cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("username", username, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7
        })
      );
      return res.json(user);
    });
  });

  router.get("/signout/", function(req, res, next) {
    req.session.destroy();

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("username", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      })
    );
    return res.json("user signed out");
  });

  router.get("/user", function(req, res, next) {
    if (req.session.user) {
      return res.json(req.session.user);
    } else {
      return res.status(401).end("Not sign in");
    }
  });

  // //enter room
  router.post("/room/:id/enter/", isAuthenticated, function(req, res, next) {
    let id = req.params.id;
    Rooms.findOne({ _id: id }, function(err, room) {
      if (err) return res.status(500).end(err);
      if (!room) return res.status(401).end("We do not find the match room.");
      if (room.users.includes(req.session.user._id))
        return res.status(404).end("bad request");
      room.users.push(req.session.user._id);
      Rooms.updateOne({ _id: id }, { users: room.users }, function(
        err,
        result
      ) {
        if (err) return res.status(500).end(err);
        req.session.room = room;
        return res.json(room);
      });
    });
  });

  //leave room
  router.post("/room/:id/leave/", isAuthenticated, function(req, res, next) {
    let id = req.params.id;
    console.log("leave room ", id);
    Rooms.findOne({ _id: id }, function(err, room) {
      if (err) return res.status(500).end(err);
      if (!room) return res.status(401).end("We do not find the match room.");
      if (!room.users.includes(req.session.user._id))
        return res.status(404).end("bad request");
      room.users.pull(req.session.user._id);
      if (room.users.length === 0) {
        Rooms.deleteOne({ _id: id }, function(err, deleted) {
          if (err) return res.status(500).end(500);
          return res.json("room deleted");
        });
      } else {
        let owner = id === req.user._id ? room.users[0] : rooms._id;
        Rooms.updateOne(
          { _id: id },
          { users: room.users, _id: owner },
          function(err, result) {
            if (err) return res.status(500).end(err);
            req.session.room = null;
            return res.json(room);
          }
        );
      }
    });
  });

  let WebSocket = require("ws");

  // append /api for our http requests
  app.use("/api", router);
  // app.user("")

  const http = require("http");

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  // Broadcast to all.
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  const connectionList = [];
  const players = [];
  let timer = null;
  let timeleft = 60;
  let roomState = {
    players: [],
    timeleft: timeleft,
    gameState: "",
    winners: []
  };
  let emojiDir = __dirname + "/static/media/emojis";

  // console.log(emojis);
  wss.on("connection", (ws, req) => {
    ws.isAlive = true;

    fs.readdir(emojiDir, (err, data) => {
      if (err) console.log(err);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "emojis",
            from: "admin",
            emojiList: data,
            path: emojiDir
          })
        );
      }
    });

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("open", function open() {
      console.log("connected");
    });
    ws.on("message", function incoming(message) {
      let msg = "";
      try {
        msg = JSON.parse(message);
      } catch (e) {
        msg = "";
      }
      let type = msg ? msg.type : null;
      // let msg = JSON.parse(message.data);
      switch (type) {
        case "ready":
          // get the user from session instead of client data
          // add the client to the connection list
          connectionList.push({
            connection: ws,
            user: { playerId: msg.from, point: 0 }
          });
          // if two clients are both ready, send the start message to clients
          // and initiate the room state and send to clients
          let activeConnections = connectionList.filter(
            c => c.connection.readyState === WebSocket.OPEN
          );
          let numOfActiveConnection = activeConnections.length;

          let players = activeConnections.map(c => c.user);
          roomState.players = players;
          // if (numOfActiveConnection === 1) {
          //     roomState.gameState = "wait";
          //     if (ws.readyState === WebSocket.OPEN) {
          //         ws.send(JSON.stringify({
          //             type: "roomState",
          //             from: "admin",
          //             roomState: roomState
          //         }));
          //     }
          // } else
          if (numOfActiveConnection === 1) {
            roomState.gameState = "gamming";
            roomState.timeleft = 60;
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "roomState",
                    from: "admin",
                    roomState: roomState
                  })
                );
              }
            });
            let timeUpdater = setInterval(() => {
              roomState.timeleft = roomState.timeleft - 1;

              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "roomState",
                      from: "admin",
                      roomState: roomState
                    })
                  );
                }
              });
            }, 1000);
            setTimeout(() => {
              clearInterval(timeUpdater);
              roomState.gameState = "end";
              let maxPoint = Math.max.apply(
                Math,
                roomState.players.map(function(o) {
                  return o.point;
                })
              );

              let winners = roomState.players.filter(e => {
                return e.point === maxPoint;
              });
              roomState.winners = winners;
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "roomState",
                      from: "admin",
                      roomState: roomState
                    })
                  );
                  client.close();
                }
              });
            }, 60999);
          } else {
            // room full
            console.log("room is full");
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  from: "admin",
                  reason: "room is full"
                })
              );
            }
          }
          break;
        case "update":
          console.log("server recieve: update from " + msg.from);
          let targetPlayer = roomState.players.find(
            p => p.playerId === msg.from
          );
          targetPlayer.point++;

          // check username with session, if pass
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "roomState",
                  from: "admin",
                  roomState: roomState
                })
              );
            }
          });
          break;
        case "stop":
          console.log("server recieve: stop from " + msg.from);
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "stop",
                  from: "admin"
                })
              );
            }
          });
          break;
        default:
          //error
          ws.send(JSON.stringify("Bad Request: nice try"));
      }
    });
    ws.on("close", () => {
      console.log("disconnected");

      // let i = roomState.players.indexOf(req.user);
      // if (i > -1) {
      //     roomState.players.splice(i, 1);
      // }
      let last = wss.clients.size === 1 ? true : false;
      if (last && roomState.timeleft > 0) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "result",
                result: "win",
                reason: "your opponent leaves, you win!"
              })
            );
          }
        });
      }
    });

    setInterval(() => {
      wss.clients.forEach(ws => {
        if (!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping(null, false, true);
      });
    }, 5000);

    // ws.send('this is websocket server');
  });
  // append /api for our http requests
  app.use("/api", router);
  // app.user("")

  // app.get("*", function(request, response) {
  //   response.sendFile(
  //     path.resolve(__dirname, "../react-ui/public/", "index.html")
  //   );
  // });

  // launch our backend into a port
  app.listen(PORT, function() {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
