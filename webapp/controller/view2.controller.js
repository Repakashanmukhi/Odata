sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
     "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, ODataModel, MessageBox, MessageToast) {
    "use strict";
    var that;
    return Controller.extend("odata.controller.view2", {
        onInit: function () {
          that= this;
          var oRouter = that.getOwnerComponent().getRouter();
          var oRoute = oRouter.getRoute("view2");
          oRoute.attachPatternMatched(that._onRouteMatched, that);
          jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jsPDF");
          jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js", "jsPDFAutoTable");

      },
      
      _onRouteMatched: function (oEvent) {
        // to get parameters 
          var oArgs = oEvent.getParameter("arguments");
          // JSON.Parse is used to return array instead of an object
          var aTableData = JSON.parse(oArgs.tableData);   
          console.log("Complete Table Data:", aTableData); 
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
         onOpenDialog: function()
        {
            if(!that.Emergency)
            {
                that.Emergency = sap.ui.xmlfragment("odata.Fragments.Personal Info", that);
                that.getView().addDependent(that.Emergency);
            }
            that.Emergency.open();
        },
        onSubmit: function(){
            let oEmg = {
                EmployeeID :sap.ui.getCore().byId("Employee_Id").getValue(),
                ContactName :sap.ui.getCore().byId("ContactName").getValue(),
                Relationship :sap.ui.getCore().byId("Relationship").getValue(),
                ContactPhone :sap.ui.getCore().byId("ContactPhone").getValue(),
                ContactEmail: sap.ui.getCore().byId("ContactEmail").getValue()            
            }
            var oModel = that.getOwnerComponent().getModel();
            oModel.create("/EmployeeInfoEmergencyContact",oEmg,{
                success:function(response){
                    sap.m.MessageToast.show("successfull");
                    oModel.refresh();
                },error:function(error){
                    sap.m.MessageToast.show("Error");
                    console.log(error);
                }
            })
            that.Emergency.close();
        },
        OnClose: function()
        {
            that.Emergency.close()
        },
        // UpdateBtn: function () {
        //     var oTable = this.byId("Employee");
        //     var oModel = this.getView().getModel(); 
        //     this._bEditMode = !this._bEditMode;
        //     var aFields = ["EmployeeID", "ContactName", "Relationship", "ContactPhone", "ContactEmail"];
        //     oTable.getItems().forEach(function (oItem) {
        //         var oContext = oItem.getBindingContext(); 
        //         var sPath = oContext.getPath();
        //         var aNewCells = [];
        //         aFields.forEach(function (sField) {
        //             if (this._bEditMode) {
        //                 var oCell = new sap.m.Input({
        //                 value: "{path: '" + sField + "', mode: 'OneWay'}"
        //             });
        //             oCell.setBindingContext(oContext);
        //             } else {
        //             var sValue = oModel.getProperty(sPath + "/" + sField);
        //             oCell = new sap.m.Text({ text: sValue });
        //         }
        //         aNewCells.push(oCell);
        //         }, this);
        //         var oActionCell = new sap.m.HBox({
        //             items: [
        //                 new sap.m.Button({
        //                     icon: "sap-icon://delete",
        //                     press: this.DeleteBtn.bind(this),
        //                     type: "Reject"
        //                 })
        //             ]
        //         });
        //         aNewCells.push(oActionCell);
        //         oItem.removeAllCells();
        //         aNewCells.forEach(function (oCell) {
        //             oItem.addCell(oCell);
        //         });
        //             var oUpdatedData = oModel.getProperty(sPath);
        //             oModel.update(sPath, oUpdatedData, {
        //                 success: function () {
        //                     console.log("Updated successfully");
        //                 },
        //                 error: function (oError) {
        //                     console.error("Update failed", oError);
        //                 }
        //             });
        //     }, this);
        // },
        UpdateBtn: function () {
            var oTable = this.byId("Employee");
            var oModel = this.getView().getModel(); 
            this._bEditMode = !this._bEditMode;
            var aFields = ["EmployeeID", "ContactName", "Relationship", "ContactPhone", "ContactEmail"];
            oTable.getItems().forEach(function (oItem) {
                var oContext = oItem.getBindingContext(); 
                var sPath = oContext.getPath();
                var aNewCells = [];
                    if (this._bEditMode) {
                    aFields.forEach(function (sField) {
                        var oCell = new sap.m.Input({
                            value: "{" + sField + "}" 
                        });
                        oCell.setBindingContext(oContext);
                        aNewCells.push(oCell);
                    });
                } else {
                    var oUpdatedData = {};
                    aFields.forEach(function (sField, i) {
                        var oCell = oItem.getCells()[i];
                        var sNewValue = oCell.getValue();
                        oUpdatedData[sField] = sNewValue;
                        var oTextCell = new sap.m.Text({ 
                            text: sNewValue 
                        });
                        aNewCells.push(oTextCell);
                    });
                    oModel.update(sPath, oUpdatedData, {
                        success: function () {
                            console.log("Updated successfully");
                        },
                        error: function (oError) {
                            console.error("Update failed", oError);
                        }
                    });
                }
                var oActionCell = new sap.m.HBox({
                    items: [
                        new sap.m.Button({
                            icon: "sap-icon://delete",
                            press: this.DeleteBtn.bind(this),
                            type: "Reject"
                        })
                    ]
                });
                aNewCells.push(oActionCell);
                oItem.removeAllCells();
                aNewCells.forEach(function (oCell) {
                    oItem.addCell(oCell);
                });
            }, this);
        },
      onPDFDownload: function () {
        var oTable = that.getView().byId("Employee");
        var aItems = oTable.getItems();
        var aTableData = [
            ["EmployeeID", "ContactName", "Relationship", "ContactPhone", "ContactEmail"] 
        ];
        aItems.forEach(function (oItem) {
            var oBindingContext = oItem.getBindingContext();
            if (oBindingContext) {
                aTableData.push([
                    oBindingContext.getProperty("EmployeeID"),
                    oBindingContext.getProperty("ContactName"),
                    oBindingContext.getProperty("Relationship"),
                    oBindingContext.getProperty("ContactPhone"),
                    oBindingContext.getProperty("ContactEmail")
                ]);
            }
        });
        console.log(aTableData);
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF();
        doc.text("Employee Contacts Report", 14, 20); 
        doc.autoTable({
            startY: 30, 
            head: [aTableData[0]],
            body: aTableData.slice(1),
            theme: 'plain',  
        });
        doc.save("Employee_Contacts.pdf");
    },
        NavBack: function(){
            that.getOwnerComponent().getRouter().navTo("RouteView1");
       },
       onNavigation: function(){
            that.getOwnerComponent().getRouter().navTo("view3");
       }
    })
 });
