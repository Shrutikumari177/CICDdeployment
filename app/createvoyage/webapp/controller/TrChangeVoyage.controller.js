
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


        let voyHeaderModel = {};
        let voyItemModel = {};
        /**
         * @type {sap.ui.model.json.JSONModel}
         */
        let costdetailsModel = {};

        let tempDataArr = [];
        let voyageNum;

        let portData = [];
        let oBidCharterModel;
        let bidItemModel;
        let bidPayload = [];
        let myVOYNO;
        let oCommercialModel;
        let userEmail;

        return BaseController.extend("com.ingenx.nauti.createvoyage.controller.TrChangeVoyage", {
            formatter: formatter,
            onInit: async function () {

                await this.getLoggedInUserInfo();

                bidPayload = [];
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
                let oRouter = this.getOwnerComponent().getRouter();


                oRouter.getRoute("RouteTrChangeVoyage").attachPatternMatched(this.onObjectMatched, this);

                let hideButton = this.byId("Hide");
                let hideButton1 = this.byId("Hide1");
                if (hideButton) {
                    hideButton.attachPress(this.toggleNavContainer.bind(this));
                }
                if (hideButton1) {
                    hideButton1.attachPress(this.toggleBarAndNavContainer.bind(this));
                }
                oBidCharterModel = new JSONModel();
                this.getView().setModel(oBidCharterModel, "oBidCharterModel");
                this.debouncedOnPortDaysChange = this.debounce(this._onPortDaysChange.bind(this), 300);

                await this._initBidTemplate();

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
                    userEmail = undefined;
                }
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
                return new Promise((resolve, reject) => {
                    voyItemModel.refresh();
                    console.log("on port days change ", voyItemModel.getData())

                    // CALLING OnCalc FUNCTION FOR POSTING DETAILS AND GETTING ARRIVAL DATE AND ARRIVAL TIME
                    this.onCalc();
                    let updatedTotalDays = this.totalSeaDaysCalc(voyItemModel.getData());
                    this.byId('_totalDays').setValue(updatedTotalDays);
                    resolve();
                });
            },
            getBidDetails1: async function (VoyageNo) {

                let that = this;
                bidItemModel = new JSONModel();

                let oModel = this.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/xNAUTIxBIDITEM", undefined, undefined, undefined, {
                    $filter: `Voyno eq '${VoyageNo}'`
                });
                await oBindList.requestContexts(0, Infinity).then(function (oContexts) {

                    console.log(oContexts);
                    let data = [];
                    oContexts.forEach(oContext => {
                        data.push(oContext.getObject());
                    })
                    console.log("bid details data : ", data);

                    //clone data to bidPayload 

                    if (data.length) {
                        bidPayload = [...data];
                        console.log(bidPayload);
                        that.relevanceDataTechnical();

                    }

                    bidItemModel.setData(data);
                    that.getView().setModel(bidItemModel, "bidItemModel");
                    that.getView().getModel('bidItemModel').refresh();

                    console.table(that.getView().getModel("bidItemModel").getData());

                })

            },
            getBidDetails: async function (VoyageNo) {
                let that = this;
                if (!that._busyDialog) {
                    that._busyDialog = new sap.m.BusyDialog({
                        title: "Please Wait",
                        text: "Loading bid details..."
                    });
                }
                that._busyDialog.open();
                try {
                    let bidItemModel = new sap.ui.model.json.JSONModel();
                    let oModel = this.getOwnerComponent().getModel();
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
                    let templateData = await that._getBidTemplate(oModel, "technical");
                    bidPayload = [...data];
                    that._setBidTemplate(templateData, that.byId("submitTechDetailTable")); 
                } catch (error) {
                    console.error("Error loading bid details:", error);
                } finally {
                    if (that._busyDialog) {
                        that._busyDialog.close();
                        that._busyDialog = null;
                    }
                }
            },  
            relevanceDataTechnical: function () {
                console.log("rel fn called");
                let otechtable = this.byId('submitTechDetailTable');
                console.log(otechtable);
                let tableItems = otechtable.getItems();
                for (let i = 0; i < tableItems.length; i++) {
                    let oItems = tableItems[i];
                    let oCells = oItems.getCells();
                    let oText = oCells[0].getText();
                    const foundObject = bidPayload.find(obj => obj.CodeDesc === oText);
                    if (foundObject) {
                        oCells[1].setSelected(true);
                        this.toggleCheckbox(undefined, tableItems[i]);
                    }
                    else {
                        oCells[1].setSelected(false);
                        oCells[2].setValue("").setEditable(false);
                        // this.toggleCheckbox(undefined, tableItems[i] );


                    }

                }

            },

            onObjectMatched: async function (oEvent) {
                let that = this;
                that._BusyDialog = new sap.m.BusyDialog();
                that._BusyDialog.open();

                tempDataArr = [];
                myVOYNO = oEvent.getParameter("arguments").VOYAGE_NO;
                voyageNum = myVOYNO;
                console.log("myVoyno  received:", myVOYNO);
                that.byId('_voyageInput1').setValue(myVOYNO);
                let iconTab = this.byId("_idIconTabBar");
                iconTab.setSelectedKey('info1');


                await that.getBidDetails(myVOYNO);
                // Set the model to the view

                let oModel = this.getOwnerComponent().getModel();
                let aFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, myVOYNO);

                let oBindList = oModel.bindList(`/xNAUTIxVOYAGEHEADERTOITEM`, undefined, undefined, [aFilter], {
                    $expand: "toitem,tocostcharge,tobiditem"
                });

                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    if (aContexts.length === 1) {
                        const entityData = aContexts[0].getObject();   // NEED TO Discuss
                        tempDataArr.push(entityData);

                        new sap.m.MessageToast.show("Data fetched successfully.")


                        // Set models only once
                        if (!that.voyHeaderModel) {
                            voyHeaderModel = new JSONModel();
                            voyItemModel = new JSONModel();
                            costdetailsModel = new JSONModel();
                        }


                        voyHeaderModel.setData(tempDataArr);
                        voyItemModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                        voyItemModel.setData([...tempDataArr[0].toitem]);
                        costdetailsModel.setData([...tempDataArr[0].tocostcharge]);
                        // sorting in asending based on Vlegn
                        costdetailsModel.getData().sort((a, b) => {
                            if (a.Vlegn < b.Vlegn) return -1;
                            if (a.Vlegn > b.Vlegn) return 1;
                            return 0;

                        });


                        that.getView().setModel(voyHeaderModel, "voyHeaderModel");
                        that.getView().setModel(voyItemModel, "voyItemModel");
                        that.getView().setModel(costdetailsModel, "costdetailsModel");


                        // Refresh models
                        that.getView().getModel("voyHeaderModel").refresh();
                        that.getView().getModel("voyItemModel").refresh();
                        that.getView().getModel("costdetailsModel").refresh();

                        console.log("LineItem :", that.getView().getModel("voyItemModel").getData());
                        console.log("costdetails :", that.getView().getModel("costdetailsModel").getData());

                        that.sCunit = voyHeaderModel.getData()[0].Curr;
                        oCommercialModel = new JSONModel({
                            myData: [
                                {
                                    "CodeDesc": "DEMURRAGE",
                                    "Cunit": that.sCunit,
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
                                }
                                ,
                                {
                                    "CodeDesc": "FREIGHT",
                                    "Cunit": that.sCunit,
                                    "Cvalue": 0,  // Decimal 
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
                    } else if (aContexts.length === 0) {

                        new sap.m.MessageBox.error(`No Data found against ${myVOYNO} Voyage no.`);
                    }

                    else {
                        console.warn("Entity with Voyage No." + myVOYNO + "has duplicate resource");
                        new sap.m.MessageBox.error(`Entity with Voyage ${myVOYNO} has duplicate resource`);
                    }
                }).catch(function (oError) {

                    console.log(`${oError.name} :${oError.message}`);
                    new sap.m.MessageBox.error(`${oError.name} :${oError.message}`);

                }).finally(function () {
                    if (that._BusyDialog) {

                        that._BusyDialog.close();
                        // console.log("busy Dialog closed ");
                    }

                });

                console.log("my data", tempDataArr);

            },



            //  code and function for bid details
            _initBidTemplate: async function () {
                console.log("begin initBidTemplate")
                let that = this;
                return new Promise(async function (resolve, reject) {

                    let oModel = that.getOwnerComponent().getModel();
                    //   let open = that.getOwnerComponent().getModel("status").getProperty("/open");
                    let oView = that.getView();
                    let templateData = await that._getBidTemplate(oModel, "technical");
                    let templateData2 = await that._getBidTemplate(oModel, "commercial"); // temporary changes
                    let oBidTemplateModel = new JSONModel(templateData);
                    oView.setModel(oBidTemplateModel, "bidtemplate");

                    let oTable1 = oView.byId("submitTechDetailTable");
                    // let oTable2 = oView.byId("CommercilalDetailTable");

                    if (Array.isArray(templateData, oTable1)) {
                        if (open) {
                            await that._setBidTemplate(templateData, oTable1);
                        } else {
                            that._setClosedBidTemplate();
                        }
                    } else {
                        console.log({ ErrorResponse: templateData });
                    }

                    console.log("end initBidTemplate")
                });
            },

            _getBidTemplate: function (oModel, detailType) {
                let index = "Not Found";
                return new Promise(async (resolve, reject) => {
                    try {

                        let oData = await helperFunctions.readEntity(oModel, "MasBidTemplateSet", undefined, undefined, undefined, undefined);
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

                    // oModel.read(`/MasBidTemplateSet`, {
                    //     success: (oData) => {
                    //         oData.results.sort((a, b) => {
                    //             if (a.Datatype.toLocaleLowerCase() < b.Datatype.toLocaleLowerCase()) {
                    //                 return -1;
                    //             }
                    //             if (a.Datatype.toLocaleLowerCase() > b.Datatype.toLocaleLowerCase()) {
                    //                 return 1;
                    //             }
                    //             return 0;
                    //         });
                    //         for (let i = oData.results.length - 1; i >= 0; i--) {
                    //             let el = oData.results[i];

                    //             delete el.__metadata;

                    //             if (detailType === "technical") {
                    //                 if (el.Code === "FREIG" || el.Code === "DEMURRAGE") {
                    //                     oData.results.splice(i, 1);
                    //                 }
                    //             } else if (detailType === "commercial") {
                    //                 if (el.Code !== "FREIG" && el.Code !== "DEMURRAGE") {
                    //                     oData.results.splice(i, 1);
                    //                 }
                    //             }
                    //         };
                    //         resolve(oData.results);
                    //     },
                    //     error: (oResponse) => {
                    //         reject(oResponse);
                    //     },
                });

            },

            _setBidTemplate1: function (templateData, oTable) {
                let editFlag = true;
                let oView = this.getView();
                let that = this;
                templateData.forEach((el) => {
                    let oItem;
                    let oCells = [];
                    oCells.push(new sap.m.Text({ text: el.Value }));
                    oCells.push(new sap.m.CheckBox({ select: this.toggleCheckbox.bind(this) }));

                    //  changes by deepanshu
                    oCells.push(
                        new sap.m.Input({
                            showValueHelp: true,
                            valueHelpRequest: function (oEvent) {
                                that._showValueHelpDialogMaster(oEvent, el.Datatype, el.Tablename, el.Value, el.Code);
                            },
                            editable: false,
                            valueHelpOnly: true,

                        }));

                    oCells.push(new sap.m.Button({
                        icon: "sap-icon://hint", press: function (oEvent) {
                            that.handlePopoverPress(oEvent, that);
                        }
                    }))

                    oItem = new sap.m.ColumnListItem({
                        cells: oCells,
                    });
                    oTable.addItem(oItem);
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
                        // editable: !isEditable
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
                    console.table(tempData);
                    console.log(distinctSet);

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

            onDeleteBidDetail: function (oEvent) {
                let oDialog = oEvent.getSource().getParent();
                let oTable = oDialog.getContent()[0]; // table is the third item in the dialog's content
                let oModel = oTable.getModel("tempModel");
                let aSelectedItems = oTable.getItems();

                let aSelectedIndices = [];

                // If no rows are selected, return
                if (oTable.getSelectedItems().length === 0) {
                    new sap.m.MessageToast.show("Please select an item to delete");
                    return;
                }

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

                // Clear the selection in the table
                oTable.removeSelections();
            },
            onSaveCommercialDetail: function () {
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
                let oTable = oDialog.getContent()[0]; // Assuming the table is the second item in the dialog's content
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
                    let entry = oModel.getData()[length - 1]
                    if (entry.Value === "" || entry.Zmin == "" || entry.Zmax == "" ||  (entry.Good === "" && entry.Mand === "" && entry.Must === "")) {
                        new sap.m.MessageToast.show("please fill the last entry first");
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
            // onSaveBidDetails : function ( oEvent ){
            //     let oModel1 = this.getOwnerComponent().getModel("modelV2");

            //     // above payload is  not working as Stringtype  value required instead of number or deciam and Vetad conversion error
            //     let payload = {
            //         Voyno: "1000000034",
            //         Voynm: "Test Voyage 9/11",
            //         Vnomtk: "",
            //         Refdoc: "",
            //         Docind: "",
            //         Vessn: "",
            //         Vimo: "",
            //         Chtyp: "",
            //         Chpno: "",
            //         Currkeys: "",
            //         Frtco: "0",
            //         Vstat: "",
            //         Voyty: "1000",
            //         Carty: "1000",
            //         Curr: "INR",
            //         Freght: "150000",
            //         Party: "",
            //         Bidtype: "SB",
            //         Frcost: "60000",
            //         Frtu: "L/S",
            //         Frcost_Act: "0",
            //         Frtu_Act: "",
            //         Ref_Voyno: "",
            //         GV_CSTATUS: "Voyage Created",
            //         tocostcharge:[],
            //         toitem:[],
            //         tobiditem: bidPayload

            //       }
            //       /*
            //       tobiditem:[
            //           {
            //               Voyno: "1000000034",
            //               Zcode: "CLASS",
            //               Value: "A",
            //               Cvalue: "0.000",
            //               Cunit: "",
            //               CodeDesc: "CLASS OF VESSEL",
            //               RevBid: false,
            //               Good: "X",
            //               Mand: "",
            //               Must: "",
            //               Zmin: "4",
            //               Zmax: "5"
            //           },
            //           {
            //               Voyno: "1000000034",
            //               Zcode: "CLASS",
            //               Value: "B",
            //               Cvalue: "0.000",
            //               Cunit: "",
            //               CodeDesc: "CLASS OF VESSEL",
            //               RevBid: false,
            //               Good: "X",
            //               Mand: "",
            //               Must: "",
            //               Zmin: "2",
            //               Zmax: "3"
            //           },
            //           {
            //               Voyno: "1000000034",
            //               Zcode: "PORT",
            //               Value: "INBOM",
            //               Cvalue: "0.000",
            //               Cunit: "",
            //               CodeDesc: "LAST PORT OF CALL",
            //               RevBid: false,
            //               Good: "X",
            //               Mand: "",
            //               Must: "",
            //               Zmin: "0",
            //               Zmax: "5"
            //           },
            //           {
            //               Voyno: "1000000034",
            //               Zcode: "COOR",
            //               Value: "IN",
            //               Cvalue: "0.000",
            //               Cunit: "",
            //               CodeDesc: "COUNTRY OF ORIGIN",
            //               RevBid: false,
            //               Good: "X",
            //               Mand: "",
            //               Must: "",
            //               Zmin: "0",
            //               Zmax: "5"
            //           },
            //           {
            //               Voyno: "1000000034",
            //               Zcode: "DAT1",
            //               Value: "20.09.2023",
            //               Cvalue: "0.000",
            //               Cunit: "",
            //               CodeDesc: "LAST CLEANING DATE",
            //               RevBid: false,
            //               Good: "X",
            //               Mand: "",
            //               Must: "",
            //               Zmin: "3",
            //               Zmax: "5"
            //           },
            //           {
            //               Voyno: "1000000034",
            //               Zcode: "PORT",
            //               Value: "INBOM",
            //               Cvalue: "0.000",
            //               Cunit: "",
            //               CodeDesc: "LAST PORT OF CALL",
            //               RevBid: false,
            //               Good: "X",
            //               Mand: "",
            //               Must: "",
            //               Zmin: "3",
            //               Zmax: "5"
            //           }
            //         ]
            //         */

            //     console.table( payload);


            //     // return;
            //     oModel1.create('/xNAUTIxVOYAGEHEADERTOITEM', payload,{
            //         success : function ( oData ){
            //             console.log(oData);
            //             oModel1.refresh();
            //         }, 
            //         error : function (oResponse) {
            //             console.log(oResponse);
            //         }
            //     })

            // },
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
                if (datatype === "DATE") {
                    obj = new sap.m.DatePicker({ valueFormat: "dd.MM.YYYY", value: "{tempModel>Value}" });

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
                                new sap.m.Column({ header: new sap.m.Text({ text: "Possible value" }), width: "220px" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Good To Have" }), hAlign: "Center" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Mandatory" }), hAlign: "Center" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Must Not Have" }), hAlign: "Center" }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Min score" }) }),
                                new sap.m.Column({ header: new sap.m.Text({ text: "Max score" }) }),
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
                                                // Handle radio button selection
                                                let value = oEvent.getParameter("selected");
                                                if (value) {
                                                    let context = oEvent.getSource().getBindingContext("tempModel");
                                                    context.getModel().setProperty(context.getPath() + "/Good", "");
                                                    context.getModel().setProperty(context.getPath() + "/Mand", "X");
                                                    context.getModel().setProperty(context.getPath() + "/Must", "");
                                                    oEvent.getSource().getParent().getCells()[4].setValue(0).setEditable(false);
                                                    oEvent.getSource().getParent().getCells()[5].setValue("").setEditable(true);
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
                                            placeholder: "0-5",
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
                            text: "Add row",
                            type: "Emphasized",
                            press: function (oEvent) {
                                that.onAddNewBid(oEvent, Code, description, undefined) // adding 4th parameter for make fn reusable
                            }
                        }).addStyleClass("sapUiTinyMargin"),
                        new sap.m.Button({
                            text: "delete",
                            press: function (oEvent) {
                                that.onDeleteBidDetail(oEvent)
                            }
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

                            function getDuplicateIndex(newEntry, existingEntries) {
                                for (let i = 0; i < existingEntries.length; i++) {
                                    if (existingEntries[i].Value === newEntry.Value) {
                                        return i;
                                    }
                                }
                                return -1;
                            }

                            let entries = tempModel.getData();
                            if (entries.length) {

                                // Check for internal duplicates within new entries
                                if (hasInternalDuplicates(entries)) {
                                    new sap.m.MessageBox.error("Duplicate entry not allowed");
                                    return; // Exit the press function
                                }
                                for (let entry of entries) {
                                    if (!entry.Value || (!entry.Good && !entry.Mand && !entry.Must) || !entry.Zmax || !entry.Zmin) {
                                        new sap.m.MessageBox.warning("Please fill empty field or remove entry.");
                                        return; // Exit the press function
                                    }
                                }
                                // Process each new entry
                                for (let newEntry of entries) {
                                    let duplicateIndex = getDuplicateIndex(newEntry, bidPayload);
                                    if (duplicateIndex !== -1) {
                                        // Overwrite the existing entry
                                        bidPayload[duplicateIndex] = newEntry;
                                    } else {
                                        // Add the new entry if no duplicate is found
                                        bidPayload.push(newEntry);
                                    }
                                }
                                // on Save locally saving bid changes

                                let oInputValue = that.getInputData(filterData);
                                oSource.setValue(oInputValue);

                                console.table(bidPayload);
                                oDialog.close();
                            } else {
                                sap.m.MessageBox.warning("Please add some details before saving");
                                oSource.setValue("");
                            }


                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Close",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                            console.log("kjkj");
                            console.table(bidPayload);
                        },
                    }),
                });

                oDialog.setModel(tempModel, "tempModel"); // Set the model to the dialog
                this.getView().addDependent(oDialog); // Bind the dialog to the view
                this.assignGroupToRadioButton(oDialog);
                oDialog.open(); // Open the dialog
                this.onAddNewBid(oEvent, Code, description, oDialog);
            },
            getInputData: function (hintData) {
                var firstMandValue = null;
                var firstGoodValue = null;

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
                }

                if (firstMandValue !== null) {
                    return firstMandValue;
                } else if (firstGoodValue !== null) {
                    return firstGoodValue;
                } else {
                    return null;
                }
            },
            
            checkRangeforZmax: function (oEvent) {
                // Get the input control
                let oInput = oEvent.getSource();

                let value = oInput.getValue();

                let numericValue = parseFloat(value);

                // Check if the value is within the range [1-5]
                if (numericValue >= 1 && numericValue <= 5) {
                    // Value is within the range, set value state to None
                    oInput.setValueState(sap.ui.core.ValueState.None);
                    oInput.setValueStateText("");
                } else {
                    // Value is out of range, set value state to Error
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Value must be between 1 and 5");
                }
            },
            checkRangeforZmin: function (oEvent) {
                // Get the input control
                let oInput = oEvent.getSource();

                let value = oInput.getValue();

                let numericValue = parseFloat(value);

                // Check if the value is within the range [1-5]
                if (numericValue >= 0 && numericValue <= 5) {
                    // Value is within the range, set value state to None
                    oInput.setValueState(sap.ui.core.ValueState.None);
                    oInput.setValueStateText("");
                } else {
                    // Value is out of range, set value state to Error
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    oInput.setValueStateText("Value must be between 1 and 5");
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
                console.log("port code cell chnage detected");
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

            onVetddDatePickerChange: function (oEvent) {
                let selectedDate = oEvent.getParameter("value");
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "MM/dd/yyyy" // Match the value format
                });
                let parsedDate = dateFormat.parse(selectedDate);
                if (parsedDate < new Date()) {
                    sap.m.MessageToast.show("You cannot select a past date.");
                    oEvent.getSource().setValue("");
                }
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
            //  FUNCTION: TO FORMAT TIME WHILE PUSH BACK TO MODEL AFTER FETCHING RESPONSE FROM API V2 oData
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

                // CALLING ONCALC FUNCTION FOR POSTING DETAILS AND GETTING ARRIVAL DATE AND ARRIVAL TIME
                this.onCalc();
                let updatedTotalDays = this.totalSeaDaysCalc(voyItemModel.getData());
                this.byId('_totalDays').setValue(updatedTotalDays);
            },
            onCalc: function () {
                let selectedPorts = voyItemModel.getData();
                let GvSpeed = selectedPorts[0].Vspeed;

                let that = this;

                let ZCalcNav = [];
                for (let i = 0; i < selectedPorts.length; i++) {
                      if (!selectedPorts[i].Weather) {
                        // new sap.ui.m.MessageBox.error("Please enter Weather ");
                        // return false;
                        selectedPorts[i].Weather = "0";
                      }
                    if (!selectedPorts[i].Cargs) {
                        new sap.ui.m.MessageBox.error("Please enter CargoSize ");
                        return false;
                    }
                    if (!selectedPorts[i].Cargu) {
                        new sap.ui.m.MessageBox.error("Please enter Cargo Unit");
                        return false;
                    }
                    if (!GvSpeed) {
                        new sap.ui.m.MessageBox.error("Please enter Speed ");
                        return false;
                    }
                    if (!selectedPorts[i].Ppdays) {
                        // new sap.ui.m.MessageBox.error("Please enter PortDays ");
                        new sap.ui.m.MessageBox.error("Please enter PortDays")
                        return false;
                    }
                }
                if (!selectedPorts[0].Vetdd) {
                    new sap.ui.m.MessageBox.error("Please select Departure Date and Time");
                    return false;
                }
                ZCalcNav.push({
                    Portc: selectedPorts[0].Portc,
                    Portn: selectedPorts[0].Portn,
                    Pdist: selectedPorts[0].Pdist,
                    Medst: "NM",
                    Vspeed: GvSpeed,
                    Ppdays: selectedPorts[0].Ppdays,
                    // Vsdays: selectedPorts[0].SeaDays,
                    // Vetdd: selectedPorts[0].DepartureDate, // Bad JS Date Value - DDMMYYYY 00:00:00 Timezone
                    Vetdd: new Date(selectedPorts[0].Vetdd), // DepartureDateValue must be in MM/DD/YYYY format for this to work
                    Vetdt: formatter.timeFormat(that.time2Format(selectedPorts[0].Vetdt)),
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
                        // Vsdays: selectedPorts[i].SeaDays,
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

                oBindList.create(oPayload, true).created(x => { console.log(x); });
                oBindList.attachCreateCompleted(function (p) {
                    let p1 = p.getParameters();

                    let oData = p1.context.getObject();
                    console.table(oData.ZCalcNav);

                    //   console.log(oData.ZCalcNav[0].Vetad, oData.ZCalcNav[0].Vetat, oData.ZCalcNav[0].Vetdd, oData.ZCalcNav[0].Vetdt, oData.ZCalcNav[1].Vetad, oData.ZCalcNav[1].Vetat, oData.ZCalcNav[1].Vetdd, oData.ZCalcNav[1].Vetdt);

                    let totalDays = 0;

                    oData.ZCalcNav.forEach((data, index) => {
                        selectedPorts[index].Vsdayss = data.Vsdays;
                        selectedPorts[index].Vspeed = GvSpeed;
                        selectedPorts[index].Vwead = data.Vwead;
                        selectedPorts[index].Vetad = formatter.dateStringToDateObj(data.Vetad);
                        selectedPorts[index].Vetat = formatter.timeStringToDateObj(data.Vetat);
                        selectedPorts[index].Vetdd = formatter.dateStringToDateObj(data.Vetdd);
                        selectedPorts[index].Vetdt = data.Vetdt;

                        totalDays += Number(selectedPorts[index].Vsdays) + Number(selectedPorts[index].Ppdays);
                        voyItemModel.refresh();
                    });
                })

                return
                const oDataModelV2 = this.getOwnerComponent().getModel("modelV2");
                oDataModelV2.create("/ZCalculateSet", oPayload, {
                    success: function (oData) {
                        console.log(oData);
                        let totalDays = 0;
                        oData.ZCalcNav.results.forEach((data, index) => {
                            selectedPorts[index].Vsdays = data.Vsdays;
                            selectedPorts[index].Vspeed = GvSpeed;
                            selectedPorts[index].Vwead = data.Vwead;

                            selectedPorts[index].Vetad = that.dateFormat(data.Vetad);

                            selectedPorts[index].Vetat = that.timeformat1(new Date(formatter.timestampToUtc(data.Vetat.ms)));

                            selectedPorts[index].Vetdd = that.dateFormat(data.Vetdd);

                            selectedPorts[index].Vetdt = that.timeformat1(new Date(formatter.timestampToUtc(data.Vetdt.ms)));

                            totalDays += Number(selectedPorts[index].Vsdays) + Number(selectedPorts[index].Ppdays);
                        });
                        voyItemModel.refresh();
                        // that.byId("daysInput").setValue(totalDays.toFixed(1));
                    },
                    error: function (oResponse) {
                        console.log(oResponse);
                    },
                });
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
                    return totalCost;
                }


            },
            calctotalCostNew: function (voyItemsArr) {
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
                let fCost1 = this.byId("_friegthIdPlan").getValue() || 0;

                let FCost = fCost1 == "" ? 0 : this.parseStringToNumber(fCost1);
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
                    MessageToast.show("Select a valid cargo unit")
                }

            },
            onCargoUniSelectChange: function (oEvent) {
                let oSelectedUnit = oEvent.getSource().getSelectedKey();
                this.liveFrCostChange();

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

                let itemdDataLength = voyItemModel.getData().length;

                if (!itemdDataLength) {
                    new sap.m.MessageBox.warning("Please add a port");
                    return;
                }
                let oTableModel = costdetailsModel;
                let oTableData = oTableModel.getData();
                let currency = voyHeaderModel.getData()[0].Curr;
                let unit = voyHeaderModel.getData()[0].toitem[0].Cargu;
                let lastEntry = oTableData[oTableData.length - 1];

                if (lastEntry && (lastEntry.Vlegn == "" || lastEntry.Procost == "" || lastEntry.Cstcodes == "" || lastEntry.Costu == "")) {
                    sap.m.MessageToast.show("Please fill the last entry first");
                    return
                }

                oTableData.push({ Voyno: myVOYNO, Vlegn: "", Procost: "", Prcunit: "", Costu: unit, Costcode: "", Cstcodes: "", Costcurr: currency, CostCheck: false });
                oTableModel.refresh();
                this.byId('_costTablePlan').removeSelections();

            },

            //  cost charges live  LegId change
            onVlegnInputLiveChange: function (oEvent) {
                let oInput = oEvent.getSource();
                let value = oInput.getValue();
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
                        new sap.m.MessageToast.show("Only integers are allowed", {
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
                    sap.m.MessageToast.show("Please select a row to remove");
                    return;
                }
                this.isDelete = true;

                // new sap.m.MessageBox.confirm("Are you sure, you want to delete ?", {
                //     title: "Cost deletion",
                //     onClose: this.onDialogClose.bind(this)
                // });
                if (this.isDelete) {

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
                    this.calctotalCost(voyItemModel.getData());
                    costdetailsModel.refresh();
                    voyItemModel.refresh();

                    console.log("costmodel after refresh ;", costdetailsModel.getData());

                    oTable.removeSelections();
                }
            },
            onDialogClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                    isDelete = true;

                    // let oTableItemModel = costdetailsModel;
                    // let oTableData = oTableItemModel.getData();

                    // aSelectedItems.forEach(function (oSelectedItem) {
                    //     let iIndex = oTable.indexOfItem(oSelectedItem);
                    //     oTableData.splice(iIndex, 1);
                    //     oTable.removeSelections();
                    // });

                    // oTableItemModel.setData(oTableData);

                } else {
                    oTable.removeSelections();
                }
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
            // fn  when any changes happen in cost item projected cost
            onCostLiveChange: function (oEvent) {

                let oSource = oEvent.getSource();
                let oValue = oEvent.getParameter('value')
                let sPath = oSource.getBindingContext("costdetailsModel").getPath();
                let oVlegn = parseInt(oSource.getBindingContext("costdetailsModel").getObject().Vlegn);
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
                // You might need to adjust this logic based on your data structure
                // For example, if legId determines forceSelection, adjust this accordingly
                return legId ? true : false;
            },

            onSaveVoyage: function () {
                let oModel = this.getOwnerComponent().getModel();
                let headerDetail = voyHeaderModel.getData();
                let itemDetails = voyItemModel.getData();
                let costData = costdetailsModel.getData();

                // console.log(voyHeaderModel.getData(), voyItemDetail, costData);

                let frcostPlValue = this.byId("_friegthIdPlan").getValue();
                let frUnitPl = this.byId("_idFrunitPlan").getSelectedKey();
                let totalcostPlvalue = this.byId("_totalCostPlId").getValue();
                let frCostPlanformatted = this.parseStringToNumber(frcostPlValue);
                // let totalCostPlformatted = this.parseStringToNumber(totalcostPlvalue);

                let commerDetailPayload = this.getView().getModel("commercialModel").getData().myData;
                if (itemDetails.length < 2) {
                    new sap.m.MessageBox.warning("Minimum two ports are mandatory");

                    return
                };

                // saving commercial Details to bidPayload;
                this.onSaveCommercialDetail();


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

                new sap.m.MessageToast.show("Saving voyage data ...", { duration: 500 });

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

                        MessageBox.success(`Successfully saved `);

                    } else {
                        sap.m.MessageBox.error(p1.context.oModel.mMessages[""][0].message);
                        console.log(p1.context.oModel.mMessages[""][0].message);
                    }


                });
                return
                oModel.create('/xNAUTIxVOYAGEHEADERTOITEM', payload, {
                    success: function (oData) {
                        console.log("result :", oData);
                        new sap.m.MessageBox.success("Changes saved Succcesfully.");
                        that.getOwnerComponent().getModel().refresh();


                    },
                    error: function (err) {
                        console.log(err);
                        let errMsg = JSON.parse(err.responseText).error.message.value;
                        console.log(errMsg);
                        new sap.m.MessageBox.error(errMsg)

                    }
                })
            },
            /*
            [
                        {
                            "Cargs": "100000",
                            "Cargu": "TO",
                            "Frcost": "0",
                            "Maktx": "",
                            "Matnr": "",
                            "Medst": "NM",
                            "Othco": "0",
                            "Pdist": "0",
                            "Portc": "INBOM",
                            "Portn": "MUMBAI",
                            "Ppdays": "2",
                            "Pstat": "",
                            "Totco": "0",
                            "Vetad": "2024-05-06",
                            "Vetat": "06:40:03",
                            "Vetdd": "2024-05-08",
                            "Vetdt": "06:40:03",
                            "Vlegn": 1,
                            "Voyno": "1000000112",
                            "Vsdays": "0",
                            "Vspeed": "23",
                            "Vwead": "00"
                          },
                          {
                            "Cargs": "100000",
                            "Cargu": "TO",
                            "Frcost": "0",
                            "Maktx": "",
                            "Matnr": "",
                            "Medst": "NM",
                            "Othco": "0",
                            "Pdist": "1971",
                            "Portc": "INPRT",
                            "Portn": "PARADIP",
                            "Ppdays": "2",
                            "Pstat": "",
                            "Totco": "0",
                            "Vetad": "2024-05-11",
                            "Vetat": "21:22:03",
                            "Vetdd": "2024-05-13",
                            "Vetdt": "21:22:03",
                            "Vlegn": 2,
                            "Voyno": "1000000112",
                            "Vsdays": "3.571",
                            "Vspeed": "23",
                            "Vwead": "0"
                          }
                    ]


            */

            onRefresh: function () {
                this.byId("_idIconTabBar").setVisible(false);
                this.byId('_voyageInput1').setValue("");
                voyHeaderModel.setData([]);
                voyItemModel.setData([]);
                costdetailsModel.setData([]);
                bidItemModel.setData([]);

                voyHeaderModel.refresh();
                voyItemModel.refresh();
                costdetailsModel.refresh();
                bidItemModel.refresh();
                this.toggleEnable(false);

            },
            sendApproval: async function () {

                if (!myVOYNO) {
                    sap.m.MessageBox.error("Please enter Voyage No.");
                    return;
                }

                let oModel = this.getOwnerComponent().getModel();
                let oBinding = oModel.bindContext(`/voyappstatusSet(Voyno='${myVOYNO}')`);
                let eligibleforApproval = false;

                await oBinding.requestObject().then((oContext) => {
                    console.log(oContext);

                    if (oContext) {
                        let Zaction = oContext.Zaction;
                        console.log(oContext.Voyno);
                        console.log(Zaction);

                        if (Zaction === "REJ") {
                            eligibleforApproval = true;

                        } else if (Zaction.toUpperCase() === "APPR") {
                            sap.m.MessageBox.warning("Already sent for approval - Status: Approved ");
                        } else {
                            sap.m.MessageBox.warning("Already sent for approval - Status: Pending");
                        }
                    } else {

                        // No existing approval found, proceed with creation
                        eligibleforApproval = true;
                    }
                }).catch(error => {
                    if (error.message.includes("No record found in voyage status")) {

                        eligibleforApproval = true // Proceed with creation on error
                    }
                    console.error("Error while fetching contexts: ", error);

                });
                const that = this;
                if (eligibleforApproval) {
                    that.onSendForApprovalCreate();
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
                    sap.m.MessageBox.error("User is not allowed to send for approval");
                    console.log("User Not Found", error.message);
                }
            },
            onSendForApprovalCreate: async function () {


                if (!myVOYNO) {
                    sap.m.MessageBox.error("Please enter Voyage No.");
                    return;
                }

                await this.checkforValidUser();
                if (!userEmail) {
                    return;
                }
                let oBindListSP = this.getView().getModel().bindList("/voyapprovalSet");

                try {
                    let saveddata = oBindListSP.create({
                        "Vreqno": "",
                        "Voyno": myVOYNO,
                        "Zemail": "sarath.venkateswara@ingenxtec.com"
                    });
                    console.log("saving data:", saveddata);
                    let oBusyDialog = new sap.m.BusyDialog();
                    oBusyDialog.open();

                    oBindListSP.requestContexts(0, Infinity).then(function (aContexts) {
                        let ApprovalNo = aContexts.filter(oContext => oContext.getObject().Voyno === myVOYNO);
                        if (ApprovalNo.length > 0) {
                            let appNo = ApprovalNo[0].getObject().Vreqno;
                            console.log(appNo);
                            sap.m.MessageBox.success(`Voyage Approval no. ${appNo} created successfully`);
                            oBusyDialog.close();
                        } else {
                            sap.m.MessageBox.error("Error: Approval not found after creation");
                        }
                    }).catch(function (error) {
                        console.error("Error while requesting contexts:", error);
                        oBusyDialog.close();
                        throw error

                    });
                } catch (error) {
                    console.error("Error while saving data:", error);
                    oBusyDialog.close();
                    sap.m.MessageBox.error("Error while saving data");
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
                            sap.m.MessageBox.warning("Already sent for approval, can't be cancel");
                        } else {
                            sap.m.MessageBox.warning("Already sent for approval, can't be cancel");
                        }
                    } else {

                        // No existing approval found, proceed with creation
                        eligibleforCancel = true;

                    }
                }).catch(error => {
                    if (error.message.includes("No record found in voyage status")) {
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
                                    sap.m.MessageToast.show("Deletion cancelled");
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

                            sap.m.MessageToast.show("Entry with  '" + voynoNoValue + "' deleted successfully");
                            that.onRefresh();

                        }
                    });

                }.bind(this))

            },
            // upload document code 
            handleUploadPress: function (oEvent) {
                this._busyDialog = new sap.m.BusyDialog();
                if (this._busyDialog) {
                    this._busyDialog.open();
                }
                let oFileUploader = this.byId("fileUploader");
                let domRef = oFileUploader.getDomRef();

                let file = domRef.querySelector("input[type='file']").files[0];

                if (!file) {
                    sap.m.MessageToast.show("No file selected for upload.");
                    return;
                }

                this.fileName = file.name;
                this.fileType = file.type;
                let reader = new FileReader();
                let that = this;
                reader.onload = function (e) {


                    //  let vContent = e.target.result.replace("data:image/jpeg;base64,",""); // hardcoded for image/jpeg file obly
                    let arr = e.target.result.split(",")
                    let vContent1 = arr[1];
                    // if(vContent === vContent1) console.log("same Binary string")

                    that.postToBackend(myVOYNO, that.fileName, that.fileType, vContent1);

                }
                reader.readAsDataURL(file);

            },
            postToBackend: function (voyageNo, filename, filetype, content) {

                let oModel = this.getOwnerComponent().getModel();

                let bindList = oModel.bindList("/FileuploadSet");

                let that = this;
                bindList.attachCreateCompleted(async function (p) {
                    let params = p.getParameters();

                    let isSuccess = params.success;

                    that._busyDialog.close();
                    if (isSuccess) {
                        new sap.m.MessageBox.success("File sucessfully uploaded");

                    } else {
                        let errMsgArr = params.context.oModel.mMessages[""];
                        let errMsg = errMsgArr[errMsgArr.length - 1].message
                        if (errMsg.includes("Duplicate Key")) {

                            new sap.m.MessageBox.error(`File with name " ${filename}  "  already exists`);
                        } else {
                            new sap.m.MessageBox.error(errMsg);


                        }

                    }

                });
                let payload = {
                    "Filename": filename,
                    "Filecont": content,
                    "Voyageno": voyageNo,
                    "Filetype": filetype

                }
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


            handleNav: function (evt) {

                // let oModel = this.getView().getModel("voyageModal");
                // console.log("named model", oModel);
                var navCon = this.byId("navCon");

                var target = evt.getSource().data("target");
                if (target) {
                    var animation = this.byId("animationSelect").getSelectedKey();
                    navCon.to(this.byId(target), animation);
                } else {
                    navCon.back();
                }
            },
            //  for navigation of nav container 2 
            handleNavToPanelA: function () {
                this.navigateToPanel("panelA");
            },

            handleNavToPanelB: function () {
                this.navigateToPanel("panelB");
            },

            navigateToPanel: function (panelId) {
                var navCon = this.byId("navCon2");
                navCon.to(this.byId(panelId));
            },


            // for visiblity of nav container 1
            toggleNavContainer: function () {
                var navCon = this.byId("navCon");
                var bar = this.byId("HBox10");
                // Get the current visibility state of the NavContainer
                var currentVisibility = navCon.getVisible();

                // Toggle the visibility state
                navCon.setVisible(!currentVisibility);
                bar.setVisible(!currentVisibility);


            },
            // for visiblity of nav container 2
            toggleBarAndNavContainer: function () {
                var navCon2 = this.byId("navCon2");
                var bar2 = this.byId("HBox20");
                var currentVisibility = navCon2.getVisible();

                navCon2.setVisible(!currentVisibility);
                bar2.setVisible(!currentVisibility);
            },
            lateInputField: function (inputField, selectedValue) {
                inputField.setValue(selectedValue);
            },
            // for dialog open
            showValueHelpDialogCurr: function (oEvent) {
                let oSource = oEvent.getSource();

                // Create a dialog
                console.log("clicked Currency type");
                var oDialog = new sap.m.Dialog({
                    title: "Select: Currency",
                    contentWidth: "25%",
                    contentHeight: "50%",
                    sticky: ["ColoumHeaders"],
                    fixedLayout: "false",
                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,
                        noDataText: "Loading ...",
                        // headerToolbar: [
                        //     new sap.m.OverflowToolbar({
                        //         content: [
                        //             new sap.m.SearchField({
                        //                 width: "auto",
                        //                 placeholder: "Search Value/Description",
                        //                 tooltip: "Search Value/Description",
                        //                 liveChange: this._onHelpTableSearchCurr.bind(this),
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
                    new sap.m.MessageToast.show("Please fill the LegId first ");
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
                                    new sap.m.MessageToast.show("Source Port can not have unloading charges");
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


            // fn for dynamic testing for Zcode

            // showValueHelpDialogClassMaster1: function (oEvent) {
            //     let oData = oEvent.getSource();
            //     let x = "profile2"

            //     // Create a dialog
            //     var oDialog = new sap.m.Dialog({
            //         title: "Bid Details",
            //         contentWidth: "60%",
            //         contentHeight: "60%",
            //         content: new sap.m.Table({
            //             mode: sap.m.ListMode.SingleSelectMaster,
            //             columns: [
            //                 new sap.m.Column({ header: new sap.m.Text({ text: "Possible value" }), width: "250px" }),
            //                 new sap.m.Column({ header: new sap.m.Text({ text: "Good To Have" }) }),
            //                 new sap.m.Column({ header: new sap.m.Text({ text: "Mandatory" }) }),
            //                 new sap.m.Column({ header: new sap.m.Text({ text: "Must Not Have" }) }),
            //                 new sap.m.Column({ header: new sap.m.Text({ text: "Min score" }) }),
            //                 new sap.m.Column({ header: new sap.m.Text({ text: "Max score" }) }),
            //             ],
            //             items: {
            //                 path: '/ClassMasterSet',
            //                 factory: (sId, oContext) => {
            //                     var oModel = this.getView().getModel();
            //                     var sPath = oContext.getPath();
            //                     var oObject = oModel.getProperty(sPath);
            //                     var oInput;

            //                     // Dynamically create input based on x
            //                     switch (x) {
            //                         case "profile1":
            //                             oInput = new sap.m.Input({
            //                                 showValueHelp: true,
            //                                 valueHelpRequest: function () {
            //                                     // Open value help dialog for profile1
            //                                     this.openValueHelpDialog(oObject.ZfValue, oObject.ZfDesc);
            //                                 }.bind(this)
            //                             });
            //                             break;
            //                         case "profile2":
            //                             // Use DatePicker for profile2
            //                             oInput = new sap.m.DatePicker({
            //                                 valueFormat: "yyyy-MM-dd",
            //                                 displayFormat: "yyyy-MM-dd",
            //                             });
            //                             break;
            //                         case "profile3":
            //                             // Use Table for profile3
            //                             oInput = new sap.m.Input({
            //                                 showValueHelp: true,
            //                                 valueHelpRequest: function () {
            //                                     // Open value help dialog for profile3
            //                                     this.openValueHelpTableDialog();
            //                                 }.bind(this)
            //                             });
            //                             break;
            //                         default:
            //                             oInput = new sap.m.Input(); // Default input
            //                     }

            //                     return new sap.m.ColumnListItem({
            //                         cells: [
            //                             oInput, // Dynamically created input
            //                             new sap.m.RadioButton({ selected: true, groupName: "Group1" }),
            //                             new sap.m.RadioButton({ groupName: "Group1" }),
            //                             new sap.m.RadioButton({ groupName: "Group1" }),
            //                             new sap.m.Input(),
            //                             new sap.m.Input()
            //                         ]
            //                     });
            //                 }
            //             },
            //             selectionChange: function (oEvent) {
            //                 var oSelectedItem = oEvent.getParameter("listItem");
            //                 var oSelectedValue = oSelectedItem.getCells()[0].getValue();
            //                 // No need to close the dialog here as it's done in the "OK" button press event
            //             }.bind(this),
            //         }),
            //         beginButton: new sap.m.Button({
            //             text: "OK",
            //             type: "Accept",
            //             press: function () {
            //                 var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
            //                 var selectedValue = oDialog.getContent()[0].getItems()[0].getCells()[0].getValue();
            //                 this.lateInputField(inputVoyageType, selectedValue);
            //                 oDialog.close();
            //             }.bind(this),
            //         }),
            //         endButton: new sap.m.Button({
            //             text: "Cancel",
            //             type: "Reject",
            //             press: function () {
            //                 oDialog.close();
            //             },
            //         }),
            //     });

            //     // Bind the dialog to the view
            //     this.getView().addDependent(oDialog);

            //     // Open the dialog
            //     oDialog.open();
            //     console.log(oData);
            // },


            // showValueHelpDialogClassMaster: function (oEvent) {
            //     let oData = oEvent.getSource();

            //     // Create a dialog
            //     var oDialog = new sap.m.Dialog({
            //         title: "Bid Details",
            //         contentWidth: "60%",
            //         contentHeight: "60%",
            //         content: new sap.m.Table({

            //             mode: sap.m.ListMode.SingleSelectMaster,
            //             items: "/ClassMasterSet",
            //             columns: [
            //                 new sap.m.Column({
            //                     header: new sap.m.Text({ text: "Possible value" }),
            //                     width: "250px"
            //                 }),
            //                 new sap.m.Column({
            //                     header: new sap.m.Text({ text: "Good To Have" }),
            //                 }),
            //                 new sap.m.Column({
            //                     header: new sap.m.Text({ text: "Mandatory" }),
            //                 }),
            //                 new sap.m.Column({
            //                     header: new sap.m.Text({ text: "Must Not Have" }),
            //                 }),
            //                 new sap.m.Column({
            //                     header: new sap.m.Text({ text: "Min score" }),
            //                 }),
            //                 new sap.m.Column({
            //                     header: new sap.m.Text({ text: "Max score" }),
            //                 }),
            //             ],
            //             items: [new sap.m.ColumnListItem({
            //                 cells: [
            //                     new sap.m.Select({
            //                         items: {
            //                             path: '/ClassMasterSet',
            //                             template: new sap.ui.core.Item({

            //                                 text: "{ZfDesc}"
            //                             }),

            //                         },
            //                         width: "100%",


            //                     }),
            //                     new sap.m.RadioButton({
            //                         selected: true,
            //                         groupName: "Group1", // Unique group name for Good To Have
            //                         select: function () {
            //                             // Handle radio button selection
            //                         }
            //                     }),
            //                     new sap.m.RadioButton({
            //                         groupName: "Group1", // Unique group name for Mandatory
            //                         select: function () {
            //                             // Handle radio button selection
            //                         }
            //                     }),
            //                     new sap.m.RadioButton({
            //                         groupName: "Group1", // Unique group name for Must Not Have
            //                         select: function () {
            //                             // Handle radio button selection
            //                         }
            //                     }),
            //                     new sap.m.Input({

            //                     }),
            //                     new sap.m.Input({

            //                     })
            //                 ],
            //             }),
            //             ],
            //             selectionChange: function (oEvent) {
            //                 var oSelectedItem = oEvent.getParameter("listItem");
            //                 var oSelectedValue = oSelectedItem.getCells()[0].getSelectedItem().getKey();
            //                 // No need to close the dialog here as it's done in the "OK" button press event
            //             }.bind(this),
            //         }),
            //         beginButton: new sap.m.Button({
            //             text: "OK",
            //             type: "Accept",
            //             press: function () {
            //                 var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
            //                 var selectedValue = oDialog.getContent()[0].getItems()[0].getCells()[0].getSelectedItem().getKey();
            //                 this.populateInputField(inputVoyageType, selectedValue);
            //                 oDialog.close();
            //             }.bind(this),
            //         }),
            //         endButton: new sap.m.Button({
            //             text: "Cancel",
            //             type: "Reject",
            //             press: function () {
            //                 oDialog.close();
            //             },
            //         }),
            //     });


            //     // Bind the dialog to the view
            //     this.getView().addDependent(oDialog);

            //     // Open the dialog
            //     oDialog.open();
            //     console.log(oData);
            // },
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

            //search function
            searchLegIdTab1: function () {
                var sLegId = this.byId("searchFieldTab1").getValue();
                var oTable = this.byId("tstab1");
                var oBinding = oTable.getBinding("rows")
                var oFilter = new Filter("LegId", FilterOperator.EQ, sLegId);
                oBinding.filter([oFilter]);
            },

            //timesheet tab1 asc sorting fragment
            sortOptionsTab1Asc: function () {
                var oView = this.getView();
                if (!this.byId('sortT1AscOptions')) {
                    Fragment.load({
                        name: "nauticalfe.fragments.TrChangeVoyTimesheetT1Asc",
                        controller: this,
                        id: oView.getId()
                    }).then(function (oDialog) {
                        oDialog.open();
                    });

                } else {
                    this.byId('sortT1AscOptions').open();
                }
            },
            exitDialog: function () {
                var oDialog = this.byId('sortT1AscOptions');
                if (oDialog) {
                    oDialog.close();
                }

            },

            //timesheet tab2 asc sorting fragment
            sortOptionsTab2Asc: function () {
                var oView = this.getView();
                if (!this.byId('sortT2AscOptions')) {
                    Fragment.load({
                        name: "nauticalfe.fragments.TrChangeVoyTimesheetT2Asc",
                        controller: this,
                        id: oView.getId()
                    }).then(function (oDialog) {
                        oDialog.open();
                    });

                } else {
                    this.byId('sortT2AscOptions').open();
                }
            },
            exitDialog: function () {
                var oDialog = this.byId('sortT2AscOptions');
                if (oDialog) {
                    oDialog.close();
                }

            },

            //timesheet tab1 desc sorting fragment
            sortOptionsTab1Desc: function () {
                var oView = this.getView();
                if (!this.byId('sortT1DescOptions')) {
                    Fragment.load({
                        name: "nauticalfe.fragments.TrChangeVoyTimesheetT1Desc",
                        controller: this,
                        id: oView.getId()
                    }).then(function (oDialog) {
                        oDialog.open();
                    });

                } else {
                    this.byId('sortT1DescOptions').open();
                }
            },


            exitDialog: function () {
                var oDialog = this.byId('sortT1DescOptions');
                if (oDialog) {
                    oDialog.close();
                }

            },

            //timesheet tab2 desc sorting fragment
            sortOptionsTab2Desc: function () {
                var oView = this.getView();
                if (!this.byId('sortT2DescOptions')) {
                    Fragment.load({
                        name: "nauticalfe.fragments.TrChangeVoyTimesheetT2Desc",
                        controller: this,
                        id: oView.getId()
                    }).then(function (oDialog) {
                        oDialog.open();
                    });

                } else {
                    this.byId('sortT2DescOptions').open();
                }
            },


            exitDialog: function () {
                var oDialog = this.byId('sortT2DescOptions');
                if (oDialog) {
                    oDialog.close();
                }

            },

            //2 tables sorting below
            sortascLegId_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "LegId"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to LegId");
                }
            },
            sortascPortCode_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PortCode"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to PortCode");
                }
            },
            sortascEventNo_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "EventNo"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to EventNo");
                }
            },
            sortascStatus_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "Status"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to Status");
                }
            },



            sortascLegId_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "LegId"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to LegId");
                }
            },
            sortascPortCode_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PortCode"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to PortCode");
                }
            },
            sortascEventNo_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "EventNo"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to EventNo");
                }
            },
            sortascStatus_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "Status"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to Status");
                }
            },

            // descending for tab1
            sortdescLegId_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "LegId"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to LegId");
                }
            },
            sortdescPortCode_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PortCode"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to PortCode");
                }
            },
            sortdescEventNo_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "EventNo"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to EventNo");
                }
            },
            sortdescStatus_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "Status"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to Status");
                }
            },

            //descending for tab2
            sortdescLegId_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "LegId"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    this.exitDialog()
                    MessageToast.show("Sorted table in Descending order according to LegId");
                }
            },
            sortdescPortCode_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PortCode"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    this.exitDialog()
                    MessageToast.show("Sorted table in Descending order according to PortCode");
                }
            },
            sortdescEventNo_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "EventNo"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    this.exitDialog()
                    MessageToast.show("Sorted table in Descending order according to EventNo");
                }
            },
            sortdescStatus_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "Status"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    this.exitDialog()
                    MessageToast.show("Sorted table in Descending order according to Status");
                }
            },

            //dates sorting for table1

            //table1 startdate sorting ascending
            sortascPlannedSD_Tab1: function () {
                var oTable = this.byId("tstab1")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned Start Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedStartDate");
                    oColumn.setFilterProperty("PlannedStartDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedStartDate", false),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned Start Date in table1")
                }

                else {
                    console.error("Planned Start Date column not found.");
                }

                var oDialog = this.byId('sortT1AscOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //table1 enddate sorting ascending
            sortascPlannedED_Tab1: function () {
                var oTable = this.byId("tstab1")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned End Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedEndDate");
                    oColumn.setFilterProperty("PlannedEndDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedEndDate", false),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned End Date in table1")
                }

                else {
                    console.error("Planned End Date column not found.");
                }

                var oDialog = this.byId('sortT1AscOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //table1 start date sorting descending
            sortdescPlannedSD_Tab1: function () {
                var oTable = this.byId("tstab1")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned Start Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedStartDate");
                    oColumn.setFilterProperty("PlannedStartDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedStartDate", true),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned Start Date in table1")
                }

                else {
                    console.error("Planned Start Date column not found.");
                }

                var oDialog = this.byId('sortT1DescOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //table1 enddate sorting descending
            sortdescPlannedED_Tab1: function () {
                var oTable = this.byId("tstab1")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned End Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedEndDate");
                    oColumn.setFilterProperty("PlannedEndDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedEndDate", true),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned End Date in table1")
                }

                else {
                    console.error("Planned End Date column not found.");
                }

                var oDialog = this.byId('sortT1DescOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //dates sorting for table2

            //table2 startdate sorting ascending
            sortascPlannedSD_Tab2: function () {
                var oTable = this.byId("tstab2")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned Start Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedStartDate");
                    oColumn.setFilterProperty("PlannedStartDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedStartDate", false),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned Start Date in table2")
                }

                else {
                    console.error("Planned Start Date column not found.");
                }

                var oDialog = this.byId('sortT2AscOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //table2 enddate sorting ascending
            sortascPlannedED_Tab2: function () {
                var oTable = this.byId("tstab2")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned End Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedEndDate");
                    oColumn.setFilterProperty("PlannedEndDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedEndDate", false),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned End Date in table2")
                }

                else {
                    console.error("Planned End Date column not found.");
                }

                var oDialog = this.byId('sortT2AscOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //table2 start date descending
            sortdescPlannedSD_Tab2: function () {
                var oTable = this.byId("tstab2")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned Start Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedStartDate");
                    oColumn.setFilterProperty("PlannedStartDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedStartDate", true),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned Start Date in table2")
                }

                else {
                    console.error("Planned Start Date column not found.");
                }

                var oDialog = this.byId('sortT2DescOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //table2 enddate sorting descending
            sortdescPlannedED_Tab2: function () {
                var oTable = this.byId("tstab2")
                var oColumn = oTable.getColumns().find(function (column) {
                    return column.getLabel().getText() === "Planned End Date";
                });
                if (oColumn) {
                    oColumn.setSortProperty("PlannedEndDate");
                    oColumn.setFilterProperty("PlannedEndDate");
                    oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    oTable.bindAggregation("rows", {
                        path: "tsFields>/fields",
                        sorter: new sap.ui.model.Sorter("PlannedEndDate", true),
                        template: oTable.getRows()[0].clone()
                    });
                    MessageToast.show("Sorted Successfully in ascending order according to Planned End Date in table2")
                }

                else {
                    console.error("Planned End Date column not found.");
                }

                var oDialog = this.byId('sortT2DescOptions');
                if (oDialog) {
                    oDialog.close();
                }
            },

            //time sorting for table1 ascending

            //planned start time table1 ascending
            sortascPlannedST_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedStartTime"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to Planned Start Time");
                }
            },

            //planned end time table1 ascending
            sortascPlannedET_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedEndTime"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to Planned End Time");
                }
            },

            //planned start time table1 descending
            sortdescPlannedST_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedStartTime"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to Planned Start Time");
                }
            },

            //planned end time table1 descending
            sortdescPlannedET_Tab1: function () {
                var oTable = this.getView().byId("tstab1")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedEndTime"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT1DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to Planned Start Time");
                }
            },




            //planned start time table2 ascending
            sortascPlannedST_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedStartTime"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to Planned Start Time");
                }
            },

            //planned end time table2 ascending
            sortascPlannedET_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedEndTime"
                    var bDescending = false;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2AscOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in ascending order according to Planned End Time");
                }
            },

            //planned start time table2 descending
            sortdescPlannedST_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedStartTime"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to Planned Start Time");
                }
            },

            //planned end time table2 descending
            sortdescPlannedET_Tab2: function () {
                var oTable = this.getView().byId("tstab2")
                var oBinding = oTable.getBinding("rows");
                console.log(oTable, oBinding)
                if (oBinding && oBinding.sort) {
                    var sSortField = "PlannedEndTime"
                    var bDescending = true;
                    var oSorter = new sap.ui.model.Sorter(sSortField, bDescending);
                    oBinding.sort(oSorter);
                    var oDialog = this.byId('sortT2DescOptions');
                    if (oDialog) {
                        oDialog.close();
                    }
                    MessageToast.show("Sorted table in Descending order according to Planned Start Time");
                }
            },

            //search function for table1
            showSearchFieldsTab1: function () {
                this.byId("valueSearchTab1").setVisible(true)
            },
            searchLegIdTab1: function () {
                var sLegId = this.byId("searchFieldTab1").getValue();
                var oTable = this.byId("tstab1");
                var oBinding = oTable.getBinding("rows")
                var oFilter = new Filter("LegId", FilterOperator.EQ, sLegId);
                oBinding.filter([oFilter]);
            },
            refreshTab1: function () {
                var oTable = this.byId("tstab1");
                var oBinding = oTable.getBinding("rows");
                oBinding.filter([]);
                this.byId("searchFieldTab1").setValue("")
                this.showSearchFieldsTab1();
            },
            closeSearchTab1: function () {
                this.refreshTab1()
                this.byId("searchFieldTab1").setValue("")
                this.byId("valueSearchTab1").setVisible(false)
            },

            //search function for table2
            showSearchFieldsTab2: function () {
                this.byId("valueSearchTab2").setVisible(true)
            },
            searchLegIdTab2: function () {
                var sLegId = this.byId("searchFieldTab2").getValue();
                var oTable = this.byId("tstab2");
                var oBinding = oTable.getBinding("rows")
                var oFilter = new Filter("LegId", FilterOperator.EQ, sLegId);
                oBinding.filter([oFilter]);
            },
            refreshTab2: function () {
                var oTable = this.byId("tstab2");
                var oBinding = oTable.getBinding("rows");
                oBinding.filter([]);
                this.byId("searchFieldTab2").setValue("")
                this.showSearchFieldsTab1();
            },
            closeSearchTab2: function () {
                this.refreshTab1()
                this.byId("searchFieldTab2").setValue("")
                this.byId("valueSearchTab2").setVisible(false)
            },

            //export dropdown
            tab1exp: function () {
                var oView = this.getView(),
                    oButton = oView.byId("bt1");

                if (!this._oMenuFragment) {
                    Fragment.load({
                        name: "nauticalfe.fragments.TrChangeVoyageTStab1fileExport",
                        id: oView.getId(),
                        controller: this
                    }).then(function (oMenu) {
                        oMenu.openBy(oButton);
                        this._oMenuFragment = oMenu;
                    }.bind(this)).catch(function (oError) {
                        new sap.ui.m.MessageBox.error("Error while loading the fragment: " + oError);
                    });
                } else {
                    this._oMenuFragment.openBy(oButton);
                }
            },
            tab2exp: function () {
                var oView = this.getView(),
                    oButton = oView.byId("bt2");

                if (!this._oMenuFragment) {
                    Fragment.load({
                        name: "nauticalfe.fragments.TrChangeVoyageTStab2fileExport",
                        id: oView.getId(),
                        controller: this
                    }).then(function (oMenu) {
                        oMenu.openBy(oButton);
                        this._oMenuFragment = oMenu;
                    }.bind(this)).catch(function (oError) {
                        new sap.ui.m.MessageBox.error("Error while loading the fragment: " + oError);
                    });
                } else {
                    this._oMenuFragment.openBy(oButton);
                }
            },
            tab1spreadsheet: function () {
                console.log('entered tab1')
                var oTable = this.getView().byId("tstab1"); // Replace with your actual table ID
                var oModel = this.getView().getModel("tsFields"); // Replace with your actual model name

                if (oTable && oModel) {
                    var oExport = new Export({
                        exportType: new sap.ui.core.util.ExportTypeCSV({
                            separatorChar: ","
                        }),
                        models: oModel,
                        rows: {
                            path: "/fields"
                        },
                        columns: [
                            { name: "LegId", template: { content: "{LegId}" } },
                            { name: "PortCode", template: { content: "{PortCode}" } },
                            { name: "EventNo", template: { content: "{EventNo}" } },
                            { name: "EventType", template: { content: "{EventType}" } },
                            { name: "NormalText", template: { content: "{NormalText}" } },
                            { name: "Status", template: { content: "{Status}" } },
                            { name: "PlannedStartDate", template: { content: "{PlannedStartDate}" } },
                            { name: "PlannedStartTime", template: { content: "{PlannedStartTime}" } },
                            { name: "PlannedEndDate", template: { content: "{PlannedEndDate}" } },
                            { name: "PlannedEndTime", template: { content: "{PlannedEndTime}" } },
                            { name: "EventStatus", template: { content: "{EventStatus}" } }

                        ]
                    });

                    oExport.saveFile("Table1_exportedData.csv").catch(function (oError) {
                        new sap.ui.m.MessageBox.error("Error while exporting data: " + oError);
                    });
                } else {
                    new sap.ui.m.MessageBox.warning("No data available for export.");
                }
            },
            tab2spreadsheet: function () {
                console.log('entered tab2')
                var oTable = this.getView().byId("tstab2");
                var oModel = this.getView().getModel("tsFields");

                if (oTable && oModel) {
                    var oExport = new Export({
                        exportType: new sap.ui.core.util.ExportTypeCSV({
                            separatorChar: ","
                        }),
                        models: oModel,
                        rows: {
                            path: "/fields"
                        },
                        columns: [
                            { name: "LegId", template: { content: "{LegId}" } },
                            { name: "PortCode", template: { content: "{PortCode}" } },
                            { name: "EventNo", template: { content: "{EventNo}" } },
                            { name: "EventType", template: { content: "{EventType}" } },
                            { name: "NormalText", template: { content: "{NormalText}" } },
                            { name: "Status", template: { content: "{Status}" } },
                            { name: "PlannedStartDate", template: { content: "{PlannedStartDate}" } },
                            { name: "PlannedStartTime", template: { content: "{PlannedStartTime}" } },
                            { name: "PlannedEndDate", template: { content: "{PlannedEndDate}" } },
                            { name: "PlannedEndTime", template: { content: "{PlannedEndTime}" } },
                            { name: "EventStatus", template: { content: "{EventStatus}" } }

                        ]
                    });

                    oExport.saveFile("Table2_exportedData.csv").catch(function (oError) {
                        new sap.ui.m.MessageBox.error("Error while exporting data: " + oError);
                    });
                } else {
                    new sap.ui.m.MessageBox.warning("No data available for export.");
                }
            },

            //pdf export
            tab1pdfexp: function () {
                var oTable = this.getView().byId("tstab1"); // Replace with your actual table ID
                var oModel = this.getView().getModel("tsFields"); // Replace with your actual model name

                if (oTable && oModel) {
                    var oPdfDocument = new sap.ui.core.util.ExportTypePDF({
                        width: "auto",
                        height: "auto",
                        margin: {
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10
                        }
                    });

                    var oPdfExporter = new sap.ui.core.util.Export({
                        exportType: oPdfDocument,
                        models: oModel,
                        rows: {
                            path: "/fields" // Replace with your actual model path
                        },
                        columns: [
                            { name: "LegId", template: { content: "{tsFields>LegId}" } },
                            { name: "PortCode", template: { content: "{tsFields>PortCode}" } },
                            { name: "EventNo", template: { content: "{tsFields>EventNo}" } },
                            { name: "EventType", template: { content: "{tsFields>EventType}" } },
                            { name: "NormalText", template: { content: "{tsFields>NormalText}" } },
                            { name: "Status", template: { content: "{tsFields>Status}" } },
                            { name: "PlannedStartDate", template: { content: "{tsFields>PlannedStartDate}" } },
                            { name: "PlannedStartTime", template: { content: "{tsFields>PlannedStartTime}" } },
                            { name: "PlannedEndDate", template: { content: "{tsFields>PlannedEndDate}" } },
                            { name: "PlannedEndTime", template: { content: "{tsFields>PlannedEndTime}" } },
                            { name: "EventStatus", template: { content: "{tsFields>EventStatus}" } }
                            // Add other columns as needed
                        ]
                    });

                    oPdfExporter.saveFile("exportedData.pdf").catch(function (oError) {
                        new sap.ui.m.MessageBox.error("Error while exporting data to PDF: " + oError);
                    });
                } else {
                    new sap.ui.m.MessageBox.warning("No data available for export.");
                }
            },
            updated: function (oEvent) {
                console.log(oEvent.getParameter("path"))
            },

            /**
             * @override
             */
            onAfterRendering1: function () {
                costdetailsModel.attachPropertyChange(this.updated, this)
            }


        });
    }
);