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
                    sap.m.MessageToast.show("Displaying Employee List");
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




//  sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/Filter",
//     "sap/m/library"
// ], function(Controller, Filter, mobileLibrary) {
//     "use strict";
//     var that;
//     return Controller.extend("sbpmart.controller.View1", {
//         onInit: function () {
//             that = this;
//             var oModel = that.getOwnerComponent().getModel();
//             that.getView().setModel(oModel);
            
//             // Call applyBackgroundColor method when the view is initialized
//             that.applyBackgroundColorToRows();
            
//             if (!that.dialog1) {
//                 that.dialog1 = sap.ui.xmlfragment("sbpmart.fragments.createPlant", that);
//             }
//         },
        
//         applyBackgroundColorToRows: function () {
//             // Get the table control
//             var oTable = that.byId("plantTable");
//             // Get the binding context of the table items
//             var aItems = oTable.getItems();
            
//             // Loop through all the items in the table
//             aItems.forEach(function (oItem) {
//                 // Get the revenue value for this row
//                 var oRevenue = oItem.getBindingContext().getProperty("PLANT_REVENUE");
                
//                 // Determine the appropriate class based on the revenue value
//                 var className = "";
//                 if (oRevenue > 0 && oRevenue <= 25000) {
//                     className = "blue";  // Blue for this range
//                 } else if (oRevenue > 25000 && oRevenue <= 50000) {
//                     className = "green";  // Green for this range
//                 } else if (oRevenue > 50000 && oRevenue <= 75000) {
//                     className = "yellow";  // Yellow for this range
//                 } else {
//                     className = "red";  // Red for this range
//                 }
                
//                 // Apply the class to the row (add to the row's style class)
//                 oItem.addStyleClass(className);
//             });
//         },

//         // Other methods like onAddPlant, onCreatePlant, etc.
//         onAddPlant: function () {
//             that.dialog1.open();
//         },

//         onCreatePlant: function () {
//             let oPlant = {
//                 PLANT_ID: sap.ui.getCore().byId("p_id").getValue(),
//                 PLANT_NAME: sap.ui.getCore().byId("p_name").getValue(),
//                 PLANT_LOC: sap.ui.getCore().byId("p_loc").getValue(),
//                 PLANT_AVATAR: sap.ui.getCore().byId("p_avatar").getValue(),
//                 PLANT_CONT: sap.ui.getCore().byId("p_cont").getValue(),
//                 PLANT_EMAIL: sap.ui.getCore().byId("p_email").getValue(),
//                 PLANT_HEAD: sap.ui.getCore().byId("p_head").getValue(),
//                 PLANT_REVENUE: sap.ui.getCore().byId("p_rev").getValue(),
//                 PLANT_CUST_COUNT: sap.ui.getCore().byId("p_count").getValue(),
//             };
//             that.getOwnerComponent().getModel().create("/PLANTS", oPlant, {
//                 success: function (response) {
//                     sap.m.MessageToast.show("Plant Details added successfully");
//                 },
//                 error: function (error) {
//                     sap.m.MessageToast.show("Error while adding Plant");
//                     console.log(error);
//                 }
//             });
//             that.onRefresh();
//             that.dialog1.close();
//         },

//         onRefresh: function () {
//             sap.ui.getCore().byId("p_id").setValue("");
//             sap.ui.getCore().byId("p_name").setValue("");
//             sap.ui.getCore().byId("p_loc").setValue("");
//             sap.ui.getCore().byId("p_avatar").setValue("");
//             sap.ui.getCore().byId("p_cont").setValue("");
//             sap.ui.getCore().byId("p_email").setValue("");
//             sap.ui.getCore().byId("p_head").setValue("");
//             sap.ui.getCore().byId("p_rev").setValue("");
//             sap.ui.getCore().byId("p_count").setValue("");
//         },

//         onCancelPlant: function () {
//             that.dialog1.close();
//         },

//         onEmployeeList: function (oEvent) {
//             var oPlant = oEvent.getSource().getBindingContext().getProperty("PLANT_LOC");
//             that.getOwnerComponent().getRouter().navTo("View2", {
//                 plantLocation: oPlant
//             });
//         }
//     });
// });



// onAfterRendering: function () {
//     this.applyBackgroundColorToRows();
// }



