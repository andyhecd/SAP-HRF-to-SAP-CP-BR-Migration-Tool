"use strict";
const HRF_DESCRIPTION_KEY = "description";
const HRF_RULEBODY_KEY = "ruleBody";
const HRF_TYPE_KEY = "type";
const HRF_HITPOLICY_KEY = "hitPolicy";

const CPBR_ID_KEY = "Id";
const CPBR_NAME_KEY = "Name";
const CPBR_DESCRIPTION_KEY = "Description";
const CPBR_PROJECT_KEY = "Project";
const CPBR_TYPE_KEY = "Type";
const CPBR_RESULT_KEY = "Result";
const CPBR_DecisionTable_KEY = "DecisionTable";
const CPBR_EXPRESSIONLANGUAGEVERSION_KEY = "ExpressionLanguageVersion";

/**
 * Convert main data of HRF Rule Content to main data of CP biz rules decision table
 * @param {*} hrfRuleOutput - object: {output:{}}
 * @param {*} cpbr - object: {}
 */

module.exports = (hrfRuleOutput, projectId, hrfRuleName, objectId, cpbr) => {
    const returnCPBR = Object.assign({}, cpbr);
    if (
        !hrfRuleOutput ||
        !hrfRuleOutput[HRF_RULEBODY_KEY][HRF_TYPE_KEY] ||
        !hrfRuleOutput[HRF_RULEBODY_KEY][HRF_HITPOLICY_KEY]
    ) {
        throw new Error("[HRF Rule Conversion] Body: Expected keys missing, Rule conversion to CP BR not supported!");
    }
    const hrfDescription = hrfRuleOutput[HRF_DESCRIPTION_KEY] ? hrfRuleOutput[HRF_DESCRIPTION_KEY] : hrfRuleName;
    const hrfType = hrfRuleOutput[HRF_RULEBODY_KEY][HRF_TYPE_KEY];
    const hrfHitpolicy = hrfRuleOutput[HRF_RULEBODY_KEY][HRF_HITPOLICY_KEY];

    let cpbrId, cpbrName, cpbrProject, cpbrType, cpbrExpressionLanguageVersion;
    const cpbrDescription = new Array();
    const cpbrResult = new Object();
    const cpbrDecisionTable = new Object();

    cpbrId = "09f505d838bc4653b03896970eccfe32"; // check this
    cpbrName = hrfRuleName;

    cpbrDescription.push({
        Language: "",
        Text: hrfDescription
    },
        {
            Language: "en",
            Text: hrfDescription
        });

    cpbrProject = projectId;  // check this

    if (hrfType === "decisionTable") {
        cpbrType = "DT";
    }

    cpbrResult.ObjectId = objectId; // check this

    if (hrfHitpolicy === "allMatch") {
        cpbrDecisionTable.HitPolicy = "MHO";
    }

    if (hrfHitpolicy === "firstMatch") {
        cpbrDecisionTable.HitPolicy = "SHF";
    }


    cpbrExpressionLanguageVersion = "1.0.0";

    if (cpbrName) {
        returnCPBR[CPBR_ID_KEY] = cpbrId;
        returnCPBR[CPBR_NAME_KEY] = cpbrName;
        returnCPBR[CPBR_DESCRIPTION_KEY] = cpbrDescription;
        returnCPBR[CPBR_PROJECT_KEY] = cpbrProject;
        returnCPBR[CPBR_TYPE_KEY] = cpbrType;
        returnCPBR[CPBR_RESULT_KEY] = cpbrResult;
        returnCPBR[CPBR_DecisionTable_KEY] = cpbrDecisionTable;
        returnCPBR[CPBR_EXPRESSIONLANGUAGEVERSION_KEY] = cpbrExpressionLanguageVersion;
    }
    // console.log(returnCPBR);
    return returnCPBR;
};