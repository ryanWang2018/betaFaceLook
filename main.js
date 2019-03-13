const { createServer } = require("http");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const express = require("express");

const normalizePort = port => parseInt(port, 10);

const PORT = normalizePort(process.env.PORT || 5000);
const app = express();
const dev = app.get("env") !== "production";

if (!dev) {
  app.disable("x-powered-by");
  app.use(compression());
  app.use(morgan("common"));

  app.use(express.static(path.resolve(__dirname, "build")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirnam, "build", "index.html"));
  });
}

if (dev) {
  app.use(morgan("div"));
}

const server = createServer(app);
server.listen(PORT, err => {
  if (err) throw err;
  console.log("servier started!");
});
