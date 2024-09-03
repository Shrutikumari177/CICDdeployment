/* eslint-disable require-await */
sap.ui.define([
	"sap/ui/mdc/ValueHelpDelegate",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (
	ValueHelpDelegate,
    Filter,
    FilterOperator,
   ) {
	"use strict";

	const JSONValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

	JSONValueHelpDelegate.getFilters = function (oValueHelp, oContent) {
		// create search filters
		const oPayload = oValueHelp.getPayload();
		let aFilters = [];
	
		if (oPayload && oPayload.searchKeys) {
			aFilters = oPayload.searchKeys.map((sPath) => {
				return new Filter({
					path: sPath,
					operator: FilterOperator.Contains,
					value1: oContent.getSearch()
				});
			});
		}
	
		const oSearchFilter = aFilters.length > 0 ? new Filter(aFilters, false) : null;
		return oSearchFilter ? [oSearchFilter] : [];
	};
	
	// enable typeahead
	JSONValueHelpDelegate.isSearchSupported = function (oValueHelp, oContent, oListBinding) {
		const oPayload = oValueHelp.getPayload();
		return oPayload && oPayload.searchKeys ? true : false;
	};
	


	return JSONValueHelpDelegate;
}, /* bExport= */false);