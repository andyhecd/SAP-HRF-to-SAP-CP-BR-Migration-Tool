sap.ui.define([
    "sap/ui/base/Object",
    "jquery.sap.global",
    "sap/m/MessageToast",
], function(
    Object, jQuery, MessageToast
) {

    // CSRF token, singleton for whole application
    var csrfToken = null;

    return Object.extend("com.trp.ui.migration.ui.services.BaseService", {

        constructor: function() {
            // this.serviceMode = ServiceMode.Online;
            this.displayErrors = true;
        },



        path: "/sap/hana/xs/formLogin",

        getServiceUrl: function(filePath) {
            var url = jQuery.sap.formatMessage("{0}/{1}", this.path, filePath);

            return url;
        },

        fetchCSRFToken: function() {
            var promise = new Promise(function(resolve, reject) {
                jQuery.ajax({
                    url: this.getServiceUrl("token.xsjs"),
                    type: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRF-Token", "Fetch");
                    }
                }).then(
                    function(data, textStatus, xmlHttpRequest) {
                        var csrfToken = xmlHttpRequest.getResponseHeader("X-CSRF-Token");
                        resolve(csrfToken);
                    },
                    function(err) {
                        reject(err);
                    }
                );
            }.bind(this));

            return promise;
        },

        /*
         * =====================================================================
         * Call Service
         * =====================================================================
         */

        /**
         * Call backend service
         * @public
         *
         * @param {object} options - The options
         */
        callService: function(options) {
            var command = options;
            command.url = "/sap/tm/trp/services" + command.pathPattern;
            command.data = command.params ? command.params : '';
            command.type = options.type;
            command.contentType = "application/json";

            var response = this.callAjaxService(command);
            if (command.type === "GET") {
                if (response) {
                    if (response.responseJSON) {
                        return response.responseJSON;
                    } else {
                        return [];
                    }
                } else {
                    return "Error";
                }
            } else {
                if (response.status === (200 || 202 || 204)) {
                    return "Sucess";
                } else {
                    return "Error";
                }
            }


        },

        /**
         * Call backend service
         * @public
         *
         * @param {object} options - The options
         */
        callODataService: function(options) {
            var command = options;
            command.url = "/sap/tm/trp/service/odata" + command.pathPattern + "?$top=1000&$skip=0&$orderby=CREATED_ON desc";
            command.data = command.params ? command.params : '';
            command.type = options.type;
            command.contentType = "application/json";

            var response = this.callAjaxService(command);
            if (response) {
                if (response.responseJSON) {
                    return response.responseJSON;
                } else {
                    return "Error";
                }
            } else {
                return "Error";
            }

        },

        /**
         * Call AJAX web service
         * @private
         *
         * @param {object} command - The command object
         * @return {Promise} The promise object
         */
        callAjaxService: function(command) {
            var ajaxOptions = {
                url: command.url,
                contentType: command.contentType,
                type: command.type,
                data: command.data,
                async: false
            };

            if (command.type === "GET") {
                return $.ajax({
                    url: command.url,
                    type: command.type,
                    async: false,
                    fail: function(error) {
                        return error;
                    },
                    done: function(data) {
                        return data;
                    }
                });
            } else if (command.type === 'POST') {

                return $.ajax({
                    url: command.url,
                    type: command.type,
                    contentType: command.contentType,
                    data: JSON.stringify(command.data),
                    async: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRF-Token", csrfToken);
                    },
                    success: function(res) {
                        MessageToast.show("Migration Started, kindly check in the monitoring");
                        return res;

                    },
                    error: function(errorThrown) {
                        MessageToast.show("Error Occured: Unable to Start the Migration");
                        return errorThrown;

                    }
                })
            } else if (command.type === "PUT") {
                return $.ajax({
                    url: command.url,
                    type: command.type,
                    contentType: command.contentType,
                    data: JSON.stringify(command.data),
                    async: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRF-Token", csrfToken);
                    },
                    success: function(res) {
                        return res;

                    },
                    error: function(errorThrown) {
                        return errorThrown;

                    }
                })
            }

        },


    });
});