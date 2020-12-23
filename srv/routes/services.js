const express = require("express");
const router = express.Router();
const httpStatus = require("http-status-codes");

const hrfRuleSysBase = require("../lib/sysCommunication/HRFRuleSystemBase");
const cpbrRSysBase = require("../lib/sysCommunication/CPBizRuleSystemBase");

//get all HRF rules
router.get("/hrfrules", (req, res) => {
    hrfRuleSysBase
        .getAllHRFRules()
        .then((data) => {
            res.status(httpStatus.OK).send(data.body);
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
});

//get all CPBR projects
router.get("/cpbrprojects", (req, res) => {
    cpbrRSysBase
        .getExpLangV1Projects()
        .then((data) => {
            res.status(httpStatus.OK).send(data.body);
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
});

//activate the project

router.put("/activateProject", (req, res) => {
    const data = req.body.ProjectID;
    cpbrRSysBase
        .activeProject(data)
        .then((data) => {
            res.status(httpStatus.ACCEPTED).send(data.body);
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
});


router.post("/migrateProject", (req, res) => {
    const data = req.body.ProjectID;
    cpbrRSysBase
        .migrateProject(data)
        .then((data) => {
            res.status(httpStatus.ACCEPTED).send(data.body);
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
});

module.exports = router;