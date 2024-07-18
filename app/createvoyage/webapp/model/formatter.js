//ddsjk


sap.ui.define([], function () {
  "use strict";

  return {
    timeFormat: function (oTime) {
      let time = new Date(oTime);

      var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
        pattern: "'PT'HH'H'mm'M'ss'S'",
      });

      return oTimeFormat.format(time);
    },
    costFormat: function (cost) {
      let oFormatOptions = {
        groupingSeparator: ",",
        decimalSeparator: ".",
        decimals: 2,
      };

      let oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);

      return oFloatFormat.format(Number(cost));
    },
    numberFormat: function (number) {
      let oFormatOptions = {
        groupingSeparator: ",",
        decimalSeparator: ".",
        decimals: 3,
      };

      // Remove grouping separator before formatting
      let formattedNumber = String(number).replace(/\,/g, '');
      let oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);


      return oFloatFormat.format(Number(formattedNumber));
    },
    timestampToUtc: function (sInput) {
      if (sInput !== undefined) {
        sInput = new Date(sInput);
        let timeA = sInput;
        let timeYear = timeA.getUTCFullYear();
        let tempMonth = timeA.getUTCMonth();
        tempMonth++; // Months are Indexed from 0 (0 being January and 11 being December)
        let timeMonth = tempMonth < "10" ? `0${tempMonth}` : tempMonth; // Append 0 when less than 10, (convert 5 -> 05)
        let timeDate = timeA.getUTCDate() < "10" ? "0" + timeA.getUTCDate() : timeA.getUTCDate();
        let timeHours = timeA.getUTCHours() < "10" ? "0" + timeA.getUTCHours() : timeA.getUTCHours();
        let timeMinutes = timeA.getUTCMinutes() < "10" ? "0" + timeA.getUTCMinutes() : timeA.getUTCMinutes();
        let timeSeconds = timeA.getUTCSeconds() < "10" ? "0" + timeA.getUTCSeconds() : timeA.getUTCSeconds();
        let timeB = `${timeYear}-${timeMonth}-${timeDate}T${timeHours}:${timeMinutes}:${timeSeconds}`;
        return timeB;
      }
      return sInput;
    },
    timeStringToDateObj: function (timeString) {
      if (timeString) {
        // Split the time string into components
        let timeParts = timeString.split(":");

        // Extract hours, minutes, and seconds
        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10);
        let seconds = parseInt(timeParts[2], 10);

        // Create a new Date object with the current date
        let date = new Date();
        date.setHours(hours, minutes, seconds, 0); // 0 milliseconds

        return date;
      }
      return null;
    },

    dateStringToDateObj: function (dateString) {
      if (dateString) {
        return new Date(dateString);
      }
      return null;
    },
    dateFormatV4: function(date) {
      let d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();
  
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
  
      return [year, month, day].join('-');
    },
    
    timeFormatV4: function(time) {
      let time1 = new Date( time );
      let hours = '' + time1.getHours();
      let minutes = '' + time1.getMinutes();
      let seconds = '' + time1.getSeconds();
  
      if (hours.length < 2) hours = '0' + hours;
      if (minutes.length < 2) minutes = '0' + minutes;
      if (seconds.length < 2) seconds = '0' + seconds;
  
      return [hours, minutes, seconds].join(':');
    }
  };
});
