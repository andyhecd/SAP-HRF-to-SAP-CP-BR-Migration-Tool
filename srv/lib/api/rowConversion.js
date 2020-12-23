"use strict";

const HRF_CONTENT_KEY = "content";
const HRF_CONTENT_HEADER_KEY = "headers";
const HRF_CONTENT_ROWS_KEY = "rows";
const HRF_CONTENT_ROW_KEY = "row";
const HRF_CONTENT_SPAN_KEY = "span";
const HRF_CONTENT_COL_ID_KEY = "colID";
const CPBR_DT_ROW_KEY = "Row";
const CPBR_DT_CELL_KEY = "Cell";

/**
 * Convert rows of HRF Rule Content to row and cell of CP biz rules decision table
 * @param {*} hrfRuleContent - object: {content:{headers:[],rows:[]}}
 * @param {*} cpbrDucesionTable - object: {Row:[],Cell:[]}
 */
module.exports = (hrfRuleContent, cpbrDecisionTable) => {
    const returnCPBRDecisionTable = Object.assign({}, cpbrDecisionTable);
    if (
        !hrfRuleContent ||
        !hrfRuleContent[HRF_CONTENT_HEADER_KEY] ||
        !hrfRuleContent[HRF_CONTENT_ROWS_KEY]
    ) {
        throw new Error("[HRF Rule Conversion] Row: Expected keys missing, Rule conversion to CP BR not supported!");
    }

    const hrfHeaders = hrfRuleContent[HRF_CONTENT_HEADER_KEY];
    const hrfRows = hrfRuleContent[HRF_CONTENT_ROWS_KEY];
    if (
        hrfHeaders instanceof Array &&
        hrfHeaders.length > 0 &&
        hrfRows instanceof Array &&
        hrfRows.length > 0
    ) {
        const cpbrRows = new Array();
        const cpbrCells = new Array();
        // key = colID, value=number of order started with 1
        const generatedColumnIdAsOrder = new Map();
        hrfHeaders.forEach((item, index) => {
            if (item[HRF_CONTENT_COL_ID_KEY]) {
                generatedColumnIdAsOrder.set(
                    item[HRF_CONTENT_COL_ID_KEY],
                    String(index + 1)
                );
            }
        });

        hrfRows.forEach((item, index) => {
            const itemRowValue = item[HRF_CONTENT_ROW_KEY];
            if (itemRowValue && itemRowValue instanceof Array) {
                const rowId = index + 1;
                cpbrRows.push({
                    Id: String(rowId),
                    SequenceNumber: rowId
                });
                itemRowValue.forEach((row) => {
                    if (
                        row[HRF_CONTENT_COL_ID_KEY] &&
                        row[HRF_CONTENT_KEY]
                    ) {
                        cpbrCells.push({
                            ColumnId: generatedColumnIdAsOrder.get(
                                row[HRF_CONTENT_COL_ID_KEY]
                            ),
                            RowId: String(rowId),
                            Expression: row[HRF_CONTENT_KEY],
                            AST: []
                        });
                    }
                });
            }
        });

        if (cpbrRows.length > 0 && cpbrCells.length > 0) {
            returnCPBRDecisionTable[CPBR_DT_ROW_KEY] = cpbrRows;
            returnCPBRDecisionTable[CPBR_DT_CELL_KEY] = cpbrCells;
        }
    }
    return returnCPBRDecisionTable;
};
