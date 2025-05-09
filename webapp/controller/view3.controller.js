sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller,DateFormat,JSONModel,MessageToast) {
    "use strict";
    var that;
    return Controller.extend("odata.controller.view3", {
        onInit: function () {
          that= this;
          var oRouter = that.getOwnerComponent().getRouter();
          var oRoute = oRouter.getRoute("view3");
          oRoute.attachPatternMatched(that._onRouteMatched, that);
      },
      _onRouteMatched: function (oEvent) {
       
      },
      formatDate: function (sDate) {
        if (sDate) {
            var oDate = new Date(sDate);
            var oFormatter = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            return oFormatter.format(oDate);
        }
    },
    formatStatus: function(status) { 
        switch (status) { 
            case "Approved": 
                return "Success"; 
            case "Rejected": 
                return "Error"; 
            case "Hold": 
                return "Warning"; 
        } 
    },
    DeleteBtn: function(oEvent){
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
    onOpenDialog: function(){
        if(!that.Leave){
            that.Leave = sap.ui.xmlfragment("odata.Fragments.Leave", that);        
        }
        that.Leave.open();
    },
    onAddRow: function () {
        var oEmployeeModel = that.getView().getModel("employeeModel");
        if (!oEmployeeModel) {
            oEmployeeModel = new sap.ui.model.json.JSONModel({ Employees: [] });
            that.getView().setModel(oEmployeeModel, "employeeModel");
        }
        var aEmployees = oEmployeeModel.getProperty("/Employees");
        var TempEmp = {
            ID: sap.ui.getCore().byId("LID").getValue(),
            EmployeeID_ID: sap.ui.getCore().byId("LemployeeID").getValue(),
            LeaveStartDate: sap.ui.getCore().byId("LSD").getValue(),
            LeaveEndDate: sap.ui.getCore().byId("LED").getValue(),
            LeaveType: sap.ui.getCore().byId("LeaveType").getValue(),
            Reason: sap.ui.getCore().byId("LReason").getValue(),
            Status: sap.ui.getCore().byId("LStatus").getValue()
        };
        if (TempEmp.ID && TempEmp.EmployeeID_ID && TempEmp.LeaveStartDate && TempEmp.LeaveEndDate && TempEmp.LeaveType && TempEmp.Reason && TempEmp.Status){
            aEmployees.push(TempEmp);
            oEmployeeModel.setProperty("/Employees", aEmployees);
        }
    },
    
    onSubmitDialog: function () { 
        var oLeaveModel = this.getView().getModel("employeeModel"); 
        var aLeaves = oLeaveModel.getProperty("/Employees"); 
        var oData = this.getOwnerComponent().getModel(); 
        for (var i = 0; i < aLeaves.length; i++) { 
            var oLeave = aLeaves[i]; 
            var oNewLeave = {
                ID: oLeave.ID,
                EmployeeID_ID: oLeave.EmployeeID_ID,
                LeaveStartDate: this.formatDate(oLeave.LeaveStartDate), 
                LeaveEndDate: this.formatDate(oLeave.LeaveEndDate), 
                LeaveType: oLeave.LeaveType,
                Reason: oLeave.Reason,
                Status: oLeave.Status
            };                
            oData.create("/EmployeeLeaveLog", oNewLeave, { 
                success: function () { 
                    MessageToast.show("Employee leave data submitted successfully!"); 
                }, 
                error: function (error) { 
                    MessageToast.show("Error submitting employee leave data!"); 
                } 
            }); 
        } 
        oLeaveModel.setProperty("/Employees", []); 
    },
    onClose: function(){
        that.Leave.close();
    },
         onUpdate: function(oEvent){
             if (!that.updateLeave) {
                 that.updateLeave = sap.ui.xmlfragment("odata.Fragments.updateLeave", that);
             }
             var oContext = oEvent.getSource().getBindingContext().getObject(); 
             sap.ui.getCore().byId("inputEmployeeID").setValue(oContext.EmployeeID_ID);
             sap.ui.getCore().byId("inputLeaveStartDate").setValue(oContext.LeaveStartDate);
             sap.ui.getCore().byId("inputLeaveEndDate").setValue(oContext.LeaveEndDate);
             sap.ui.getCore().byId("inputLeaveType").setValue(oContext.LeaveType);
             sap.ui.getCore().byId("inputReason").setValue(oContext.Reason);
             sap.ui.getCore().byId("inputStatus").setValue(oContext.Status);
             that.updateLeave.open();
         },
         onUpdateDialog: function () {
             var sId = sap.ui.getCore().byId("inputEmployeeID").getValue();
             var sLSD = sap.ui.getCore().byId("inputLeaveStartDate").getValue();
             var sLED = sap.ui.getCore().byId("inputLeaveEndDate").getValue(); 
             var sLT = sap.ui.getCore().byId("inputLeaveType").getValue();
             var sR = sap.ui.getCore().byId("inputReason").getValue();
             var sS = sap.ui.getCore().byId("inputStatus").getValue();
             var oUpdateLeaveLog = {
                 EmployeeID_ID: sId,
                 LeaveStartDate: new Date(sLSD),
                 LeaveEndDate: new Date(sLED),
                 LeaveType: sLT,
                 Reason: sR,
                 Status: sS
             };
             var oDataModel = that.getOwnerComponent().getModel();
             var updatePath = "/EmployeeLeaveLog('" + sId + "')";
             oDataModel.update(updatePath, oUpdateLeaveLog, {
                 success: function () {
                     sap.m.MessageToast.show("Leave log updated successfully.");
                 },
                 error: function (oError) {
                     sap.m.MessageBox.error("Failed to update leave log. Please try again.");
                 }
             });
         },
    NavBack: function(){
        that.getOwnerComponent().getRouter().navTo("RouteView1")
    },
    onNavigation: function(){
        that.getOwnerComponent().getRouter().navTo("view4")
    }
    })
 });
