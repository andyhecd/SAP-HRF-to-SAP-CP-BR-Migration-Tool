"use strict";

const headerConversion = function (headers, columnSegmentIdList) {
    var v_out = {};
    v_out.Column = [];
    var v_columnObj = {};
    var i;

    if (!(headers instanceof Array &&
        headers.length > 0)) {
        throw new Error("[HRF Rule Conversion] Header: Format error, Rule conversion to CP BR not supported!");
    }
    var v_headerLen = headers.length;
    //loop for all header values
    try {
        for (i = 0; i < v_headerLen; i++) {
            v_columnObj = {};
            if (headers[i].type === "condition") //if condition attr, then 
            {
                v_columnObj.Id = String(i + 1);
                v_columnObj.SequenceNumber = i + 1;

                v_columnObj.Description = [];
                v_columnObj.Description[0] = {
                    "Language": "",
                    "Text": ""
                }
                v_columnObj.Type = 'C';
                v_columnObj.Condition = {};
                v_columnObj.Condition.Expression = headers[i].expression;
                v_columnObj.Condition.AST = [];
                v_columnObj.Condition.ValueOnly = false;
                v_columnObj.Condition.FixedOperator = "";

                v_out.Column[i] = v_columnObj;

            }

            else if (headers[i].type === "output") // if output attr, then 
            {
                v_columnObj.Id = String(i + 1);
                v_columnObj.SequenceNumber = i + 1;
                v_columnObj.Description = [];
                v_columnObj.Type = 'R';
                v_columnObj.Result = {};
                if (columnSegmentIdList.get(headers[i].name) === undefined) {
                    throw new Error("[HRF Rule Conversion] Data Object used for Input / Result does not contain necessary columns for conversion. Kindly adjust the Data Objects!");
                }
                v_columnObj.Result.Segment = columnSegmentIdList.get(headers[i].name);
                v_columnObj.Result.Cell = {};
                v_columnObj.Result.Cell.Mode = 'E';
                v_columnObj.Result.Cell.FixedExpression = null;
                v_columnObj.Result.Cell.AST = [];

                v_out.Column[i] = v_columnObj;

            }

        }
        return v_out;
    } catch (e) {
        throw new Error(e);
    }
}
module.exports = headerConversion;

