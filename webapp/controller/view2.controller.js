sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
     
    return Controller.extend("odata.controller.View2", {
        onInit() {
       
        if(!this.Personalinfo){
            this.Personalinfo=sap.ui.xmlfragment("odata.Fragments.Personalinfo",this)
        }
        },
        Info: function(){
            this.Personalinfo.open();
        },
       
             
        
    })
})
