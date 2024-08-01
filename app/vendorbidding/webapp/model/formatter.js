sap.ui.define([], function () {
    "use strict";
  
    return {
        dateFormat: function (oDate) {
            let date = new Date(oDate);

            let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: 'yyyy-MM-dd',
            });
            return oDateFormat.format(date);
        },


        formatBidTime: function (time) {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
        
            if (time) {
                let timeParts = time.split(':');
                let hours = pad(parseInt(timeParts[0], 10));
                let minutes = pad(parseInt(timeParts[1], 10));
                let seconds = pad(parseInt(timeParts[2], 10));
                return `${hours}:${minutes}:${seconds}`;
            } else {
                let now = new Date();
                let hours = pad(now.getHours());
                let minutes = pad(now.getMinutes());
                let seconds = pad(now.getSeconds());
                return `${hours}:${minutes}:${seconds}`;
            }
        }, 


        formatTime: function () {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
        
            let now = new Date();
            let hours = pad(now.getHours());
            let minutes = pad(now.getMinutes());
            let seconds = pad(now.getSeconds());
        
            return `${hours}:${minutes}:${seconds}`;
        }, 


        formatDateTime: function (date, time) {
            
            let date1 = new Date(date);
            let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: 'yyyy-MM-dd',
            });
            let newDate = oDateFormat.format(date1);;
            if (newDate && time) {
                return newDate + " " + time;
            }
            return "N/A"
        },

        formatNumber: function(value) {
            if (!value) {
                return "";
            }
            var number = parseFloat(value);
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(number) ;
        },  
       
    };
  });