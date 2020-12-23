
const cpbrRSysBase = require('./../sysCommunication/CPBizRuleSystemBase');

const ObjectDetails = async function (projectId, inputTableName, outputTableName) {

    //API call to get dataobjects
    let dataObjOutput = await cpbrRSysBase.getDataObjects(projectId);

    let objectId, inputTableId, outputTableId, columnDetails = [];
    //get input table id 
    dataObjOutput.body.forEach((item, index) => {
        if (item.Name === inputTableName) {
            inputTableId = item.Id;
        }
    });

    //get output table id 
    dataObjOutput.body.forEach((item, index) => {
        if (item.Name === outputTableName) {
            outputTableId = item.Id;
            objectId = item.Table.LineType.ObjectId;
        }
    });

    //get output table column details
    dataObjOutput.body.forEach((item, index) => {
        if (item.Id === objectId) {
            columnDetails = item.Structure.Component;
        }
    });

    // key = colName, value=segmentId
    const generatedColumnSegment = new Map();
    columnDetails.forEach((item, index) => {
        generatedColumnSegment.set(
            item.Name,
            item.Id
        )
    });

    return [inputTableId, outputTableId, generatedColumnSegment];
}

module.exports = ObjectDetails;


