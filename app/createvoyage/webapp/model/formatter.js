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
  };
});
