sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
   
], function (Controller,MessageBox,MessageToast) {
    "use strict";
    
    return Controller.extend("odata.controller.View1", {
        onInit: function () {
            this._oDialog = null; 
        },
        // Open the dialog (from the view)
        onOpenDialog: function () {
            if (!this.create) {
                this.create = sap.ui.xmlfragment("odata.Fragments.create", this);
                this.getView().addDependent(this.create);
            }
            this.create.open();
        },
        // Close the dialog
        onclose: function () {
            if (this.create) {
                this.create.close();
            }
        },
        handleCalendarSelect: function (oEvent) {
            var oCalendar = oEvent.getSource();
            var oSelectedDate = oCalendar.getSelectedDates()[0].getStartDate(); // Get selected date
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            var sFormattedDate = oDateFormat.format(oSelectedDate);
            sap.ui.getCore().byId("eJoiningDate").setValue(sFormattedDate); // Set the value in the input
             },
        // Submit the data from the dialog
        onSubmitDialog: function () {
            // var sEmployeeId=sap.ui.getCore().byId("eEmpId").getValue();
             var sfirstName = sap.ui.getCore().byId("efirstName").getValue();
             var slastName = sap.ui.getCore().byId("elastName").getValue();
             var sEmail = sap.ui.getCore().byId("eEmail").getValue();
             var sPhone = sap.ui.getCore().byId("ePhone").getValue();
             var sdepartment = sap.ui.getCore().byId("edepartment").getValue();
             var sposition = sap.ui.getCore().byId("eposition").getValue();
             var sjoiningDate=sap.ui.getCore().byId("eJoiningDate").getValue();

             if (sfirstName && slastName && sEmail && sPhone && sdepartment && sposition && sjoiningDate ) {
                 var oNewEmployee = {
                    // EmployeeId:sEmployeeId,
                     FirstName: sfirstName,
                     LastName: slastName,
                     Email: sEmail,
                     Phone: sPhone,
                     Department: sdepartment,
                     Position: sposition,
                     JoiningDate: sjoiningDate,
                 };
                 var oData = this.getOwnerComponent().getModel();
                 oData.create("/EmployeeInfo", oNewEmployee, {
                     success: function (response) {
                         MessageToast.show("Record created successfully");
                         that.create.close();
                         oData.refresh(true);
                    },
                    error: function (error) {
                        MessageToast.show("Error creating record");
                    }
                });
            } else {
                MessageBox.error("Please fill all required fields.");
            }
        }, 
        // Reset the input fields in the dialog
        onClear: function () {
            sap.ui.getCore().byId("efirstName").setValue("");
            sap.ui.getCore().byId("elastName").setValue("");
            sap.ui.getCore().byId("eEmail").setValue("");
            sap.ui.getCore().byId("ePhone").setValue("");
            sap.ui.getCore().byId("edepartment").setValue("");
            sap.ui.getCore().byId("eposition").setValue("");
            sap.ui.getCore().byId("eJoiningDate").setValue("");
        },
        DeleteBtn: function(oEvent){
            var oButton=oEvent.getSource();
            var oContext=oButton.getBindingContext();
            var sPath=oContext.getPath();
            var oModel=this.getView().getModel();
            oModel.remove(sPath,{
                success: function(){
                    sap.m.MessageToast.show("Record deleted successfully!");
                },
                error: function(){
                    sap.m.MessageToast.show("Cannot delete record");
                }
            })
        },
        handleCalendarSelectUpdate: function (oEvent) {
            var oCalendar = oEvent.getSource();
            var oSelectedDate = oCalendar.getSelectedDates()[0].getStartDate();
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            var sFormattedDate = oDateFormat.format(oSelectedDate);
            sap.ui.getCore().byId("JD_E").setValue(sFormattedDate); 
        },
        UpdateBtn: function(oEvent){
            if(!this.update){
                this.update=sap.ui.xmlfragment("odata.Fragments.update", this)
            }
            var oContext = oEvent.getSource().getBindingContext().getObject();
            // set the values which are present in the table to update fragment 
            sap.ui.getCore().byId("id_E").setValue(oContext.ID);
            sap.ui.getCore().byId("FN_E").setValue(oContext.FirstName);
            sap.ui.getCore().byId("LN_E").setValue(oContext.LastName);
            sap.ui.getCore().byId("E_E").setValue(oContext.Email);
            sap.ui.getCore().byId("P_E").setValue(oContext.Phone);
            sap.ui.getCore().byId("D_E").setValue(oContext.Department);
            sap.ui.getCore().byId("PO_E").setValue(oContext.Position);
            sap.ui.getCore().byId("JD_E").setValue(oContext.JoiningDate);
            this.update.open();
        },
         //Get the values from table and display them on a update fragment 
        onUpdateDialog: function(){
            var sId = sap.ui.getCore().byId("id_E").getValue();
            var sfirstName = sap.ui.getCore().byId("FN_E").getValue();
            var slastName = sap.ui.getCore().byId("LN_E").getValue();
            var sEmail = sap.ui.getCore().byId("E_E").getValue();
            var sPhone = sap.ui.getCore().byId("P_E").getValue();
            var sDepartment = sap.ui.getCore().byId("D_E").getValue();
            var sPosition = sap.ui.getCore().byId("PO_E").getValue();
            // Validate that all fields are filled
                var oUpdatedEmployee = {
                    ID:sId,
                    FirstName: sfirstName,
                    LastName: slastName,
                    Email: sEmail,
                    Phone: sPhone,
                    Department: sDepartment,
                    Position: sPosition
                };
                var oData = this.getOwnerComponent().getModel();
                var updatePath = `/EmployeeInfo(guid'${sId}')`
                oData.update(updatePath, oUpdatedEmployee,{
                    success: function(){
                        sap.m.MessageToast.show("Record updated successfully!");
                    },
                error: function (error) {
                console.log(error)
                MessageToast.show("Cannot update record");
            },
            })
        },
        onCancleDialog: function(){
            this.update.close()
            },
        OnNavigate: function () {
            this.getOwnerComponent().getRouter().navTo("view2");
        }
    });
});
