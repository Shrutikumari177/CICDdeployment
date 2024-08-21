sap.ui.define([
], function() {
	"use strict";

	const aPropertyInfos = [{
		key: "BusinessPartner",
		label: "BusinessPartner",
		path: "BusinessPartner",
		dataType: "sap.ui.model.type.String",
		// groupable: true,
		visible: true
	},{
		key: "Country",
		label: "Country",
		path: "Country",
		dataType: "sap.ui.model.type.String",
		visible: true
	},{
		key: "PostalCode",
		label: "PostalCode",
		path: "PostalCode",
		dataType: "sap.ui.model.type.String",
		visible: true
	},{
		key: "CityName",
		label: "CityName",
		path: "CityName",
		dataType: "sap.ui.model.type.String",
		visible: true
		// groupable: true
	},{
		key: "PhoneNumber1",
		label: "PhoneNumber1",
		path: "PhoneNumber1",
		dataType: "sap.ui.model.type.String",
		visible: true
		// groupable: true
	},{
		key: "FaxNumber",
		label: "FaxNumber",
		path: "FaxNumber",
		dataType: "sap.ui.model.type.String",
		visible: true
		// groupable: true
	},{
		key: "CreationDate",
		label: "CreationDate",
		path: "CreationDate",
		dataType: "sap.ui.model.type.String",
		visible: true
		// groupable: true
	},{
		key: "PhoneNumber2",
		label: "PhoneNumber2",
		path: "PhoneNumber2",
		dataType: "sap.ui.model.type.String",
		visible: true
		// groupable: true
	}
	// ,{
	// 	key: "Supplier",
	// 	label: "Supplier",
	// 	path: "Supplier",
	// 	dataType: "sap.ui.model.type.String"
	// },{
	// 	key: "PurchasingOrganization",
	// 	label: "PurchasingOrganization",
	// 	path: "PurchasingOrganization",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "BankCountry",
	// 	label: "BankCountry",
	// 	path: "BankCountry",
	// 	dataType: "sap.ui.model.type.String"
	// },{
	// 	key: "coordinBankates",
	// 	label: "coordinBankates",
	// 	path: "coordinBankates",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "BankAccount",
	// 	label: "BankAccount",
	// 	path: "BankAccount",
	// 	dataType: "sap.ui.model.type.Integer"
	// },{
	// 	key: "SupplierName",
	// 	label: "SupplierName",
	// 	path: "SupplierName",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "Bank",
	// 	label: "Bank",
	// 	path: "Bank",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "OrganizationBPName1",
	// 	label: "OrganizationBPName1",
	// 	path: "OrganizationBPName1",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "OrganizationBPName2",
	// 	label: "OrganizationBPName2",
	// 	path: "OrganizationBPName2",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "OrganizationBPName3",
	// 	label: "OrganizationBPName3",
	// 	path: "OrganizationBPName3",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "StreetName",
	// 	label: "StreetName",
	// 	path: "StreetName",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "CreatedByUser",
	// 	label: "CreatedByUser",
	// 	path: "CreatedByUser",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "IsNaturalPerson",
	// 	label: "IsNaturalPerson",
	// 	path: "IsNaturalPerson",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "TaxNumber1",
	// 	label: "TaxNumber1",
	// 	path: "TaxNumber1",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "TaxNumber2",
	// 	label: "TaxNumber2",
	// 	path: "TaxNumber2",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "TaxNumber3",
	// 	label: "TaxNumber3",
	// 	path: "TaxNumber3",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },
	// {
	// 	key: "TaxNumber4",
	// 	label: "TaxNumber4",
	// 	path: "TaxNumber4",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },
	// {
	// 	key: "TaxNumber5",
	// 	label: "TaxNumber5",
	// 	path: "TaxNumber5",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },
	// {
	// 	key: "VATRegistration",
	// 	label: "VATRegistration",
	// 	path: "VATRegistration",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "ResponsibleType",
	// 	label: "ResponsibleType",
	// 	path: "ResponsibleType",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },{
	// 	key: "TaxNumberType",
	// 	label: "TaxNumberType",
	// 	path: "TaxNumberType",
	// 	dataType: "sap.ui.model.type.String",
	// 	groupable: true
	// },


	,{
		key: "$search",
		label: "Search",
		visible: true,
		maxConditions: 1,
		dataType: "sap.ui.model.type.String"
	}



];

	return aPropertyInfos;
}, /* bExport= */false);
