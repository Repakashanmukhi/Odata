sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "odata/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet"
], function (Controller,MessageBox,MessageToast,formatter,JSONModel,Spreadsheet) {
    "use strict";
    var that;
    return Controller.extend("odata.controller.View1", {
        formatter: formatter,
        onInit: function () 
        {
            that=this;
            var jQueryScript = document.createElement('script');
            jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js');
            document.head.appendChild(jQueryScript); 
            jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jsPDF");
            jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js", "jsPDFAutoTable");
            // jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
            var TempEmployee = new JSONModel({
                Employees: []
            });
            that.getView().setModel(TempEmployee, "employeeModel");
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ selectedItems: [] });
            this.getOwnerComponent().setModel(oModel, "selectedDataModel");            
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
        formatJoiningDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
                return oFormatter.format(oDate);
            }
        },
        onAddRow: function()
        {
            var oEmployeeModel = that.getView().getModel("employeeModel");
            var aEmployees = oEmployeeModel.getProperty("/Employees"); 
            var TempEmp = {
                FirstName: sap.ui.getCore().byId("efirstName").getValue(), 
                Email: sap.ui.getCore().byId("eEmail").getValue(),  
                Phone: sap.ui.getCore().byId("ePhone").getValue(),  
                BloodGroup: sap.ui.getCore().byId("eBloodGroup").getValue(),
                Department: sap.ui.getCore().byId("edepartment").getValue(), 
                Position: sap.ui.getCore().byId("eposition").getValue(),
                Salary: sap.ui.getCore().byId("esalary").getValue(),
                JoiningDate: sap.ui.getCore().byId("eJoiningDate").getValue()  
            };
            if (TempEmp.FirstName &&  TempEmp.Email && TempEmp.Phone && TempEmp.BloodGroup && TempEmp.Department && TempEmp.Position && TempEmp.Salary && TempEmp.JoiningDate) {
                var oModel = that.getView().getModel();  
                aEmployees.push(TempEmp);  
                oEmployeeModel.setProperty("/Employees", aEmployees);  
                that.onClear();  
            } else {
                MessageToast.show("Please fill all the fields!");
            }
        },
        onSubmitDialog: function () {
        var oEmployeeModel = that.getView().getModel("employeeModel");
        var aEmployees = oEmployeeModel.getProperty("/Employees"); 
        var oData = that.getOwnerComponent().getModel();  
        for (var i = 0; i < aEmployees.length; i++) {
            var oEmployee = aEmployees[i];  
            var oNewEmployee = {
               FirstName: oEmployee.FirstName,
                LastName: oEmployee.LastName,   
                Email: oEmployee.Email,  
                Phone: oEmployee.Phone, 
                BloodGroup: oEmployee.BloodGroup, 
                Department: oEmployee.Department,  
                Position: oEmployee.Position, 
                Salary: oEmployee.Salary,
                JoiningDate: oEmployee.JoiningDate 
                };
            oData.create("/EmployeeInfo", oNewEmployee, { 
                success: function () {
                            MessageToast.show("Employee data submitted successfully!");
                        },
                        error: function (error) {
                            MessageToast.show("Error submitting employee data!");
                        }
                    });
                }
        oEmployeeModel.setProperty("/Employees", []);
        that.onclose();
    },
        onClear: function () 
        {
            sap.ui.getCore().byId("efirstName").setValue(""); 
            sap.ui.getCore().byId("eEmail").setValue("");
            sap.ui.getCore().byId("ePhone").setValue("");
            sap.ui.getCore().byId("eBloodGroup").setValue("");
            sap.ui.getCore().byId("edepartment").setValue("");
            sap.ui.getCore().byId("eposition").setValue("");
            sap.ui.getCore().byId("esalary").setValue("");
            sap.ui.getCore().byId("eJoiningDate").setValue("");
        },
        DeleteBtn: function(oEvent)
        {
            var oButton=oEvent.getSource();
            // Bringing the binding context of the button.
            var oContext=oButton.getBindingContext();
            // Get the path of the context (Location).
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
            sap.ui.getCore().byId("BloodGroup_E").setValue(oContext.BloodGroup);
            sap.ui.getCore().byId("Department_E").setValue(oContext.Department);
            sap.ui.getCore().byId("Position_E").setValue(oContext.Position);
            sap.ui.getCore().byId("Salary_E").setValue(oContext.Salary);
            sap.ui.getCore().byId("JoiningDate_E").setValue(oContext.JoiningDate);
            that.update.open();
        },
        onUpdateDialog: function () {
            var sId = sap.ui.getCore().byId("id_E").getValue();
            var sfirstName = sap.ui.getCore().byId("FirstName_E").getValue();
            var sEmail = sap.ui.getCore().byId("Email_E").getValue();
            var sPhone = sap.ui.getCore().byId("Phone_E").getValue();
            var sBloodGroup = sap.ui.getCore().byId("BloodGroup_E").getValue();
            var sDepartment = sap.ui.getCore().byId("Department_E").getValue();
            var sPosition = sap.ui.getCore().byId("Position_E").getValue();
            var sSalary = sap.ui.getCore().byId("Salary_E").getValue();
            var sJoiningDate = sap.ui.getCore().byId("JoiningDate_E").getValue();
        
            var oUpdatedEmployee = {
                ID: sId,
                FirstName: sfirstName,
                Email: sEmail,
                Phone: sPhone,
                BloodGroup: sBloodGroup,
                Department: sDepartment,
                Position: sPosition,
                Salary: sSalary,
                JoiningDate: sJoiningDate
            };
        
            var oData = that.getOwnerComponent().getModel();
            var updatePath = "/EmployeeInfo('" + sId + "')";
            oData.update(updatePath, oUpdatedEmployee, {
                success: function () {
                    sap.m.MessageToast.show("Record updated successfully!");
                },
                error: function (error) {
                    console.log(error);
                    sap.m.MessageToast.show("Cannot update record");
                }
            });
        
            that.update.close();
        },        
        onCancleDialog: function()
        { 
            that.update.close()
        },
        // Multi navigation for only selected ids.
        // MultiNavigate: function () {
        //     var oTable = this.getView().byId("employeeTable");
        //     var aSelectedItems = oTable.getSelectedItems();
        //     if (aSelectedItems && aSelectedItems.length > 0) {
        //         var aSelectedIds = [];
        //         aSelectedItems.forEach(function (oItem) {
        //             var sEmployeeId = oItem.getBindingContext().getProperty("ID");
        //             aSelectedIds.push(sEmployeeId);
        //         });
        //         var oRouter = this.getOwnerComponent().getRouter();
        //         oRouter.navTo("view2", {
        //             selectedIds: JSON.stringify(aSelectedIds)
        //         });
        //     } 
        // },
        // MultiNavigation for complete table. 
        MultiNavigate: function () {
            var oTable = this.getView().byId("employeeTable");
            var aItems = oTable.getItems(); 
            var aTableData=[];
            aItems.forEach(function (oItem) {
            // Binding the context- binding context is used to bind the elements into the specific object in a model. 
                var oBindingContext = oItem.getBindingContext();
                    if (oBindingContext) {
                    var sEmployeeId = oBindingContext.getProperty("ID");
                    var sFirstName = oBindingContext.getProperty("FirstName");
                    var sLastName = oBindingContext.getProperty("LastName")
                    var sEmail = oBindingContext.getProperty("Email");
                    var sPhone = oBindingContext.getProperty("Phone");
                    var sBloodGroup = oBindingContext.getProperty("BloodGroup");
                    var sDepartment = oBindingContext.getProperty("Department");
                    var sPosition = oBindingContext.getProperty("Positon");
                    var sSalary = oBindingContext.getProperty("Salary");
                    var sJoiningDate = oBindingContext.getProperty("JoiningDate");
                    aTableData.push({
                        EmployeeId: sEmployeeId,
                        FirstName: sFirstName, 
                        LastName: sLastName,
                        Email: sEmail,
                        Phone: sPhone,
                        BloodGroup: sBloodGroup,
                        Department: sDepartment,
                        Position: sPosition,
                        Salary: sSalary,
                        JoiningDate: sJoiningDate
                    });
                } 
            });
            var oRouter = this.getOwnerComponent().getRouter().navTo("view2", {
                // JSON.stringify is used to convert an object into a string. 
                tableData: JSON.stringify(aTableData)  
            });
        },
        onExcelDownload: function(oEvent) {
        var oTable = this.getView().byId("employeeTable");
        var aItems = oTable.getItems();
        console.log(aItems);
        var aTableData = [
            ["EmployeeId", "FullName", "Email", "Phone", "BloodGroup", "Department", "Position", "Salary", "JoiningDate"]
        ];
        aItems.forEach(function(oItem) {
            var oBindingContext = oItem.getBindingContext();
            if (oBindingContext) {
                var fullName = oBindingContext.getProperty("FirstName") + " " + oBindingContext.getProperty("LastName"); 
                aTableData.push([
                    oBindingContext.getProperty("ID"),
                    fullName, 
                    oBindingContext.getProperty("Email"),
                    oBindingContext.getProperty("Phone"),
                    oBindingContext.getProperty("BloodGroup"),
                    oBindingContext.getProperty("Department"),
                    oBindingContext.getProperty("Position"),
                    oBindingContext.getProperty("Salary"),
                    oBindingContext.getProperty("JoiningDate")
                ]);
            }
        }); 
        var oSheet = XLSX.utils.aoa_to_sheet(aTableData);
        var oWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(oWorkbook, oSheet, "Employee Data");
        var sFileName = "EmployeeData.xlsx";
        XLSX.writeFile(oWorkbook, sFileName);
    },
    handleUpload: function()
    {
        if (!that.upload) 
            {
                that.upload = sap.ui.xmlfragment("odata.Fragments.upload", that);
                that.getView().addDependent(that.upload);
            }
            that.upload.open();
    }, 
    onFileChange: function(oEvent) 
    {
        var aFile = oEvent.getParameter("files")[0];        
        // Initialising FileReader() to read the content.
        var reader = new FileReader();
        reader.onload = function(e) 
        {
            // Get the result from the FileReader.
            var data = e.target.result;
            // XLSX.read- Reads the file as an EXCEL workbook
            var workbook = XLSX.read(data, { 
                type: 'array'
            });
            // Get the sheet names from the workbook
            var sheetNames = workbook.SheetNames;
            // Select the first sheet in the workbook
            var sheet = workbook.Sheets[sheetNames[0]];
            //XLSX.utils.sheet_to_json- it Convert the sheet content into a JSON array of objects.
            var jsonData = XLSX.utils.sheet_to_json(sheet);
            console.log(jsonData);
            // Store the file for use in ExcelUpload
            that.selectedFile = aFile;  
            that.jsonData = jsonData;
        } 
        //readAsArrayBuffer()- starts reading the content of specific file 
        reader.readAsArrayBuffer(aFile); 
    },      
    onFileChange: function(){
        var aFile=oEvent.getParameter("files")[0];
        var reader = new FileReader();
        reader.onload=function(e)
        {
            var data = e.target.result;
        }
    },
    ExcelUpload: function () {
        var oData = that.jsonData;
        var oModel = that.getOwnerComponent().getModel();
        oData.forEach(function (entry) {
            // If JoiningDate is a number, convert it to a Date object
            var joiningdate = entry.JoiningDate;
            // Excel serial date to JavaScript Date
            joiningdate = new Date((joiningdate - 25569) * 86400 * 1000);
            // Format the date as 'YYYY-MM-DD'
            var year = joiningdate.getFullYear();
            var month = ("0" + (joiningdate.getMonth() + 1)).slice(-2);
            var day = ("0" + joiningdate.getDate()).slice(-2);
            // Combine into 'YYYY-MM-DD' format
            var formattedJoiningDate = `${year}-${month}-${day}`;
            // Filter method to check duplicate record exists or not 
            var aFilters = [
                new sap.ui.model.Filter({
                    path: 'FirstName',  
                    operator: sap.ui.model.FilterOperator.EQ, 
                    value1: entry.FirstName 
                }),
            ];
            oModel.read("/EmployeeInfo", {
                filters: aFilters,
                success: function (response) {
                    if (response.results && response.results.length > 0) {
                        var existingRecord = response.results[0]; 
                        console.log("Duplicate entries found in EmployeeInfo ", entry);
                        // Create Employee Entry to update
                        var oEmployeeEntry = {
                            ID: existingRecord.ID,
                            FirstName: entry.FirstName,
                            LastName: entry.LastName,
                            Email: entry.Email,
                            Phone: entry.Phone + "",
                            BloodGroup: entry.BloodGroup,
                            Department: entry.Department,
                            Position: entry.Position,
                            Salary: entry.Salary + "",
                            JoiningDate: formattedJoiningDate 
                        };
                        oModel.update("/EmployeeInfo(" + existingRecord.ID + ")", oEmployeeEntry, {
                            success: function (response) {
                                // MessageToast.show("Employee record updated successfully");
                            },
                            error: function (error) {
                                console.log("Employee update failed:", error);
                            }
                        }); 
                    }else {
                        var oEntry = {
                            FirstName: entry.FirstName,
                            LastName: entry.LastName,
                            Email: entry.Email,
                            Phone: entry.Phone + "",
                            BloodGroup: entry.BloodGroup,
                            Department: entry.Department,
                            Position: entry.Position,
                            Salary: entry.Salary + "",
                            JoiningDate: formattedJoiningDate 
                        };
                        oModel.create("/EmployeeInfo", oEntry, {
                            success: function (response) {
                                console.log("Upload successful: ", response);
                                that.close();
                            },
                            error: function (error) {
                                console.log("Upload failed: ", error);
                            }
                        });
                    }
                }, 
            });
        });
    },
        close: function() 
        {   
        that.upload.close();
        },
    });
});