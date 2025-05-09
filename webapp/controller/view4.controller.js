sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
     "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, ODataModel, MessageBox, MessageToast) {
    "use strict";
    var that;
    return Controller.extend("odata.controller.view4", {
        onInit: function () {
          that= this;
          var oRouter = that.getOwnerComponent().getRouter();
          var oRoute = oRouter.getRoute("view4");
          oRoute.attachPatternMatched(that._onRouteMatched, that);
      },
      _onRouteMatched: function (oEvent) {
        
      },
      onOpenDialog: function(){
        if(!that.LeaveSetCreate){
          that.LeaveSetCreate = sap.ui.xmlfragment("odata.Fragments.LeavesetCreate", that);        
      }
        that.LeaveSetCreate.open();
      },
      onSubmit: function () {
        var oModel = that.getView().getModel();   
        var sID = sap.ui.getCore().byId("IDInput").getValue(); 
        var sEmployeeID = sap.ui.getCore().byId("employeeIDInput").getValue();
        var sTotalLeaves = sap.ui.getCore().byId("totalLeavesInput").getValue();
        var sLeavesUsed = sap.ui.getCore().byId("leavesUsedInput").getValue();
        var iTotalLeaves = parseInt(sTotalLeaves, 10);
        var iLeavesUsed = parseInt(sLeavesUsed, 10);
        var iLeaveBalance = iTotalLeaves - iLeavesUsed;
        var oPayload = {
          ID: sID,
          EmployeeID_ID: sEmployeeID,
          TotalLeaves: iTotalLeaves,
          LeavesUsed: iLeavesUsed,
          LeaveBalance: iLeaveBalance
        };
        oModel.create("/EmployeeLeaveSet", oPayload, {
            success: function () {
                MessageToast.show("Leave record created successfully.");
                that.LeaveSet.close();
            },
            error: function (oError) {
                MessageBox.error("could not create record");
            }
        });
    },
      DeleteBtn: function(oEvent){
        var oButton=oEvent.getSource();
        var oContext=oButton.getBindingContext();
        var sPath=oContext.getPath();
        var oModel=that.getView().getModel();
        oModel.remove(sPath,{
          success: function(){
            sap.m.MessageToast.show("Record deleted successfully!");
          },
          error: function(){
            sap.m.MessageToast.show("Cannot delete record");
          }
        }) 
      }, 
      onUpdateDialog: function() { 
        if (!that.updateLeaveSet) { 
          that.updateLeaveSet = sap.ui.xmlfragment("odata.Fragments.LeavesetUpdate", that); 
      } 
      var oTable = that.getView().byId("EmployeeLeaveDes"); 
      var oSelectedItems = oTable.getSelectedItems(); 
      var selectedEmployees = [];
      for (var i = 0; i < oSelectedItems.length; i++) { 
          var item = oSelectedItems[i]; 
          var oEmp = item.getBindingContext().getObject(); 
          selectedEmployees.push(oEmp); 
      } 
      var oSelectedEmployeesModel = new sap.ui.model.json.JSONModel(); 
      oSelectedEmployeesModel.setData({ selectedEmployees: selectedEmployees }); 
      that.updateLeaveSet.setModel(oSelectedEmployeesModel, "selectedEmployeesModel"); 
      that.updateLeaveSet.open(); 
  },
    onSave: function () { 
      var oModel = that.updateLeaveSet.getModel("selectedEmployeesModel"); 
      var oDataModel = that.getView().getModel(); 
      var aEmployees = oModel.getProperty("/selectedEmployees"); 
      aEmployees.forEach(function (employee) { 
          var totalLeaves = employee.TotalLeaves; 
          var leavesUsed = employee.LeavesUsed; 
          var leaveBalance = totalLeaves - leavesUsed; 
          var oUpdatedData = { 
              LeavesUsed: leavesUsed, 
              LeaveBalance: leaveBalance 
          }; 
            var sPath = "/EmployeeLeaveSet('" + employee.ID + "')"; 
          oDataModel.update(sPath, oUpdatedData, { 
              success: function () { 
                  MessageToast.show("Leave data updated successfully"); 
              }, 
              error: function () { 
                  MessageBox.error("Failed to update leave data."); 
              } 
          }); 
      }); 
      that.updateLeaveSet.close(); 
  },
  onNavigation: function(){
    that.getOwnerComponent().getRouter().navTo("view5")
  },
      NavBack: function(){
        that.getOwnerComponent().getRouter().navTo("RouteView1")
      }
    })
 });

