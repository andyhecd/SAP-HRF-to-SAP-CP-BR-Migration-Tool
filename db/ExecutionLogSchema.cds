namespace sap.tm.trp.rule.migr.tool;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity ExecutionLog : cuid, managed {
    key![HRF_RULE_NAME]      : String(256) @title : 'HRF_RULE_NAME: HRF_RULE_NAME';
    key![HRF_RULE_PACKAGE]   : String(256) @title : 'HRF_RULE_PACKAGE: HRF_RULE_PACKAGE_NAME';
       ![CP_BR_RULE_NAME]    : String(256) @title : 'CP_BR_RULE_NAME: CP_BR_RULE_NAME';
       ![CP_BR_PROJECT_NAME] : String(256) @title : 'CP_BR_PROJECT_NAME: CP_BR_PROJECT_NAME';
       ![CREATED_ON]         : Timestamp   @title : 'CREATED_ON: CREATED_ON';
       ![STATUS_STEP1]       : String(1)   @title : 'STATUS_STEP1: STATUS_STEP1';
       ![STATUS_STEP2]       : String(1)   @title : 'STATUS_STEP2: STATUS_STEP2';
       ![STATUS_STEP3]       : String(1)   @title : 'STATUS_STEP3: STATUS_STEP3';
       ![STATUS_STEP4]       : String(1)   @title : 'STATUS_STEP4: STATUS_STEP4';
       ![STATUS_STEP5]       : String(1)   @title : 'STATUS_STEP5: STATUS_STEP5';
       ![STATUS_STEP6]       : String(1)   @title : 'STATUS_STEP6: STATUS_STEP6';
       ![STATUS_STEP7]       : String(1)   @title : 'STATUS_STEP7: STATUS_STEP7';
       ![ERROR_MSG]          : String(5000)@title : 'ERROR_MSG: ERROR_MSG';
}
