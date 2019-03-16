const express = require("express");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 4000;

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

  console.log("set the cookie");
  app.use(function(req, res, next) {
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
  longpoll.create("/poll");

  router.get("/api/rooms", function(req, res, next) {
    // find the last room in the DB.

    Rooms.find({})
      .sort({ time: -1 })
      .limit(6)
      .exec(function(err, rooms) {
        if (err) return res.status(500).end(err);
        return res.json(rooms);
      });
  });

  router.get("/rooms", isAuthenticated, function(req, res, next) {
    // find the last room in the DB.

    return res.redirect("/");
  });

  router.post("/api/joinRoom", function(req, res, next) {
    let id = req.body._id;

    Rooms.findOne({ _id: new mongoose.Types.ObjectId(id) }, function(
      err,
      room
    ) {
      let user_list = room.users;
      let username = req.session.user._id;
      var pos = user_list.indexOf(username);
      if (pos < 0) {
        room.users.push(username);

        Rooms.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id) },
          { users: room.users },
          function(err, result) {
            if (err) return res.status(500).end(err);
            return;
          }
        );
      }
    });
  });

  router.post("/api/Addroom", function(req, res, next) {
    let owner = req.session.user._id;
    let current_users = req.body.current_users;
    console.log("adding rooms");
    // find the last room in the DB.
    Rooms.insertMany({
      owner: owner,
      current_users: current_users,
      users: [owner]
    });
    Rooms.find({})
      .sort({ time: -1 })
      .limit(6)
      .exec(function(err, rooms) {
        if (err) return res.status(500).end(err);
        longpoll.publish("/poll", json(rooms));
        return res.json(rooms);
      });
  });

  router.delete("/api/room/:id", function(req, res, next) {
    let id = req.params.id;
    // find the last room in the DB.
    Rooms.deleteMany({ _id: new mongoose.Types.ObjectId(id) }, function(
      err,
      r
    ) {
      if (err) return res.status(500).end(err);
    });
    Rooms.find({})
      .sort({ time: -1 })
      .limit(6)
      .exec(function(err, rooms) {
        if (err) return res.status(500).end(err);
        return res.json(rooms);
      });
  });

  router.post("/api/signin", function(req, res, next) {
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
      return res.json("hello");
    });
  });

  router.get("/signin", function(req, res, next) {
    return res.redirect("/");
  });
  router.get("/register", function(req, res, next) {
    return res.redirect("/");
  });

  router.get("/api/signout/", function(req, res, next) {
    req.session.destroy();

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("username", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      })
    );
    return res.json("haha");
  });

  router.get("/api/user", function(req, res, next) {
    if (req.session.user) {
      return res.json(req.session.user);
    } else {
      return res.status(401).end("Not sign in");
    }
  });

  router.post("/api/register", function(req, res, next) {
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

  // append /api for our http requests
  app.use("/", router);
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
