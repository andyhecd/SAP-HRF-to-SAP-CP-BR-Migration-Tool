"use strict";
/**
 * 
 * @param {*} projectId 
 * @param {*} ruleName 
 * @param {*} cpbrRuleInfo 
 */
module.exports = function (projectId, ruleName, cpbrRuleInfo) {
    if (!(projectId &&
        ruleName &&
        cpbrRuleInfo.ruleId &&
        cpbrRuleInfo.ruleserviceId
    )) {
        throw new Error("Ruleset could not be generated. Incorrect Number or types of Parameters.");
    }
    let ruleSetData = {};
    ruleSetData.Project = projectId;
    ruleSetData.Name = ruleName;
    ruleSetData.Description = [
        {
            "Language": "en",
            "Text": "Rulset for " + ruleName
        }
    ];
    ruleSetData.Label = [
        {
            "Language": "",
            "Text": ""
        }
    ];
    ruleSetData.RuleService = {
        "ObjectId": cpbrRuleInfo.ruleserviceId
    }
    ruleSetData.Rule = [
        {
            "ObjectId": cpbrRuleInfo.ruleId,
            "SequenceNumber": 1
        }
    ]
    ruleSetData.Priority = 50;
    ruleSetData.Policy = "A";


    return ruleSetData;
}


