/* eslint-disable require-await */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/mdc/TableDelegate",
	"sap/ui/mdc/table/Column",
	"sap/m/Text",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/ingenx/nauti/masterdashboard/model/metadata/VendorDataPropertyInfo"
], function (
	Element, TableDelegate, Column, Text, Filter, FilterOperator, VendorDataPropertyInfo) {
	"use strict";

	const VendorDataTableDelegate = Object.assign({}, TableDelegate);

	VendorDataTableDelegate.fetchProperties = async () =>
		VendorDataPropertyInfo.filter((oPI) => oPI.key !== "$search");

	const _createColumn = (sId, oPropertyInfo) => {
		const sPropertyKey = oPropertyInfo.key;
		return new Column(sId, {
			propertyKey: sPropertyKey,
			header: oPropertyInfo.label,
			template: new Text({
				text: {
					path: sPropertyKey,
					type: oPropertyInfo.dataType
				}
			})
		});
	};

	VendorDataTableDelegate.addItem = async (oTable, sPropertyKey) => {
		const oPropertyInfo = VendorDataPropertyInfo.find((oPI) => oPI.key === sPropertyKey);
		const sId = oTable.getId() + "---col-" + sPropertyKey;
		return Element.getElementById(sId) ?? (await _createColumn(sId, oPropertyInfo));
	};

	VendorDataTableDelegate.updateBindingInfo = (oTable, oBindingInfo) => {
		TableDelegate.updateBindingInfo.call(VendorDataTableDelegate, oTable, oBindingInfo);
		oBindingInfo.path = oTable.getPayload().bindingPath;
		oBindingInfo.templateShareable = true;
	};

	const _createSearchFilters = (sSearch, aKeys) => {
		const aFilters = aKeys.map((aKey) => new Filter({
			path: aKey,
			operator: FilterOperator.Contains,
			value1: sSearch
		}));
		return [new Filter(aFilters, false)];
	};

	VendorDataTableDelegate.getFilters = (oTable) => {
		
		const sSearch = Element.getElementById(oTable.getFilter()).getSearch();
		const aKeys = oTable.getPayload().searchKeys;
		let aFilters = TableDelegate.getFilters(oTable);
		if (sSearch && aKeys) {
			aFilters = aFilters.concat(_createSearchFilters(sSearch, aKeys));
		}
		return aFilters;
	};

	return VendorDataTableDelegate;
}, /* bExport= */false);