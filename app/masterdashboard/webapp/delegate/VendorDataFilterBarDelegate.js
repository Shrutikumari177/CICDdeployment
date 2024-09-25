/* eslint-disable require-await */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/mdc/FilterBarDelegate",
	"com/ingenx/nauti/masterdashboard/model/metadata/VendorDataFilterPropertyInfo",
	"sap/ui/mdc/FilterField",
	"sap/ui/core/Fragment"
], function (Element, FilterBarDelegate, VendorDataFilterPropertyInfo, FilterField, Fragment) {
	"use strict";

	const VendorDataFilterBarDelegate = Object.assign({}, FilterBarDelegate);

	VendorDataFilterBarDelegate.fetchProperties = async () => VendorDataFilterPropertyInfo;

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
			valueHelp: "name-vh",
			label: oProperty.label,
			maxConditions: oProperty.maxConditions,
			
			//  operators: "Contains",
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

	VendorDataFilterBarDelegate.addItem = async (oFilterBar, sPropertyKey) => {
		const oProperty = VendorDataFilterPropertyInfo.find((oPI) => oPI.key === sPropertyKey);
		const sId = oFilterBar.getId() + "--filter--" + sPropertyKey;
		return Element.getElementById(sId) ?? (await _createFilterField(sId, oProperty, oFilterBar));
	};

	return VendorDataFilterBarDelegate;
}, /* bExport= */false);