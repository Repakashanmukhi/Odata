sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
     "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, ODataModel, MessageBox, MessageToast) {
    "use strict";
    return Controller.extend("odata.controller.view2", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
          var oRoute = oRouter.getRoute("view2");
          oRoute.attachPatternMatched(this._onRouteMatched, this);
      },
      
      _onRouteMatched: function (oEvent) {
        // to get parameters 
          var oArgs = oEvent.getParameter("arguments");
          // JSON.Parse is used to return array instead of an object
          var aTableData = JSON.parse(oArgs.tableData);   
          console.log("Complete Table Data:", aTableData); 
      },
        NavBack: function(){
            this.getOwnerComponent().getRouter().navTo("RouteView1");
       },
    })
 });
