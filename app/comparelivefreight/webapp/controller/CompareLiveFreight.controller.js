sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, Fragment) {
    "use strict";

    return Controller.extend("com.ingenx.nauti.comparelivefreight.controller.CompareLiveFreight", {
        onInit: function () {
            this._oBusyDialog = new sap.m.BusyDialog();
        },

        // This function is using for open the dialog box
        _showBusyDialog: function (text) {
            this._oBusyDialog.setText(text || "Processing...");
            this._oBusyDialog.open();
        },

        // This function is using for closing the dialog box
        _hideBusyDialog: function () {
            this._oBusyDialog.close();
        },

        // This function is using extract the vendor data based on voyage number
        _fetchBidData: async function (voyageNo) {
            const oModel = this.getOwnerComponent().getModel();
            const oBidListData = oModel.bindList("/contaward_tableSet", undefined, undefined, undefined, {
                $filter: `Voyno eq '${voyageNo}'`
            });

            this._showBusyDialog("Loading data, please wait...");

            try {
                const oContexts = await oBidListData.requestContexts(0, Infinity);
                const data = oContexts.map(oContext => oContext.getObject());
                const awardTable = this.getView().byId("vendorDetailsLayout");

                if (!data.length) {
                    sap.m.MessageToast.show(`Data not found for Voyage Number: ${voyageNo}`);
                    awardTable.setVisible(false);
                } else {
                    const aChrnminValues = data.map(item => item.Chrnmin);
                    const aAdditionalData = await this._fetchAdditionalData(aChrnminValues);
                    const aMergedData = this._mergeData(data, aAdditionalData);

                    const dModel = new sap.ui.model.json.JSONModel(aMergedData);
                    this.getView().setModel(dModel, "compareLiveFreightModel");

                    awardTable.setVisible(true);
                    console.log("Bid details data:", dModel.getData());
                }
            } catch (error) {
                console.error("Error fetching bid data:", error);
            } finally {
                this._hideBusyDialog();
            }
        },

        // This function is using for extract the rank score data
        _fetchAdditionalData: async function (Charter) {
            const oModel = this.getOwnerComponent().getModel();
            const oAdditionData = oModel.bindList("/CompareLiveFreight", undefined, undefined, undefined, {
                $filter: `Chrnmin eq '${Charter}'`
            });

            try {
                const oContexts = await oAdditionData.requestContexts(0, Infinity);
                return oContexts.map(oContext => oContext.getObject());
            } catch (error) {
                console.error("Error fetching additional data:", error);
                return [];
            }
        },

        // This function is using for merging the selected vendor data and rank score data
        _mergeData: function (aMainData, aAdditionalData) {
            return aMainData.map(oMainItem => {
                const oAdditionalItem = aAdditionalData.find(oAddItem => oAddItem.Voyno === oMainItem.Voyno);

                if (oAdditionalItem) {
                    const oVendorData = oAdditionalItem.Vendors.find(vendor => vendor.vendorId === oMainItem.Lifnr);
                    if (oVendorData) {
                        oMainItem.Crank = oVendorData.Crank;
                        oMainItem.Trank = oVendorData.Trank;
                    }
                }

                return oMainItem;
            });
        },

        booleanFormatter: function (value) {
            return value ? "X" : "";
        },

        // This function is used for opening the vendor details value help dialog box
        onRowSelect: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("compareLiveFreightModel");
            const rowData = oContext.getObject();
            const oModel = new sap.ui.model.json.JSONModel(rowData);

            const oView = this.getView();
            if (!this._oDialog2) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.ingenx.nauti.comparelivefreight.fragments.Details",
                    controller: this
                }).then(oDialog => {
                    this._oDialog2 = oDialog;
                    oView.addDependent(this._oDialog2);
                    this._oDialog2.setModel(oModel, "vendorDetail");
                    this._oDialog2.open();
                });
            } else {
                this._oDialog2.setModel(oModel, "vendorDetail");
                this._oDialog2.open();
            }
        },

        oncancell: function () {
            this._oDialog2.close();
        },

        // This function is using for open the dialog box
        onCharteringNumber: function (oEvent) {
            const oView = this.getView();
            this._oInputField = oEvent.getSource();

            if (!this.countryOfOrigin) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.ingenx.nauti.comparelivefreight.fragments.Charter",
                    controller: this
                }).then(oDialog => {
                    this.countryOfOrigin = oDialog;
                    oView.addDependent(this.countryOfOrigin);
                    this._clearAndRefreshDialogData().then(() => {
                        this.countryOfOrigin.open();
                    });
                });
            } else {
                this._clearAndRefreshDialogData().then(() => {
                    this.countryOfOrigin.open();
                });
            }
        },

        // This function is using for refres the value help's model data
        _clearAndRefreshDialogData: function () {
            return new Promise((resolve, reject) => {
                try {
                    const oBinding = this.countryOfOrigin.getBinding("items");

                    if (oBinding) {
                        oBinding.filter([]);
                        oBinding.refresh();
                        setTimeout(resolve, 500);
                    } else {
                        reject("Binding not found");
                    }
                } catch (err) {
                    reject(err);
                }
            });
        },

        // This function is used for closing the value help
        onValueHelpClosevoy: async function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                const sSelectedValue = oSelectedItem.getTitle();
                this._oInputField.setValue(sSelectedValue);

                try {
                    await this._fetchBidData(sSelectedValue);
                } catch (error) {
                    console.log("Selected item is not found");
                }
            }
        },

        // This function is used for searching the voyage in value help
        onValueHelpSearch: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const aFilters = [];

            if (sValue) {
                aFilters.push(new Filter("Chrnmin", FilterOperator.Contains, sValue));
                aFilters.push(new Filter("voyno", FilterOperator.Contains, sValue));
            }

            const oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(new Filter({
                filters: aFilters,
                and: false
            }));
        },

        // This function is used for given the contract award to a specific vendor
        onContractLiveFreightBtn: function () {
            const oTable = this.byId("createTypeTable");
            const aSelectedContexts = oTable.getSelectedContexts();

            if (aSelectedContexts.length === 0) {
                sap.m.MessageToast.show("Please select at least one row.");
                return;
            }

            aSelectedContexts.forEach(oContext => {
                const oData = oContext.getObject();
                this._postDataPayload(oData);
            });
        },

        // This function is used for creating the payload of vendor data and this calling from onContractLiveFreightBtn
        _postDataPayload: async function (awardData) {
            const oPayload = {
                "Chrnmin": awardData.Chrnmin,
                "Voyno": awardData.Voyno,
                "Lifnr": awardData.Lifnr,
                "Zcode": awardData.Zcode,
                "Biddate": awardData.Biddate,
                "Bidtime": awardData.Bidtime,
                "CodeDesc": awardData.CodeDesc,
                "Value": "",
                "Cvalue": awardData.Cvalue,
                "Cunit": awardData.Cunit,
                "Chrqsdate": awardData.Chrqsdate,
                "Chrqstime": awardData.Chrqstime,
                "Chrqedate": awardData.Chrqedate,
                "Chrqetime": awardData.Chrqetime,
                "DoneBy": awardData.DoneBy,
                "Uname": awardData.Lifnr,
                "Stat": awardData.Stat,
                "Zmode": awardData.Zmode,
                "Zcom": awardData.Zcom,
                "Rank": awardData.Rank
            };

            await this._sendAwardDataToS4(oPayload);
        },

        // This method is used for checking the data i.e. available or not on server and this function calling from _postDataPayload
        _sendAwardDataToS4: function (oPayload) {
            debugger
            const awardModel = this.getOwnerComponent().getModel();
            this._showBusyDialog("Checking for duplicates, please wait...");

            const oListBinding = awardModel.bindList("/awardcontractSet");
            let allData = []
            oListBinding.requestContexts().then(aContexts => {
                this._hideBusyDialog();

                const hasDuplicate = aContexts.some(oContext => {
                    const oData = oContext.getObject();
                    return (
                        oData.Chrnmin === oPayload.Chrnmin &&
                        oData.Voyno === oPayload.Voyno
                    );
                });
                // const fData = aContexts.forEach(oContext=>{
                //     allData.push(oContext.getObject())
                // })
                // let findData = fData.find(item=>{
                //     return (item.Chrnmin === oPayload.Chrnmin &&
                //               item.Voyno === oPayload.Voyno)
                // })

                if (hasDuplicate) {
                    sap.m.MessageToast.show("Duplicate entry found.");
                } else {
                    this._postToServer(oPayload);
                    this._hideBusyDialog();
                }
            }).catch(oError => {
                this._hideBusyDialog();
                console.error("Error checking duplicates:", oError);
                sap.m.MessageToast.show("Error checking for duplicates.");
            });
        },

        // This method is using for post the data on server and this function called from _sendAwardDataToS4
        _postToServer: function (oPayload) {
            const awardModel = this.getOwnerComponent().getModel();
            this._showBusyDialog("Creating award...");
            let oBindList = awardModel.bindList("/awardcontractSet")

            oBindList.create(oPayload,true).created().then(oContext=>{
                sap.m.MessageBox.success("Award created",{
                    title:"Award"
                })
            }).catch(oError=>{
                console.log("Error message:",oError);
            })
        }
    });
});
