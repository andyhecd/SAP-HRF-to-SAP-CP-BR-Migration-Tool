"use strict";

const bodyConversion = require('./bodyConversion');
const headerConversion = require('./headerConversion');
const segmentIdConversion = require('./segmentIdConversion');
const rowConversion = require('./rowConversion');


/**
 * Converts the comple HRF rule to CPBR rule
 * @param {*} hrfRule - object: {}
 * @param {*} cpbr - object: {}
 */
var converter = async function (hrfRule, projectId, hrfRuleName) {
    try {
        var cpbrRuleOutput = {};
        var cpbrRuleInfo = {};
        var columnSegmentIdList = [];
        var inputTableName = hrfRule.output.embeddedServices[0].executionContext.dataObject.name;
        var outputTableName = hrfRule.output.output;

        //get the object Id's and Attribute id's by passing the output table name and input table name
        columnSegmentIdList = await segmentIdConversion(projectId, inputTableName, outputTableName);
        if (!columnSegmentIdList[0] || !columnSegmentIdList[1]) {
            throw new Error("[HRF Rule Conversion] Data Object used for Input / Result are not created. Kindly create the Data Objects!")
        }

        // HRF rule body conversion 
        var cpbrRule = bodyConversion(hrfRule.output, projectId, hrfRuleName, columnSegmentIdList[1]);
        cpbrRuleOutput = cpbrRule;

        // HRF rule header conversion 
        cpbrRule = headerConversion(hrfRule.output.ruleBody.content.headers, columnSegmentIdList[2]);
        cpbrRuleOutput.DecisionTable.Column = cpbrRule.Column;

        // HRF rule row conversion 
        cpbrRule = rowConversion(hrfRule.output.ruleBody.content);
        cpbrRuleOutput.DecisionTable.Row = cpbrRule.Row;
        cpbrRuleOutput.DecisionTable.Cell = cpbrRule.Cell;

        cpbrRuleInfo.ruleId = '';
        cpbrRuleInfo.inputId = columnSegmentIdList[0];
        cpbrRuleInfo.resultId = columnSegmentIdList[1];
        cpbrRuleInfo.ruleserviceId = '';
        cpbrRuleInfo.rulesetId = '';

        return [cpbrRuleOutput, cpbrRuleInfo];
    }
    catch (e) {
        throw e;
    }


}


module.exports = converter;