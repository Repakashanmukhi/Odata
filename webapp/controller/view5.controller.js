sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
     "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, ODataModel, MessageBox, MessageToast,Fragment) {
    "use strict";
    var that;
    return Controller.extend("odata.controller.view5", {
        onInit: function () {
          that= this;
          var oRouter = that.getOwnerComponent().getRouter();
          var oRoute = oRouter.getRoute("view5");
          oRoute.attachPatternMatched(that._onRouteMatched, that);
      },
      _onRouteMatched: function (oEvent) {
        var oTable = this.getView().byId("EmployeePay");
        var oBinding = oTable.getBinding("items");
        oBinding.filter([]);
        var oSorter = new sap.ui.model.Sorter("EmployeeID_ID", false); 
        oBinding.sort(oSorter);
      },
      formatPayDate: function (sDate) {
        if (sDate) {
            var oDate = new Date(sDate);
            var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
            return oFormatter.format(oDate);
        }
    },
      onOpenDialog: function(){
        if(!that.payDialog){
          that.payDialog = sap.ui.xmlfragment("odata.Fragments.PayCreate", that)
        }
        that.payDialog.open();
      },
      onCreatePayslip: function () {
        var oView = this.getView();
        var oModel = oView.getModel(); 
        var id = sap.ui.getCore().byId("IDInputPay").getValue();
        var employeeId = sap.ui.getCore().byId("employeeIdInput").getValue();
        var payDate = sap.ui.getCore().byId("payDatePicker").getDateValue(); 
        var basicPay = parseFloat(sap.ui.getCore().byId("basicPayInput").getValue());
        var deduction = parseFloat(sap.ui.getCore().byId("DeductionInput").getValue());
        var netPay = basicPay - deduction;
        oModel.setProperty("/NetPay", netPay);
        var oPayslipData = {
            ID: id,
            EmployeeID_ID: employeeId,
            PayDate: payDate,
            BasicPay: basicPay,
            Deductions: deduction,
            NetPay: netPay,
            PayslipDocument: ""
        };
        oModel.create("/EmployeePayslips", oPayslipData, {
            success: function (oData, response) {
                sap.m.MessageBox.success("Payslip created successfully!");
                that.payDialog.close();  
            },
            error: function (oError) {
                sap.m.MessageBox.error("Error while creating payslip. Please try again.");
                console.error(oError);
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
    onUpdateDialog: function(){
      if(!that.updatepay){
        that.updatepay = sap.ui.xmlfragment("odata.Fragments.PayUpdate", that)
      }
      var oTable = that.getView().byId("EmployeePay"); 
      var oSelectedItems = oTable.getSelectedItems(); 
      var selectedEmployees = [];
      for (var i = 0; i < oSelectedItems.length; i++) { 
          var item = oSelectedItems[i]; 
          var oEmp = item.getBindingContext().getObject(); 
          selectedEmployees.push(oEmp); 
      } 
      var oSelectedEmployeesModel = new sap.ui.model.json.JSONModel(); 
      oSelectedEmployeesModel.setData({ selectedEmployees: selectedEmployees }); 
      that.updatepay.setModel(oSelectedEmployeesModel, "selectedEmployeesModel"); 
      that.updatepay.open(); 
    },
    onSave: function(){
      var oModel= that.updatepay.getModel("selectedEmployeesModel");
      var oDataModel= that.getView().getModel();
      var aEmployees= oModel.getProperty("/selectedEmployees");
      aEmployees.forEach(function(employee) {
        var payDate = employee.PayDate;
        var BasicPay = employee.BasicPay;
        var Deductions = employee.Deductions;
        var netpay = BasicPay - Deductions;
        var oUpdatedData = {
          PayDate: payDate,
          BasicPay: BasicPay,
          Deductions: Deductions,
          NetPay: netpay
        }
        var sPath = "/EmployeePayslips('"+employee.ID+"')"
        oDataModel.update(sPath, oUpdatedData,{
          success: function(){
            MessageToast.show("Leave data updated successfully");
          },
          error: function(){
            MessageBox.error("Failed to update Leave Data")
          }
        })
      })
    },                      
    onPdf: function(oEvent) {
      if (!that.uploadPdf) {
          that.uploadPdf = sap.ui.xmlfragment("odata.Fragments.PDFupload", that);
      }
      var oTable = oEvent.getSource().getBindingContext().getProperty("EmployeeID_ID");
      that._selectedEmployeeId = oTable; 
      that.uploadPdf.open();
  },
  onFileChange: function(oEvent) {
    var aFile = oEvent.getParameter("files")[0];
    if (aFile) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var fileContent = e.target.result;
            var sEmployeeId = that._selectedEmployeeId;
            if (!sEmployeeId) {
                MessageBox.error("No employee selected. Please try again.");
                return;
            }
            var updatedData = {
                PayslipDocument: fileContent
            };
            var sPath = "/EmployeePayslips('" + sEmployeeId + "')";
            var oModel = that.getView().getModel();
            oModel.update(sPath, updatedData, {
                success: function() {
                    MessageToast.show("Payslip uploaded successfully!");
                    that.uploadPdf.close(); 
                },
                error: function(oError) {
                    MessageBox.error("Failed to upload the payslip. Please try again.");
                    console.error(oError);
                }
            });
        };
        reader.readAsDataURL(aFile);
    } else {
        MessageBox.warning("Please select a file to upload.");
    }
},

    onPDFDocument: function (oEvent) {
      var oButton = oEvent.getSource();
      var oContext = oButton.getBindingContext();
      var oData = oContext.getObject();
      var sPdfUrl = oData.PayslipDocument;
  
      if (sPdfUrl) {
          window.open(sPdfUrl, "_blank");
      } else {
          MessageBox.warning("No payslip document available.");
      }
  },
    onClose: function(){
      that.updatepay.close();
    },
    NavBack: function(){
      that.getOwnerComponent().getRouter().navTo("RouteView1")
    },
      onPay: function(){
        that.getOwnerComponent().getRouter().navTo("view6")
      }
    })
 });