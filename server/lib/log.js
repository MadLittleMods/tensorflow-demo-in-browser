const Promise = require('bluebird');
const path = require('path');
const fs = require('fs-extra');
const readFile = Promise.promisify(fs.readFile);
const winston = require('winston');

const config = require('./config');
const logPath = path.join(config.get('logDir'), `./log-${Date.now()}.txt`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: logPath,
      level: config.get('fileLogLevel')
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: config.get('logLevel')
    })
  ]
});

function getLogs() {
  return readFile(logPath, 'utf8');
}

module.exports = {
  logger,
  getLogs
};
