sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "odata/model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller,MessageBox,MessageToast,formatter,JSONModel) {
    "use strict";
    var that;
    return Controller.extend("odata.controller.View1", {
        // passing formatter details to formatter property
        formatter: formatter,
        onInit: function () 
        {
            that=this;
            var TempEmployee = new JSONModel({
                Employees: []
            });
            that.getView().setModel(TempEmployee, "employeeModel");
        },
        onOpenDialog: function () 
        {
            if (!that.create) 
            {
                that.create = sap.ui.xmlfragment("odata.Fragments.create", that);
                that.getView().addDependent(that.create);
            }
            that.create.open();
        },
        onclose: function () 
        {
            that.create.close(); 
        },  
        onAddRow: function()
        {
            var oView = that.getView();
            var oEmployeeModel = that.getView().getModel("employeeModel");
            var aEmployees = oEmployeeModel.getProperty("/Employees");
            var TempEmp = {
                FirstName: sap.ui.getCore().byId("efirstName").getValue(),
                Email : sap.ui.getCore().byId("eEmail").getValue(),
                Phone: sap.ui.getCore().byId("ePhone").getValue(),
                BloodGroup: sap.ui.getCore().byId("eBloodGroup").getValue(),
                Department: sap.ui.getCore().byId("edepartment").getValue(),
                Position: sap.ui.getCore().byId("eposition").getValue(),
                JoiningDate: sap.ui.getCore().byId("eJoiningDate").getValue()
            };
            if (TempEmp.FirstName && TempEmp.Email &&TempEmp.Phone && TempEmp.BloodGroup && TempEmp.Department && TempEmp.Position && TempEmp.JoiningDate) {
                var oModel = that.getView().getModel();
                aEmployees.push(TempEmp);  
                oEmployeeModel.setProperty("/Employees", aEmployees);     
                that.onClear();         
            }
        },
        onSubmitDialog: function () 
        {
                var oEmployeeModel = that.getView().getModel("employeeModel");
                var aEmployees = oEmployeeModel.getProperty("/Employees");
                var oData = that.getOwnerComponent().getModel(); 
                for(var i=0;i<aEmployees.length;i++)
                    var oEmployee=aEmployees[i];
                    var oNewEmployee = {
                        FirstName: oEmployee.FirstName,
                        Email: oEmployee.Email,
                        Phone: oEmployee.Phone,
                        BloodGropup: oEmployee.BloodGroup,
                        Department: oEmployee.Department,
                        Position: oEmployee.Position,
                        JoiningDate: oEmployee.JoiningDate
                    };
                    oData.create("/EmployeeInfo", oNewEmployee, { 
                        success: function () 
                        {
                            that.getOwnerComponent().getModel();
                            MessageToast.show("Employee data submitted successfully!");
                        },
                        error: function (error) 
                        {
                             MessageToast.show("Error submitting employee data!");
                        }
                    });
                oEmployeeModel.setProperty("/Employees", []);
            },
        onClear: function () 
        {
            sap.ui.getCore().byId("efirstName").setValue(""); 
            sap.ui.getCore().byId("eEmail").setValue("");
            sap.ui.getCore().byId("ePhone").setValue("");
            sap.ui.getCore().byId("eBloodGroup").setValue("");
            sap.ui.getCore().byId("edepartment").setValue("");
            sap.ui.getCore().byId("eposition").setValue("");
            sap.ui.getCore().byId("eJoiningDate").setValue("");
        },
        DeleteBtn: function(oEvent)
        {
            var oButton=oEvent.getSource();
            var oContext=oButton.getBindingContext();
            var sPath=oContext.getPath();
            var oModel=that.getView().getModel();
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
            if(!that.update)
            {
                that.update=sap.ui.xmlfragment("odata.Fragments.update", that)
            }
            that.update.open();
            var oContext = oEvent.getSource().getBindingContext().getObject(); 
            sap.ui.getCore().byId("id_E").setValue(oContext.ID);
            sap.ui.getCore().byId("FirstName_E").setValue(oContext.FirstName);
            sap.ui.getCore().byId("Email_E").setValue(oContext.Email);
            sap.ui.getCore().byId("Phone_E").setValue(oContext.Phone);
            sap.ui.getCore().byId("Department_E").setValue(oContext.Department);
            sap.ui.getCore().byId("Position_E").setValue(oContext.Position);
            sap.ui.getCore().byId("JoiningDate_E").setValue(oContext.JoiningDate);
            that.update.open();
        },
        onUpdateDialog: function()
        {
            var sId = sap.ui.getCore().byId("id_E").getValue();
            var sfirstName = sap.ui.getCore().byId("FirstName_E").getValue();
            var sEmail = sap.ui.getCore().byId("Email_E").getValue();
            var sPhone = sap.ui.getCore().byId("Phone_E").getValue();
            var sDepartment = sap.ui.getCore().byId("Department_E").getValue();
            var sPosition = sap.ui.getCore().byId("Position_E").getValue();
            var sJoiningDate=sap.ui.getCore().byId("JoiningDate_E").getValue();
                var oUpdatedEmployee = {
                    ID:sId,
                    FirstName: sfirstName,
                    Email: sEmail,
                    Phone: sPhone,
                    Department: sDepartment,
                    Position: sPosition,
                    JoiningDate: sJoiningDate
                    
                };
                var oData = that.getOwnerComponent().getModel();
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
            that.update.close()
        },
        // OnNavigate: function (oEvent) 
        // {
        //     var oId = oEvent.getSource().getBindingContext().getProperty("ID");
        //     var Oname=oEvent.getSource().getBindingContext().getProperty("FirstName");
        //     that.getOwnerComponent().getRouter().navTo("view2",{
        //         Ids: oId,
        //        FName:Oname
        //     });
        // },
        MultiNavigate: function()
        {
            var oTable = this.byId("employeeTable"); 
            var aSelectedItems = oTable.getSelectedItems()
           var selectedData=[];
           for(var i=0; i<aSelectedItems.length; i++){
            var oContext=aSelectedItems[i].getBindingContext().getObject();
            selectedData.push(oContext);
           }
                // var oRouter= that.getOwnerComponent().getRouter()
                // oRouter.navTo("view2",{
                that.getOwnerComponent().getRouter().navTo("view2",{
                selectedItems: selectedData
            });
            
        }
    });
});
