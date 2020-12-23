"use strict";
const cds = require("@sap/cds");

/**
 * Create Execution Log instance
 * @param {Object} executionLogData - supports both single entity and array of entities to be created. 
 */
module.exports.create = async (executionLogData) => {
  const date = new Date();
  const executionLogDatas = new Array();
  if (executionLogData instanceof Array) {
    for (const data of executionLogData) {
      if (!data || !data.HRF_RULE_NAME || !data.HRF_RULE_PACKAGE) {
        throw new Error("Invalid execution log data for creation");
      }
      data.CREATED_ON = date;
      executionLogDatas.push(data);
    }
  } else {
    if (!executionLogData || !executionLogData.HRF_RULE_NAME || !executionLogData.HRF_RULE_PACKAGE) {
      throw new Error("Invalid execution log data for creation");
    }
    executionLogDatas.push(executionLogData);
  }
  const srv = await cds.connect.to("ExecutionLogService");
  const { ExecutionLog } = srv.entities;

  return await srv.run(cds.ql.INSERT.into(ExecutionLog).entries(...executionLogDatas));
};

/**
 * Update Execution Log instance
 * @param {Object} executionLogData
 */
module.exports.update = async (executionLogData) => {
  if (!executionLogData || !executionLogData.ID) {
    throw new Error("Invalid execution log data for update");
  }
  const srv = await cds.connect.to("ExecutionLogService");
  const { ExecutionLog } = srv.entities;
  return await srv.run(cds.ql.UPDATE(ExecutionLog).set(executionLogData).where({ ID: executionLogData.ID }));
};

/**
 * Delete Execution Log instance
 * @param {Object} executionLogData
 */
module.exports.delete = async (executionLogData) => {
  if (!executionLogData || !executionLogData.ID) {
    throw new Error("Invalid execution log data for deletion");
  }
  const srv = await cds.connect.to("ExecutionLogService");
  const { ExecutionLog } = srv.entities;
  return await srv.run(cds.ql.DELETE.from(ExecutionLog).where({ ID: executionLogData.ID }));
};
