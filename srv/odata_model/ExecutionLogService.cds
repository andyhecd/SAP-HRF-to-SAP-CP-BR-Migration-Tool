using {sap.tm.trp.rule.migr.tool} from '../../db/ExecutionLogSchema';

service ExecutionLogService {

    entity ExecutionLog as projection on tool.ExecutionLog;

}
