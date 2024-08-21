/* eslint-disable require-await */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/mdc/FilterBarDelegate",
	"com/ingenx/nauti/masterdashboard/model/metadata/BusinessPartnerPropertyInfo",
	"sap/ui/mdc/FilterField",
	"sap/ui/core/Fragment",
	"com/ingenx/nauti/masterdashboard/delegate/JSONBaseDelegate"
], function (Element, FilterBarDelegate, BusinessPartnerPropertyInfo, FilterField, Fragment,
	JSONBaseDelegate) {
	"use strict";

	const JSONFilterBarDelegate = Object.assign({}, FilterBarDelegate, JSONBaseDelegate);

	JSONFilterBarDelegate.fetchProperties = async () => BusinessPartnerPropertyInfo;

	// const _createValueHelp = (oFilterBar, sPropertyName) => {
	// 	const aKey = "com.ingenx.nauti.masterdashboard.fragments.";
	// 	return Fragment.load({
	// 		name: aKey + oFilterBar.getPayload().valueHelp[sPropertyName]
	// 	}).then((oValueHelp) => {
	// 		oFilterBar.addDependent(oValueHelp);
	// 		return oValueHelp;
	// 	});
	// };

	const _createFilterField = async (sId, oProperty, oFilterBar) => {
		const sPropertyKey = oProperty.key;
		const oFilterField = new FilterField(sId, {
			dataType: oProperty.dataType,
			conditions: "{$filters>/conditions/" + sPropertyKey + '}',
			propertyKey: sPropertyKey,
			required: oProperty.required,
			label: oProperty.label,
			maxConditions: oProperty.maxConditions,
			delegate: {name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {}}
		});
		// if (oFilterBar.getPayload().valueHelp[sPropertyKey]) {
		// 	const aDependents = oFilterBar.getDependents();
		// 	let oValueHelp = aDependents.find((oD) => oD.getId().includes(sPropertyKey));
		// 	oValueHelp ??= await _createValueHelp(oFilterBar, sPropertyKey);
		// 	oFilterField.setValueHelp(oValueHelp);
		// }
		return oFilterField;
	};

	JSONFilterBarDelegate.addItem = async (oFilterBar, sPropertyKey) => {
		const oProperty = BusinessPartnerPropertyInfo.find((oPI) => oPI.key === sPropertyKey);
		const sId = oFilterBar.getId() + "--filter--" + sPropertyKey;
		return Element.getElementById(sId) ?? (await _createFilterField(sId, oProperty, oFilterBar));
	};

	return JSONFilterBarDelegate;
}, /* bExport= */false);