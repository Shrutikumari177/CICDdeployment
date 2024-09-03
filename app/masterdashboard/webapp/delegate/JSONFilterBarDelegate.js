/* eslint-disable require-await */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/mdc/FilterBarDelegate",
	"com/ingenx/nauti/masterdashboard/model/metadata/JSONPropertyInfo",
	"sap/ui/mdc/FilterField",
	"sap/ui/core/Fragment"
], function (Element, FilterBarDelegate, JSONPropertyInfo, FilterField, Fragment) {
	"use strict";

	const JSONFilterBarDelegate = Object.assign({}, FilterBarDelegate);

	JSONFilterBarDelegate.fetchProperties = async () => JSONPropertyInfo;

	const _createValueHelp = (oFilterBar, sPropertyName) => {
		const aKey = "com.ingenx.nauti.masterdashboard.fragments.";
		return Fragment.load({
			name: aKey + oFilterBar.getPayload().valueHelp[sPropertyName]
		}).then((oValueHelp) => {
			oFilterBar.addDependent(oValueHelp);
			return oValueHelp;
		});
	};

	const _createFilterField = async (sId, oProperty, oFilterBar) => {
		const sPropertyKey = oProperty.key;
		const oFilterField = new FilterField(sId, {
			dataType: oProperty.dataType,
			conditions: "{$filters>/conditions/" + sPropertyKey + '}',
			propertyKey: sPropertyKey,
			required: oProperty.required,
			label: oProperty.label,
			maxConditions: oProperty.maxConditions,
			delegate: { name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {} }
		});
	
		const oPayload = oFilterBar.getPayload();
		if (oPayload && oPayload.valueHelp && oPayload.valueHelp[sPropertyKey]) {
			const aDependents = oFilterBar.getDependents();
			let oValueHelp = null;
	
			for (let i = 0; i < aDependents.length; i++) {
				if (aDependents[i].getId().includes(sPropertyKey)) {
					oValueHelp = aDependents[i];
					break;
				}
			}
	
			if (!oValueHelp) {
				oValueHelp = await _createValueHelp(oFilterBar, sPropertyKey);
			}
	
			oFilterField.setValueHelp(oValueHelp);
		}
	
		return oFilterField;
	};
	
	JSONFilterBarDelegate.addItem = async (oFilterBar, sPropertyKey) => {
		const oProperty = JSONPropertyInfo.find((oPI) => oPI.key === sPropertyKey);
		const sId = oFilterBar.getId() + "--filter--" + sPropertyKey;
		const oElement = Element.getElementById(sId);
	
		if (oElement) {
			return oElement;
		} else {
			return await _createFilterField(sId, oProperty, oFilterBar);
		}
	};

	return JSONFilterBarDelegate;
}, /* bExport= */false);