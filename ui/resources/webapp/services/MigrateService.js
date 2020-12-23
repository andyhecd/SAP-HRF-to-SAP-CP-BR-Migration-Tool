sap.ui.define([
    "com/trp/ui/migration/ui/services/BaseService",

], function(BaseService) {
    "use strict";

    return BaseService.extend("com.trp.ui.migration.ui.services.MigrateService", {

        getProjectList: function() {
            var options = {
                pathPattern: "/cpbrprojects",
                type: 'GET',
                params: "",
            };

            return this.callService(options);
        },
        getRulesList: function() {
            var options = {
                pathPattern: "/hrfrules",
                type: 'GET',
                params: "",
            };

            return this.callService(options);
        },
        activateProject: function(params) {
            var options = {
                pathPattern: "/activateProject",
                type: 'PUT',
                params: params,
            };

            return this.callService(options);
        },
        migrateProject: function(params) {

            var options = {
                pathPattern: "/hrftocpbr/convert",
                type: 'POST',
                params: params,
            };

            return this.callService(options);
        },
        getExecutionLog: function() {
            var options = {
                pathPattern: "/ExecutionLog",
                type: 'GET',
                params: "",
            };

            return this.callODataService(options);
        },
        migrateSelectedProject: function(params) {

            var options = {
                pathPattern: "/migrateProject",
                type: 'POST',
                params: params,
            };

            return this.callService(options);
        }
    });
});