"use strict";
const constants = require("./constants");
const got = require("got");

class HRFRuleSystemBase {
  constructor() {
    let hrfSystemCredential, hrfSystemHost;
    try {
      const userProvidedSrcs = JSON.parse(process.env.VCAP_SERVICES)["user-provided"];
      hrfSystemCredential = userProvidedSrcs.find((ups) => ups.name === constants.HRF_SYSTEM_UPS).credentials;
      // hrfSystemHost = process.env[constants.HRF_SYSTEM_HOST_KEY];
      hrfSystemHost = hrfSystemCredential.HRF_SYSTEM_HOST;
    } catch (error) {
      throw new Error("Failed to load HRF system communication configurations");
    }

    // if (!hrfSystemCredential.user || !hrfSystemCredential.password || !hrfSystemHost) {
    if (!hrfSystemCredential.HRF_SYSTEM_USER || !hrfSystemCredential.HRF_SYSTEM_PASSWORD || !hrfSystemHost) {
      throw new Error("Invalid HRF system communication configurations");
    }

    // this.username = hrfSystemCredential.user;
    // this.password = hrfSystemCredential.password;
    this.username = hrfSystemCredential.HRF_SYSTEM_USER;
    this.password = hrfSystemCredential.HRF_SYSTEM_PASSWORD;
    this.host = hrfSystemHost;
  }

  /**
   * Get all the Rules from the HRF repository
   * @returns {Object} listofHRFRules, return value data structure {d:{results:[{ID:"123",PACKAGE:"sample.package", NAME:"ruleName"}]}}
   */
  async getAllHRFRules() {
    const gotGetOpts = {
      headers: {
        accept: constants.HTTP_MSG_JSON
      },
      responseType: constants.HTTP_RESPONSE_TYPE,
      method: constants.HTTP_METHOD_GET,
      prefixUrl: this.host,
      username: this.username,
      password: this.password,
      searchParams: {
        $select: "ID,PACKAGE,NAME"
      }
    };
    return await got(constants.HRF_ENDPOINT_ALL_RULES, gotGetOpts);
  }

  /**
   * Get Rule details for a single HRF Rule
   * @param {String} rulePackage
   * @param {String} ruleName
   * @returns {Object} detialed HRF Rule content
   */
  async getHRFRule(rulePackage, ruleName) {
    if (!rulePackage || !ruleName) {
      throw new Error("Mandatory package and name for getting dedicated hrf rule");
    }
    const gotGetOpts = {
      headers: {
        accept: constants.HTTP_MSG_JSON
      },
      responseType: constants.HTTP_RESPONSE_TYPE,
      method: constants.HTTP_METHOD_GET,
      prefixUrl: this.host,
      username: this.username,
      password: this.password
    };
    return await got(`${constants.HRF_ENDPOINT_RULE_CONTENT}/${rulePackage}/${ruleName}`, gotGetOpts);
  }
}
module.exports = new HRFRuleSystemBase();
