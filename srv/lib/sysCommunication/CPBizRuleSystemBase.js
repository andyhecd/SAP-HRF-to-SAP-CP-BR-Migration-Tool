const got = require("got");
const constants = require("./constants");
const httpStatusCodes = require("http-status-codes");

class CPBizRuleSystemBase {
  constructor() {
    const userProvidedSrcs = JSON.parse(process.env.VCAP_SERVICES)["user-provided"];
    let systemCredential = userProvidedSrcs.find((ups) => ups.name === constants.HRF_SYSTEM_UPS).credentials;

    // this.ruleSrvAPI = process.env[constants.CPBR_ENDPOINT_RULE_SERVICE_API_KEY];
    this.ruleSrvAPI = systemCredential[constants.CPBR_ENDPOINT_RULE_SERVICE_API_KEY];
    this.clientID = systemCredential[constants.CPBR_SYSTEM_ACCESS_CLIENT_ID_KEY];
    this.clientSecret = systemCredential[constants.CPBR_SYSTEM_ACCESS_CLIENT_SECRET_KEY];
    this.tokenAPI = systemCredential[constants.CPBR_SYSTEM_ACCESS_TOKEN_ADDRESS_KEY];
    // if (!this.ruleSrvAPI) {
    if (!this.ruleSrvAPI || !this.clientID || !this.clientSecret || !this.tokenAPI) {
      throw new Error("Invalid CP Biz Rules system communication configurations");
    }
  }

  /**
   * Get all projects with expression language 1.0 only
   * @returns {Array} all projects data as array, sample data structure [{Id:"project id", Name:"project name", Description:[],ChangedBy:"",ChangedOn:""}]
   */
  async getExpLangV1Projects() {
    const getOpts = this._buildCommonReqOption();
    getOpts.method = constants.HTTP_METHOD_GET;
    const getProjectsUri = "projects";
    const getProjectsResult = await this._executeAPICalling(getProjectsUri, getOpts);
    if (getProjectsResult instanceof Error) {
      throw new Error(getProjectsResult.message);
    }
    const filteredProjects = new Array();
    if (getProjectsResult && getProjectsResult.body instanceof Array) {
      getProjectsResult.body.forEach((project) => {
        // check if 2.0 expression language
        let isNotExpLang1 = false;
        if (project.Annotations && project.Annotations instanceof Array) {
          isNotExpLang1 = project.Annotations.some((annotation) => {
            //  Expression language 1.0 does not have the this annotation.
            return annotation.Key === "com.sap.rules.expression.language" && annotation.Value !== "1.0";
          });
        }
        if (!isNotExpLang1) {
          filteredProjects.push({
            Id: project.Id,
            Name: project.Name,
            Description: project.Description,
            ChangedBy: project.ChangedBy,
            ChangedOn: project.ChangedOn
          });
        }
      });
    } else {
      throw new Error("Failed to get projects data");
    }
    return { body: filteredProjects };
  }

  /**
   * Retrieve all the data objects of a project
   * @param {String} projectID
   * @returns {Array} list of data objects
   */
  async getDataObjects(projectID) {
    if (!projectID) {
      throw new Error("Mandatory project ID for retrieving data objects");
    }
    const getOpts = this._buildCommonReqOption();
    getOpts.method = constants.HTTP_METHOD_GET;
    const getDataObjUri = `projects/${projectID}/dataobjects`;
    return await this._executeAPICalling(getDataObjUri, getOpts);
  }

  /**
   * Get dedicated CPBR rule content by given projectID and ruleID
   * @param {String} projectID
   * @param {String} ruleID
   * @returns {Object} Entire Rule Content
   */
  async getRule(projectID, ruleID) {
    if (!projectID || !ruleID) {
      throw new Error("Mandatory project ID and rule ID for getting rule details");
    }
    const getOpts = this._buildCommonReqOption();
    getOpts.method = constants.HTTP_METHOD_GET;
    const getRuleUri = `projects/${projectID}/rules/${ruleID}`;
    return await this._executeAPICalling(getRuleUri, getOpts);
  }

  /**
   * Creates a rule for the project with the specified rule data
   * @param {Object} ruleData
   * @returns {Object} created rule content, the same value just like calling getRule
   */
  async createRule(ruleData) {
    if (!ruleData || !ruleData instanceof Object || !ruleData["Project"]) {
      throw new Error("Invalid project ID and rule data for rule creation");
    }
    const projectID = ruleData["Project"];
    const postOpts = this._buildCommonReqOption();
    postOpts.method = constants.HTTP_METHOD_POST;
    postOpts.json = ruleData;
    const createRuleUri = `projects/${projectID}/rules`;
    return await this._executeAPICalling(createRuleUri, postOpts);
  }

  /**
   * Creates a rule service for the project with the specified rule service data.
   * @param {Object} ruleServiceData
   * @returns {Object} created rule service content
   */
  async createRuleService(ruleServiceData) {
    if (!ruleServiceData || !ruleServiceData instanceof Object || !ruleServiceData["Project"]) {
      throw new Error("Invalid project ID and rule service data for creation");
    }
    const projectID = ruleServiceData["Project"];
    const postOpts = this._buildCommonReqOption();
    postOpts.method = constants.HTTP_METHOD_POST;
    postOpts.json = ruleServiceData;
    const createRuleServiceUri = `projects/${projectID}/ruleservices`;
    return await this._executeAPICalling(createRuleServiceUri, postOpts);
  }

