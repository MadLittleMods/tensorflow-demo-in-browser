const path = require("path");
const express = require("express");
const router = express.Router();

const webpackMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");

router.use(
  "/js",
  webpackMiddleware(webpack(require("../webpack.config")), {
    logLevel: "warn",
    lazy: false,
    watchOptions: {
      aggregateTimeout: 400
    },
    //publicPath: "/_s/l/js/",
    stats: {
      colors: true
    }
  })
);

router.use(
  express.static(path.join(__dirname, "../public/static"), {
    maxAge: 0
  })
);

module.exports = router;
