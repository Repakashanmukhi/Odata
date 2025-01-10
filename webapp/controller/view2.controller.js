sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, JSONModel, ODataModel) {
    "use strict";
     var that;
    return Controller.extend("odata.controller.view2", {
        onInit: function () {
            that=this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.getRoute('view2').attachPatternMatched(that.PersonalInfo, that);
            if(!that.Personalinfo){
               that.Personalinfo=sap.ui.xmlfragment("odata.Fragments.Personalinfo", that);
            }
		},
        onCLick: function(oClick){
            var oContext = oClick.getSource().getBindingContext().getObject();
            sap.ui.getCore().byId("eEmployee_Id").setValue(oContext.ID);
            sap.ui.getCore().byId("eContactName").setValue(oContext.ContactName);
            sap.ui.getCore().byId("eRelationship").setValue(oContext.Relationship);
            sap.ui.getCore().byId("eContactPhone").setValue(oContext.ContactPhone);
            sap.ui.getCore().byId("eContactEmail").setValue(oContext.ContactEmail);
            that.Personalinfo.open();
        
        },
        OnClose: function(){
            that.Personalinfo.close();
        },
        PersonalInfo: function(oEvent){
            var oData = oEvent.getParameter("arguments");
            var ID = oData.Ids;
            var Name= oData.FName;
            that.Personalinfo.setTitle(Name);
            that.EmpInfo(ID);
        },
        EmpInfo: function(ID){
            this.getOwnerComponent().getModel().read("/EmployeeInfoEmergencyContact",{
                success:function(response){
                    var filteredEmployees = response.results.filter(employee=> employee.EmployeeID_ID === ID);
                    console.log(filteredEmployees);
                    var oModel = new sap.ui.model.json.JSONModel({
                        items: filteredEmployees
                    })
                    that.byId("Data").setModel(oModel);
                },error:function(error){
                    sap.m.MessageToast.show("Error");
                    console.log(error);
                }
            })
        },
        NavBack: function(){
            that.getOwnerComponent().getRouter().navTo("RouteView1");
       },
    })
 });
