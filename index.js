const { logger } = require("./server/lib/log");
const app = require("./server/app");

// Log out any error that may have been lost
process.on("unhandledRejection", function(reason /*, promise*/) {
  logger.error("unhandledRejection", reason, reason.stack);
});

const port = 9595;
const server = app.listen(port, function() {
  logger.info(`Server listening on port ${port}!`);
});

process.on("SIGINT", function() {
  logger.info("Received SIGINT, gracefully shutting down");
  server.close();
  process.exit();
});

module.exports = server;
