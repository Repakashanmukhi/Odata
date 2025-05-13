sap.ui.define([ 
    "sap/ui/core/mvc/Controller", 
    "sap/m/MessageToast", 
    "sap/ui/thirdparty/jquery", 
    "sap/ui/core/Fragment" 
  ], function (Controller, MessageToast, jQuery, Fragment) { 
    "use strict"; 
   
    return Controller.extend("odata.controller.view6", { 
   
      onInit: function () { 

        var jQueryScript1 = document.createElement('script');
            jQueryScript1.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js');
            document.head.appendChild(jQueryScript1);

            var jQueryScript2 = document.createElement('script');
            jQueryScript2.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js');
            document.head.appendChild(jQueryScript2);

        var oData = { 
          FirstName: "Shanmukhi", 
          LastName: "Repaka", 
          EmployeeID: "EMP01", 
          Department: "SAP UI5", 
          Position: "Trainee", 
          Salary: "50000", 
          JoiningDate: "2024-09-02", 
          Email: "shanmukhirepaka@gmail.com", 
          Phone: "7386518289", 
          PayDate: "2024-12-31", 
          BasicPay: 50000, 
          Deductions: 5000, 
          NetPay: 45000 
        }; 
        var oModel = new sap.ui.model.json.JSONModel(oData); 
        this.getView().setModel(oModel); 
      },  
    onDownloadPayslip: function () {
        var oData = this.getView().getModel().getData();
        var deductions = [
          { type: "Provident Fund (PF)", amount: 2000 },
          { type: "Professional Tax", amount: 1000 },
          { type: "Other Deductions", amount: 2000 }
        ];
      
        var deductionTableBody = [
          [
            { text: "Deduction Type", style: "tableHeader" },
            { text: "Amount (₹)", style: "tableHeader" }
          ]
        ];
      
        deductions.forEach(function (ded) {
          deductionTableBody.push([
            { text: ded.type, margin: [0, 4, 0, 4] },
            { text: ded.amount.toFixed(2), alignment: 'right', margin: [0, 4, 0, 4] }
          ]);
        });
        var employeeDetailsTable = {
          layout: {
            hLineWidth: function () { return 0; },  
            vLineWidth: function () { return 0; },  
            paddingLeft: function () { return 3; },  
            paddingRight: function () { return 3; }, 
            paddingTop: function () { return 3; },  
            paddingBottom: function () { return 3; }
          },
          table: {
            widths: ['30%', '70%'],
            body: [
              [{ text: 'Employee ID', bold: true }, oData.EmployeeID],
              [{ text: 'Department', bold: true }, oData.Department],
              [{ text: 'Position', bold: true }, oData.Position],
              [{ text: 'Joining Date', bold: true }, oData.JoiningDate],
              [{ text: 'Email', bold: true }, oData.Email],
              [{ text: 'Phone', bold: true }, oData.Phone]
            ]
          },
          margin: [0, 0, 0, 10]  
        };
        var docDefinition = {
          content: [
            { text: 'SBP Consulting Pvt. Ltd.', style: 'companyHeader' },
            { text: `Payslip for ${oData.FirstName} ${oData.LastName}`, style: 'header' },
      
            { text: '\nEmployee Details', style: 'sectionHeader' },
            employeeDetailsTable,
      
            { text: '\nDeduction Breakdown', style: 'sectionHeader' },
            {
              table: {
                widths: ['*', 'auto'],
                body: deductionTableBody
              },
              layout: 'lightHorizontalLines',
              margin: [0, 0, 0, 10]
            },
      
            { text: '\nSalary Summary', style: 'sectionHeader' },
            {
              table: {
                widths: ['*', '*'],
                body: [
                  [
                    { text: 'Basic Pay', alignment: 'left', margin: [0, 4, 0, 4] },
                    { text: `₹ ${oData.BasicPay.toFixed(2)}`, alignment: 'right', margin: [0, 4, 0, 4] }
                  ],
                  [{ text: '', colSpan: 2, border: [false, false, false, false] }, {}],
                  [
                    { text: 'Total Deductions', alignment: 'left', margin: [0, 4, 0, 4] },
                    { text: `₹ ${oData.Deductions.toFixed(2)}`, alignment: 'right', margin: [0, 4, 0, 4] }
                  ],
                  [
                    { text: 'Net Pay', bold: true, alignment: 'left', margin: [0, 6, 0, 6] },
                    { text: `₹ ${oData.NetPay.toFixed(2)}`, bold: true, alignment: 'right', margin: [0, 6, 0, 6] }
                  ]
                ]
              },
              layout: {
                hLineWidth: function (i) {
                  return (i === 1) ? 0 : 0.5; 
                },
                vLineWidth: function () { return 0.5; },
                hLineColor: function () { return '#aaa'; },
                vLineColor: function () { return '#aaa'; }
              },
              margin: [0, 0, 0, 10]
            },
      
            { text: `\nPay Date: ${oData.PayDate}`, style: 'footer' }
          ],
      
          styles: {
            companyHeader: {
              fontSize: 20,
              bold: true,
              alignment: 'center',
              margin: [0, 0, 0, 20]
            },
            header: {
              fontSize: 16,
              bold: true,
              alignment: 'center',
              margin: [0, 0, 0, 10]
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              margin: [0, 15, 0, 5]
            },
            tableHeader: {
              bold: true,
              fillColor: '#eeeeee'
            },
            footer: {
              italics: true,
              alignment: 'right',
              margin: [0, 20, 0, 0]
            }
          },
          defaultStyle: {
            fontSize: 10
          }
        };
      
        pdfMake.createPdf(docDefinition).download("Payslip.pdf");
      }
    }); 
  });

