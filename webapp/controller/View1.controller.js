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
        // passing formatter details to formatter property.
        formatter: formatter,
        onInit: function () 
        {
            that=this;
            var TempEmployee = new JSONModel({
                Employees: []
            });
            that.getView().setModel(TempEmployee, "employeeModel");
            // Create a new model.
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ selectedItems: [] });
            // Set the model to the component.
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
            // Get the view object to access its elements and models.
            var oView = that.getView(); 
             // Get the employee model.
            var oEmployeeModel = that.getView().getModel("employeeModel");
            // Get the current list of employees from the model.
            var aEmployees = oEmployeeModel.getProperty("/Employees"); 
            // Create a new employee object with data taken from the form inputs.
            var TempEmp = {
                FirstName: sap.ui.getCore().byId("efirstName").getValue(), 
                LastName: sap.ui.getCore().byId("elastName").getValue(),
                Email: sap.ui.getCore().byId("eEmail").getValue(),  
                Phone: sap.ui.getCore().byId("ePhone").getValue(),  
                BloodGroup: sap.ui.getCore().byId("eBloodGroup").getValue(),
                Department: sap.ui.getCore().byId("edepartment").getValue(), 
                Position: sap.ui.getCore().byId("eposition").getValue(),
                JoiningDate: sap.ui.getCore().byId("eJoiningDate").getValue()  
            };
            // Check if all required fields are filled.
            if (TempEmp.FirstName && TempEmp.LastName && TempEmp.Email && TempEmp.Phone && TempEmp.BloodGroup && TempEmp.Department && TempEmp.Position && TempEmp.JoiningDate) {
                var oModel = that.getView().getModel();  
                // Add the new employee object to the list of employees.
                aEmployees.push(TempEmp);  
                // Update the model with the new list of employees.
                oEmployeeModel.setProperty("/Employees", aEmployees);  
                // Clear the form after adding the employee.
                that.onClear();  
            } else {
                MessageToast.show("Please fill all the fields!");
            }
        },
        onSubmitDialog: function () {
        // Get the employee model which holds the employee data.
        var oEmployeeModel = that.getView().getModel("employeeModel");
         // Get the list of employees from the model.
        var aEmployees = oEmployeeModel.getProperty("/Employees"); 
        // Get the OData model.
        var oData = that.getOwnerComponent().getModel();  
        // Looping for each employee and sending the data to the OData service.
        for (var i = 0; i < aEmployees.length; i++) {
            var oEmployee = aEmployees[i];  
            // Creating a new employee object for sending it to the backend.
            var oNewEmployee = {
                FirstName: oEmployee.FirstName,
                LastName: oEmployee.LastName,  
                Email: oEmployee.Email,  
                Phone: oEmployee.Phone, 
                BloodGroup: oEmployee.BloodGroup, 
                Department: oEmployee.Department,  
                Position: oEmployee.Position, 
                JoiningDate: oEmployee.JoiningDate 
                };
            // Syntax to create an employee data in oData service.
            oData.create("/EmployeeInfo", oNewEmployee, { 
                success: function () {
                            //success message.
                            MessageToast.show("Employee data submitted successfully!");
                        },
                        error: function (error) {
                            //error message.
                            MessageToast.show("Error submitting employee data!");
                        }
                    });
                }
        // After submitting, clear the employees list in the model. 
        oEmployeeModel.setProperty("/Employees", []);
},
          // To clear the data.
        onClear: function () 
        {
            sap.ui.getCore().byId("efirstName").setValue(""); 
            sap.ui.getCore().byId("elastName").setValue(" ");
            sap.ui.getCore().byId("eEmail").setValue("");
            sap.ui.getCore().byId("ePhone").setValue("");
            sap.ui.getCore().byId("eBloodGroup").setValue("");
            sap.ui.getCore().byId("edepartment").setValue("");
            sap.ui.getCore().byId("eposition").setValue("");
            sap.ui.getCore().byId("eJoiningDate").setValue("");
        },
        DeleteBtn: function(oEvent)
        {
            var oButton=oEvent.getSource();
            // Bringing the binding context of the button.
            var oContext=oButton.getBindingContext();
            // Get the path of the context (Location).
            var sPath=oContext.getPath();
            // Get the model from the view which holds the data. 
            var oModel=that.getView().getModel();
            // Syntax to Delete the record in oData Serivice.
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
            // Bring the value from the table to update fragment using Id's.
            var oContext = oEvent.getSource().getBindingContext().getObject(); 
            sap.ui.getCore().byId("id_E").setValue(oContext.ID);
            sap.ui.getCore().byId("FirstName_E").setValue(oContext.FirstName);
            sap.ui.getCore().byId("FirstName_E").setValue(oContext.LastName);
            sap.ui.getCore().byId("Email_E").setValue(oContext.Email);
            sap.ui.getCore().byId("Phone_E").setValue(oContext.Phone);
            sap.ui.getCore().byId("BloodGroup_E").setValue(oContext.BloodGroup);
            sap.ui.getCore().byId("Department_E").setValue(oContext.Department);
            sap.ui.getCore().byId("Position_E").setValue(oContext.Position);
            sap.ui.getCore().byId("JoiningDate_E").setValue(oContext.JoiningDate);
            that.update.open();
        },
        onUpdateDialog: function()
        {
            // storing the updated value into the table. 
            var sId = sap.ui.getCore().byId("id_E").getValue();
            var sfirstName = sap.ui.getCore().byId("FirstName_E").getValue();
            var sLastName = sap.ui.getCore().byId("LastName_E").getValue();
            var sEmail = sap.ui.getCore().byId("Email_E").getValue();
            var sPhone = sap.ui.getCore().byId("Phone_E").getValue();
            var sBloodGroup= sap.ui.getCore().byId("BloodGroup_E").getValue();
            var sDepartment = sap.ui.getCore().byId("Department_E").getValue();
            var sPosition = sap.ui.getCore().byId("Position_E").getValue();
            var sJoiningDate=sap.ui.getCore().byId("JoiningDate_E").getValue();
            // Object to store the updated values.
                var oUpdatedEmployee = {
                    ID:sId,
                    FirstName: sfirstName,
                    LastName: sLastName,
                    Email: sEmail,
                    Phone: sPhone,
                    BloodGroup: sBloodGroup,
                    Department: sDepartment,
                    Position: sPosition,
                    JoiningDate: sJoiningDate
                };
                // Getting the model and storing it into oData. 
                var oData = that.getOwnerComponent().getModel();
                // Binding with EntityName of the table.
                var updatePath = `/EmployeeInfo(guid'${sId}')`
                // Syntax to update the record in oData Serivice. 
                oData.update(updatePath, oUpdatedEmployee,{
                    // Success Message.
                    success: function()
                    {
                        sap.m.MessageToast.show("Record updated successfully!");
                    },
                    // Eroor Message.
                error: function (error) 
                {
                console.log(error)
                MessageToast.show("Cannot update record");
                }   
           })
           // Closing the fragment once the data get updated in table. 
           that.update.close()
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
            // Bring the view of table and storing them into oTable.
            var oTable = this.getView().byId("employeeTable");
            // Bring items of the table and storing them into aItem.
            var aItems = oTable.getItems(); 
            // Creating an array to push each and every column.
            var aTableData=[];
            // Using forEach method we call a function for each element in array. 
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
                    var sJoiningDate = oBindingContext.getProperty("JoiningDate");
                    // Pushing the binded data into aTableData.
                    aTableData.push({
                        EmployeeId: sEmployeeId,
                        FirstName: sFirstName,
                        LastName: sLastName,
                        Email: sEmail,
                        Phone: sPhone,
                        BloodGroup: sBloodGroup,
                        Department: sDepartment,
                        Position: sPosition,
                        JoiningDate: sJoiningDate
                    });
                } 
            });
            // Navigation for view 2.
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("view2", {
                // JSON.stringify is used to convert an object into a string. 
                tableData: JSON.stringify(aTableData)  
            });
        },
    onDownload: function(oEvent) 
    {
        var oTable = this.getView().byId("employeeTable");
        var aItems = oTable.getItems();
        console.log(aItems)
        // Initializing the table data array with column headers.
        var aTableData = [
            ["EmployeeId", "FirstName", "LastName", "Email", "Phone", "BloodGroup", "Department", "Position", "JoiningDate"] 
        ];
        aItems.forEach(function(oItem) 
        {
            // Get binding context for all properties.
            var oBindingContext = oItem.getBindingContext();
            if (oBindingContext) {
                // Push a new row into the aTableData array using binding context.
                aTableData.push([
                    oBindingContext.getProperty("ID"),
                    oBindingContext.getProperty("FirstName"),
                    oBindingContext.getProperty("LastName"),
                    oBindingContext.getProperty("Email"),
                    oBindingContext.getProperty("Phone"),
                    oBindingContext.getProperty("BloodGroup"),
                    oBindingContext.getProperty("Department"),
                    oBindingContext.getProperty("Position"),
                    oBindingContext.getProperty("JoiningDate")
                ]);
            }   
        });
        // XLSX is used to store spreedsheet data.
        // XLSX.utils.aoa_to_sheet- creates worksheets from array of arrays.
        var oSheet = XLSX.utils.aoa_to_sheet(aTableData);
        // XLSX.utils.book_new- creates a new book.
        var oWorkbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet- Appends Worksheet to a Workbook.
        XLSX.utils.book_append_sheet(oWorkbook, oSheet, "Employee Data");  
        var sFileName = "EmployeeData.xlsx";
        // XLSX.writeFile- Geneates and saves the file in system.
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
        var aFile = oEvent.getParameter("files");
        if (aFile.length > 0) 
        {
            var oFile = aFile[0];
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
                that.selectedFile = oFile;  
                that.jsonData = jsonData;
            } 
            //readAsArrayBuffer()- starts reading the content of specific file 
            reader.readAsArrayBuffer(oFile);
        }
    },     
    ExcelUpload: function () {
        // Get the data from onFileChange(jsonData)
        var oData = that.jsonData;
        // Get oData model
        var oModel = that.getOwnerComponent().getModel();
        // Use forEach function to check each and every field in the sheet
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
            // Filter methods to check duplicate record exists or not 
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
                        console.log("Duplicate entries found ", entry);
                        var oEntry = {
                            ID: existingRecord.ID,
                            FirstName: entry.FirstName,
                            LastName: entry.LastName,
                            Email: entry.Email,
                            Phone: entry.Phone + "",
                            BloodGroup: entry.BloodGroup,
                            Department: entry.Department,
                            Position: entry.Position,
                            JoiningDate: formattedJoiningDate 
                        };
                        oModel.update("/EmployeeInfo(" + existingRecord.ID+ ")", oEntry, {
                            success: function (response) {
                                console.log("Record updated successfully:", response);
                            },
                            error: function (error) {
                                console.log("Update failed:", error);
                            }
                        });
                    } 
                    else {
                        var oEntry = {
                            FirstName: entry.FirstName,
                            LastName: entry.LastName,
                            Email: entry.Email,
                            Phone: entry.Phone + "",
                            BloodGroup: entry.BloodGroup,
                            Department: entry.Department,
                            Position: entry.Position,
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
                error: function (error) {
                    console.log("Error fetching data:", error);
                }
            });
        });
    },
        close: function() 
        {
        that.upload.close();
        }
    });
}); 

