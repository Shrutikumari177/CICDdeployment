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
	visible: true,
	visualSettings: {
        widthCalculation: function (sValue) {
            const baseWidth = 100; // Set a minimum base width
            const charWidth = 8; // Approximate width per character (you can adjust this as needed)
            
            return `${Math.max(baseWidth, sValue.length * charWidth)}px`;
        }
    },
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
	key: "Erdat",
	label: "Creation Date",
	path: "Erdat",
	dataType: "sap.ui.model.type.String",
	visible: true
	
},{
	key: "Telf2",
	label: "Telephone",
	path: "Telf2",
	dataType: "sap.ui.model.type.Integer",
	visible: true
	
},{
	key: "Telf1",
	label: "PhoneNumber1",
	path: "Telf1",
	dataType: "sap.ui.model.type.Integer",
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
