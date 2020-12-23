"use strict";

/**
 * 
 * @param {*} projectId - string object: {content:{headers:[],rows:[]}}
 * @param {*} ruleName - string
 * @param {*} annotations -array of objects [{key :, value :},..]
 * @param {*} cpbrRuleInfo --object {inputId: , resultId : } //data object/table id's
 */
module.exports = function (projectId, ruleName, annotations, cpbrRuleInfo) {

    if (!(projectId &&
        ruleName &&
        (annotations instanceof Array) &&
        cpbrRuleInfo.inputId &&
        cpbrRuleInfo.resultId
    )) {
        throw new Error("Rule Service could not be generated. Incorrect Number or types of Parameters.");
    }
    let ruleServiceData = {};
    ruleServiceData.Project = projectId;
    ruleServiceData.Name = ruleName;
    ruleServiceData.Description = [{
        "Language": "en",
        "Text": "Rule Service for " + ruleName
    }];
    ruleServiceData.Label = [
        {
            "Language": "en",
            "Text": ""
        },
        {
            "Language": "",
            "Text": ""
        }
    ];
    annotations.forEach((item, index) => {
        if (item.Key === "com.sap.hana.advanced.ruleservice.target.synonym") {
            item.Value = ruleName;
        }
    });

    ruleServiceData.Annotations = annotations;
    ruleServiceData.Vocabulary = {
        "Input": [
            {
                "ObjectId": cpbrRuleInfo.inputId
            }
        ],
        "Result": [
            {
                "ObjectId": cpbrRuleInfo.resultId
            }
        ]
    };

    return ruleServiceData;


}



