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
          FirstName: "Rahul", 
          LastName: "Bajaj", 
          EmployeeID: "EMP03", 
          Department: "SAP UI5", 
          Position: "Technical Lead", 
          Salary: "100000", 
          JoiningDate: "2006-08-03", 
          Email: "rahulbajaj@gmail.com", 
          Phone: "9885686042", 
          PayDate: "2024-12-31", 
          BasicPay: 100000, 
          Deductions: 10000, 
          NetPay: 90000 
        }; 
        var oModel = new sap.ui.model.json.JSONModel(oData); 
        this.getView().setModel(oModel); 
      },  
    onDownloadPayslip: function () {
      var oData = this.getView().getModel().getData();
      var deductions = [
        { type: "Provident Fund (PF)", amount: 4000 },
        { type: "Professional Tax", amount: 2000 },
        { type: "Other Deductions", amount: 4000 }
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
      function createSalarySection(month, pageBreak = false) {
        return [
          ...(pageBreak ? [{ text: '', pageBreak: 'before' }] : []),
          { text: `1st of ${month} 2025`, italics: true, margin: [0, 10, 0, 4] },
          { text: `${month} 2025`, style: 'monthHeader' },
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
            margin: [0, 0, 0, 20]
          }
        ];
      }
      var docDefinition = {
        content: [
          { text: 'SBP Consulting Pvt. Ltd.', style: 'companyHeader' },
          { text: `Payslip Document for ${oData.FirstName} ${oData.LastName}`, style: 'header' },
          { text: '\nEmployee Details', style: 'sectionHeader' },
          employeeDetailsTable,
    
          { text: '\nDeduction Breakdown (Same for All Months)', style: 'sectionHeader' },
          {
            table: {
              widths: ['*', 'auto'],
              body: deductionTableBody
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 10]
          },
          { text: '\nMonthly Salary Summary', style: 'sectionHeader' },
          ...createSalarySection("January"),
          ...createSalarySection("February"),
          ...createSalarySection("March", true), // Page break before March
          { text: `\nGenerated On: ${new Date().toLocaleDateString()}`, style: 'footer' }
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
          monthHeader: {
            fontSize: 13,
            bold: true,
            margin: [0, 10, 0, 4]
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
      pdfMake.createPdf(docDefinition).download("EMP03.pdf");    
    }
    }); 
  });


