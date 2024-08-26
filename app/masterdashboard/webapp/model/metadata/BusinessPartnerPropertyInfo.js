sap.ui.define([
], function() {
	"use strict";


const aPropertyInfos = [{
	key: "Lifnr",
	label: "Vendor No",
	path: "Lifnr",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Name1",
	label: "Name",
	path: "Name1",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Stras",
	label: "Street",
	path: "Stras",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Pstlz",
	label: "Postal Code",
	path: "Pstlz",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Ort01",
	label: "City",
	path: "Ort01",
	dataType: "sap.ui.model.type.String",
	visible: true
	// groupable: true
},{
	key: "Land1",
	label: "Country",
	path: "Land1",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Erdat",
	label: "Creation Date",
	path: "Erdat",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "Telf2",
	label: "Telephone",
	path: "Telf2",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "Telf1",
	label: "PhoneNumber1",
	path: "Telf1",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "Telfx",
	label: "FaxNumber",
	path: "Telfx",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "SmtpAddr",
	label: "Address",
	path: "SmtpAddr",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "Regio",
	label: "Region",
	path: "Regio",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "Anred",
	label: "Title",
	path: "Anred",
	dataType: "sap.ui.model.type.String",
	visible: true
},{
	key: "Spras",
	label: "Language",
	path: "Spras",
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
