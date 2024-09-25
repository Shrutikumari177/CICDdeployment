sap.ui.define([
], function() {
	"use strict";


const aPropertyInfos = [{
	key: "Lifnr",
	label: "Vendor No",
	path: "Lifnr",
	dataType: "sap.ui.model.type.Integer",
	visible: true,
},{
	key: "Name1",
	label: "Name",
	path: "Name1",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Pstlz",
	label: "Postal Code",
	path: "Pstlz",
	dataType: "sap.ui.model.type.Integer",
	visible: true
},{
	key: "Ort01",
	label: "City",
	path: "Ort01",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Land1",
	label: "Country",
	path: "Land1",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Telf2",
	label: "Telephone",
	path: "Telf2",
	dataType: "sap.ui.model.type.Integer",
	visible: true
	
},{
	key: "Regio",
	label: "Region",
	path: "Regio",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{	
	key: "$search",
	label: "Search",
	visible: true,
	maxConditions: 1,
	dataType: "sap.ui.model.type.String"
}

];

	return aPropertyInfos;
}, /* bExport= */false);
