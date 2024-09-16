/* eslint-disable require-await */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/mdc/FilterBarDelegate",
	"com/ingenx/nauti/masterdashboard/model/metadata/BusinessPartnerPropertyInfo",
	"sap/ui/mdc/FilterField",
], function (Element, FilterBarDelegate, BusinessPartnerPropertyInfo, FilterField) {
	"use strict";
	
	const JSONFilterBarDelegate = Object.assign({}, FilterBarDelegate);

	JSONFilterBarDelegate.fetchProperties = async () => BusinessPartnerPropertyInfo;


	const _createFilterField = async (sId, oProperty, oController) => {

		const sPropertyKey = oProperty.key;
		console.log("controler", oController)
		const oFilterField = new FilterField(sId, {
			dataType: oProperty.dataType,
			// liveChange:  oController.onLiveChange ? oController.onLiveChange.bind(oController) : null,
			conditions: "{$filters>/conditions/" + sPropertyKey + '}',
			propertyKey: sPropertyKey,
			required: oProperty.required,
			valueHelp: "name-vh",
			label: oProperty.label,
			maxConditions: oProperty.maxConditions,
			delegate: {name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {}},
			operators: "Contains"
		});
		return oFilterField;
	};

	JSONFilterBarDelegate.addItem = async (oFilterBar, sPropertyKey, oController) => {
		const oProperty = BusinessPartnerPropertyInfo.find((oPI) => oPI.key === sPropertyKey);
		const sId = oFilterBar.getId() + "--filter--" + sPropertyKey;
		return Element.getElementById(sId) ?? (await _createFilterField(sId, oProperty, oController));
	};

	return JSONFilterBarDelegate;
}, /* bExport= */false);

