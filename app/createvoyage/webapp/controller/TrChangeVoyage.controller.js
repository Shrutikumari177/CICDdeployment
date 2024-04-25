//jdlk
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/m/MessageToast",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/util/Export",
        "sap/ui/export/ExportUtils",
        "sap/ui/core/util/ExportTypeCSV",
        "sap/ui/model/type/Date",
        "sap/ui/model/json/JSONModel",
        "com/ingenx/nauti/createvoyage/model/formatter",
        "sap/m/MessageToast"

    ],
    function (BaseController, Fragment, MessageToast, Filter, FilterOperator, Export, ExportTypeCSV, ExportTypePDF, Date, JSONModel, formatter) {
        "use strict";


        let voyHeaderModel = {};
        let voyItemModel = {};
        /**
         * @type {sap.ui.model.json.JSONModel}
         */
        let costdetailsModel = {};
        let bidItemModel;

        let tempDataArr = [];
        let voyageNum;
        let bidCommericalModel = [];
        let bidTechnicalModel = [];

        return BaseController.extend("com.ingenx.nauti.createvoyage.controller.TrChangeVoyage", {
            formatter: formatter,
            onInit() {
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
                let masBid = [
                    {
                        Bname: "PANKAJ.J",
                        Code: "FREIG",
                        Value: "FREIGHT",
                        Cvalue: 0,
                        Cunit: "",
                        Datatype: "CURR",
                        Tablename: "",
                        MultiChoice: false
                    },
                    {
                        Bname: "PANKAJ.J",
                        Code: "DAT1",
                        Value: "LAST CLEANING DATE",
                        Cvalue: 0,
                        Cunit: "",
                        Datatype: "DATE",
                        Tablename: "",
                        MultiChoice: false
                    },
                    {
                        Bname: "PANKAJ.J",
                        Code: "DEMURRAGE",
                        Value: "DEMURRAGE",
                        Cvalue: 0,
                        Cunit: "",
                        Datatype: "CURR",
                        Tablename: "",
                        MultiChoice: false
                    },
                    {
                        Bname: "PANKAJ.J",
                        Code: "COOR",
                        Value: "COUNTRY OF ORIGIN",
                        Cvalue: 0,
                        Cunit: "",
                        Datatype: "CHAR",
                        Tablename: "/NAUTI/ZCOUNTRY",
                        MultiChoice: true
                    },
                    {
                        Bname: "PANKAJ.J",
                        Code: "PORT",
                        Value: "LAST PORT OF CALL",
                        Cvalue: 0,
                        Cunit: "",
                        Datatype: "CHAR",
                        Tablename: "/NAUTI/ZPORT",
                        MultiChoice: true
                    },
                    {
                        Bname: "PANKAJ.J",
                        Code: "CLASS",
                        Value: "CLASS OF VESSEL",
                        Cvalue: 0,
                        Cunit: "",
                        Datatype: "CHAR",
                        Tablename: "/NAUTI/CLASS",
                        MultiChoice: true
                    }
                ]
                let bidTechnicalTemplate = masBid.filter(item => item.Datatype !== "CURR");
                let bidCommercialTemplate = masBid.filter(item => item.Datatype === "CURR");

                // console.log("tech  and commer details data :",bidTechnicalTemplate, bidCommercialTemplate)   ;

                bidTechnicalModel = new JSONModel(bidTechnicalTemplate);
                bidCommericalModel = new JSONModel(bidCommercialTemplate);

                this.getView().setModel(bidTechnicalModel, "technicalModel");
                this.getView().setModel(bidCommericalModel, "commercialModel");

                bidTechnicalModel.refresh();
                bidTechnicalModel.refresh();
                let testData = [{

                    Voyno: "1000000034",
                    Zcode: "CLASS",
                    Value: "",
                    Cvalue: 0,
                    Cunit: "",
                    CodeDesc: "CLASS OF VESSEL",
                    RevBid: false,
                    Good: "",
                    Mand: "",
                    Must: "",
                    Zmin: 0,
                    Zmax: 0
                },
                {
                    Voyno: "1000000034",
                    Zcode: "DAT1",
                    Value: "01.09.2023",
                    Cvalue: 0,
                    Cunit: "",
                    CodeDesc: "LAST CLEANING DATE",
                    RevBid: false,
                    Good: "",
                    Mand: "",
                    Must: "",
                    Zmin: 0,
                    Zmax: 0
                    } 
            ]
                // {
                //     Voyno: "1000000034",
                //     Zcode: "FREIG",
                //     Value: "",
                //     Cvalue: 0,
                //     Cunit: "INR",
                //     CodeDesc: "FREIGHT",
                //     RevBid: true,
                //     Good: "",
                //     Mand: "",
                //     Must: "",
                //     Zmin: 0,
                //     Zmax: 0
                // }
                // temporary testing
                bidItemModel = new JSONModel(testData);
                this.getView().setModel(bidItemModel, "bidItemModel");
                bidItemModel.refresh();

                console.log(this.getView().getModel("technicalModel").getData());
                console.log(this.getView().getModel("commercialModel").getData());

            },
            onObjectMatched(oEvent) {

                tempDataArr = [];
                let myVOYNO = oEvent.getParameter("arguments").VOYAGE_NO;
                voyageNum = myVOYNO;
                console.log("myVoyno  received:", myVOYNO);

                let oModel = this.getOwnerComponent().getModel();
                let aFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, myVOYNO);

                let oBindList = oModel.bindList(`/xNAUTIxVOYAGEHEADERTOITEM`, undefined, undefined, [aFilter], {
                    $expand: "toitem,tocostcharge,tobiditem"
                });

                let that = this;
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    if (aContexts.length === 1) {
                        const entityData = aContexts[0].getObject();
                        tempDataArr.push(entityData);

                        // Set models only once
                        if (!that.voyHeaderModel) {
                            voyHeaderModel = new JSONModel();
                            voyItemModel = new JSONModel();
                            costdetailsModel = new JSONModel();
                            bidItemModel = new JSONModel();
                        }

                        voyHeaderModel.setData(tempDataArr);
                        voyItemModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                        voyItemModel.setData(tempDataArr[0].toitem);
                        costdetailsModel.setData(tempDataArr[0].tocostcharge);
                        // bidItemModel.setData(tempDataArr[0].tobiditem);

                        that.getView().setModel(voyHeaderModel, "voyHeaderModel");
                        that.getView().setModel(voyItemModel, "voyItemModel");
                        that.getView().setModel(costdetailsModel, "costdetailsModel");
                        // that.getView().setModel(bidItemModel, "bidItemModel");

                        // Refresh models
                        that.getView().getModel("voyHeaderModel").refresh();
                        that.getView().getModel("voyItemModel").refresh();
                        that.getView().getModel("costdetailsModel").refresh();

                        console.log("LineItem :", that.getView().getModel("voyItemModel").getData());
                        console.log("costdetails :", that.getView().getModel("costdetailsModel").getData());
                        // console.log("bidDetails :", that.getView().getModel("bidItemModel").getData());

                    } else {
                        console.warn("Entity with VOYAGE_NO:", myVOYNO, "not found.");
                    }
                }).catch(function (oError) {
                    console.error("Error fetching entity:", oError);
                });

                console.log("my data", tempDataArr);

            },
            //  totalDistance fn 
            totalDistanceCalc: function (odata) {
                console.log(odata);
                let totalDist = 0;
                let arr = odata;
                arr.forEach((port) => {
                    totalDist += parseFloat(port.Pdist);

                })
                console.log("total Distance: ", totalDist);
                return formatter.numberFormat(totalDist);

            },

            // fn  for Ui display formated Frcost
            CalcTotalFrcost: function (odata) {
                console.log(odata);
                let totalFrCost = 0;
                let arr = odata;
                arr.forEach((port) => {
                    totalFrCost += parseFloat(port.Frcost);

                })
                console.log("total fr cost: ", totalFrCost);

                return formatter.numberFormat(totalFrCost);

            },

            //fn to calculate sum for all freight costs and other costs to show in header of item table
            calctotalCost: function (voyItemsArr) {
                console.log(voyItemsArr);
                let totalCost = 0;
                let arr = voyItemsArr;
                arr.forEach((port) => {
                    totalCost += parseFloat(port.Totco);

                })
                console.log("total Totco cost: ", totalCost);
                this.byId("_totalCostItem").setValue(formatter.numberFormat(totalCost))
                return totalCost;


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
                    totalSeaDays += parseFloat(port.Vsdays);

                })
                console.log("total SeaDays: ", totalSeaDays);
                return formatter.numberFormat(totalSeaDays);

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
            liveFrCostChange: function (oEvent) {

                const fCost1 = oEvent.getParameter("value") || 0;
                let FCost =  fCost1 == "" ? 0 : this.parseStringToNumber(fCost1);
                let selectedUnit = this.byId("_idunit").getSelectedKey();
                if (FCost === undefined) {
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

            lumpsumFrCostChange1: function (cargosize, currIndex) {

                try {

                    const items = this.byId("_itemTable").getItems();

                    const lumpsumPortData = items;
                    let totalCost = 0,
                        last = 0,
                        tempCost = 0;
                    lumpsumPortData.forEach((element, index) => {
                        if (last) {
                            tempCost = Number(Decimal(FCost).div(last).mul(element.Cargs).toString());
                        } else {
                            last = element.Cargs;
                        }
                        lumpsumPortData[index].Frcost = tempCost;
                        // lumpsumPortData[index].Othco= 0;
                        lumpsumPortData[index].Totco = Decimal(tempCost).add(lumpsumPortData[index].Othco);
                        totalCost += tempCost;
                        tempCost = 0;
                    });
                    voyItemModel.refresh();

                    
                    
                    //   this.byId("lumpsumTotalCost").setValue(formatter.costFormat(totalCost));

                } catch (error) {

                    throw new Error(error);
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
                        pertPortData[index].Othco = 0;
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
                        toNMPortData[index].Othco = 0;
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


            onAddRow1: function () {
                let oTableModel = costdetailsModel;
                let oTableData = oTableModel.getData();
                oTableData.push({ Voyno: voyageNum, Vlegn: "", Procost: "", Prcunit: "", Cargu: "", Costu: "", Costcode: "", Cstcodes: "", Costcurr: "", CostCheck: false });
                oTableModel.refresh();
                // let oTable = this.byId("_costTablePlan");

                // // Create a new row
                // let oNewRow = new sap.m.ColumnListItem({
                //   cells: [
                //     new sap.m.Input({ value: ""}),
                //     new sap.m.Input({ value: "",showValueHelp: true, valueHelpRequest: this.showValueHelpDialogCost.bind(this)}),
                //     new sap.m.Input({ value: ""}),
                //     new sap.m.Input({ value: ""}),
                //     new sap.m.Input({ value: ""}),
                //     new sap.m.Input({ value: "" }),

                //   ]
                // });

                // // Add the new row to the table
                // oTable.addItem(oNewRow);
            },

            onDeleteRow1: function () {

                let oTable = this.byId("_costTablePlan");
                let aSelectedItems = oTable.getSelectedItems().slice();
                let contextArr = oTable.getSelectedContexts();

                let oVlegnArr = [];
                let that = this;
                aSelectedItems.forEach(function (oSelectedItem) {

                    // oTable.removeItem(oSelectedItem);
                    let oContext = oSelectedItem.getBindingContext("costdetailsModel")
                    let sPath = oContext.getPath();
                    let oVlegn = parseInt(oContext.getObject().Vlegn);
                    oVlegnArr.push(oVlegn);

                    // simultanelously change other cost from line item also




                    // delete costdetailsModel.getData()[Number(oSelectedItem.getBindingContext("costdetailsModel").getPath().replace('/',''))]
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

                this.calculateSumAllCharges(oVlegn);

            },
            // fn  called after  change in cost item table  
            liveOtherCostChange: function (oVlegn, sum) {
                let temp = 0;
                let data = voyItemModel.getData();
                let totalCost = this.byId("_totalCostItem")
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
            populateInputField: function (inputField, selectedValue) {
                inputField.setValue(selectedValue);
            },
            // for dialog open
            showValueHelpDialogCurr: function (oEvent) {
                let oData = oEvent.getSource();
                console.log(oData);
                // Create a dialog
                console.log("clicked Currency type");
                var oDialog = new sap.m.Dialog({
                    title: "Select: Vessel Types",
                    contentWidth: "60%",
                    contentHeight: "60%",
                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,

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
                            var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
                            this.populateInputField(inputVoyageType, oSelectedValue);
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
            showValueHelpDialogCost: function (oEvent) {

                let oInputSource = oEvent.getSource();
                //   console.log(oData);
                let costDesc = oEvent.getSource().oParent.getCells()[2];
                console.log("clicked Currency");
                // Create a dialog

                var oDialog = new sap.m.Dialog({
                    title: "Select: Cost Types",
                    contentWidth: "60%",
                    contentHeight: "60%",
                    content: new sap.m.Table({
                        mode: sap.m.ListMode.SingleSelectMaster,

                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Cost Code" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Cost Description" }),
                            }),
                        ],

                        selectionChange: function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oSelectedValue1 = oSelectedItem.getCells()[0].getText();
                            var oSelectedValue2 = oSelectedItem.getCells()[1].getText();
                            console.log("selected values :", oSelectedValue1, oSelectedValue2, costDesc);
                            this.populateInputField(oInputSource, oSelectedValue1);
                            this.populateInputField(costDesc, oSelectedValue2);
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

            showValueHelpDialogClassMaster: function (oEvent) {
                let oData = oEvent.getSource();

                // Create a dialog
                var oDialog = new sap.m.Dialog({
                    title: "Bid Details",
                    contentWidth: "60%",
                    contentHeight: "60%",
                    content: new sap.m.Table({

                        mode: sap.m.ListMode.SingleSelectMaster,
                        items: "/ClassMasterSet",
                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Possible value" }),
                                width: "250px"
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Good To Have" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Mandatory" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Must Not Have" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Min score" }),
                            }),
                            new sap.m.Column({
                                header: new sap.m.Text({ text: "Max score" }),
                            }),
                        ],
                        items: [new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.Select({
                                    items: {
                                        path: '/ClassMasterSet',
                                        template: new sap.ui.core.Item({
                                            key: "{ZfValue}",
                                            text: "{ZfDesc}"
                                        }),

                                    },
                                    width:"100%",
                                    

                                }),
                                new sap.m.RadioButton({
                                    selected : true,
                                    groupName: "Group1", // Unique group name for Good To Have
                                    select: function () {
                                        // Handle radio button selection
                                    }
                                }),
                                new sap.m.RadioButton({
                                    groupName: "Group1", // Unique group name for Mandatory
                                    select: function () {
                                        // Handle radio button selection
                                    }
                                }),
                                new sap.m.RadioButton({
                                    groupName: "Group1", // Unique group name for Must Not Have
                                    select: function () {
                                        // Handle radio button selection
                                    }
                                }),
                                new sap.m.Input ({

                                }),
                                new sap.m.Input ({

                                })
                            ],
                        }),
                        ],
                        selectionChange: function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("listItem");
                            var oSelectedValue = oSelectedItem.getCells()[0].getSelectedItem().getKey();
                            // No need to close the dialog here as it's done in the "OK" button press event
                        }.bind(this),
                    }),
                    beginButton: new sap.m.Button({
                        text: "OK",
                        type: "Accept",
                        press: function () {
                            var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
                            var selectedValue = oDialog.getContent()[0].getItems()[0].getCells()[0].getSelectedItem().getKey();
                            this.populateInputField(inputVoyageType, selectedValue);
                            oDialog.close();
                        }.bind(this),
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        type: "Reject",
                        press: function () {
                            oDialog.close();
                        },
                    }),
                });

                // Bind the dialog to the view
                this.getView().addDependent(oDialog);

                // Open the dialog
                oDialog.open();
                console.log(oData);
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
                        MessageBox.error("Error while loading the fragment: " + oError);
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
                        MessageBox.error("Error while loading the fragment: " + oError);
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
                        MessageBox.error("Error while exporting data: " + oError);
                    });
                } else {
                    MessageBox.warning("No data available for export.");
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
                        MessageBox.error("Error while exporting data: " + oError);
                    });
                } else {
                    MessageBox.warning("No data available for export.");
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
                        MessageBox.error("Error while exporting data to PDF: " + oError);
                    });
                } else {
                    MessageBox.warning("No data available for export.");
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