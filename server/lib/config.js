const path = require("path");
const argv = require("yargs").argv;

class Config {
  constructor() {
    this.data = {
      logLevel: argv.logLevel || "info",
      fileLogLevel: argv.fileLogLevel || "debug",
      logDir:
        argv.logDir || process.env["LOG_DIR"]
          ? path.resolve(
              __dirname,
              "../",
              argv.logDir || process.env["LOG_DIR"]
            )
          : path.resolve(__dirname, "../logs")
    };
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }
}

module.exports = new Config();
