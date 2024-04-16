/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/ingenx/nauti/createvoyage/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.ingenx.nauti.createvoyage.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                let that = this;
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                dayjs.extend(dayjsPluginUTC.default);
                
                let oModel = this.getModel();
                let VHParams = [
                    {
                        sEntitySet: "VoyTypeSet",
                        sValueHelpName: "sVoyageTypes",
                        sModelAlias: "voyagetypes",
                        label: "sVoyageType",
                        description:"sVoyageTypeText",
                        skey:"Voycd",
                        sDes:"Voydes",

                    },
                    {
                        sEntitySet: "CarTypeSet",
                        sValueHelpName: "sCargoTypes",
                        sModelAlias: "cargotypes",
                        label:"sCargoType",
                        description:"sCargoTypeText",
                        skey:"Carcd",
                        sDes:"Cardes",
                    },
                    {
                        sEntitySet: "CurTypeSet",
                        sValueHelpName: "sCurrencyTypes",
                        sModelAlias: "currencytypes",
                        label:"sCurrencyType",
                        description:"sCurrencyTypeText",
                        skey:"Navoycur",
                        sDes:"Navoygcurdes",
                    },
                    {
                        sEntitySet: "BidTypeSet",
                        sValueHelpName: "sBidTypes",
                        sModelAlias: "bidtypes",
                        label: "sBidType",
                        description:"sBidTypeText",
                        skey:"DomvalueL",
                        sDes:"Ddtext",
                    },
                    {
                        sEntitySet: "CargoUnitSet",
                        sValueHelpName: "sCargoUnits",
                        sModelAlias: "cargounit",
                        label:"sCargoUnit",
                        description:"sCargoUnitText",
                        skey:"Uom",
                        sDes:"Uomdes",
                    }
                ]

                VHParams.forEach(e => {
                    this.setModel(models.initValueHelpModel(oModel, e.sEntitySet, e.sValueHelpName, e.label,e.description, e.skey, e.sDes), e.sModelAlias);
                })
            }
        });
    }
);