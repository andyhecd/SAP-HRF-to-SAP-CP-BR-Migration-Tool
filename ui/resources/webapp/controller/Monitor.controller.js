sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "com/trp/ui/migration/ui/services/MigrateService",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat"
], function(Controller, History, MigrateService, JSONModel, MessageBox, DateFormat) {
    "use strict";

    return Controller.extend("com.trp.ui.migration.ui.controller.Monitor", {
        onInit: function() {
            var route = sap.ui.core.UIComponent.getRouterFor(this);
            route.attachRouteMatched(this.setMoniteringData(), this);

        },

        getMigrationService: function() {
            if (!this.migrationService) {
                this.migrationService = new MigrateService();
            }
            this.service = this.migrationService;

        },

        setMoniteringData: function(args) {
            this.getMigrationService();
            // var oDataModel = this.getView().getModel("oData");
            // oDataModel =
            var data = this.service.getExecutionLog();
            if (data) {
                this.getView().setBusy(false);
                var model = new JSONModel(data);
                this.getView().setModel(model);
            }
        },

        navBack: function() {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main", true);

        },
        formatTextToIcon: function(val) {
            if (val === 'S') {
                return "sap-icon://message-success";
            } else if (val === 'E') {
                return "sap-icon://message-error";
            }
        },
        iconColor: function(val) {
            if (val === 'S') {
                return 'Positive';
            } else if (val === 'E') {
                return "Negative";
            }
        },
        DateFormat: function(val) {
            var oDateFormat = DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy hh:mm:ss aaa" });
            if (val) {
                return oDateFormat.format(new Date(val));
            }
        },
        selectedRow: function(oEvt) {
            var rowIndex = oEvt.getSource().getSelectedIndex();
            var data = this.getView().getModel().getData();
            var table = this.byId("table");
            if (data.value.length > 0) {
                var oData = table.getContextByIndex(rowIndex);
                var selData = oData.getProperty(oData.sPath)
                if (selData.ERROR_MSG) {
                    MessageBox.information(selData.ERROR_MSG);
                }

            }
        },
        onRefresh: function() {
            this.getView().setBusy(true);
            this.setMoniteringData();
        }
    });
});