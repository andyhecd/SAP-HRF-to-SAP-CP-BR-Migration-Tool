const express = require("express");
const router = express.Router();

const hrfRuleSysBase = require("../lib/sysCommunication/HRFRuleSystemBase");
const cpbrRSysBase = require("../lib/sysCommunication/CPBizRuleSystemBase");
const hrfToBrfConversion = require('./../lib/api/conversionHrfToCpbr');
const ruleServiceCreate = require('../lib/api/ruleServiceCreation');
const ruleSetCreate = require('../lib/api/ruleSetCreation');
const exeLogOperator = require("../lib/exeLogOperator");


router.post("/convert", async (req, res) => {
    try {
        let result = await exeLogOperator.create(req.body.Rules);
        if (req.body.Rules.length == 1) {
            result = new Array(result)
        }
        convert(result, req.body.ProjectId, req.body.Annotations);
        res.status(200).send("Migration Started");
    }
    catch (e) {
        res.status(500).send("Migration failed");
    }
});

async function convert(params, projectId, annotations) {

    let rulesLen = params.length;
    let res, ruleName, executionLogData;
    let i, hrfRule, convertedRule, ruleSetData, createdRuleSet;
    let createdBR, ruleInfo, ruleServiceData, createdRuleService, ruleServiceActivated;


    //loop over all rules 
    for (i = 0; i < rulesLen; i++) {
        executionLogData = {};
        executionLogData.ID = params[i].ID;
        ruleName = params[i].CP_BR_RULE_NAME;

        //setp 1 : get hrf rule
        try {
            hrfRule = await hrfRuleSysBase.getHRFRule(params[i].HRF_RULE_PACKAGE, params[i].HRF_RULE_NAME);
            executionLogData.STATUS_STEP1 = "S";
            await exeLogOperator.update(executionLogData);
        }
        catch (e) {
            executionLogData.STATUS_STEP1 = 'E'
            if (e.response) {
                executionLogData.ERROR_MSG = JSON.stringify(e.response.body);
            }
            else if (e.message) {
                executionLogData.ERROR_MSG = JSON.stringify(e.message);
            }
            else {
                executionLogData.ERROR_MSG = 'HRF Rule Fetch Failed';
            }
            await exeLogOperator.update(executionLogData);
            continue;
        }

        //Step 2 : call the converter function with hrf rule, projectId , rule nameas input
        try {
            convertedRule = await hrfToBrfConversion(hrfRule.body, projectId, ruleName);
            executionLogData.STATUS_STEP2 = "S";
            await exeLogOperator.update(executionLogData);
        }
        catch (e) {
            executionLogData.STATUS_STEP2 = 'E'
            if (e.response) {
                executionLogData.ERROR_MSG = JSON.stringify(e.response.body);
            }
            else if (e.message) {
                executionLogData.ERROR_MSG = JSON.stringify(e.message);
            }
            else {
                executionLogData.ERROR_MSG = 'HRF Rule Conversion Failed';
            }
            await exeLogOperator.update(executionLogData);
            continue;
        }

        //STEP 3 : post the HRF Rule to the given project
        try {
            createdBR = await cpbrRSysBase.createRule(convertedRule[0]);
            ruleInfo = convertedRule[1];
            ruleInfo.ruleId = createdBR.body.Id;
            executionLogData.STATUS_STEP3 = "S";
            await exeLogOperator.update(executionLogData);
        }
        catch (e) {
            executionLogData.STATUS_STEP3 = 'E'
            if (e.response) {
                executionLogData.ERROR_MSG = JSON.stringify(e.response.body);
            }
            else if (e.message) {
                executionLogData.ERROR_MSG = JSON.stringify(e.message);
            }
            else {
                executionLogData.ERROR_MSG = 'Rule Creation Failed';
            }
            await exeLogOperator.update(executionLogData);
            continue;
        }

        //STEP 4 : generate data for ruleservice and call the rule service API create
        try {
            ruleServiceData = ruleServiceCreate(projectId, ruleName, annotations, ruleInfo);
            createdRuleService = await cpbrRSysBase.createRuleService(ruleServiceData);
            ruleInfo.ruleserviceId = createdRuleService.body.Id;
            executionLogData.STATUS_STEP4 = "S";
            await exeLogOperator.update(executionLogData);
        }
        catch (e) {
            executionLogData.STATUS_STEP4 = 'E'
            if (e.response) {
                executionLogData.ERROR_MSG = JSON.stringify(e.response.body);
            }
            else if (e.message) {
                executionLogData.ERROR_MSG = JSON.stringify(e.message);
            }
            else {
                executionLogData.ERROR_MSG = 'Ruleservice Creation Failed';
            }
            await exeLogOperator.update(executionLogData);
            continue;

        }

        //STEP 5 : generate data for ruleset and call the ruleset API
        try {
            ruleSetData = ruleSetCreate(projectId, ruleName, ruleInfo);
            createdRuleSet = await cpbrRSysBase.createRuleSet(ruleSetData);
            ruleInfo.rulesetId = createdRuleSet.body.Id;
            executionLogData.STATUS_STEP5 = "S";
            await exeLogOperator.update(executionLogData);
        }
        catch (e) {
            executionLogData.STATUS_STEP5 = 'E'
            if (e.response) {
                executionLogData.ERROR_MSG = JSON.stringify(e.response.body);
            }
            else if (e.message) {
                executionLogData.ERROR_MSG = JSON.stringify(e.message);
            }
            else {
                executionLogData.ERROR_MSG = 'Ruleset Creation Failed';
            }
            await exeLogOperator.update(executionLogData);
            continue;
        }

        //Setp 6: Activate CPBR Rule set and Update DB
        try {
            ruleServiceActivated = await cpbrRSysBase.activeRuleService(ruleInfo.ruleserviceId);
            executionLogData.STATUS_STEP6 = "S";
            await exeLogOperator.update(executionLogData);
        }
        catch (e) {
            executionLogData.STATUS_STEP6 = 'E'
            if (e.response) {
                executionLogData.ERROR_MSG = JSON.stringify(e.response.body);
            }
            else if (e.message) {
                executionLogData.ERROR_MSG = JSON.stringify(e.message);
            }
            else {
                executionLogData.ERROR_MSG = 'Ruleset Activation Failed';
            }
            executionLogData.ERROR_MSG = executionLogData.ERROR_MSG.replace(/'/g, '"');
            executionLogData.ERROR_MSG = executionLogData.ERROR_MSG.substring(0, 5000);

            await exeLogOperator.update(executionLogData);
            continue;
        }

        await exeLogOperator.update(executionLogData);

    }
}

module.exports = router;

