
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/util/Export",
        "sap/ui/export/ExportUtils",
        "sap/ui/core/util/ExportTypeCSV",

        "sap/ui/model/json/JSONModel",
        "com/ingenx/nauti/createvoyage/model/formatter",
        "sap/m/MessageBox",
        "com/ingenx/nauti/createvoyage/utils/helperFunctions"



    ],
    function (BaseController, Fragment, Filter, FilterOperator, Export, ExportUtils, ExportTypeCSV, JSONModel, formatter, MessageBox, helperFunctions) {
        "use strict";


        var voyHeaderModel = {};
        var voyItemModel = {};
        /**
         * @type {sap.ui.model.json.JSONModel}
         */
        var costdetailsModel = {};
        var voyageNum;

        var portData = [];
        var oBidCharterModel;
        var bidItemModel;
        var bidPayload = [];
        var voyageNumModel = [];
        var tempDataArr = [];
        var voyageNoArr = [];
        var myVOYNO;
        var oCommercialModel;
        var costDetailsData;
        let userEmail;
        var bidData = [];
        var voyageStatus;
        var selectedProfile;
        var referenceDocModel;


        return BaseController.extend("com.ingenx.nauti.createvoyage.controller.changeVoyage", {
            formatter: formatter,
            // for use in view of this controller explicit define to bound to 'this'


            onInit: async function () {
                // Refrence table code 

                // ref document  model
                referenceDocModel = new sap.ui.model.json.JSONModel({
                    documents: [
                        {
                            documentIndicator: "",
                            referenceDocumentNo: ""
                        }
                    ]
                });
                this.getView().setModel(referenceDocModel, "referenceModel");

                await this.getLoggedInUserInfo();
                this._rowCount = 0;
                this._uploadedFiles = [];
                this._aFileUploaders = [];

                this.toggleEnable(false);


                this.byId("_idIconTabBar").setVisible(false);
                let model = this.getOwnerComponent().getModel();
                let oBindList = model.bindList("/PortMasterSet");
                oBindList.requestContexts(0, Infinity).then(function (oContext) {

                    oContext.forEach((item) =>
                        portData.push(item.getObject())
                    );
                }).catch(function (oError) {
                    console.error("Error fetching Port Data:", oError);
                });
                console.log("port Data", portData);
                // let oRouter = this.getOwnerComponent().getRouter();


                let that = this;

                that.getDataforvoyage();
                that.debouncedOnPortDaysChange = that.debounce(this._onPortDaysChange.bind(this), 300);
                that._initBidTemplate();

            },

            getLoggedInUserInfo: async function () {
                try {
                    let User = await sap.ushell.Container.getService("UserInfo");
                    let userID = User.getId();
                    userEmail = User.getEmail();
                    let userFullName = User.getFullName();
                    console.log("userEmail", userEmail);
                    console.log("userFullName", userFullName);
                    console.log("userID", userID);
                } catch (error) {
                     userEmail = undefined ;
                    //  userEmail = "sarath.venkateswara@ingenxtec.com";
                }
            },

            onObjectMatched: function () {
                console.log("page navigated");
                this.onRefresh();

            },
            toggleEnable: function (boolean) {

                let iconTab = this.byId("_idIconTabBar");
                iconTab.setVisible(boolean);
                iconTab.setSelectedKey('info');

                this.byId('_submitBtn').setEnabled(boolean);
                this.byId('_approvalBtn').setEnabled(boolean);
                this.byId('_refreshBtn').setEnabled(boolean);
                this.byId('_addPort1').setEnabled(boolean);
                this.byId('_removePort1').setEnabled(boolean);
                this.byId('_addCostPl').setEnabled(boolean);
                this.byId('_removeCostPl').setEnabled(boolean);

                this.byId('_cancelVoyageBtn').setEnabled(boolean);

            },
            debounce: function (func, wait) {
                let timeout;
                return function (...args) {
                    const context = this;
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(context, args), wait);
                };
            },

            onPortDaysChange: function (oEvent) {
                let oInput = oEvent.getSource();
                let sValue = oInput.getValue();

                // Remove leading zeros, but keep the number as "0" if the input was "0"
                sValue = sValue.replace(/^0+(?!\.|$)/, '');
                // Set the modified value back to the input field
                oInput.setValue(sValue);

                // Regular expression to allow positive decimal numbers with up to 3 digits after the decimal

                var oRegex = /^[0-9]\d*(\.\d{0,3})?$/;

                // Check if the value is negative
                if (parseFloat(sValue) < 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Negative values are not allowed.");
                    return;
                }
                // Check if the value doesn't match the decimal pattern
                else if (!oRegex.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Please enter a valid positve number with up to 3 decimal places.");
                    return;
                }
                // If the value is valid, clear any error state
                else {
                    oInput.setValueState("None");
                    oInput.setValueStateText("");
                }
                this.debouncedOnPortDaysChange(oEvent);
            },
            _onPortDaysChange: function (oEvent) {
                let oValue = oEvent.getParameter('value');
                this.getView().setBusy(true); // Show busy indicator
                this._fetchData(oValue).then(() => {
                    this.getView().setBusy(false); // Hide busy indicator
                }).catch(() => {
                    this.getView().setBusy(false); // Hide busy indicator even if there's an error
                });
            },
            _fetchData: function (oValue) {
                return new Promise(async (resolve, reject) => {
                    voyItemModel.refresh();
                    console.log("on port days change ", voyItemModel.getData())

                    // CALLING OnCalc FUNCTION FOR POSTING DETAILS AND GETTING ARRIVAL DATE AND ARRIVAL TIME
                    await this.onCalc();

                    resolve();
                });
            },
            getBidDetails: async function (VoyageNo) {
                let that = this;
                if (!that._busyDialog1) {
                    that._busyDialog1 = new sap.m.BusyDialog({
                        title: "Please wait",
                        text: "Loading Bid Betails..."
                    });
                }
                that._busyDialog1.open();
                try {
                    let bidItemModel = new sap.ui.model.json.JSONModel();
                    let oModel = that.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/xNAUTIxBIDITEM", undefined, undefined, undefined, {
                        $filter: `Voyno eq '${VoyageNo}'`
                    });
                    let oContexts = await oBindList.requestContexts(0, Infinity);
                    let data = [];
                    oContexts.forEach(oContext => {
                        data.push(oContext.getObject());
                    });
                    console.log("Bid details data:", data);
                  
                    bidItemModel.setData(data);
                    that.getView().setModel(bidItemModel, "bidItemModel");
                    that.getView().getModel("bidItemModel").refresh();
                    console.table(that.getView().getModel("bidItemModel").getData());

                    // again rendering bidTemple after getting bid  details  to  confirm

                    let templateData = await that._getBidTemplate(oModel, "technical");

                    bidData = JSON.parse(JSON.stringify(data));

                    bidPayload = [...data];

                    that._setBidTemplate(templateData, that.byId("submitTechDetailTable"));
                    that._busyDialog1.close();

                } catch (error) {
                    console.error("Error loading Bid Details:", error);
                    sap.m.MessageBox.error("Error in fetching Bid Details")
                    that._busyDialog1.close();

                } finally {
                    if (that._busyDialog1) {
                        that._busyDialog1.close();
                        that._busyDialog1 = null;
                    }
                }
            },


            getDataforvoyage: function () {
                let that = this;

                // Initialize and open the Busy Dialog
                if (!that._busyDialog) {
                    that._busyDialog = new sap.m.BusyDialog({
                        title: "Please Wait",
                        text: "Fetching Voyage Data ..."
                    });
                }
                that._busyDialog.open();

                console.log("Begin getDataforVoyage");
                tempDataArr = [];
                voyageNoArr = [];

                let oModel = this.getOwnerComponent().getModel();

                let oBindList = oModel.bindList(`/xNAUTIxVOYAGEHEADERTOITEM`, undefined, undefined, undefined, {
                    $expand: "toitem,tocostcharge,tobiditem",
                });

                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    const entityData = aContexts;
                    tempDataArr = [];
                    voyageNoArr = [];
                    entityData.forEach(data => {
                        tempDataArr.push(data.getObject());
                        voyageNoArr.push(data.getObject().Voyno);
                    });
                    console.log("Fetched Voyage data", tempDataArr);
                    // console.log(tempDataArr);

                    // Set models only once
                    if (!that.voyHeaderModel) {
                        voyHeaderModel = new sap.ui.model.json.JSONModel();
                        voyItemModel = new sap.ui.model.json.JSONModel();
                        costdetailsModel = new sap.ui.model.json.JSONModel();
                        voyageNumModel = new sap.ui.model.json.JSONModel();
                    }

                    voyageNoArr.sort((a, b) => (b - a));
                    voyageNumModel.setData({ voyageNumbers: voyageNoArr });

                    that.getView().setModel(voyageNumModel, "voyageNumModel");
                    that.getView().getModel("voyageNumModel").refresh();
                }).finally(function () {
                    // Close the Busy Dialog
                    if (that._busyDialog) {
                        that._busyDialog.close();
                        that._busyDialog = null;
                    }
                    console.log("End getDataforVoyage function");
                });
            },

            showVoyageValueHelp: function () {

                if (!this._VoyageDialog) {
                    this._VoyageDialog = sap.ui.xmlfragment(
                        "com.ingenx.nauti.createvoyage.fragments.voyageValueHelp",
                        this
                    );
                    this.getView().addDependent(this._VoyageDialog);
                }

                // Clear any existing filters on the SelectDialog
                this._VoyageDialog.open();
                if (this._VoyageDialog) {

                    this._VoyageDialog.getBinding("items").filter([]);
                }
            },
            onVoyageValueHelpClose: async function (oEvent) {
                let that = this;

                let oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    if (that._VoyageDialog) {

                        that._VoyageDialog.destroy();
                        that._VoyageDialog = null;
                    }
                    return;
                }
                that.clearRefDoc();

                try {

                    that.toggleEnable(true);
                    let inputField = that.byId("_voyageInput1");
                    if (inputField.getValue() == oSelectedItem.getTitle()) {
                        return;
                    } else {
                        inputField.setValue(oSelectedItem.getTitle());
                    }
                    let voyageInputObj = that.getView().byId("_voyageInput1");
                    myVOYNO = voyageInputObj.getProperty("value");

                    console.log("Selected Voyage No.", myVOYNO);

                    // Function to get bid details for selected Voyage

                    let filteredObj = tempDataArr.filter(function (data) {
                        return data.Voyno === myVOYNO;
                    });
                    console.log("voyage data : ", filteredObj[0]);

                    voyHeaderModel = new sap.ui.model.json.JSONModel([...filteredObj]);
                    voyItemModel = new sap.ui.model.json.JSONModel([...filteredObj[0].toitem]);
                    costdetailsModel = new sap.ui.model.json.JSONModel([...filteredObj[0].tocostcharge]);

                    // Sorting in ascending order based on Vlegn
                    costDetailsData = costdetailsModel.getData();
                    costDetailsData.sort((a, b) => a.Vlegn - b.Vlegn);
                    costdetailsModel.setData(costDetailsData);

                    that.getView().setModel(voyHeaderModel, "voyHeaderModel");
                    that.getView().setModel(voyItemModel, "voyItemModel");
                    that.getView().setModel(costdetailsModel, "costdetailsModel");

                    that.getView().getModel("voyHeaderModel").refresh();
                    that.getView().getModel("voyItemModel").refresh();
                    that.getView().getModel("costdetailsModel").refresh();

                    console.log("Voyage number data:", that.getView().getModel("voyageNumModel").getData());
                    console.log("LineItem:", that.getView().getModel("voyItemModel").getData());
                    console.log("Costdetails:", that.getView().getModel("costdetailsModel").getData());

                    await that.getBidDetails(myVOYNO);
                    await that.getVoyageStatus(myVOYNO);
                    // Commercial Model
                    let sCunit = voyHeaderModel.getData()[0].Curr;
                    oCommercialModel = new sap.ui.model.json.JSONModel({
                        myData: [
                            {
                                "CodeDesc": "DEMURRAGE",
                                "Cunit": sCunit,
                                "Cvalue": 0,
                                "Good": "",
                                "Mand": "",
                                "Must": "",
                                "RevBid": true,
                                "Value": "",
                                "Voyno": myVOYNO,
                                "Zcode": "DEMURRAGE",
                                "Zmax": "0",
                                "Zmin": "0"
                            },
                            {
                                "CodeDesc": "FREIGHT",
                                "Cunit": sCunit,
                                "Cvalue": 0,
                                "Good": "",
                                "Mand": "",
                                "Must": "",
                                "RevBid": true,
                                "Value": "",
                                "Voyno": myVOYNO,
                                "Zcode": "FREIG",
                                "Zmax": "0",
                                "Zmin": "0"
                            }
                        ]
                    });

                    that.getView().setModel(oCommercialModel, "commercialModel");


                } catch (error) {
                    console.error("Error during onVoyageValueHelpClose execution:", error);
                    sap.m.MessageBox.error(error.message);
                } finally {
                    // Close the Busy Dialog
                    if (that._busyDialog) {
                        that._busyDialog.close();
                        that._busyDialog = null;
                    }
                    // close the Voyage fragment
                    if (that._VoyageDialog) {
                        that._VoyageDialog.destroy();
                        that._VoyageDialog = null;
                    }
                }
            },
            // code for refrence document table 
            clearRefDoc: function () {
                let oModel = referenceDocModel;

                // Clear the documents array
                if (oModel) {

                    oModel.setProperty("/documents", [
                        {
                            documentIndicator: "",
                            referenceDocumentNo: ""
                        }
                    ]);
                }
            },

            onAddRowRef: function () {
                var oModel = this.getView().getModel('referenceModel');
                var aDocuments = oModel.getProperty("/documents");
                aDocuments.push({
                    documentIndicator: "",
                    referenceDocumentNo: ""
                });
                oModel.setProperty("/documents", aDocuments);
            },

            onDeleteRowRef: function (oEvent) {
                var oModel = this.getView().getModel('referenceModel');
                var oTable = this.getView().byId("documentTable");
                var sPath = oEvent.getSource().getBindingContext('referenceModel').getPath();
                var aDocuments = oModel.getProperty("/documents");
                var iIndex = parseInt(sPath.split("/")[2]);

                aDocuments.splice(iIndex, 1);
                oModel.setProperty("/documents", aDocuments);
            },

            onVoyageFilterSearch: function (oEvent) {

                let sQuery = oEvent.getParameter("value");

                let oSelectDialog = oEvent.getSource();
                let oBinding = oSelectDialog.getBinding("items");


                let aFilters = [];
                if (sQuery) {
                    aFilters.push(new Filter({
                        path: "", // as the numbers are direct values in the array
                        test: function (value) {
                            return value.includes(sQuery);
                        }
                    }));
                }

                oBinding.filter(aFilters);

                // Check if there are any items after filtering
                let aItems = oBinding.getCurrentContexts();
                if (aItems.length === 0) {
                    oSelectDialog.setNoDataText("No data");
                } else {
                    oSelectDialog.setNoDataText("Loading...");
                }

            },


            _initBidTemplate: function () {
                console.log("begin initBidTemplate")
                let that = this;
                return new Promise(async function (resolve, reject) {

                    let oModel = that.getOwnerComponent().getModel();

                    let oView = that.getView();
                    let templateData = await that._getBidTemplate(oModel, "technical");

                    // let templateData2 = await that._getBidTemplate(oModel, "commercial"); // temporary changes
                    let oBidTemplateModel = new JSONModel(templateData);
                    oView.setModel(oBidTemplateModel, "bidtemplate");

                    let oTable1 = oView.byId("submitTechDetailTable");
                    // let oTable2 = oView.byId("CommercilalDetailTable");

                    if (Array.isArray(templateData, oTable1)) {
                        if (open) {
                            that._setBidTemplate(templateData, oTable1);
                        } else {
                            that._setClosedBidTemplate();
                        }
                    } else {
                        console.log({ ErrorResponse: templateData });
                    }

                    console.log("end initBidTemplate")
                });
            },
            onProfileChange: async function (oEvent) {
                let oSource = oEvent.getSource();
                selectedProfile = oSource._getSelectedItemText();
                console.log("profile selected : ", selectedProfile);
                await this._initBidTemplate();

                let oTable1 = oView.byId("submitTechDetailTable");
                console.log("profile chnage");




            },

            _getBidTemplate: function (oModel, detailType) {
                let index = "Not Found";
                return new Promise(async (resolve, reject) => {
                    try {
                        selectedProfile = this.byId('_selectProfileId')._getSelectedItemText();
                        // if (!selectedProfile) {

                        //     sap.m.MessageToast.show("Request to remote service : Profile not found ");
                        // }
                        let aFilter = new sap.ui.model.Filter('profileId', sap.ui.model.FilterOperator.Contains, selectedProfile);

                        let oData = await helperFunctions.readEntity(oModel, "xNAUTIxMASBID", undefined, undefined, aFilter);
                        // let oData = await helperFunctions.readEntity(oModel, "MasBidTemplateSet", undefined, undefined, undefined, undefined);
                        console.log("MasBidTemplate", oData);
                        oData.sort((a, b) => {
                            if (a.Datatype.toLocaleLowerCase() < b.Datatype.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.Datatype.toLocaleLowerCase() > b.Datatype.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        for (let i = oData.length - 1; i >= 0; i--) {
                            let el = oData[i];

                            delete el.__metadata;

                            if (detailType === "technical") {
                                if (el.Code === "FREIG" || el.Code === "DEMURRAGE") {
                                    oData.splice(i, 1);
                                }
                                // } else if (detailType === "commercial") {
                                //     if (el.Code !== "FREIG" && el.Code !== "DEMURRAGE") {
                                //         oData.splice(i, 1);
                                //     }
                                // }
                            };
                            resolve(oData);

                        }
                    } catch (err) {
                        console.log(err);
                        sap.m.MessageBox.error(`${err.name} : ${err.message}`);
                    }

                });

            },
            _setBidTemplate: function (templateData, oTable) {
                let oView = this.getView();
                let that = this;
                oTable.removeAllItems();
                templateData.forEach((el) => {
                    let oItem;
                    let oCells = [];
                    oCells.push(new sap.m.Text({ text: el.Value }));
                    let filterItems = bidPayload.filter(item => item.CodeDesc === el.Value);
                    let resultData = this.getInputData(filterItems);
                    let isEditable = resultData ? true : false;
                    oCells.push(new sap.m.CheckBox({
                        select: this.toggleCheckbox.bind(this),
                        selected: isEditable,

                    }));
                    oCells.push(
                        new sap.m.Input({
                            showValueHelp: true,
                            valueHelpRequest: function (oEvent) {
                                that._showValueHelpDialogMaster(oEvent, el.Datatype, el.Tablename, el.Value, el.Code);
                            },
                            editable: isEditable,
                            valueHelpOnly: true,
                            value: resultData
                        })
                    );
                    // Add the Button
                    oCells.push(new sap.m.Button({
                        icon: "sap-icon://hint",
                        press: function (oEvent) {
                            that.handlePopoverPress(oEvent, that);
                        }
                    }));
                    oItem = new sap.m.ColumnListItem({
                        cells: oCells,
                    });
                    oTable.addItem(oItem);
                });

                //  deleting othe bid entries from bid Payload which are not in other profile 
                // let oTable1 = oView.byId("submitTechDetailTable");
                // console.log("profile  --");
                // let oTableItems = oTable1.getItems();
                // if( bidPayload.length){

                //     for( let i=0 ; i< oTableItems.length ; i++){

                //         let sCodeDesc = oTableItems[i].getCells()[0].getText();
                //         bidPayload = bidPayload.filter( item =>item.CodeDesc !== sCodeDesc);
                //         // console.log("bidpayload iteration -- ", i);
                //     }
                // }
                // console.log("bidPayload after  complete iteration --", bidPayload);
            },


            handlePopoverPress: function (oEvent, that) {
                let oButton = oEvent.getSource();
                let oView = that.oView;
                let oCodeDesc = oEvent.getSource().getParent().getCells()[0].getText();
                let filterItems = bidPayload.filter(item =>
                    item.CodeDesc === oCodeDesc
                );

                let hintModel = new sap.ui.model.json.JSONModel();
                hintModel.setData({
                    hintData: filterItems
                })
                oView.setModel(hintModel, "hintModel");


                // create popover
                if (!that._pPopover) {
                    that._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.ingenx.nauti.createvoyage.fragments.Popover",
                        controller: that
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("hintModel>/");

                        return oPopover;
                    });
                }

                that._pPopover.then(function (oPopover) {
                    oPopover.setModel(hintModel, "hintModel");
                    oPopover.openBy(oButton);
                });
            },

            hintCheckBox: function (value) {
                return value === "X" ? true : false;

            },
            toggleCheckbox: function (oEvent, itemRow) {
                // debugger;
                let boolean, oSource, oInput, oText;
                if (oEvent) {
                    boolean = oEvent.getParameter('selected');
                    oSource = oEvent.getSource();
                    oInput = oSource.getParent().getCells()[2];
                    oText = oSource.getParent().getCells()[0].getText();
                } else {
                    boolean = true;
                    oInput = itemRow.getCells()[2];
                    oText = itemRow.getCells()[0].getText();

                }

                let filterItems = bidPayload.filter(item => item.CodeDesc === oText);

                let resultData = this.getInputData(filterItems); // seeting value to input source

                boolean ? oInput.setValue(resultData).setEditable(boolean) : oInput.setValue("").setEditable(boolean);
            },

            getInputData: function (hintData) {
                var firstMandValue = null;
                var firstGoodValue = null;
                var firstMustValue = null;

                for (var i = 0; i < hintData.length; i++) {
                    var item = hintData[i];

                    if (item.Mand === "X") {
                        if (firstMandValue === null) {
                            firstMandValue = item.Value;
                        }
                    }

                    if (item.Good === "X") {
                        if (firstGoodValue === null) {
                            firstGoodValue = item.Value;
                        }
                    }
                    if (item.Must === "X") {
                        if (firstMustValue === null) {
                            firstMustValue = item.Value;
                        }
                    }
                }

                if (firstMandValue !== null) {
                    return firstMandValue;
                } else if (firstGoodValue !== null) {
                    return firstGoodValue;
                } else if (firstMustValue !== null) {
                    return firstMustValue
                } else {
                    return null;
                }
            },

            toggleCheckbox2: function (oEvent) {
                let boolean = oEvent.getParameter('selected');
                let oSource = oEvent.getSource();
                let oInput = oSource.getParent().getCells()[2];
                if (boolean) {

                    oInput.setValue(this.sCunit).setEditable(boolean);
                } else {
                    oInput.setValue("").setEditable(boolean);


                }

            },
            _onHelpTableRequest: async function (oEvent, description) {
                let _BusyDialogTable = new sap.m.BusyDialog({});
                _BusyDialogTable.open()
                let oView = this.getView();
                let oSource = oEvent.getSource();
                oSource.setBusy(true);

                // let sBidTemplateDetail = oSource.getParent().getAggregation("cells")[0].getText();  // replaced by Description parameter
                let sBidTemplateDetail = description
                let oTemplateData = oView.getModel("bidtemplate").getData();
                let sBidHelpTableData = oTemplateData.find((el) => el.Value === sBidTemplateDetail);
                let sBidHelpTableName = sBidHelpTableData.Tablename;
                let sBidHelpTableTitle = sBidHelpTableData.Value;
                let oHelpTableData = await this._getHelpTableData(sBidHelpTableName);

                if (Array.isArray(oHelpTableData && oHelpTableData.data)) {
                    // console.table(oHelpTableData.data);
                    this._showHelpTableDialog(oSource, oHelpTableData, sBidHelpTableTitle);
                } else {
                    console.log({ ErrorResponse: oHelpTableData });
                }
                oSource.setBusy(false);
                _BusyDialogTable.close();
            },


            _getHelpTableData: async function (sTable) {
                let oModel = this.getOwnerComponent().getModel();
                let oBinding = oModel.bindList("/DynamicTableSet", undefined, undefined, undefined, {
                    $filter: `key eq '${sTable}'`
                });

                try {
                    let aContexts = await oBinding.requestContexts(0, Infinity);
                    let distinctSet = new Set();
                    let oHelpData = {
                        data: [],
                        distinctSet: distinctSet,
                    };
                    let tempData = []
                    // Create distinct set of names
                    aContexts.forEach(context => {
                        let oData = context.getObject();
                        tempData.push(oData);
                        if (!distinctSet.has(oData.name)) {
                            distinctSet.add(oData.name);
                        }
                    });
                    // console.table(tempData);
                    // console.log(distinctSet);

                    let distinctArray = Array.from(distinctSet);

                    for (let i = 0; i < aContexts.length; i++) {
                        let oHelpDataRow = {};
                        let oData = aContexts[i].getObject();

                        if (oData && oData.__metadata) {
                            delete oData.__metadata;
                        }

                        distinctArray.forEach((name, index) => {
                            let dataIndex = i + index;
                            if (dataIndex < aContexts.length) {
                                let innerData = aContexts[dataIndex].getObject();
                                if (!(innerData["value"] === "O" || innerData["value"] === "OTHER")) {
                                    oHelpDataRow[name] = innerData["value"];
                                    oHelpDataRow[`${name} key`] = innerData["key"];
                                }
                            }
                        });

                        if (Object.keys(oHelpDataRow).length > 0) {
                            oHelpData.data.push(oHelpDataRow);
                        }
                        i += distinctArray.length - 1; // Skip the processed set
                    }

                    return oHelpData;
                } catch (error) {
                    console.error(error);
                    sap.m.MessageBox.error(error.message);
                    throw error;
                }
            },

            _showHelpTableDialog: function (oSource, oHelpTableData, sBidHelpTableTitle) {
                oHelpTableData.data.sort((a, b) => {
                    if (a.Value < b.Value) return -1;
                    if (a.Value > b.Value) return 1;
                    return 0;
                });
                let helpTableColumns = [];
                let oHelpTableModel = new JSONModel({
                    columns: helpTableColumns,
                    items: oHelpTableData.data,
                });
                oHelpTableData.distinctSet.forEach((columnName) => {
                    helpTableColumns.push({ col: columnName });
                });
                let oHelpTable = this._setHelpTable(oHelpTableModel, oSource);
                console.log({ helpTableColumns });
                // adding close button to the footer

                let oCloseButton = new sap.m.Button({
                    text: "Close",
                    type: "Emphasized",
                    press: function () {
                        this._oHelpTableDialog.close();
                    }.bind(this),
                });

                this._oHelpTableDialog = new sap.m.Dialog({
                    title: sBidHelpTableTitle,
                    content: oHelpTable,
                    // Add the close button to the footer
                    endButton: oCloseButton,
                    afterClose: function () {
                        // Optional: Destroy the dialog after closing to free resources
                        this._oHelpTableDialog.destroy();
                    }.bind(this)
                });

                // this._oHelpTableDialog = new sap.m.Dialog({
                //     title: sBidHelpTableTitle,
                // });
                this._oHelpTableDialog.open();
                oHelpTable.placeAt(this._oHelpTableDialog);
            },

            _setHelpTable: function (oHelpTableModel, oSource) {
                let oHelpTable = new sap.m.Table({
                    fixedLayout: false,
                    alternateRowColors: true,
                    sticky: ["ColumnHeaders"],
                    selectionChange: this._onHelpTableSelectionChange.bind(this, oSource),
                    includeItemInSelection: true,
                    mode: "SingleSelectMaster",
                    noDataText: "Loading ...",
                    modeAnimationOn: false,
                    headerToolbar: [
                        new sap.m.OverflowToolbar({
                            content: [
                                new sap.m.SearchField({
                                    width: "auto",
                                    placeholder: "Search Field Value/Description",
                                    tooltip: "Search Field Value/Description",
                                    liveChange: this._onHelpTableSearch.bind(this),
                                }),
                            ],
                        }),
                    ],
                });
                oHelpTable.setModel(oHelpTableModel);
                oHelpTable.bindAggregation("columns", {
                    path: "/columns",
                    factory: function (_index, context) {
                        console.log(context.getObject().col);
                        return new sap.m.Column({
                            header: new sap.m.Text({ text: context.getObject().col }),
                        });
                    },
                });
                oHelpTable.bindItems({
                    path: "/items",
                    factory: function (_index, context) {
                        let obj = structuredClone(context.getObject());
                        let row = new sap.m.ColumnListItem();
                        for (let [key, value] of Object.entries(obj)) {
                            if (!/ key$/.test(key))
                                // OR if(key.endsWith(" key"))
                                row.addCell(
                                    new sap.m.Label({
                                        text: value,
                                    })
                                );
                        }
                        return row;
                    },
                });
                return oHelpTable;
            },
            _onHelpTableSearch: function (oEvent) {
                // Reference to dynamic table in dialog
                let oHelpTable = oEvent.getSource().getParent().getParent();
                let query = oEvent.getParameter("newValue"),
                    aFilter = [],
                    fFilter,
                    columnArray = oHelpTable.getModel().getProperty("/columns");

                for (let columnObject of columnArray) {
                    if (columnObject && columnObject.col) {
                        aFilter.push(
                            new sap.ui.model.Filter(
                                columnObject.col,
                                query.length === 2 ? sap.ui.model.FilterOperator.EQ : sap.ui.model.FilterOperator.Contains,
                                query
                            )
                        );
                    }
                }

                fFilter = new sap.ui.model.Filter({
                    filters: aFilter,
                    and: false,
                });

                oHelpTable.getBinding("items").filter(fFilter);
                if (!oHelpTable.getItems().length) oHelpTable.setNoDataText("No data");
            },
            _onHelpTableSelectionChange: function (oSource, oEvent) {
                console.log(oEvent);
                let fieldValue = oEvent.getParameter("listItem").getBindingContext().getObject()["Value"];
                oSource.setValue(fieldValue);
                this._oHelpTableDialog.close();
            },

            formatRadioButtonSelection: function (sMand) {
                // Check if Mand property equals "X"
                if (sMand === "X") {
                    // If Mand is "X", return true to select the RadioButton
                    return true;
                } else {
                    // If Mand is not "X", return false to unselect the RadioButton
                    return false;
                }
            },
            onDeleteBidDetail: function (oEvent, oInputSource) {
                let oDialog = oEvent.getSource().getParent();
                let oTable = oDialog.getContent()[0]; // table is the third item in the dialog's content
                let oModel = oTable.getModel("tempModel");
                let aSelectedItems = oTable.getItems();


                let aSelectedIndices = [];

                // If no rows are selected, return
                if (oTable.getSelectedItems().length === 0) {
                    new sap.m.MessageToast.show("Please Select an Item to Delete.");
                    return;
                }
                let that = this;

                new sap.m.MessageBox.confirm("Are you sure, you want to delete ?", {
                    title: "Bid Deletion",
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {

                            // Loop through table items and find selected indices
                            for (let i = 0; i < aSelectedItems.length; i++) {
                                if (aSelectedItems[i].getSelected()) {
                                    aSelectedIndices.push(i);
                                }
                            }

                            // Sort the indices in descending order to ensure correct deletion when multiple rows are selected
                            aSelectedIndices.sort(function (a, b) {
                                return b - a;
                            });

                            // Remove the selected rows from the model and from bidPayload
                            for (let j = 0; j < aSelectedIndices.length; j++) {
                                let index = aSelectedIndices[j];
                                let aData = oModel.getProperty("/");

                                // Get the Zcode and Value from the selected item
                                let selectedItem = aData[index];
                                let selectedZcode = selectedItem.Zcode;
                                let selectedValue = selectedItem.Value;

                                // Find the index of the corresponding entry in bidPayload
                                let bidIndex = bidPayload.findIndex(bidItem => bidItem.Zcode === selectedZcode && bidItem.Value === selectedValue);

                                // Remove the entry from bidPayload if it exists
                                if (bidIndex !== -1) {
                                    bidPayload.splice(bidIndex, 1);
                                }

                                // Remove the entry from the model
                                aData.splice(index, 1);
                                oModel.setProperty("/", aData);
                            }
                            //setting Parent input value
                            let tempModelData = oModel.getData();
                            let oInputValue = that.getInputData(tempModelData);
                            oInputSource.setValue(oInputValue);

                            if (!tempModelData.length) {
                                oDialog.getContent()[1].setEnabled(true);
                            }


                            // Clear the selection in the table
                            oTable.removeSelections();


                        } else {

                            oTable.removeSelections();

                        }
                    }
                });


            },

            onAddNewBid: function (oEvent, Code, description, oDialogRef) {
                let oButton, oDialog;
                if (oDialogRef) {
                    oDialog = oDialogRef;


                } else {
                    oButton = oEvent.getSource();
                    oDialog = oButton.getParent();

                }
                // Add row button is nested inside the dialog
                let oTable = oDialog.getContent()[0];
                let oModel = oTable.getModel("tempModel");

                // Generate a unique group name for each row based on current timestamp
                var groupName = "Group_" + new Date().getTime();

                // Add a new empty entry to the model

                let newData = {
                    CodeDesc: description, // dynamic code description
                    Cunit: "", // Fixed value, can be changed if required
                    Cvalue: "0.0", // Fixed value, can be changed if required
                    Good: "", // Empty initially, can be changed by user
                    Mand: "", // Empty initially, can be changed by user
                    Must: "", // Empty initially, can be changed by user
                    RevBid: true, // Fixed value, can be changed if required
                    Value: "", // Empty initially, can be changed by user
                    Voyno: myVOYNO, // Fixed value for particular voyage
                    Zcode: Code, // dynamic code respective to description
                    Zmax: "", // Fixed value, can be changed if required
                    Zmin: "" // Fixed value, can be changed if required
                };

                // allowing user only to create new entry when previous entry filled only
                let length = oModel.getData().length;

                if (oDialogRef && length) {

                    // if bid data exists and  template Input value help pressed also then no need to add empty row
                    return;
                }
                if (length) {

                    let entry = oModel.getData()[length - 1];

                    if (entry.Value === "") {
                        sap.m.MessageBox.error("Please fill Possible Value");
                        return;
                    }

                    if (entry.Good === "" && entry.Mand === "" && entry.Must === "") {
                        sap.m.MessageBox.error("Please fill at least one of the Good, Mand, or Must fields");
                        return;
                    }
                    if (entry.Zmin == "") {
                        sap.m.MessageBox.error("Please fill Min Score");
                        return;
                    }

                    if (entry.Zmax == "") {
                        sap.m.MessageBox.error("Please fill Max Score");
                        return;
                    }

                }
                var aData = oModel.getProperty("/");
                aData.push(newData);
                oModel.setProperty("/", aData);

                // Refresh the binding of the table to reflect the changes
                oTable.bindItems({
                    path: "tempModel>/",
                    template: oTable.getItems()[0].clone() // Assuming the first item in the table is the template
                });
                oTable.removeSelections();

                // Set the group name for each radio button in the new row
                var numRows = oModel.getProperty("/").length;
                for (var i = 0; i < numRows; i++) {
                    var groupName = "Group_" + i;
                    var row = oTable.getItems()[i];
                    row.getCells()[1].setGroupName(groupName);
                    row.getCells()[2].setGroupName(groupName);
                    row.getCells()[3].setGroupName(groupName);
                }
            },

            formatZminEditable: function (sGood, sMand, sMust) {
                return sGood === "X";
            },
            formatZmaxEditable: function (sGood, sMand, sMust) {
                return sGood === "X" || sMand === "X";
            },
            

            _showValueHelpDialogMaster: function (oEvent, datatype, tablename, description, Code) {

                let oSource = oEvent.getSource();
                let that = this;
                let obj;
                let currentDate = new Date();
                if (datatype === "DATE") {
                    obj = new sap.m.DatePicker({ valueFormat: "dd.MM.YYYY", value: "{tempModel>Value}",maxDate: currentDate });

                } else if (tablename) {

                    obj = new sap.m.Input({
                        value: "{tempModel>Value}",
                        showValueHelp: true,
                        valueHelpRequest: function (oEvent) { that._onHelpTableRequest(oEvent, description); },
                        valueHelpOnly: true,
                    });
                } else {
                    obj = new sap.m.Input({ value: "{tempModel>Value}" });
                }
                let tempModel = new JSONModel();

                let sBidData = JSON.parse(JSON.stringify(bidPayload)); // Deep cloning bidPayload

                let filterdata = [];
                sBidData.forEach((item, i) => {

                    if (item.CodeDesc === description) {
                        item.RevBid = true;

                        filterdata.push(item);

                    }

                });
                tempModel.setData(filterdata);
                that.getView().setModel(tempModel, 'tempModel');
                let filterData = tempModel.getData()
                console.log("dynmaic filter bid items", filterData);
                console.log("group id ", oEvent.getSource().getId());


                var oDialog = new sap.m.Dialog({
                    title: `Bid Details  -  ${description}`,
                    titleAlignment: "Center",
                    contentWidth: "60%",
                    contentHeight: "40%",
                    content: [

                        new sap.m.Table({
                            mode: sap.m.ListMode.MultiSelect,
                            alternateRowColors: true,
                            sticky: ["ColumnHeaders"],
                            includeItemInSelection: true,
                            columns: [
                                new sap.m.Column({ header: new sap.m.Text({ text: "Possible Value" }), width: "220px" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Good To Have" }), hAlign: "Center" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Mandatory" }), hAlign: "Center" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Must Not Have" }), hAlign: "Center" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Min Score" }) }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Max Score" }) }),
                            ],
                            items: {
                                path: "tempModel>/",
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        obj,
                                        new sap.m.RadioButton({
                                            selected: {
                                                path: "tempModel>Good",
                                                formatter: that.formatRadioButtonSelection
                                            },

                                            select: function (oEvent) {
                                                // Handle radio button selection
                                                let value = oEvent.getParameter("selected");
                                                if (value) {
                                                    let context = oEvent.getSource().getBindingContext("tempModel");
                                                    context.getModel().setProperty(context.getPath() + "/Good", "X");
                                                    context.getModel().setProperty(context.getPath() + "/Mand", "");
                                                    context.getModel().setProperty(context.getPath() + "/Must", "");
                                                    oEvent.getSource().getParent().getCells()[5].setEditable(true);
                                                    oEvent.getSource().getParent().getCells()[4].setEditable(true);
                                                }
                                            }
                                        }),
                                        new sap.m.RadioButton({

                                            selected: {
                                                path: "tempModel>Mand",
                                                formatter: that.formatRadioButtonSelection
                                            },
                                            select: function (oEvent) {
                                                let dialog = oEvent.getSource().getParent().getParent().getParent();
                                                // Retrieve the model and data
                                                let tempModel = oEvent.getSource().getModel("tempModel");
                                                let tempData = tempModel.getData();
                                                let currentContext = oEvent.getSource().getBindingContext("tempModel");
                                                let currentPath = currentContext.getPath();

                                                // Check if there are any other entries in the model
                                                let otherEntriesExist = tempData.some(function (entry) {
                                                    return entry !== tempData[currentPath.slice(currentPath.lastIndexOf('/') + 1)];
                                                });

                                                if (otherEntriesExist) {
                                                    sap.m.MessageBox.warning("Single Entry is Allowed in Case of Mandatory, Please Remove Other Entries.");
                                                    // Reset the radio button selection
                                                    oEvent.getSource().setSelected(false);

                                                    return;
                                                }

                                                // Handle radio button selection if no other entries exist
                                                let value = oEvent.getParameter("selected");
                                                if (value) {
                                                    let context = oEvent.getSource().getBindingContext("tempModel");
                                                    context.getModel().setProperty(context.getPath() + "/Good", "");
                                                    context.getModel().setProperty(context.getPath() + "/Mand", "X");
                                                    context.getModel().setProperty(context.getPath() + "/Must", "");
                                                    oEvent.getSource().getParent().getCells()[4].setValue(0).setEditable(false);
                                                    oEvent.getSource().getParent().getCells()[5].setValue("").setEditable(true);

                                                    // Disable add button in Dialog

                                                    dialog.getContent()[1].setEnabled(false);

                                                } else {
                                                    // Enable add button in Dialog
                                                    dialog.getContent()[1].setEnabled(true);


                                                }
                                            }
                                        }),
                                        new sap.m.RadioButton({

                                            selected: {
                                                path: "tempModel>Must",
                                                formatter: that.formatRadioButtonSelection
                                            },
                                            select: function (oEvent) {
                                                // Handle radio button selection
                                                let value = oEvent.getParameter("selected");
                                                if (value) {
                                                    let context = oEvent.getSource().getBindingContext("tempModel");
                                                    context.getModel().setProperty(context.getPath() + "/Good", "");
                                                    context.getModel().setProperty(context.getPath() + "/Mand", "");
                                                    context.getModel().setProperty(context.getPath() + "/Must", "X");
                                                    oEvent.getSource().getParent().getCells()[4].setValue(0).setEditable(false);
                                                    oEvent.getSource().getParent().getCells()[5].setValue(0).setEditable(false);
                                                }
                                            }
                                        }),
                                        new sap.m.Input({
                                            placeholder: "0-4",
                                            value: "{tempModel>Zmin}",
                                            type: sap.m.InputType.Number,
                                            liveChange: that.checkRangeforZmin.bind(that),
                                            editable: {
                                                parts: [{ path: "tempModel>Good" }, { path: "tempModel>Mand" }, { path: "tempModel>Must" }],
                                                formatter: function (sGood, sMand, sMust) {
                                                    return that.formatZminEditable(sGood, sMand, sMust);
                                                }
                                            }
                                        }),
                                        new sap.m.Input({
                                            type: "Number",
                                            placeholder: "1-5",
                                            type: sap.m.InputType.Number,
                                            value: "{tempModel>Zmax}",
                                            liveChange: that.checkRangeforZmax.bind(that),
                                            editable: {
                                                parts: [{ path: "tempModel>Good" }, { path: "tempModel>Mand" }, { path: "tempModel>Must" }],
                                                formatter: function (sGood, sMand, sMust) {
                                                    return that.formatZmaxEditable(sGood, sMand, sMust);
                                                }
                                            }
                                        })
                                    ]
                                })
                            }
                        }).addStyleClass("sapUiTinyMarginTop"),
                        new sap.m.Button({
                            text: "Add Row",
                            icon: "sap-icon://sys-add",
                            type: "Success",
                            press: function (oEvent) {
                                that.onAddNewBid(oEvent, Code, description, undefined) // adding 4th parameter for make fn reusable
                            },
                            enabled: {
                                path: 'tempModel>/',
                                formatter: function (aItems) {
                                    return that.isEditableBasedOnMand(aItems);
                                }
                            }
                        }).addStyleClass("sapUiTinyMargin"),
                        new sap.m.Button({
                            text: "Delete",
                            type: "Reject",
                            press: function (oEvent) {

                                that.onDeleteBidDetail(oEvent, oSource);

                                // let oInputValue = that.getInputData(filterData);
                                // oSource.setValue(oInputValue);
                            },
                            // enabled: {
                            //     path: 'tempModel>/',
                            //     formatter: function (aItems) {
                            //         return that.isEditableBasedOnMand(aItems);
                            //     }
                            // }
                        }).addStyleClass("sapUiTinyMargin")
                    ],
                    beginButton: new sap.m.Button({
                        text: "Save",
                        type: "Accept",
                        press: function () {

                            // Function to check for duplicates
                            function hasInternalDuplicates(entries) {
                                let counts = {};
                                for (let entry of entries) {
                                    if (counts[entry.Value]) {
                                        counts[entry.Value]++;
                                        if (counts[entry.Value] > 1) {
                                            return true;
                                        }
                                    } else {
                                        counts[entry.Value] = 1;
                                    }
                                }
                                return false;
                            }

                            let entries = tempModel.getData();
                            if (entries.length) {

                                // Check for internal duplicates within new entries
                                if (hasInternalDuplicates(entries)) {
                                    new sap.m.MessageBox.error("Duplicate Entry found");
                                    return; // Exit the press function
                                }
                                for (let entry of entries) {
                                    if (entry.Value === "") {
                                        sap.m.MessageBox.error("Please fill Possible Value");
                                        return;
                                    }

                                    if (entry.Good === "" && entry.Mand === "" && entry.Must === "") {
                                        sap.m.MessageBox.error("Please fill at least one of the Good, Mand, or Must fields");
                                        return;
                                    }
                                    if (entry.Zmin == "") {
                                        sap.m.MessageBox.error("Please fill Min Score");
                                        return;
                                    }

                                    if (entry.Zmax == "") {
                                        sap.m.MessageBox.error("Please fill Max Score");
                                        return;
                                    }
                                }


                                let entriesMap = new Map();
                                entries.forEach(entry => {
                                    let key = `${entry.Zcode}_${entry.Value}`;
                                    entriesMap.set(key, entry);
                                });

                                // Process bidPayload to remove conflicting entries and update with new ones
                                for (let i = 0; i < bidPayload.length; i++) {
                                    let existingEntry = bidPayload[i];
                                    let matchingEntryKey = `${existingEntry.Zcode}_${existingEntry.Value}`;

                                    // Check if the exact Zcode and Value pair exists in entries
                                    if (entriesMap.has(matchingEntryKey)) {
                                        // Overwrite the existing entry with the new one from entries
                                        bidPayload[i] = entriesMap.get(matchingEntryKey);
                                        // Remove the entry from the map as it has been processed
                                        entriesMap.delete(matchingEntryKey);
                                    } else {
                                        // Check if there's an entry in entries with the same Zcode but different Value
                                        let conflictingKey = `${existingEntry.Zcode}_`;
                                        if ([...entriesMap.keys()].some(key => key.startsWith(conflictingKey))) {
                                            // Remove the entry with the same Zcode but different Value
                                            bidPayload.splice(i, 1);
                                            i--; // Adjust the index after removal
                                        }
                                    }
                                }

                                // Add any remaining new entries from entries to bidPayload
                                entriesMap.forEach((value) => {
                                    bidPayload.push(value);
                                });


                                let oInputValue = that.getInputData(filterData);
                                oSource.setValue(oInputValue);

                                console.table(bidPayload);
                                oDialog.close();
                            } else {
                                sap.m.MessageBox.warning("Please Add Some Details");
                                oSource.setValue("");
                            }

                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Close",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                            // console.log("Cosed btn pressed");

                        },
                    }),
                });

                oDialog.setModel(tempModel, "tempModel"); // Set the model to the dialog
                this.getView().addDependent(oDialog); // Bind the dialog to the view
                this.assignGroupToRadioButton(oDialog);
                oDialog.open(); // Open the dialog
                this.onAddNewBid(oEvent, Code, description, oDialog);
            },

            isEditableBasedOnMand: function (aItems) {
                if (aItems && aItems.length > 0) {
                    for (var i = 0; i < aItems.length; i++) {
                        if (aItems[i].Mand === "X") {
                            return false; // Disable button if Mand is "X"
                        }
                    }
                }
                return true; // Enable button by default
            },
            checkRangeforZmin: function (oEvent) {
                // Get the input control
                let oInput = oEvent.getSource();

                let value = oInput.getValue();

                let numericValue = parseFloat(value);

                // Check if the value is within the range [0-4]
                if (numericValue >= 0 && numericValue <= 4) {
                    // Value is within the range, set value state to None
                    oInput.setValueState(sap.ui.core.ValueState.None);
                    oInput.setValueStateText("");
                } else {
                    // Value is out of range, set value state to Error
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Value must be in range [0 - 4]");
                    oInput.setValue("");
                }
            },
            checkRangeforZmax: function (oEvent) {
                // Get the input control
                let oInput = oEvent.getSource();

                let value = oInput.getValue();
                let zMinValue = oEvent.getSource().getParent().getCells()[4].getValue();
                if (zMinValue == "") {
                    oInput.setValue("");
                    sap.m.MessageToast.show("Please fill Min Score First.", { duration: 1000 });

                    return;
                }
                if (zMinValue && value == "") {

                    return
                }
                if (value <= zMinValue) {
                    oInput.setValue("");

                    sap.m.MessageToast.show("Max Score Must be Greater than Min Score");
                    return
                }


                let numericValue = parseFloat(value);

                // Check if the value is within the range [1-5]
                if (numericValue >= 1 && numericValue <= 5) {

                    oInput.setValueState(sap.ui.core.ValueState.None);
                    oInput.setValueStateText("");

                } else {

                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Value must be in range [Min score - 5]", { duration: 1000 });
                    oInput.setValue("");
                }
            },
            assignGroupToRadioButton: function (oDialog) {
                let oDialogModel = oDialog.getModel("tempModel");
                let oDialogModelData = oDialogModel.getData();
                let oDialogContent = oDialog.getContent();
                let oTable = oDialogContent[0];
                let items = oTable.getItems();

                //iteration  table row
                items.forEach((item, index) => {

                    let cells = item.getCells();
                    //   index from radio button 1 to button 3
                    for (let i = 1; i <= 3; i++) {

                        cells[i].setGroupName('Group_' + index);
                    }
                })

            },


            // onPortEnterPress fn
            onPortEnterPress: function (oEvent) {
                console.log("Port code cell change detected");
            },

            getRouteSeaPath: function (startLatitude, startLongitude, endLatitude, endLongitude) {
                let oModel = this.getOwnerComponent().getModel();
                console.log("oModel", oModel);
                let url = `/getRoute?startLatitude=${startLatitude}&startLongitude=${startLongitude}&endLatitude=${endLatitude}&endLongitude=${endLongitude}`;
                let oBindList = oModel.bindList(url, null, null, null);

                return new Promise((resolve, reject) => {
                    oBindList.requestContexts(0, Infinity).then(function (context) {
                        let oData = {};
                        context.forEach((oContext, index) => {
                            oData = oContext.getObject();
                            console.log("Sea Path ", oData);
                        });
                        resolve(oData);
                    }).catch(error => {
                        reject(error);
                    });
                });
            },

            onVetddDatePickerChange: async function (oEvent) {
                let selectedDate = oEvent.getParameter("value");
                let oSource = oEvent.getSource();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "MM/dd/yyyy"
                });
                let parsedDate = dateFormat.parse(selectedDate);
                let oMinDate = new Date(); // Today's date
                let minTimeGap = 15;

                oMinDate.setDate(oMinDate.getDate() + parseInt(minTimeGap, 10));
                if (parsedDate < oMinDate) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText(`Select Date should be ${minTimeGap} days after Today onwards.`);
                    oSource.setDateValue(null);
                } else {

                    oSource.setValueState("None");
                    await this.onCalc();
                }
            },
            validateInputValue: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                // Remove leading zeros, but keep the number as "0" if the input was "0"
                sValue = sValue.replace(/^0+(?!\.|$)/, '');
                // Set the modified value back to the input field
                oInput.setValue(sValue);

                // Regular expression to allow positive decimal numbers with up to 3 digits after the decimal

                var oRegex = /^[0-9]\d*(\.\d{0,3})?$/;

                // Check if the value is negative
                if (parseFloat(sValue) < 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Negative values are not allowed.");
                }
                // Check if the value doesn't match the decimal pattern
                else if (!oRegex.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Please enter a valid positve number with up to 3 decimal places.");
                }
                // If the value is valid, clear any error state
                else {
                    oInput.setValueState("None");
                    oInput.setValueStateText("");
                }
            },
            onVetdtDatePickerChange: async function (oEvent) {
                let oSource = oEvent.getSource();

                await this.onCalc();

            },
            dateFormat: function (date) {
                // Get day, month, and year components
                const day = date.getDate();
                // Note: Months in JavaScript are zero-based, so we add 1 to get the correct month
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                // Format the date string
                // const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
                const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

                console.log(formattedDate);
                return formattedDate;
            },
            //  FUNCTION: TO FORMAT TIME WHILE PUSH BACK TO MODEL AFTER FETCHING RESPONSE FROM API
            timeformat1: function (date) {

                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                // Format the time string
                const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                console.log(formattedTime);
                return formattedTime;
            },
            // getting route distance fn
            //  FUNCTION: TO FORMAT TIME WHILE SENDING DATA TO API


            time2Format: function (timeString) {
                const date = new Date(0); // 0 represents the Unix epoch time, which is January 1, 1970, 00:00:00 UTC

                // Extract hours, minutes, and seconds from the time string "06:40:03"
                const [hours, minutes, seconds] = timeString.split(':').map(Number);

                // Set the time part to the extracted values
                date.setTime(0);
                date.setHours(hours);
                date.setMinutes(minutes);
                date.setSeconds(seconds);

                console.log(date);
                return date;
            },

            onPortDaysChange1: function (oEvent) {
                let oValue = oEvent.getParameter('value');
                voyItemModel.refresh();
                console.log("on port days change ", voyItemModel.getData())

                this.onCalc();
                let updatedTotalDays = this.totalSeaDaysCalc(voyItemModel.getData());
                this.byId('_totalDays').setValue(updatedTotalDays);
            },
            onCalc: function () {

                try {
                    let selectedPorts = voyItemModel.getData();


                    let ZCalcNav = [];
                    for (let i = 0; i < selectedPorts.length; i++) {
                        if (!selectedPorts[i].Vwead) {
                            selectedPorts[i].Vwead = "0";
                        }
                        if (!selectedPorts[i].Cargs) {
                            new sap.m.MessageBox.error("Please enter Cargo Size");
                            return false;
                        }
                        if (!selectedPorts[i].Cargu) {
                            new sap.m.MessageBox.error("Please enter Cargo Unit");
                            return false;
                        }
                        if (i !== 0 && !selectedPorts[i].Vspeed) {
                            MessageBox.error("Please enter Speed");
                            return false;
                        }
                        if (i !== 0 && selectedPorts[i].Vspeed == "0") {
                            MessageBox.error("Speed can't  be Zero except Source Port");
                            return;

                        }

                        if (!selectedPorts[i].Ppdays) {
                            new sap.m.MessageBox.error("Please enter Port Days");
                            return false;
                        }
                    }
                    if (!selectedPorts[0].Vetdd) {
                        new sap.m.MessageBox.error("Please select Departure Date and Time");
                        return false;
                    }

                    let that = this;
                    sap.m.MessageToast.show("Calculating Arrival Date and Time ...", { duration: 1200 });


                    for (let i = 0; i < selectedPorts.length; i++) {
                        let dummySelectedPorts = {
                            ArrivalDate: "",
                            ArrivalTime: "",
                            CargoSize: "",
                            CargoUnit: "",
                            DepartureDateValue: "",
                            DepartureTime: "",
                            Distance: "",
                            LegId: "",
                            PortDays: "",
                            PortId: "",
                            PortName: "",
                            SeaDays: "",
                            Speed: "",
                            Weather: ""
                        }
                        if (i == 0 && selectedPorts[i].Vetdt == "24:00:00") {
                            dummySelectedPorts.DepartureTime = "00:00:00";
                        }
                        else {
                            dummySelectedPorts.DepartureTime = selectedPorts[i].Vetdt;
                        }
                        dummySelectedPorts.ArrivalDate = selectedPorts[i].Vetad;
                        dummySelectedPorts.ArrivalTime = selectedPorts[i].Vetat;
                        dummySelectedPorts.CargoSize = selectedPorts[i].Cargs;
                        dummySelectedPorts.CargoUnit = selectedPorts[i].Cargu;
                        dummySelectedPorts.DepartureDateValue = selectedPorts[i].Vetdd;

                        dummySelectedPorts.Distance = selectedPorts[i].Pdist;
                        dummySelectedPorts.LegId = selectedPorts[i].Vlegn.toString();
                        dummySelectedPorts.PortDays = selectedPorts[i].Ppdays;
                        dummySelectedPorts.PortId = selectedPorts[i].Portc;
                        dummySelectedPorts.PortName = selectedPorts[i].Portn;
                        dummySelectedPorts.SeaDays = selectedPorts[i].Vsdays;
                        dummySelectedPorts.Speed = selectedPorts[i].Vspeed;
                        dummySelectedPorts.Weather = selectedPorts[i].Vwead;

                        ZCalcNav.push(dummySelectedPorts);
                    }


                    const oDataModelV4 = this.getOwnerComponent().getModel();
                    let oBindList1 = oDataModelV4.bindList("/calculateDateAndTime");
                    let data1 = oBindList1.create(
                        {
                            "ZCalcNav": ZCalcNav
                        }
                    ).created().then(context => {
                        console.log(context);
                    });

                    oBindList1.attachCreateCompleted((p) => {


                        let p1 = p.getParameters();
                        let oContext = p1.context;
                        if (p1.success) {
                            let ZCalcNav = oContext.getObject().ZCalcNav;
                            console.table(ZCalcNav);

                            let totalDays = 0;
                            // console.log(ZCalcNav[0].Vetad, ZCalcNav[0].Vetat, ZCalcNav[0].Vetdd, ZCalcNav[0].Vetdt, ZCalcNav[1].Vetad, ZCalcNav[1].Vetat, ZCalcNav[1].Vetdd, ZCalcNav[1].Vetdt);

                            ZCalcNav.forEach((data, index) => {
                                selectedPorts[index].Vsdays = data.SeaDays;
                                selectedPorts[index].Vspeed = data.Speed;
                                selectedPorts[index].Vwead = data.Weather;
                                selectedPorts[index].Vetad = data.ArrivalDate;
                                selectedPorts[index].Vetat = data.ArrivalTime;
                                selectedPorts[index].Vetdd = data.DepartureDateValue;
                                selectedPorts[index].Vetdt = data.DepartureTime;

                                totalDays += Number(selectedPorts[index].Vsdays) + Number(selectedPorts[index].Ppdays);

                            });

                            that.byId("_totalDays").setValue(totalDays.toFixed(1));
                            voyItemModel.refresh();
                        } else {
                            sap.m.MessageBox.error("Unexpected error occurred during Calculation");
                            console.log(p1.context.oModel.mMessages[""][0].message);
                        }
                    });

                } catch (error) {
                    sap.m.MessageBox.error("An unexpected error occurred: " + error.message);
                    console.error(error);
                } finally {

                }
            },

            onCalc1: function () {


                try {
                    let selectedPorts = voyItemModel.getData();
                    let GvSpeed = selectedPorts[0].Vspeed;

                    let ZCalcNav = [];
                    for (let i = 0; i < selectedPorts.length; i++) {
                        if (!selectedPorts[i].Vwead) {
                            selectedPorts[i].Vwead = "0";
                        }
                        if (!selectedPorts[i].Cargs) {
                            new sap.m.MessageBox.error("Please enter Cargo Size");
                            return false;
                        }
                        if (!selectedPorts[i].Cargu) {
                            new sap.m.MessageBox.error("Please enter Cargo Unit");
                            return false;
                        }
                        if (!GvSpeed) {
                            new sap.m.MessageBox.error("Please enter Speed");
                            return false;
                        }
                        if (!selectedPorts[i].Ppdays) {
                            new sap.m.MessageBox.error("Please enter Port Days");
                            return false;
                        }
                    }
                    if (!selectedPorts[0].Vetdd) {
                        new sap.m.MessageBox.error("Please select Departure Date and Time");
                        return false;
                    }

                    let that = this;
                    sap.m.MessageToast.show("Calculating Arrival Date and Time ...", { duration: 1200 });

                    ZCalcNav.push({
                        Portc: selectedPorts[0].Portc,
                        Portn: selectedPorts[0].Portn,
                        Pdist: selectedPorts[0].Pdist,
                        Medst: "NM",
                        Vspeed: GvSpeed,
                        Ppdays: selectedPorts[0].Ppdays,
                        Vetdd: selectedPorts[0].Vetdd,
                        Vetdt: selectedPorts[0].Vetdt,
                        Vwead: selectedPorts[0].Vwead,
                    });

                    for (let i = 1; i < selectedPorts.length; i++) {
                        ZCalcNav.push({
                            Portc: selectedPorts[i].Portc,
                            Portn: selectedPorts[i].Portn,
                            Pdist: selectedPorts[i].Pdist,
                            Medst: "NM",
                            Vspeed: GvSpeed,
                            Ppdays: selectedPorts[i].Ppdays,
                            Vwead: selectedPorts[i].Vwead,
                        });
                    }

                    let oPayload = {
                        GvSpeed: GvSpeed,
                        ZCalcNav: ZCalcNav,
                    };

                    console.log(oPayload);

                    const oDataModelV4 = this.getOwnerComponent().getModel();
                    let oBindList = oDataModelV4.bindList("/ZCalculateSet", true);



                    oBindList.create(oPayload, true).created(x => {
                        console.log(x);
                    });

                    oBindList.attachCreateCompleted(function (p) {
                        let p1 = p.getParameters();

                        if (p1.success) {
                            let oData = p1.context.getObject();
                            console.table(oData.ZCalcNav);

                            let totalDays = 0;

                            oData.ZCalcNav.forEach((data, index) => {
                                selectedPorts[index].Vsdays = data.Vsdays;
                                selectedPorts[index].Vspeed = GvSpeed;
                                selectedPorts[index].Vwead = data.Vwead;
                                selectedPorts[index].Vetad = data.Vetad;
                                selectedPorts[index].Vetat = data.Vetat;
                                selectedPorts[index].Vetdd = data.Vetdd;
                                selectedPorts[index].Vetdt = data.Vetdt;

                                totalDays += Number(selectedPorts[index].Vsdays) + Number(selectedPorts[index].Ppdays);
                                that.byId('_totalDays').setValue(totalDays.toFixed(1));
                            });

                            voyItemModel.refresh();
                        } else {
                            sap.m.MessageBox.error("Error occurred in Calculation");
                            console.log(p1.context.oModel.mMessages[""][0].message);
                        }
                    });
                } catch (error) {
                    sap.m.MessageBox.error("An unexpected error occurred: " + error.message);
                    console.error(error);
                } finally {

                }
            },


            onAddPortRow1: function (oEvent) {

                let oTableItemModel = voyItemModel;
                let oTableData = oTableItemModel.getData();
                // let itemLength = oTableData.length  + 1;
                // console.log(itemLength);
                let lastEntry = oTableData[oTableData.length - 1];

                if (lastEntry.Vlegn && lastEntry.Pdist && lastEntry.Portn && lastEntry.Portc) {
                    console.log("valid row");
                    oTableData.push({
                        "Cargs": "",
                        "Cargu": lastEntry.Cargu,
                        "Frcost": "0",
                        "Maktx": "",
                        "Matnr": "",
                        "Medst": "NM",
                        "Othco": "0",
                        "Pdist": "",
                        "Portc": "",
                        "Portn": "",
                        "Ppdays": "",
                        "Pstat": "",
                        "Totco": "0",
                        "Vetad": "",
                        "Vetat": "",
                        "Vetdd": "",
                        "Vetdt": "",
                        "Vlegn": lastEntry.Vlegn + 1,
                        "Voyno": myVOYNO,
                        "Vsdays": "",
                        "Vspeed": lastEntry.Vspeed,
                        "Vwead": "0"
                    });
                    oTableItemModel.refresh();
                } else {
                    new sap.m.MessageToast.show("Please fill last row details.");
                }

            },
            onPortTabCargoSizeChange: function (oEvent) {
                let oSource = oEvent.getSource();
                // let CargoSizePathInModel = oSource.getBindingContext("oJsonModel").getPath();
                let path = oSource.getBindingContext("voyItemModel").getPath();
                let value = oEvent.getParameter("value");
                // removing "," from "12,000.00"
                let formatedValue = value.replace(/\,/g, '');
                voyItemModel.setProperty(path + "/Cargs", formatedValue);
                if (path == "/0" && voyItemModel.getData().length === 2) {
                    voyItemModel.getData()[1].Cargs = formatedValue;
                    voyItemModel.refresh();
                    this.liveFrCostChange();
                } else {
                    this.liveFrCostChange()
                }
            },

            onDeletePort: function () {
                var oTable = this.getView().byId("_itemTable");
                var aSelectedItems = oTable.getSelectedItems();

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Please select a port to remove");
                    return;
                }

                new sap.m.MessageBox.confirm("Are you sure, you want to delete ?", {
                    title: "Port deletion",
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {

                            let oTableItemModel = voyItemModel;
                            let oTableData = oTableItemModel.getData();

                            // Collect indices of selected items
                            let aIndicesToRemove = aSelectedItems.map(function (oSelectedItem) {
                                return oTable.indexOfItem(oSelectedItem);
                            });

                            // Sort indices in descending order
                            aIndicesToRemove.sort(function (a, b) { return b - a; });

                            // Remove items at collected indices
                            aIndicesToRemove.forEach(function (iIndex) {
                                oTableData.splice(iIndex, 1);
                            });

                            oTable.removeSelections();
                            oTableItemModel.setData(oTableData);

                        } else {
                            oTable.removeSelections();
                        }
                    }
                })
            },
            //  totalDistance fn 
            totalDistanceCalc: function (odata) {
                console.log(odata);
                let totalDist = 0;
                let arr = odata;
                if (arr && arr.length) {

                    arr.forEach((port) => {
                        totalDist += parseFloat(port.Pdist);

                    })
                    console.log("total Distance: ", totalDist);
                    return formatter.numberFormat(totalDist);
                }

            },
            FrieghtCostToShow: function (fcost) {
                return formatter.numberFormat(fcost)
            },


            onCargoUnitSelectChange: function (oEvent) {
                let oSelectedUnit = oEvent.getSource().getSelectedKey();
                let itemData = voyItemModel.getData();
                itemData.forEach(item => item.Cargu = oSelectedUnit);
                let costData = costdetailsModel.getData();
                // if( costData.length){
                //     costData.forEach( data => data.Costu = oSelectedUnit);
                // }
                let costTableItems = this.byId('_costTablePlan').getItems();
                if (costTableItems.length) {

                    costTableItems.forEach(item => {

                        item.getCells()[3].setSelectedKey(oSelectedUnit);
                    })
                }
                this.liveFrCostChange();

            },

            //fn to calculate sum for all freight costs and other costs to show in header of item table
            calctotalCost: function (voyItemsArr) {
                // console.log(voyItemsArr);
                let totalCost = 0;
                let arr = voyItemsArr;
                if (arr && arr.length) {

                    arr.forEach((port) => {
                        totalCost += parseFloat(port.Totco);

                    })
                    // console.log("total Totco cost: ", totalCost);

                    this.byId("_totalCostPlId").setValue(formatter.numberFormat(totalCost))
                    return formatter.numberFormat(totalCost);
                }


            },
            // port value help
            onPortValueHelpRequest: function (oEvent) {
                let oInputSource = oEvent.getSource();
                //   console.log(oData);
                let portNameCellObj = oEvent.getSource().oParent.getCells()[3];  // getting port name cell refrence
                let portDistObj = oEvent.getSource().oParent.getCells()[9];
                let portIdObj = oEvent.getSource().oParent.getCells()[0];
                let itemsData = voyItemModel.getData();
                let currentLength = itemsData.length;
                let lastPortObj = itemsData[currentLength - 2];
                let lastPort = portData.find(port => port.Portc === lastPortObj.Portc);
                let startLatitude = parseFloat(lastPort.Latitude);
                let startLongitude = parseFloat(lastPort.Longitude);
                console.log("clicked port value help");
                // Create a dialog

                var oDialog = new sap.m.Dialog({
                    title: "Select: Port ",
                    contentWidth: "20%",
                    contentHeight: "60%",
                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,
                        noDataText: "Loading...",

                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Port code" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Port name" }),
                            }),
                        ],

                        selectionChange: async function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oSelectedValue1 = oSelectedItem.getCells()[0].getText();
                            var oSelectedValue2 = oSelectedItem.getCells()[1].getText();
                            let selectedPort = portData.find(x => x.Portc == oSelectedValue1);
                            if (selectedPort) {

                                let endLatitude = parseFloat(selectedPort.Latitude);
                                let endLongitude = parseFloat(selectedPort.Longitude);
                                let oData = await this.getRouteSeaPath((startLatitude), startLongitude, endLatitude, endLongitude);
                                console.log("result from api", oData);
                                if (oData.seaDistance) {


                                    this.lateInputField(oInputSource, oSelectedValue1);
                                    this.lateInputField(portNameCellObj, oSelectedValue2);
                                    this.lateInputField(portDistObj, parseInt(oData.seaDistance));
                                    this.lateInputField(portIdObj, currentLength);
                                    voyItemModel.refresh();
                                } else {
                                    new sap.ui.m.MessageBox.error(`No Route exist between ${lastPort.Portn} and ${selectedPort.Portn}`)
                                }

                            } else {
                                MessageToast.show("Invalid Port or port not exists");
                            }
                            // console.log("selected values :", oSelectedValue1, oSelectedValue2, portNameCellObj);
                            oDialog.close();
                        }.bind(this),
                    }),
                    beginButton: new sap.m.Button({
                        text: "Cancel",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                        },
                    }),

                });

                let oValueHelpTable = oDialog.getContent()[0]; //  table is the first content element

                oValueHelpTable.bindItems({
                    path: "/PortMasterSet",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{Portc}" }),
                            new sap.m.Text({ text: "{Portn}" }),
                        ],
                    }),
                });
                // Bind the dialog to the view
                this.getView().addDependent(oDialog);

                oDialog.open()
            },

            formattedLegId: function (legId) {
                if (legId) return parseInt(legId);
                return ''
            },
            totalSeaDaysCalc: function (odata) {
                console.log(odata);
                let totalSeaDays = 0;
                let arr = odata;
                arr.forEach((port) => {
                    totalSeaDays += parseFloat(port.Vsdays) + parseFloat(port.Ppdays);

                })
                console.log("total SeaDays: ", totalSeaDays);

                return totalSeaDays.toFixed(1);


            },
            // fn to convert "60,000.000" to "600000"
            parseStringToNumber: function (stringValue) {

                // Remove commas from the string and parse it to a floating-point number
                if (stringValue) {

                    const numericValue = parseFloat(stringValue.replace(/,/g, ''));
                    return numericValue;
                }
            },

            // fn to change model value dynamicaly on cargosize change
            // liveCargoChange1: function (oEvent) {

            //     const cargosize1 = oEvent.getParameter("value") || 0;
            //     const currIndex = oEvent.getSource().getParent().getId().slice(-1);
            //     const oTable = this.byId("_itemTable").getItems();
            //     const cargosize = this.parseStringToNumber(cargosize1);
            //     let selectedUnit = this.byId("_idunit").getSelectedKey();

            //     if (selectedUnit === "L/S") {
            //         this.lumpsumFrCostChange1(cargosize, currIndex)
            //     }
            //     else if (selectedUnit === "TO") {
            //         this.pertFCostChange(cargosize);

            //     } else if (selectedUnit === "PTK") {

            //         this.tonNMFCostChange(cargosize);
            //     }

            // },
            liveFrCostChange: function () {
                let oInput = this.byId("_friegthIdPlan");
                let sValue = oInput.getValue();
                // Remove leading and trailing spaces
                sValue = sValue.trim();
             
                // Remove all commas from the value
                sValue = sValue.replace(/,/g, '');
                
                // Set the cleaned value back to the input
                oInput.setValue(sValue);

                // Regular expression to allow positive numbers with commas and up to 3 decimal places
                var oRegex = /^\d{1,}(\.\d{0,3})?$/;

                // Check if the value is negative
                if (parseFloat(sValue) < 0 ) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Negative values are not allowed.");
                    return;
                }
                // Check if the value doesn't match the decimal pattern
                else if (!oRegex.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Please enter a valid positve number with up to 3 decimal places.");
                    return
                }
                // If the value is valid, clear any error state
                else {
                    oInput.setValueState("None");
                    oInput.setValueStateText("");
                }

                let FCost = sValue == "" ? 0 : this.parseStringToNumber(sValue);
                let selectedUnit = this.byId("_idFrunitPlan").getSelectedKey();
                if (FCost === undefined || isNaN(FCost)) {
                    FCost = 0;
                }
                if (selectedUnit === "L/S" || selectedUnit === "LS") {
                    this.lumpsumFrCostChange(FCost)
                }
                else if (selectedUnit === "TO") {
                    this.pertFCostChange(FCost);

                } else if (selectedUnit === "PTK") {

                    this.tonNMFCostChange(FCost);
                } else {
                    MessageToast.show("Select Cargo Unit")
                }

            },
            lumpsumFrCostChange: function (FCost) {

                try {


                    // if (FCost) {
                    const lumpsumPortData = voyItemModel.getData();
                    let totalCost = 0,
                        last = 0,
                        tempCost = 0;
                    lumpsumPortData.forEach((element, index) => {
                        if (last) {
                            tempCost = parseFloat(Decimal(FCost).div(last).mul(element.Cargs).toString());
                        } else {
                            last = element.Cargs;
                        }
                        lumpsumPortData[index].Frcost = tempCost;
                        // lumpsumPortData[index].Othco= 0;

                        lumpsumPortData[index].Totco = parseFloat(Decimal(tempCost).add(lumpsumPortData[index].Othco));
                        totalCost += tempCost;
                        tempCost = 0;
                    });
                    voyItemModel.refresh();

                    this.calctotalCost(voyItemModel.getData());

                    //   this.byId("lumpsumTotalCost").setValue(formatter.costFormat(totalCost));

                } catch (error) {

                    throw new Error(error);
                }
            },


            // fn for per ton  costCharge
            pertFCostChange: function (FCost) {

                try {
                    //   const FCost = oEvent.getParameter("value") || 0;
                    // if (FCost) {
                    voyItemModel.refresh();
                    const pertPortData = voyItemModel.getData();
                    let totalCost = 0,
                        tempCost = 0;
                    pertPortData.forEach((element, index, arr) => {
                        if (index === 1) {
                            tempCost = Number(Decimal(element.Cargs).mul(FCost).toString());
                        } else if (index > 1) {
                            tempCost = Number(
                                Decimal(arr[index - 2].Cargs)
                                    .sub(arr[index - 1].Cargs)
                                    .mul(FCost)
                                    .toString()
                            );
                        }
                        pertPortData[index].Frcost = tempCost;

                        pertPortData[index].Totco = Decimal(tempCost).add(pertPortData[index].Othco);
                        totalCost += tempCost;
                        tempCost = 0;

                    });
                    voyItemModel.refresh();
                    this.calctotalCost(voyItemModel.getData());

                    //   this.byId("pertTotalCost").setValue(formatter.costFormat(totalCost));


                } catch (error) {

                    throw new Error(error);
                }
            },

            // fn for per ton per NM cost charge
            tonNMFCostChange: function (FCost) {

                try {
                    //   const FCost = oEvent.getParameter("value") || 0;
                    // if (FCost) {
                    const toNMPortData = this.getView().getModel("voyItemModel").getData();
                    let totalCost = 0,
                        tempCost = 0;
                    toNMPortData.forEach((element, index) => {
                        tempCost = Number(Decimal(FCost).mul(element.Cargs).mul(element.Pdist).toString());
                        toNMPortData[index].Frcost = tempCost;
                        // toNMPortData[index].Othco = 0;
                        toNMPortData[index].Totco = Decimal(tempCost).add(toNMPortData[index].Othco);
                        totalCost += tempCost;
                        tempCost = 0;

                    });
                    voyItemModel.refresh();
                    this.calctotalCost(voyItemModel.getData())

                    //   this.byId("tonNMTotalCost").setValue(formatter.costFormat(totalCost))


                } catch (error) {

                    throw new Error(error);
                }
            },
            // FUNCTION : To Add new empty cost charge row 
            onAddCost: function () {
                // checking where items exist or not 
                let itemsData = voyItemModel.getData();
                let itemdDataLength = itemsData.length;

                if (!itemdDataLength) {
                    new sap.m.MessageBox.warning("Please Add Port");
                    return;
                }

                let oTableModel = costdetailsModel;
                let oTableData = oTableModel.getData();
                let currency = voyHeaderModel.getData()[0].Curr;
                let unit = voyHeaderModel.getData()[0].toitem[0].Cargu;

                let lastEntry = oTableData[oTableData.length - 1];
                if (lastEntry) {
                    if (lastEntry.Vlegn === "") {
                        sap.m.MessageToast.show("Please fill LegId");
                        return;
                    }
                    if (lastEntry.Cstcodes === "") {
                        sap.m.MessageToast.show("Please fill Cost Code");
                        return;
                    }
                    if (lastEntry.Costu === "") {
                        sap.m.MessageToast.show("Please Select Cost Unit");
                        return;
                    }
                    if (lastEntry.Procost === "") {
                        sap.m.MessageToast.show("Please fill Projected Cost");
                        return;
                    }
                }

                oTableData.push({ Voyno: myVOYNO, Vlegn: "", Procost: "0.000", Prcunit: "", Costu: unit, Costcode: "", Cstcodes: "", Costcurr: currency, CostCheck: false });
                oTableModel.refresh();
                this.byId('_costTablePlan').removeSelections();

            },
            onVlegnInputLiveChange: function (oEvent) {
                let oInput = oEvent.getSource();

                let prevLegId = oEvent.getSource().getProperty("value");

                let oParent = oInput.getParent();

                // Check if cell[1], cell[2], and cell[4] exist and clear their values if they are not empty
                let cell1 = oParent.getCells()[1];
                let cell2 = oParent.getCells()[2];
                let cell5 = oParent.getCells()[5];

                if (cell5.getValue() !== "") {
                    cell5.setValue("0.000");
                    if (prevLegId) {
                        this.calculateSumAllCharges(parseInt(prevLegId));
                    }
                }
                if (cell1.getValue() !== "") {
                    cell1.setValue("");
                }
                if (cell2.getValue() !== "") {
                    cell2.setValue("");
                }
                let value = oInput.getValue();

                if (value === "") {
                    oInput.setValue("");

                    return;
                }
                let oVlegn = parseInt(value, 10);

                let oItems = voyItemModel.getData();
                let maxLegId = oItems.length;

                // Check if the value is a valid integer and within the allowed range
                if (oVlegn > maxLegId || oVlegn <= 0) {
                    new sap.m.MessageToast.show("Invalid LegId", {
                        duration: 600
                    });
                    oInput.setValue("");
                } else {
                    // Check if the value contains any non-integer characters
                    let integerRegex = /^[0-9]*$/;
                    if (!integerRegex.test(value)) {
                        new sap.m.MessageToast.show("Only Integers are Allowed", {
                            duration: 800
                        });
                        oInput.setValue("");


                    } else {
                        // Set the input value with the integer value
                        oInput.setValue(oVlegn);

                        // Update the model with the integer value for Vlegn
                        let path = oInput.getBindingContext("costdetailsModel").getPath();
                        costdetailsModel.setProperty(path + "/Vlegn", oVlegn);
                    }
                }
            },

            onDeleteCost: function () {

                let oTable = this.byId("_costTablePlan");
                let aSelectedItems = oTable.getSelectedItems().slice();
                let contextArr = oTable.getSelectedContexts();

                let oVlegnArr = [];
                let that = this;

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Please Select a Row to Remove");
                    return;
                }


                new sap.m.MessageBox.confirm("Are you sure, you want to delete ?", {
                    title: "Cost Deletion",
                    onClose: function (oAction) {

                        if (oAction === sap.m.MessageBox.Action.OK) {

                            aSelectedItems.forEach(function (oSelectedItem) {

                                let oContext = oSelectedItem.getBindingContext("costdetailsModel")
                                let sPath = oContext.getPath();
                                if (oContext.getObject() && oContext.getObject().Vlegn) {

                                    let oVlegn = parseInt(oContext.getObject().Vlegn);
                                    oVlegnArr.push(oVlegn);
                                } else {

                                }

                            });
                            let numericContextArr = contextArr.map(context => parseInt(context.sPath.substring(1)));

                            // Sort the numeric context paths
                            numericContextArr.sort((a, b) => b - a);

                            // Convert the sorted numeric context paths back to strings with '/' prefix
                            let sortedContextArr = numericContextArr.map(num => `/${num}`);
                            sortedContextArr.forEach(x => {

                                let array = costdetailsModel.getData(); // Assuming getData() returns the array

                                let objectToRemove = costdetailsModel.getProperty(x); // Assuming getProperty(sPath) returns the object
                                let index = array.indexOf(objectToRemove);
                                if (index !== -1) {

                                    array.splice(index, 1); // Remove the object at the found index
                                    // costdetailsModel.refresh(); 
                                }
                            })
                            oVlegnArr.forEach(oVlegn => that.calculateSumAllCharges(oVlegn)
                            )
                            that.calctotalCost(voyItemModel.getData());
                            costdetailsModel.refresh();
                            voyItemModel.refresh();

                            // console.log("costmodel after refresh ;", costdetailsModel.getData());

                            oTable.removeSelections();
                        }
                        else {
                            oTable.removeSelections();


                        }


                    }
                });

            },

            calculateSumAllCharges: function (oVlegn) {

                let data = costdetailsModel.getData();
                let sum = data.reduce((accumulator, currentObj) => {
                    if (oVlegn == currentObj.Vlegn) {

                        return accumulator + parseInt(currentObj.Procost);
                    } else return accumulator
                }, 0   // initial value
                );

                console.log("sum:", sum);
                this.liveOtherCostChange(oVlegn, sum);
            },
            // Live chnage function for  cost item projected cost
            onCostLiveChange: function (oEvent) {

                let oInput = oEvent.getSource();
                let sValue = oEvent.getParameter('value');
                sValue = sValue.replace(/^0+(?!\.|$)/, '');
                // Set the modified value back to the input field
                oInput.setValue(sValue);

                // Regular expression to allow positive decimal numbers with up to 3 digits after the decimal

                var oRegex = /^[0-9]\d*(\.\d{0,3})?$/;

                // Check if the value is negative
                if (parseFloat(sValue) < 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Negative values are not allowed.");
                    return;
                }
                // Check if the value doesn't match the decimal pattern
                else if (!oRegex.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Please enter a valid positve number with up to 3 decimal places.");
                    return;
                }
                // If the value is valid, clear any error state
                else {
                    oInput.setValueState("None");
                    oInput.setValueStateText("");
                }

                let sPath = oInput.getBindingContext("costdetailsModel").getPath();
                let oVlegn = parseInt(oInput.getBindingContext("costdetailsModel").getObject().Vlegn);
                if (oVlegn) {

                    this.calculateSumAllCharges(oVlegn);
                } else {
                    MessageToast.show(`Invalid LegId ${oVlegn}`);
                }

            },
            // fn  called after  change in cost item table  
            liveOtherCostChange: function (oVlegn, sum) {
                let temp = 0;
                let data = voyItemModel.getData();
                let totalCost = this.byId("_totalCostPlId")
                let totalCostValue = totalCost.getValue();


                let filterArr = data.filter(item => item.Vlegn == oVlegn);

                filterArr[0].Othco = sum;
                temp = parseFloat(filterArr[0].Frcost);
                filterArr[0].Totco = temp + sum;

                temp = 0;
                console.log("total cost :", totalCostValue);
                this.calctotalCost(data);

                voyItemModel.refresh();

            },

            // forselection in select control for cost charge unit to be emplty for new entry 
            formatForceSelection: function (legId) {

                return legId ? true : false;
            },

            onSaveCommercialDetail: function () {             // to be modified later
                let oCommercialModel = this.getView().getModel("commercialModel");
                let commercialPayload = [...oCommercialModel.getData().myData];

                // Loop through each item in commercialPayload
                commercialPayload.forEach(commercialItem => {
                    if (commercialItem.RevBid && commercialItem.Cunit !== "") {
                        let bidIndex = bidPayload.findIndex(bidItem => bidItem.Zcode === commercialItem.CodeDesc);

                        if (bidIndex !== -1) {
                            // Update existing item
                            bidPayload[bidIndex] = Object.assign({}, commercialItem);
                        } else {
                            // Check if Zcode is "DEMURRAGE" or "FRIEGHT" and if they already exist in bidPayload
                            if (["DEMURRAGE", "FREIGHT"].includes(commercialItem.CodeDesc)) {
                                let existingIndex = bidPayload.findIndex(bidItem => bidItem.CodeDesc === commercialItem.CodeDesc);
                                if (existingIndex === -1) {
                                    // Add new item only if it doesn't already exist
                                    bidPayload.push(Object.assign({}, commercialItem));
                                } else {
                                    // Update existing item if it exists
                                    bidPayload[existingIndex] = Object.assign({}, commercialItem);
                                }
                            } else {
                                // Add new item for other Zcodes
                                bidPayload.push(Object.assign({}, commercialItem));
                            }
                        }
                    }
                });
                console.table(bidPayload);
                // sap.m.MessageToast.show("Data Saved");
            },

            onSaveVoyage: async function () {

                let oModel = this.getOwnerComponent().getModel();
                let oBinding = oModel.bindContext(`/voyappstatusSet(Voyno='${myVOYNO}')`);
                let isVoyageEditable = true;

                await oBinding.requestObject().then((oContext) => {
                    console.log(oContext);

                    if (oContext) {
                        let Zaction = oContext.Zaction;
                        console.log(oContext.Voyno);
                        console.log(Zaction);

                        if (Zaction === "REJ") {
                            isVoyageEditable = true;

                        } else if (Zaction.toUpperCase() === "APPR") {
                            sap.m.MessageBox.warning("Changes not Allowed after sent for Approval.");
                            isVoyageEditable = false;
                        } else {
                            sap.m.MessageBox.warning("Changes not Allowed after sent for Approval.");
                            isVoyageEditable = false;
                        }
                    } else {

                        isVoyageEditable = true;
                    }
                }).catch(error => {
                    console.log("Error",);
                    if (error.message.includes("No Record found for Voyage Status") || error.error.message.includes("No record found in voyage status")) {
                        isVoyageEditable = true
                    }
                    console.error("Error while fething contetxs : ", error)
                });
                if (!isVoyageEditable) {

                    return

                }


                let headerDetail = voyHeaderModel.getData();
                let itemDetails = voyItemModel.getData();
                let costData = costdetailsModel.getData();

                // console.log(voyHeaderModel.getData(), voyItemDetail, costData);

                let frcostPlValue = this.byId("_friegthIdPlan").getValue();
                let frUnitPl = this.byId("_idFrunitPlan").getSelectedKey();

                // let totalcostPlvalue = this.byId("_totalCostPlId").getValue();
                let frCostPlanformatted = this.parseStringToNumber(frcostPlValue);

                // let totalCostPlformatted = this.parseStringToNumber(totalcostPlvalue);


                if (itemDetails.length < 2) {
                    new sap.m.MessageBox.warning("Minimum Two Ports are Mandatory");

                    return
                };

                // condition to check cost charges empty entries
                let isEmptyCostField = this.checkEmptyFieldsCostCharges(costData);
                if (isEmptyCostField) {
                    sap.m.MessageBox.error(this.errorMessage);
                    return;
                }

                // Check for loading charges and unloading charges conditions
                let hasLoadingCharges = false;
                let hasUnloadingCharges = false;
                let destinationPort = itemDetails[itemDetails.length - 1].Vlegn;

                for (let i = 0; i < costData.length; i++) {
                    let cost = costData[i];
                    if (cost.Vlegn === 1 && (cost.Costcode === "1000" || cost.Cstcodes === "LOADING CHARGES")) {
                        hasLoadingCharges = true;
                    }
                    if (cost.Vlegn === destinationPort && (cost.Costcode === "1001" || cost.Cstcodes === "UNLOADING CHARGES")) {
                        hasUnloadingCharges = true;
                    }
                }

                if (!hasLoadingCharges) {
                    new sap.m.MessageBox.error("Loading Charges for the Source Port is Mandatory");
                    return;
                }
                if (hasLoadingCharges && !hasUnloadingCharges) {
                    new sap.m.MessageBox.error("Unloading Charges for the Destination Port is Mandatory");
                    return;
                }



                let oTable1 = this.byId("submitTechDetailTable");
                let oTableItems = oTable1.getItems();

                // Extract all sCodeDesc values from oTableItems into an array
                let sCodeDescList = oTableItems.map(item => item.getCells()[0].getText());

                if (bidPayload) {
                    // Iterate over bidPayload using a for loop to allow deletion
                    for (let i = bidPayload.length - 1; i >= 0; i--) {
                        let item = bidPayload[i];

                        // Check if the item should be kept
                        if (!sCodeDescList.includes(item.CodeDesc) && item.Cunit === "") {
                            // Remove the item from the array if it doesn't match the condition
                            bidPayload.splice(i, 1);
                        }
                    }
                }

                console.log("bidPayload after  complete iteration --", bidPayload);
                // saving commercial Details to bidPayload;

                this.onSaveCommercialDetail();


                console.log(costData);

                let payload = {
                    Bidtype: headerDetail[0].Bidtype,
                    Carty: headerDetail[0].Carty,
                    Chpno: headerDetail[0].Chpno,
                    Chtyp: headerDetail[0].Chtyp,
                    Curr: headerDetail[0].Curr,
                    Currkeys: headerDetail[0].Currkeys,
                    Docind: headerDetail[0].Docind,

                    Frcost: frCostPlanformatted,
                    Frcost_Act: headerDetail[0].Frcost_Act,
                    Freght: headerDetail[0].Freght,
                    Frtco: headerDetail[0].Frtco,
                    Frtu: frUnitPl,
                    Frtu_Act: headerDetail[0].Frtu_Act,
                    GV_CSTATUS: "Voyage Created",
                    Party: "",
                    Ref_Voyno: "",
                    Refdoc: "",
                    Vessn: "",
                    Vimo: "",
                    Vnomtk: "",
                    Voynm: headerDetail[0].Voynm,
                    Voyno: headerDetail[0].Voyno,
                    Voyty: headerDetail[0].Voyty,
                    Vstat: "",
                    toitem: itemDetails,
                    tocostcharge: costData,
                    tobiditem: [...bidPayload],

                };


                let that = this;
                console.log("voyage payload :", payload);
                console.table(bidPayload);

                new sap.m.MessageToast.show("Saving Voyage Data ...", { duration: 500 });

                // oData v4 model create code
                const oDataModelV4 = this.getOwnerComponent().getModel();
                let oBindList = oDataModelV4.bindList("/xNAUTIxVOYAGEHEADERTOITEM", true);

                oBindList.create(payload, true).created(x => {
                    console.log("fsf", x);
                });

                oBindList.attachCreateCompleted(function (p) {
                    let p1 = p.getParameters();

                    let oContext = p1.context;
                    let oData = oContext.getObject();

                    if (p1.success) {
                        console.log(oData);

                        // MessageBox.success(`Successfully saved `);
                        MessageBox.success(`Successfully Saved `, {
                            title: "Voyage updation",
                            onClose: function () {

                                that.onRefresh();

                            }
                        });

                    } else {
                        sap.m.MessageBox.error(p1.context.oModel.mMessages[""][0].message);
                        console.log(p1.context.oModel.mMessages[""][0].message);
                    }


                });

            },
            checkEmptyFieldsCostCharges: function (dataArray) {
                for (let i = 0; i < dataArray.length; i++) {
                    const obj = dataArray[i];
                    if (
                        obj.Vlegn === "" ||
                        obj.Costcode === "" ||
                        obj.Costu === "" ||
                        obj.Procost === "" ||
                        obj.Costcurr === "" ||
                        obj.Cstcodes === ""
                    ) {
                        this.errorMessage = "All Cost Charges fields are Mandatory";
                        return true;
                    }
                    // Check if Procost is equal to 0.000
                    if (parseFloat(obj.Procost) === 0.000) {
                        this.errorMessage = "Projected Cost are Mandatory";
                        return true;
                    }
                }
                return false;
            },

            onRefresh: async function () {
                let that = this;

                if (!that._busyDialog1) {
                    that._busyDialog1 = new sap.m.BusyDialog({
                        title: "Please Wait",
                        text: "Refreshing data..."
                    });
                }
                that._busyDialog1.open();

                try {
                    let iconTab = this.byId("_idIconTabBar");
                    iconTab.setVisible(false);
                    iconTab.setSelectedKey('info');

                    that.byId('_voyageInput1').setValue("");
                    that.byId('fileUploader').setValue("");
                    that.byId('fileinput').setValue("");
                    this.byId('Input6').setValue("");
                    voyHeaderModel.setData([]);
                    voyItemModel.setData([]);
                    costdetailsModel.setData([]);

                    voyHeaderModel.refresh();
                    console.log(voyHeaderModel.getData());
                    voyItemModel.refresh();
                    costdetailsModel.refresh();
                    that.toggleEnable(false);


                    var oVerticalLayout = this.byId("_IDGenVertiLayout1");

                    if (oVerticalLayout) {
                        if (this._aFileUploaders && this._aFileUploaders.length > 0) {
                            for (var i = 0; i < this._aFileUploaders.length; i++) {
                                var oFileUploader = this._aFileUploaders[i].fileUploader;
                                var oUploadButton = this._aFileUploaders[i].uploadButton;
                                var oSuccessIconButton = this._aFileUploaders[i].successIconButton;
                                var oDescriptionInput = this._aFileUploaders[i].descriptionInput;

                                var oHorizontalLayout = oFileUploader.getParent();
                                if (oHorizontalLayout) {
                                    oVerticalLayout.removeContent(oHorizontalLayout);
                                }

                                oFileUploader.destroy();
                                oUploadButton.destroy();
                                oSuccessIconButton.destroy();
                                oDescriptionInput.destroy();
                            }

                            this._aFileUploaders = [];
                        }

                    }
                    that._busyDialog1.close();

                    await that.getDataforvoyage();



                } catch (error) {
                    console.error("Error during refresh:", error);
                } finally {
                    if (that._busyDialog1) {
                        that._busyDialog1.close();
                        that._busyDialog1 = null;
                    }
                }
            },


            getVoyageStatus: async function (myVOYNO) {
                try {
                    let oModel = this.getOwnerComponent().getModel();
                    let oData = await helperFunctions.readEntity(oModel, "xNAUTIxallstatuses", undefined, undefined, undefined, undefined);
                    if (oData.length) {
                        let filterValue = oData.filter(x => x.Voyage == myVOYNO);

                        if (filterValue.length) {

                            voyageStatus = filterValue[0].Status;
                            let oStatusField = this.byId('Input6');
                            oStatusField.setValue(voyageStatus);
                        } else {
                            sap.m.MessageBox.error("Voyage Status not Found")
                        }
                    }

                } catch (error) {
                    MessageBox.error(error.message)

                }


            },


         
            checkforValidUser: async function () {
                try {
                    let oModel = this.getOwnerComponent().getModel();
                    let oBinding = oModel.bindContext(`/xNAUTIxuserEmail(SmtpAddr='${userEmail}')`);
                    await oBinding.requestObject().then((oContext) => {
                        console.log(oContext);
                        userEmail = oContext.SmtpAddr;
                        console.log("hii", userEmail);
                    }).catch((error) => {
                        throw error
                    });

                } catch (error) {
                    userEmail = undefined
                    sap.m.MessageBox.error("You are not Authorized to send for Voyage Approval");
                    console.log("User Not Found", error.message);
                }
            },

         
            sendApproval: async function () {
                let oBusyDialog = new sap.m.BusyDialog();
                oBusyDialog.open(); 
            
                try {
                    if (!myVOYNO) {
                        sap.m.MessageBox.error("Please Select Voyage");
                        oBusyDialog.close();
                        return;
                    }
            
                    if (!bidPayload.length) {
                        sap.m.MessageBox.error("Please fill Bid Details");
                        oBusyDialog.close(); 
                        return;
                    }
            
                    let isTechnicalDetailsPresent = false;
                    let isCommercialDetailsPresent = false;
            
                    // Check for Technical and Commercial details
                    for (let item of bidPayload) {
                        if (item.Cunit == "") {
                            isTechnicalDetailsPresent = true;
                        } else {
                            isCommercialDetailsPresent = true;
                        }
                    }
            
                    if (!isTechnicalDetailsPresent) {
                        sap.m.MessageBox.error("Please fill Technical Bid Details");
                        oBusyDialog.close();
                        return;
                    }
            
                    if (bidData.length !== bidPayload.length) {
                        sap.m.MessageBox.error("Please Save Bid Details.");
                        oBusyDialog.close(); 
                        return;
                    }
            
                    if (!isCommercialDetailsPresent) {
                        sap.m.MessageBox.error("Please fill Commercial Bid Details");
                        oBusyDialog.close(); 
                        return;
                    }
            
                    let oModel = this.getOwnerComponent().getModel();
                    let oBinding = oModel.bindContext(`/voyappstatusSet(Voyno='${myVOYNO}')`);
                    let eligibleforApproval = false;
            
                    await oBinding.requestObject().then((oContext) => {
                        if (oContext) {
                            let Zaction = oContext.Zaction;
            
                            if (Zaction === "REJ") {
                                eligibleforApproval = true;
                            } else if (Zaction.toUpperCase() === "APPR") {
                                sap.m.MessageBox.warning("Already sent for Approval, status: Approved");
                                oBusyDialog.close(); 
                            } else {
                                sap.m.MessageBox.warning("Already sent for Approval, Status: Pending");
                                oBusyDialog.close(); 
                            }
                        } else {
                            eligibleforApproval = true;
                        }
                    }).catch(error => {
                        console.log("Error", error);
                        if (error.message.includes("No record found in Voyage Status") || error.error.message.includes("No record found in voyage status")) {
                            eligibleforApproval = true;
                        }
                        console.error("Error while fetching contexts: ", error);
                        oBusyDialog.close(); 
                    });
            
                    if (eligibleforApproval) {
                        await this.onSendForApprovalCreate(oBusyDialog); 
                    }
                } catch (error) {
                    console.log("Error during approval process:", error);
                    oBusyDialog.close(); 
                }
            },
            onSendForApprovalCreate: async function (oBusyDialog) {
                if (!myVOYNO) {
                    sap.m.MessageBox.error("Please enter Voyage No.");
                    oBusyDialog.close();
                    return;
                }
            
                await this.checkforValidUser();
                if (!userEmail) {
                    oBusyDialog.close(); 
                    return;
                }
            
                let oRouter = this.getOwnerComponent().getRouter(); 
                let oModel = this.getOwnerComponent().getModel();
                let oBindListSP = oModel.bindList("/voyapprovalSet");
            
                try {
                   
                    let saveddata = oBindListSP.create({
                        "Vreqno": "",
                        "Voyno": myVOYNO,
                        "Zemail": userEmail
                    });
            
                    await oBindListSP.requestContexts(0, Infinity).then(function (aContexts) {
                        let ApprovalNo = aContexts.filter(oContext => oContext.getObject().Voyno === myVOYNO);
                        if (ApprovalNo.length > 0) {
                            let appNo = ApprovalNo[0].getObject().Vreqno;
                            console.log(appNo);
            
                           
                            sap.m.MessageBox.success(`Voyage Approval no. ${appNo} Created Successfully`, {
                                onClose: function () {
                                    oBusyDialog.close(); 
            
                                    
                                    oRouter.navTo("RouteVoyageDashboard");
                                }
                            });
                        } else {
                            sap.m.MessageBox.error("Error: Approval not found after creation");
                            oBusyDialog.close();
                        }
                    }).catch(function (error) {
                        console.log("Error while requesting contexts:", error);
                        if (error.cause && error.cause.message.includes("VOYNO. NOT ASSOCIATED TO VESSELTYPE AND VOYAGE TYPE")) {
                            sap.m.MessageBox.error("Release Strategy is not Maintained against Voyage Type and Vessel Type");
                        } else {
                            sap.m.MessageBox.error("Error while Sending Approval");
                        }
                        oBusyDialog.close(); 
                    });
                } catch (error) {
                    console.log("Error while saving data:", error);
                    oBusyDialog.close(); 
                }
            },
            
        


            onCancelVoayge: async function () {


                const voynoNoValue = this.getView().byId("_voyageInput1").getValue(); // Assuming you have an input field for ChartNo
                if (!voynoNoValue) {
                    sap.m.MessageBox.error("Please Select Voyage No.");
                    return;
                }
                let oModel = this.getOwnerComponent().getModel();
                let oBinding = oModel.bindContext(`/voyappstatusSet(Voyno='${myVOYNO}')`);
                let eligibleforCancel = false;
                await oBinding.requestObject().then((oContext) => {
                    console.log(oContext);

                    if (oContext) {
                        let Zaction = oContext.Zaction;
                        console.log(oContext.Voyno);
                        console.log(Zaction);

                        if (Zaction === "REJ") {
                            eligibleforCancel = true;

                        } else if (Zaction.toUpperCase() === "APPR") {
                            sap.m.MessageBox.warning("Already sent for Approval, can't be cancelled");
                        } else {
                            sap.m.MessageBox.warning("Already sent for Approval, can't be cancelled");
                        }
                    } else {

                        // No existing approval found, proceed with creation
                        eligibleforCancel = true;

                    }
                }).catch(error => {
                    if (error.message.includes("No record found in Voyage Status")) {
                        eligibleforCancel = true


                    }
                    console.error("Error while fetching contexts: ", error);
                });

                const that = this;
                if (eligibleforCancel) {

                    sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                        MessageBox.confirm(
                            "Are you sure you want to delete?", {
                            title: "Confirm",
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    that.deleteVoyageSet(voynoNoValue);
                                } else {
                                    sap.m.MessageToast.show("Deletion Cancelled");
                                }
                            }
                        }
                        );
                    });
                }
            },
            deleteVoyageSet: function (voynoNoValue) {
                let that = this;
                let oModel = this.getOwnerComponent().getModel();

                let oBindList = oModel.bindList("/xNAUTIxVOYAGEHEADERTOITEM");
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    let voyageData = []
                    aContexts.forEach(function (oContext) {
                        voyageData.push(oContext.getObject());
                        if (oContext.getObject().Voyno === voynoNoValue) {

                            oContext.delete();

                            sap.m.MessageToast.show("Voyage with  '" + voynoNoValue + "' Deleted Successfully");
                            that.onRefresh();

                        }
                    });

                }.bind(this))

            },


            onAddRowFileUpload: function () {
                var oInitialInput = this.byId("fileinput");
                var oInitialFileUploader = this.byId("fileUploader");

                if (oInitialInput && oInitialFileUploader) {
                    if (!oInitialInput.getValue() || !oInitialFileUploader.getValue()) {
                        sap.m.MessageToast.show("Please Upload file and add Description First ");
                        return;
                    }
                }

                if (this._aFileUploaders && this._aFileUploaders.length > 0) {
                    var lastUploader = this._aFileUploaders[this._aFileUploaders.length - 1];

                    if (!lastUploader.descriptionInput.getValue() || !lastUploader.fileUploader.getValue()) {
                        sap.m.MessageToast.show("Please upload a File and provide a Description before adding a New File.");
                        return;
                    }
                }

                var oVerticalLayout = this.byId("_IDGenVertiLayout1");

                if (oVerticalLayout) {
                    var oHorizontalLayout = new sap.ui.layout.HorizontalLayout();

                    var oInput = new sap.m.Input({
                        width: "250px",
                        placeholder: "Description of file",
                        liveChange: this.Fileinputchange.bind(this)
                    });
                    oInput.addStyleClass("sapUiMarginTinyEnd");

                    var oFileUploader = new sap.ui.unified.FileUploader({
                        uploadUrl: "odata/v4/nautical/FileuploadSet",
                        sendXHR: true,
                        httpRequestMethod: sap.ui.unified.FileUploaderHttpRequestMethod.Post,
                        change: this.handleValueChangeUpload.bind(this),
                        tooltip: "Upload your file to the local server",
                        buttonText: "Choose File",
                        icon: "sap-icon://value-help",
                        fileType: "pdf",
                        typeMissmatch: this.handleTypeMissmatch.bind(this)
                    });

                    var oUploadButton = new sap.m.Button({
                        text: "Upload File",
                        press: this.handleUploadPress.bind(this)
                    });

                    var oDeleteButton = new sap.m.Button({
                        icon: "sap-icon://delete",
                        type: sap.m.ButtonType.Reject,
                        press: this.OnfileUploadDelete.bind(this)
                    });

                    var oSuccessIconButton = new sap.m.Button({
                        icon: "sap-icon://message-success",
                        visible: false
                    });

                    oHorizontalLayout.addContent(oInput);
                    oHorizontalLayout.addContent(oFileUploader);
                    oHorizontalLayout.addContent(oUploadButton);
                    oHorizontalLayout.addContent(oDeleteButton); // Add delete button to the layout
                    oHorizontalLayout.addContent(oSuccessIconButton);

                    oVerticalLayout.insertContent(oHorizontalLayout, oVerticalLayout.getContent().length - 1);

                    if (!this._aFileUploaders) {
                        this._aFileUploaders = [];
                    }
                    this._aFileUploaders.push({
                        fileUploader: oFileUploader,
                        uploadButton: oUploadButton,
                        deleteButton: oDeleteButton, // Store reference to delete button
                        successIconButton: oSuccessIconButton,
                        descriptionInput: oInput
                    });
                } else {
                    console.error("VerticalLayout with ID '_IDGenVertiLayout1' not found.");
                }
            },

            Fileinputchange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                if (sValue.length > 100) {
                    sValue = sValue.substring(0, 100);
                    oInput.setValue(sValue);
                    sap.m.MessageToast.show("Maximum length is 100 characters.");
                }

                if (/[^a-zA-Z0-9 ]/.test(sValue) || /^\s/.test(sValue)) {
                    sValue = sValue.replace(/[^a-zA-Z0-9 ]/g, '').replace(/^\s+/g, '');

                    oInput.setValue(sValue);
                    sap.m.MessageToast.show("Only Alphanumeric Characters are allowed");
                }
            },

            handleUploadPress: function (oEvent) {
                this._busyDialog = new sap.m.BusyDialog();
                if (this._busyDialog) {
                    this._busyDialog.open();
                }

                let oUploadButton = oEvent.getSource();
                let oHorizontalLayout = oUploadButton.getParent();
                let oFileUploader = oHorizontalLayout.getContent().find(function (content) {
                    return content instanceof sap.ui.unified.FileUploader;
                });
                let oDescriptionInput = oHorizontalLayout.getContent().find(function (content) {
                    return content instanceof sap.m.Input;
                });

                if (oFileUploader && oDescriptionInput) {
                    let fileDescription = oDescriptionInput.getValue().trim(); // Trim any leading/trailing spaces

                    // Check if the description input is filled
                    if (!fileDescription) {
                        sap.m.MessageToast.show("Please provide a description before uploading.");
                        this._busyDialog.close();
                        return;
                    }

                    let domRef = oFileUploader.getDomRef();
                    let file = domRef.querySelector("input[type='file']").files[0];

                    if (!file) {
                        sap.m.MessageToast.show("No file selected for upload.");
                        this._busyDialog.close();
                        return;
                    }

                    this.fileName = file.name.substring(0, 30);
                    this.fileType = file.type.substring(0, 30);
                    this.fileDescription = fileDescription;

                    let reader = new FileReader();
                    let that = this;
                    reader.onload = function (e) {
                        let arr = e.target.result.split(",");
                        let vContent1 = arr[1];
                        that.postToBackend(myVOYNO, that.fileName, that.fileType, vContent1, that.fileDescription, oUploadButton, oDescriptionInput, oFileUploader);
                    };
                    reader.readAsDataURL(file);
                } else {
                    sap.m.MessageToast.show("FileUploader or Description Input not found in the row.");
                    this._busyDialog.close();
                }
            },


            OnfileUploadDelete: function (oEvent) {
                var oButton = oEvent.getSource();
                var oHorizontalLayout = oButton.getParent();
                var oVerticalLayout = this.byId("_IDGenVertiLayout1");

                var isStaticRow = !this._aFileUploaders.find(function (item) {
                    return item.fileUploader.getParent() === oHorizontalLayout;
                });

                if (isStaticRow) {
                    var oDescriptionInput = oHorizontalLayout.getContent().find(function (content) {
                        return content instanceof sap.m.Input;
                    });
                    var oFileUploader = oHorizontalLayout.getContent().find(function (content) {
                        return content instanceof sap.ui.unified.FileUploader;
                    });

                    if (oDescriptionInput && oFileUploader) {
                        var descriptionValue = oDescriptionInput.getValue().trim();
                        var fileUploaderValue = oFileUploader.getValue();

                        if (descriptionValue === "" && fileUploaderValue === "") {
                            sap.m.MessageToast.show("Nothing to delete. The description and file uploader are empty.");
                            return;
                        } else {
                            sap.m.MessageBox.confirm("Are you sure you want to delete this item?", {
                                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.Cancel],
                                onClose: function (oAction) {
                                    if (oAction === sap.m.MessageBox.Action.OK) {
                                        if (descriptionValue !== "") {
                                            oDescriptionInput.setValue("");
                                        }
                                        if (fileUploaderValue !== "") {
                                            oFileUploader.clear();
                                        }
                                        sap.m.MessageToast.show(" Deleted Successfully");
                                    }
                                }.bind(this)
                            });
                        }
                    }
                } else {
                    sap.m.MessageBox.confirm("Are you sure you want to delete this item?", {
                        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.Cancel],
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                oVerticalLayout.removeContent(oHorizontalLayout);

                                var index = this._aFileUploaders.findIndex(function (item) {
                                    return item.fileUploader.getParent() === oHorizontalLayout;
                                });
                                if (index !== -1) {
                                    this._aFileUploaders.splice(index, 1);
                                }
                                sap.m.MessageToast.show(" Deleted Successfully");

                                var oSuccessIconButton = oHorizontalLayout.getContent().find(function (content) {
                                    return content instanceof sap.m.Button && content.getIcon() === "sap-icon://message-success";
                                });
                                if (oSuccessIconButton) {
                                    oSuccessIconButton.setVisible(false);
                                }
                            }
                        }.bind(this)
                    });
                }
            },
            postToBackend: function (voyageNo, filename, filetype, content, fileDescription, oUploadButton, oDescriptionInput, oFileUploader) {
                let oModel = this.getOwnerComponent().getModel();
                let bindList = oModel.bindList("/FileuploadSet");
                let that = this;

                bindList.attachCreateCompleted(async function (p) {
                    let params = p.getParameters();
                    let isSuccess = params.success;
                    that._busyDialog.close();

                    let oHorizontalLayout = oUploadButton.getParent();

                    let oSuccessIconButton = oHorizontalLayout.getContent().find(function (content) {
                        return content instanceof sap.m.Button && content.getIcon() === "sap-icon://message-success";
                    });

                    let oDeleteIconButton = oHorizontalLayout.getContent().find(function (content) {
                        return content instanceof sap.m.Button && content.getIcon() === "sap-icon://delete";
                    });

                    if (isSuccess) {
                        sap.m.MessageBox.success("File successfully uploaded");

                        if (oUploadButton) {
                            oUploadButton.setEnabled(false);
                        }
                        if (oFileUploader) {
                            oFileUploader.setEnabled(false);
                        }
                        if (oDescriptionInput) {
                            oDescriptionInput.setEnabled(false);
                        }
                        if (oSuccessIconButton) {
                            oSuccessIconButton.setType(sap.m.ButtonType.Accept);
                            oSuccessIconButton.setVisible(true);
                        }
                        if (oDeleteIconButton) {
                            oDeleteIconButton.setVisible(false);
                        }
                    } else {
                        let errMsgArr = params.context.oModel.mMessages[""];
                        let errMsg = errMsgArr[errMsgArr.length - 1].message;
                        if (errMsg.includes("Duplicate Key")) {
                            sap.m.MessageBox.error(`File with name "${filename}" already exists`);
                        } else {
                            sap.m.MessageBox.error(errMsg);
                        }
                    }
                });

                let payload = {
                    "Filedescription": fileDescription,
                    "Filename": filename,
                    "Filecont": content,
                    "Voyageno": voyageNo,
                    "Filetype": filetype,
                };

                bindList.create(payload, true);
            },


            handleValueChangeUpload: function (oEvent) {
                sap.m.MessageToast.show("Press 'Upload File' to upload file '" + oEvent.getParameter("newValue") + "'");
            },
            handleTypeMissmatch: function (oEvent) {
                var aFileTypes = oEvent.getSource().getFileType();
                aFileTypes.map(function (sType) {
                    return "*." + sType;
                });
                sap.m.MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                    " is not supported. Choose one of the following types: " +
                    aFileTypes.join(", "));
            },

            lateInputField: function (inputField, selectedValue) {
                inputField.setValue(selectedValue);
            },

            // Dialog for currency value help
            showValueHelpDialogCurr: function (oEvent) {
                let oSource = oEvent.getSource();

                // Create a dialog
                console.log("clicked Currency type");
                var oDialog = new sap.m.Dialog({
                    title: "Select: Currency",
                    contentWidth: "25%",
                    contentHeight: "50%",

                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,
                        noDataText: "Loading ...",
                        alternateRowColors: true,
                        sticky: ["ColumnHeaders"],
                        mode: "SingleSelectMaster",
                        fixedLayout: "false",
                        // headerToolbar: [
                        //     new sap.m.OverflowToolbar({
                        //         content: [
                        //             new sap.m.SearchField({
                        //                 width: "auto",
                        //                 placeholder: "Search Value/Description",
                        //                 tooltip: "Search Value/Description",
                        //                 liveChange: this._onHelpTableSearchCurr
                        //             }),
                        //         ],
                        //     }),
                        // ],
                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Currency Code" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Currency Description" }),
                            }),
                        ],

                        selectionChange: function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oSelectedValue = oSelectedItem.getCells()[0].getText();
                            var inputVoyageType = oSource
                            this.lateInputField(inputVoyageType, oSelectedValue);
                            oDialog.close();
                        }.bind(this),
                    }),
                    beginButton: new sap.m.Button({
                        text: "Cancel",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                        },
                    }),

                });

                let oValueHelpTable = oDialog.getContent()[0]; // Assuming the table is the first content element

                oValueHelpTable.bindItems({
                    path: "/CurTypeSet", // Replace with your entity set
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{Navoycur}" }),
                            new sap.m.Text({ text: "{Navoygcurdes}" }),
                        ],
                    }),
                });
                // Bind the dialog to the view
                this.getView().addDependent(oDialog);

                // Open the dialog
                oDialog.open();
            },
            _onHelpTableSearchCurr: function (oEvent) {


                let oHelpTable = oEvent.getSource().getParent().getParent();
                let query = oEvent.getParameter("newValue"),
                    aFilter = [],
                    fFilter,
                    columnArray = [{ col: "Navoycur" }, { col: "{Navoygcurdes}" }];

                for (let columnObject of columnArray) {
                    if (columnObject && columnObject.col) {
                        aFilter.push(
                            new sap.ui.model.Filter(
                                columnObject.col,
                                query.length === 3 ? sap.ui.model.FilterOperator.EQ : sap.ui.model.FilterOperator.Contains,
                                query
                            )
                        );
                    }
                }

                fFilter = new sap.ui.model.Filter({
                    filters: aFilter,
                    and: false,
                });

                oHelpTable.getBinding("items").filter(fFilter);
                if (!oHelpTable.getItems().length) oHelpTable.setNoDataText("No data");
            },
            showValueHelpDialogCargoUnit: function (oEvent) {
                let oSource = oEvent.getSource();
                // console.log(oSource);
                // Create a dialog
                console.log("clicked CargoUnit");
                var oDialog = new sap.m.Dialog({
                    title: "Select: Cargo Unit",
                    contentWidth: "30%",
                    contentHeight: "50%",
                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,
                        noDataText: "Loading ...",
                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Code" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Description" }),
                            }),
                        ],

                        selectionChange: function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oSelectedValue = oSelectedItem.getCells()[0].getText();
                            var inputVoyageType = oSource; // Input field for Voyage Type
                            this.lateInputField(inputVoyageType, oSelectedValue);
                            oDialog.close();
                        }.bind(this),
                    }),
                    beginButton: new sap.m.Button({
                        text: "Cancel",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                        },
                    }),

                });

                let oValueHelpTable = oDialog.getContent()[0]; // Assuming the table is the first content element

                oValueHelpTable.bindItems({
                    path: "/CargoUnitSet", // Replace with your entity set
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{Uom}" }),
                            new sap.m.Text({ text: "{Uomdes}" }),
                        ],
                    }),
                });
                // Bind the dialog to the view
                this.getView().addDependent(oDialog);

                // Open the dialog
                oDialog.open();
            },
            showValueHelpDialogCost: function (oEvent) {

                let oInputSource = oEvent.getSource();
                // console.log("clicked Cost value help");

                let costDescInput = oEvent.getSource().oParent.getCells()[2];

                let oVlegn = oEvent.getSource().oParent.getCells()[0].getValue();
                oVlegn = parseInt(oVlegn, 10);
                if (!oVlegn) {
                    new sap.m.MessageToast.show("Please fill the LegId ");
                    return;

                }

                let oDialog = new sap.m.Dialog({
                    title: "Select: Cost Types",
                    contentWidth: "25%",
                    contentHeight: "50%",
                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,
                        noDataText: "Loading ...",
                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Cost Code" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Cost Description" }),
                            }),
                        ],

                        selectionChange: function (oEvent) {
                            let oSelectedItem = oEvent.getParameter("listItem");
                            let sCostCode = oSelectedItem.getCells()[0].getText();
                            let sCostDesc = oSelectedItem.getCells()[1].getText();

                            // console.log("selected values :", sCostCode, sCostDesc, costDescInput);
                            let costData = costdetailsModel.getData();
                            let isDuplicateEntry = false;
                            let itemsLength = voyItemModel.getData().length;
                            for (let i = 0; i < costData.length; i++) {

                                if (oVlegn === 1 && sCostCode == 1001) {
                                    new sap.m.MessageToast.show("Source Port can not have Unloading Charges");
                                    return
                                } else if (oVlegn === itemsLength && (sCostCode == 1000 || (sCostDesc.toUpperCase() == 'LOADING CHARGES'))) {
                                    new sap.m.MessageToast.show("Loading charges not applicable to destination port");
                                    return;
                                }

                                else if (parseInt(costData[i].Vlegn) === oVlegn && costData[i].Costcode === sCostCode) {
                                    isDuplicateEntry = true;
                                    new sap.m.MessageToast.show("Charges already exists");
                                    break;
                                }
                            }
                            if (!isDuplicateEntry) {

                                this.lateInputField(oInputSource, sCostCode);
                                this.lateInputField(costDescInput, sCostDesc);
                            }
                            oDialog.close();
                        }.bind(this),
                    }),
                    beginButton: new sap.m.Button({
                        text: "Cancel",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                        },
                    }),

                });

                let oValueHelpTable = oDialog.getContent()[0]; // Assuming the table is the first content element

                oValueHelpTable.bindItems({
                    path: "/CostMasterSet", // Replace with your entity set
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{Costcode}" }),
                            new sap.m.Text({ text: "{Cstcodes}" }),
                        ],
                    }),
                });
                // Bind the dialog to the view
                this.getView().addDependent(oDialog);

                // Open the dialog
                oDialog.open();
            },

            populateInputField: function (inputField, selectedValue) {
                inputField.setValue(selectedValue);
            },
            onBackPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCreateVoyage");
            },
            onPressHome: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHome");
            },


        });
    }
);