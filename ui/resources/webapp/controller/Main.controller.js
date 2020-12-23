sap.ui.define([

    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/trp/ui/migration/ui/services/MigrateService",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat"
], function(Controller, JSONModel, Fragment, MigrateService, MessageToast, Dialog, DialogType, Button, ButtonType, MessageBox, DateFormat) {
    "use strict";

    return Controller.extend("com.trp.ui.migration.ui.controller.Main", {
        onInit: function() {
            this.selectedProject = "";
            var view = this.getView();
            var model = new JSONModel({

                Annotations: [{
                    key: "1",
                    name: "HANA XSC",
                    selected: false
                }, {
                    key: "2",
                    name: "HANA ADVANCED",
                    selected: false
                }],
                advanced: {},
                xsa: {},
                isProject: false,
                isMigrate: false
            });
            view.setModel(model, "mainModel");

            this.getMigrationService();
            // this.getProjectList();
            this.getRuleList();
        },

        getMigrationService: function() {
            if (!this.migrationService) {
                this.migrationService = new MigrateService();
            }
            this.service = this.migrationService;

        },
        getProjectList: function() {

            // var promise = new Promise(function(resolve, reject) {
            var data = this.service.getProjectList();
            if (data.error) {
                MessageToast.show("Error: " + data.error.message);
                this.getView().getModel("mainModel").setProperty("/ProjectList", []);
            } else if (data) {
                this.getView().getModel("mainModel").setProperty("/ProjectList", data);
            } else {
                this.getView().getModel("mainModel").setProperty("/ProjectList", []);
            }
        },

        getRuleList: function() {
            var data = this.service.getRulesList();
            if (data.error) {
                MessageToast.show("Error: " + data.error.message);
                this.getView().getModel("mainModel").setProperty("/rulesList", []);
            } else if (data.d) {
                this.getView().getModel("mainModel").setProperty("/rulesList", data.d.results);
            } else {
                this.getView().getModel("mainModel").setProperty("/rulesList", []);
            }
        },
        onSelectionAnnotation: function(oEvent) {

            var selectedItem = oEvent.getSource().getSelectedItem().getText(),
                oModel = this.getView().getModel("mainModel");
            if (selectedItem === "HANA XSC") {
                oModel.setProperty("/Annotations/0/selected", true);
                oModel.setProperty("/Annotations/1/selected", false);
                this.openXSAForm();
            } else {
                oModel.setProperty("/Annotations/0/selected", false);
                oModel.setProperty("/Annotations/1/selected", true);
                this.openAdvancedForm();
            }
            if (oModel.getProperty("/isProject")) {
                oModel.setProperty("/isMigrate", true);
            }

        },
        openXSAForm: function() {
            if (!this._dialogXSA) {
                Fragment.load({
                    name: "com.trp.ui.migration.ui.fragments.classicForm",
                    controller: this
                }).then(function(dialog) {
                    this._dialogXSA = dialog;
                    this.getView().addDependent(this._dialogXSA);
                    // this._configValueHelpDialog();
                    this._dialogXSA.open();
                }.bind(this));
            } else {
                // this._configValueHelpDialog();
                this._dialogXSA.open();
            }
        },
        openAdvancedForm: function() {
            if (!this._dialogAdvanced) {
                Fragment.load({
                    name: "com.trp.ui.migration.ui.fragments.advancedForm",
                    controller: this
                }).then(function(oDialog) {
                    this._dialogAdvanced = oDialog;
                    this.getView().addDependent(this._dialogAdvanced);
                    // this._configValueHelpDialog();
                    this._dialogAdvanced.open();
                }.bind(this));
            } else {
                // this._configValueHelpDialog();
                this._dialogAdvanced.open();
            }
        },
        onValueHelpRequested: function() {
            this.getProjectList();
            if (!this._oValueHelpDialog) {
                Fragment.load({
                    name: "com.trp.ui.migration.ui.fragments.ProjectValueHelp",
                    controller: this
                }).then(function(oValueHelpDialog) {
                    this._oValueHelpDialog = oValueHelpDialog;
                    this.getView().addDependent(this._oValueHelpDialog);
                    this._configValueHelpDialog();
                    this._oValueHelpDialog.open();
                }.bind(this));
            } else {
                this._configValueHelpDialog();
                this._oValueHelpDialog.open();
            }
        },

        _configValueHelpDialog: function() {
            var sInputValue = this.byId("input").getValue(),
                oModel = this.getView().getModel("mainModel"),
                aProjects = oModel.getProperty("/ProjectList");

            aProjects.forEach(function(oProject) {
                oProject.selected = (oProject.Name === sInputValue);
            });
            oModel.setProperty("/ProjectList", aProjects);
        },


        handleValueHelpClose: function() {
            var oModel = this.getView().getModel("mainModel"),
                aProjects = oModel.getProperty("/ProjectList"),
                oInput = this.byId("input");

            var bHasSelected = aProjects.some(function(oProject) {
                if (oProject.selected) {
                    oInput.setValue(oProject.Name);
                    this.selectedProject = oProject;
                    oModel.setProperty("/isProject", true);
                    return true;
                }
            }.bind(this));

            if (!bHasSelected) {
                this.selectedProject = "";
                oInput.setValue(null);
                oModel.setProperty("/isProject", false);
            } else {

                var select = oModel.getProperty("/Annotations/0/selected") ? true : oModel.getProperty("/Annotations/1/selected") ? true : false;
                if (select) {
                    oModel.setProperty("/isMigrate", true);
                }
            }


        },

        onDoneAdvanced: function() {

            this._dialogAdvanced.close();
        },
        onCancelAdvanced: function() {
            this._dialogAdvanced.close();
            // if (this._dialogAdvanced) {
            //     this._dialogAdvanced.destroy();
            // }
        },
        onDoneClassic: function() {
            this._dialogXSA.close();
        },
        onCancelClassic: function() {
            this._dialogXSA.close();
            // if (this._dialogXSA) {
            //     this._dialogXSA.destroy();
            // }
        },
        onExit: function() {
            if (this._oValueHelpDialog) {
                this._oValueHelpDialog.destroy();
            }
            if (this._dialogXSA) {
                this._dialogXSA.destroy();
            }
            if (this._dialogAdvanced) {
                this._dialogAdvanced.destroy();
            }
        },
        onMonitor: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("status");
            // var router = this.getOwnerComponent().getRouter();
            // router.navTo("/status");

        },
        onActivateProject: function() {
            var that = this;
            MessageBox.confirm(" Do you really want to activate the project?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(sAction) {
                    if (sAction === "OK") {
                        var project = that.byId("input").getValue();
                        var oModel = that.getView().getModel("mainModel"),
                            selectedProject = {},
                            aProjects = oModel.getProperty("/ProjectList");

                        var selected = aProjects.some(function(oProject) {
                            if (oProject.Name === project) {
                                selectedProject = oProject;
                                return oProject;
                            }
                        }.bind(that));
                        if (selected) {
                            var data = {
                                ProjectID: selectedProject.Id
                            }
                            var response = that.service.activateProject(data);
                            if (response !== "Error") {
                                MessageToast.show("Successfully Activated the Project");
                            } else {
                                MessageToast.show("Error Occured: Unable to Activate the Project");
                            }
                        }
                    }

                }
            });
            // var project = this.byId("input").getValue();
            // var oModel = this.getView().getModel("mainModel"),
            //     selectedProject = {},
            //     aProjects = oModel.getProperty("/ProjectList");

            // var selected = aProjects.some(function(oProject) {
            //     if (oProject.Name === project) {
            //         selectedProject = oProject;
            //         return oProject;
            //     }
            // }.bind(this));
            // if (selected) {
            //     var data = {
            //         ProjectID: selectedProject.Id
            //     }
            //     this.service.activateProject(data);
            // }
        },

        onMigrateProject: function() {
            var that = this;
            MessageBox.confirm("Do you really want to start the rule migration?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(sAction) {
                    if (sAction === "OK") {
                        var data = that.getView().getModel("mainModel").getData();
                        if (that.validate(data)) {
                            var postData = that.getMigrateData(data);
                            that.service.migrateProject(postData);
                            // if (respornse !== "Error") {
                            //     MessageToast.show("Successfully Migration completed");
                            // } else {
                            //     MessageToast.show("Error Occured: Unable to Start the Migration");
                            // }
                        }
                    }

                }
            });

        },
        getMigrateData: function(data) {
            var advanced = [{
                    "Key": "com.sap.hana.advanced",
                    "Value": "true"
                },
                {
                    "Key": "com.sap.hana.advanced.ruleservice.target.namespace",
                    "Value": ""
                },
                {
                    "Key": "com.sap.hana.advanced.ruleservice.source.namespace",
                    "Value": ""
                },
                {
                    "Key": "com.sap.hana.advanced.ruleservice.target.container",
                    "Value": ""
                },
                {
                    "Key": "com.sap.hana.advanced.ruleservice.source.container",
                    "Value": ""
                },
                {
                    "Key": "com.sap.hana.advanced.ruleservice.target.synonym",
                    "Value": ""
                }
            ];
            var xsc = [{
                    "Key": "com.sap.hana.classic",
                    "Value": "true"
                },
                {
                    "Key": "com.sap.hana.classic.ruleservice.source.schema",
                    "Value": ""
                },
                {
                    "Key": "com.sap.hana.classic.ruleservice.source.package",
                    "Value": ""
                }
            ];
            var main = {
                "ProjectId": this.selectedProject.Id + "",
                "Annotations": [],
                "Rules": []
            }
            if (data.Annotations[0].selected) {
                if (Object.values(data.xsa).length === 2) {
                    var values = Object.values(data.xsa)
                    for (var j = 0; j <= 1; j++) {
                        xsc[j + 1].Value = values[j];
                    }
                    main.Annotations = xsc;
                } else {
                    MessageBox.error("Please provide all the details for HANA XSC");
                    return;
                }
            } else {
                if (Object.values(data.advanced).length === 4) {
                    var values = Object.values(data.advanced)
                    for (var j = 0; j <= 3; j++) {
                        advanced[j + 1].Value = values[j];
                    }
                    main.Annotations = advanced;
                } else {
                    MessageBox.error("Please provide all the details for HANA Advanced");
                    return;
                }
            }
            var oTable = this.byId("table");
            var indices = this.byId("table").getSelectedIndices();
            var rows = this.byId("table").getRows();
            var obj;
            if (indices.length > 0) {
                for (var i = 0; i <= indices.length - 1; i++) {
                    var oData = oTable.getContextByIndex(indices[i]);
                    var selData = oData.getProperty(oData.sPath)
                    obj = {
                        "HRF_RULE_NAME": "",
                        "HRF_RULE_PACKAGE": "",
                        "CP_BR_RULE_NAME": "",
                        "CP_BR_PROJECT_NAME": ""
                    };
                    obj.HRF_RULE_NAME = selData.NAME;
                    obj.HRF_RULE_PACKAGE = selData.PACKAGE;
                    obj.CP_BR_RULE_NAME = selData.NAME;
                    obj.CP_BR_PROJECT_NAME = this.selectedProject.Name;
                    main.Rules.push(obj);
                }
                return main;
            } else {
                MessageBox.error("Select atleast one rule");
                return;
            }

        },

        validate: function(data) {
            if (data.isMigrate = true) {
                if (data.Annotations[0].selected) {
                    if (Object.values(data.xsa).length === 0) {
                        MessageToast.show("Please Enter the Value for the HANA XSC");
                    } else {
                        return true;
                    }
                } else if (data.Annotations[1].selected) {
                    if (Object.values(data.advanced).length === 0) {
                        MessageToast.show("Please Enter the Value for the HANA Advanced");
                    } else {
                        return true;
                    }
                }
            }
        },
        onMigrateSelectedProject: function() {
            var that = this;
            MessageBox.confirm("This action is irreversible! Do you really want start the migration?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function(sAction) {
                    if (sAction === "OK") {
                        var data = {
                            "ProjectID": that.selectedProject.Id
                        };
                        var respornse = that.service.migrateSelectedProject(data);
                        if (respornse !== "Error") {
                            MessageToast.show("Successfully Migrated");
                        } else {
                            MessageBox.Error("Error Occured: Unable to Migrate the Project");
                        }
                    }

                }
            });
        },
        DateFormat: function(val) {
            var oDateFormat = DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy hh:mm:ss aaa" });
            if (val) {
                return oDateFormat.format(new Date(val));
            }
        },

    });

});