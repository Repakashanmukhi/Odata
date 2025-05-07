sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat"

], function (Controller,DateFormat) {
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
    NavBack: function(){
        that.getOwnerComponent().getRouter().navTo("RouteView1")
    }
    })
 });
