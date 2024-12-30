sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("com.employeeapi.controller.View1", {
        onInit: function () {
            // Load data from API
            this._loadEmployeeData();
        },

        _loadEmployeeData: function () {
            const oModel = new sap.ui.model.json.JSONModel();
            oModel.loadData("http://localhost:3000/api/employees");
            this.getView().setModel(oModel);
        },

        onSave: function () {
            const sName = this.getView().byId("name").getValue();
            const sPosition = this.getView().byId("position").getValue();

            // Data payload
            const oPayload = {
                name: sName,
                position: sPosition
            };

            fetch("http://localhost:3000/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(oPayload)
            })
                .then((response) => {
                    if (response.ok) {
                        MessageToast.show("Employee saved successfully!");
                        this._loadEmployeeData(); // Reload data
                    } else {
                        MessageBox.error("Failed to save employee!");
                    }
                })
                .catch((error) => MessageBox.error(error.message));
        },

        onEdit: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oEmployee = oContext.getObject();

            // Prefill form with existing data
            this.getView().byId("name").setValue(oEmployee.name);
            this.getView().byId("position").setValue(oEmployee.position);

            this._currentEmployeeId = oEmployee.id; // Store ID for update
        },

        onDelete: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sId = oContext.getObject().id;

            fetch(`http://localhost:3000/api/employees/${sId}`, { method: "DELETE" })
                .then((response) => {
                    if (response.ok) {
                        MessageToast.show("Employee deleted successfully!");
                        this._loadEmployeeData(); // Reload data
                    } else {
                        MessageBox.error("Failed to delete employee!");
                    }
                })
                .catch((error) => MessageBox.error(error.message));
        }
    });
});
