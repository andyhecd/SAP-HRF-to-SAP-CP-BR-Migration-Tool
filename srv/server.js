/* eslint-disable no-console */
"use strict";

const path = require("path");
const httpStatus = require("http-status-codes");
const hdbext = require("@sap/hdbext");
const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
// Enable the token from xsuaa.
const JWTStrategy = require("@sap/xssec").JWTStrategy;
const passport = require("passport");
const express = require("express");
const app = express();

const OdataServer = require("./lib/OdataServer");
const convert = require('./routes/converter');
const service = require('./routes/services');

/**
 * Start server instance
 */
async function start() {
  const defaultPortNum = 3000;
  const port = process.env.PORT || defaultPortNum;

  app.use(
    express.json({
      limit: "10mb"
    })
  );
  app.use(
    express.urlencoded({
      extended: false
    })
  );

  if (process.env.NODE_ENV !== "development") {
    // Configure xsuaa with passport authentication middleware
    const uaaConfig = xsenv.cfServiceCredentials({
      tag: "xsuaa"
    });

    passport.use(new JWTStrategy(uaaConfig));
    app.use(passport.initialize());
    app.use(
      passport.authenticate("JWT", {
        session: false
      })
    );
  }

  // Middleware hdbext
  // Configure hana middleware
  const hanaConfig = xsenv.cfServiceCredentials({
    tag: "trp4_migr_tool_db"
  });
  // set schema for synonymGeneration
  global.__schema = hanaConfig.schema;
  app.use(hdbext.middleware(hanaConfig));

  // Register CAP odata services and exception process handler
  const serviceName = "ExecutionLogService";
  const servicePath = "sap/tm/trp/service/odata";
  const serviceImplPath = path.join(
    __dirname,
    "odata_model/ExecutionLogService.js"
  );

  // eslint-disable-next-line object-curly-newline
  await new OdataServer({ serviceName, servicePath, serviceImplPath })
    .serve(app)
    .catch((err) => {
      console.error(`Failed to register Migration tool odata services, with error ${err}`);
    });

  // Register Storefront Service API
  app.use("/sap/tm/trp/services/hrftocpbr", convert);
  app.use("/sap/tm/trp/services", service);

  app.use(function (req, res, next) {
    const error = new Error(httpStatus.getStatusText(httpStatus.NOT_FOUND));
    error.status = httpStatus.NOT_FOUND;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).send({
      error: {
        status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
        message:
          error.message ||
          httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)
      }
    });
  });

  app.listen(port, () => {
    console.log(`listening on port ${port}.`);
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
