sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "odata/model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller,MessageBox,MessageToast,formatter,JSONModel) {
    "use strict";
    return Controller.extend("odata.controller.View1", {
        // passing formatter details to formatter property
        formatter: formatter,
        onInit: function () 
        {
            var TempEmployee = new JSONModel({
                Employees: []
            });
            this.getView().setModel(TempEmployee, "employeeModel");
        },
        onOpenDialog: function () 
        {
            if (!this.create) 
            {
                this.create = sap.ui.xmlfragment("odata.Fragments.create", this);
                this.getView().addDependent(this.create);
            }
            this.create.open();
        },
        onclose: function () 
        {
            if (this.create) 
            {
                this.create.close(); 
            }
        },  
        onAddRow: function()
        {
            var oView = this.getView();
            var oEmployeeModel = this.getView().getModel("employeeModel");
            var aEmployees = oEmployeeModel.getProperty("/Employees");
            var TempEmp = {
                FirstName: sap.ui.getCore().byId("efirstName").getValue(),
                Email : sap.ui.getCore().byId("eEmail").getValue(),
                Phone: sap.ui.getCore().byId("ePhone").getValue(),
                Department: sap.ui.getCore().byId("edepartment").getValue(),
                Position: sap.ui.getCore().byId("eposition").getValue(),
                JoiningDate: sap.ui.getCore().byId("eJoiningDate").getValue()
            };
            aEmployees.push(TempEmp);
                oEmployeeModel.setProperty("/Employees", aEmployees);
                this.onClear();
        },
        onSubmitDialog: function () 
        {
                var oEmployeeModel = this.getView().getModel("employeeModel");
                var aEmployees = oEmployeeModel.getProperty("/Employees");
                var oData = this.getOwnerComponent().getModel(); 
                for (var i = 0; i < aEmployees.length; i++) 
                {
                    var oEmployee = aEmployees[i];
                    var oNewEmployee = {
                        FirstName: oEmployee.FirstName,
                        Email: oEmployee.Email,
                        Phone: oEmployee.Phone,
                        Department: oEmployee.Department,
                        Position: oEmployee.Position,
                        JoiningDate: oEmployee.JoiningDate
                    };
                    oData.create("/EmployeeInfo", oNewEmployee, {
                        success: function () 
                        {
                            MessageToast.show("Employee data submitted successfully!");
                        },
                        error: function (error) 
                        {
                            MessageToast.show("Error submitting employee data!");
                            // console.error(error);
                        }
                    });
                }
                oEmployeeModel.setProperty("/Employees", []);
            },
        onClear: function () 
        {
            sap.ui.getCore().byId("efirstName").setValue(""); 
            sap.ui.getCore().byId("eEmail").setValue("");
            sap.ui.getCore().byId("ePhone").setValue("");
            sap.ui.getCore().byId("edepartment").setValue("");
            sap.ui.getCore().byId("eposition").setValue("");
            sap.ui.getCore().byId("eJoiningDate").setValue("");
        },
        DeleteBtn: function(oEvent)
        {
            var oButton=oEvent.getSource();
            var oContext=oButton.getBindingContext();
            var sPath=oContext.getPath();
            var oModel=this.getView().getModel();
            oModel.remove(sPath,{
                success: function()
                {
                    sap.m.MessageToast.show("Record deleted successfully!");
                },
                error: function()
                {
                    sap.m.MessageToast.show("Cannot delete record");
                }
            }) 
        },
        UpdateBtn: function(oEvent)
        {
            if(!this.update)
            {
                this.update=sap.ui.xmlfragment("odata.Fragments.update", this)
            }
            var oContext = oEvent.getSource().getBindingContext().getObject(); 
            sap.ui.getCore().byId("id_E").setValue(oContext.ID);
            sap.ui.getCore().byId("FN_E").setValue(oContext.FirstName);
            sap.ui.getCore().byId("E_E").setValue(oContext.Email);
            sap.ui.getCore().byId("P_E").setValue(oContext.Phone);
            sap.ui.getCore().byId("D_E").setValue(oContext.Department);
            sap.ui.getCore().byId("PO_E").setValue(oContext.Position);
            sap.ui.getCore().byId("JD_E").setValue(oContext.JoiningDate);
            this.update.open();
        },
        onUpdateDialog: function()
        {
            var sId = sap.ui.getCore().byId("id_E").getValue();
            var sfirstName = sap.ui.getCore().byId("FN_E").getValue();
            var sEmail = sap.ui.getCore().byId("E_E").getValue();
            var sPhone = sap.ui.getCore().byId("P_E").getValue();
            var sDepartment = sap.ui.getCore().byId("D_E").getValue();
            var sPosition = sap.ui.getCore().byId("PO_E").getValue();
                var oUpdatedEmployee = {
                    ID:sId,
                    FirstName: sfirstName,
                    Email: sEmail,
                    Phone: sPhone,
                    Department: sDepartment,
                    Position: sPosition
                };
                var oData = this.getOwnerComponent().getModel();
                // var updatePath = "/EmployeeInfo,oData (' "+sfirstName+" ')";
                var updatePath = `/EmployeeInfo(guid'${sId}')`
                oData.update(updatePath, oUpdatedEmployee,{
                    success: function()
                    {
                        sap.m.MessageToast.show("Record updated successfully!");
                    },
                error: function (error) 
                {
                console.log(error)
                MessageToast.show("Cannot update record");
                }
           })
        },
        onCancleDialog: function()
        {
            this.update.close()
        },
        OnNavigate: function (oEvent) 
        {
            var oId = oEvent.getSource().getBindingContext().getProperty("ID");
            var Oname=oEvent.getSource().getBindingContext().getProperty("FirstName");
            this.getOwnerComponent().getRouter().navTo("view2",{
                Ids: oId,
               FName:Oname});
        },
    });
});
