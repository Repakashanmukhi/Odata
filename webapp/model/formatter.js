sap.ui.define([], function () {
    "use strict";

    return {
        // Formatter to convert Date format to 'yyyy-dd-MM'
        formatJoiningDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
                return oFormatter.format(oDate);
            }
            return "";
        }
    };
});
