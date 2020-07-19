const path = require("path");
const express = require("express");
const logger = require("morgan");

const config = require("./lib/config");
const { getLogs } = require("./lib/log");

const app = express();
if (config.get("logLevel") === "debug") {
  app.use(logger("dev"));
}

app.get("/", function(req, res) {
  //res.status(200).send(`Server is up!`);

  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/server-log", function(req, res) {
  getLogs()
    .then(logs => {
      res
        .status(200)
        .set("Content-Type", "text/plain")
        .send(logs);
    })
    .catch(err => {
      res
        .status(500)
        .set("Content-Type", "text/plain")
        .send("Error", err, err.stack);
    });
});

app.use("/static", require("./express-static"));

module.exports = app;