  /**
   * Creates a ruleset for the project with the specified rule set data
   * @param {Object} ruleSetData
   * @returns {Object} created rule set content
   */
  async createRuleSet(ruleSetData) {
    if (!ruleSetData || !ruleSetData instanceof Object || !ruleSetData["Project"]) {
      throw new Error("Invalid project ID and rule set data for creation");
    }
    const projectID = ruleSetData["Project"];
    const postOpts = this._buildCommonReqOption();
    postOpts.method = constants.HTTP_METHOD_POST;
    postOpts.json = ruleSetData;
    const createRuleSetUri = `projects/${projectID}/rulesets`;
    return await this._executeAPICalling(createRuleSetUri, postOpts);
  }

  /**
   * Activates a rule service with the specified rule service ID,
   * and all its entities such as data objects, rules and rulesets within the project.
   * @param {String} ruleServiceID
   * @returns no specific return, active rule service successfully if no error
   */
  async activeRuleService(ruleServiceID) {
    if (!ruleServiceID) {
      throw new Error("Invalid rule service ID for activation");
    }
    const putOpts = this._buildCommonReqOption();
    putOpts.method = constants.HTTP_METHOD_PUT;
    const activeRuleSrvUri = `ruleservices/${ruleServiceID}/activation`;
    return await this._executeAPICalling(activeRuleSrvUri, putOpts);
  }

  /**
   * Activates a project with the specified project ID,
   * and all its entities such as data objects, rules, rulesets and rule services.
   * @param {String} projectID
   * @returns no specific return, active project successfully if no error
   */
  async activeProject(projectID) {
    if (!projectID) {
      throw new Error("Invalid project ID for activation");
    }
    const putOpts = this._buildCommonReqOption();
    putOpts.method = constants.HTTP_METHOD_PUT;
    const activeProjectUri = `projects/${projectID}/activation`;
    return await this._executeAPICalling(activeProjectUri, putOpts);
  }

  /**
   * Migrates rule expressions of a project from expression language 1.0 to 2.0
   * @param {String} projectID
   * @returns {Object} migrated project content
   */
  async migrateProject(projectID) {
    if (!projectID) {
      throw new Error("Invalid project ID for migration expression language");
    }
    const postOpts = this._buildCommonReqOption();
    postOpts.method = constants.HTTP_METHOD_POST;
    postOpts.json = { Project: projectID };
    const migrateProUri = "migrations";
    return await this._executeAPICalling(migrateProUri, postOpts);
  }

  _buildCommonReqOption() {
    return {
      headers: {
        accept: constants.HTTP_MSG_JSON,
        Authorization: undefined
      },
      retry: {
        limit: 2,
        methods: [constants.HTTP_METHOD_GET, constants.HTTP_METHOD_POST, constants.HTTP_METHOD_PUT],
        statusCodes: [httpStatusCodes.UNAUTHORIZED]
      },
      prefixUrl: this.ruleSrvAPI,
      responseType: constants.HTTP_RESPONSE_TYPE,
      method: undefined,
      context: { token: undefined }
    };
  }

  async _executeAPICalling(url, options) {
    const executionContext = got.extend({
      hooks: {
        beforeRequest: [
          async (options) => {
            if (!options.context || !options.context.token) {
              const token = await this._getAccessToken();
              if (!token) {
                throw new Error("Token required");
              }
              //check if retry set
              if (!options.retry || !options.retry.statusCodes) {
                throw new Error("Retry mechanism should have been configured");
              }
              options.context.token = token;
            }
            options.headers.Authorization = options.context.token;
          }
        ],
        beforeRetry: [
          (options, error, retryCount) => {
            // catch unauthorized exception and clean overdue token
            // _buildCommonReqOption limit retrying 2 times with 401 error only
            options.context.token = undefined;
            options.headers.Authorization = undefined;
            console.debug("Access token is overdue, refresh token and retry");
          }
        ]
      }
    });
    return await executionContext(url, options);
  }

  async _getAccessToken() {
    // const clientID = process.env[constants.CPBR_SYSTEM_ACCESS_CLIENT_ID_KEY];
    // const clientSecret = process.env[constants.CPBR_SYSTEM_ACCESS_CLIENT_SECRET_KEY];
    // const tokenAPI = process.env[constants.CPBR_SYSTEM_ACCESS_TOKEN_ADDRESS_KEY];
    // if (!clientID || !clientSecret || !tokenAPI) {
    //   throw new Error("Invalid CP Biz Rules system communication configurations");
    // }
    const reqBodyGrantType = "grant_type=client_credentials";
    const reqBodyClientID = `client_id=${encodeURIComponent(this.clientID)}`;
    const reqBodyClientSecret = `client_secret=${encodeURIComponent(this.clientSecret)}`;
    const getTokenOpts = {
      headers: {
        accept: constants.HTTP_MSG_JSON,
        "content-type": constants.HTTP_MSG_XFRM
      },
      responseType: constants.HTTP_RESPONSE_TYPE,
      method: constants.HTTP_METHOD_POST,
      body: `${reqBodyGrantType}&${reqBodyClientID}&${reqBodyClientSecret}`
    };

    const getTokenResponse = await got(this.tokenAPI, getTokenOpts);
    if (getTokenResponse instanceof Error) {
      throw new Error(getTokenResponse.message);
    }
    if (!getTokenResponse.body || !getTokenResponse.body.token_type || !getTokenResponse.body.access_token) {
      throw new Error("Invalid access token response");
    }
    return `${getTokenResponse.body.token_type} ${getTokenResponse.body.access_token}`;
  }
}

module.exports = new CPBizRuleSystemBase();
