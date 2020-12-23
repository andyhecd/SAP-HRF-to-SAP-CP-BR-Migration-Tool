/* eslint-disable max-lines */
/* eslint-disable no-shadow */
/* eslint-disable no-magic-numbers */
/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
"use strict";
const cds = require("@sap/cds");
const path = require("path");

let failedToConnectCDS = false;

/**
 * By default service implementation
 */
function CommmonServiceImplFun() {
  // TO-DO if necessary
}

/**
 * Utils to load SAP CAP cds difinitions and serve as odata v4 and v2
 */
class OdataServer {
  /**
   * The service name defined in .cds file; "all" by default.
   * @param {*} parameters.serviceName
   * The path odata service will serve at; "/sap/tm/trp/service/odata.xsodata" by default.
   * @param {*} parameters.servicePath
   * The path for serviveName related implementation; empty implementation by default.
   * @param {*} parameters.serviceImplPath
   */
  constructor(parameters) {
    const { serviceName, servicePath, serviceImplPath } = parameters || {};
    this.serviceName = serviceName || "all";
    this.servicePath = servicePath || "sap/tm/trp/service/odata";
    let odataServiceImpl;
    if (serviceImplPath) {
      odataServiceImpl = require(serviceImplPath);
    }
    this.serviceImpl =
      odataServiceImpl && odataServiceImpl instanceof Function
        ? odataServiceImpl
        : CommmonServiceImplFun;
  }

  /**
   *
   * @param {*} app - The express instance odata service will serve in; Mandatory input.
   * @param {*} port - express app port; default is process.env.PORT || 3000
   * @param {*} odataV2 - default value true to enable odata v2 parallelly
   */
  async serve(app) {
    try {
      if (failedToConnectCDS) {
        throw new Error("Failed to load cds model, please run cds build.");
      }
      if (app) {
        const cdsPath = cds.requires.db.model || "gen/csn.json";
        await cds.connect.to("db");
        await cds.load(cdsPath);
        // OData V4
        if (this.serviceName === "all") {
          const csn = require(path.resolve(cdsPath));
          const updatedCsn = Object.assign({}, csn);
          updatedCsn.definitions = Object.assign({}, csn.definitions);
          // eslint-disable-next-line max-depth
          for (const key of Object.keys(updatedCsn.definitions)) {
            // eslint-disable-next-line max-depth
            if (updatedCsn.definitions[key].kind === "service") {
              await cds.serve(key).at(`${this.servicePath}/${key}`).in(app);
              console.log(
                `[OData Service] Odata service v4 serve at: https://<host>:<port>/${this.servicePath}/${key}`
              );
            }
          }
        } else {
          await cds
            .serve(this.serviceName)
            .at(this.servicePath)
            .in(app)
            .with(this.serviceImpl);
          console.log(
            `[OData Service] Odata service v4 serve at: https://<host>:<port>/${this.servicePath}`
          );
        }
      }
    } catch (e) {
      if (e && e.code === "MODEL_NOT_FOUND") {
        failedToConnectCDS = true;
        throw new Error("Failed to load cds model, please run cds build");
      } else {
        throw new Error("Internal error upon building odata service");
      }
    }
  }
}

module.exports = OdataServer;
