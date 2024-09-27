sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/core/routing/History",
        'sap/m/MessageToast',
        "sap/m/MenuItem",
        'sap/ui/model/json/JSONModel',
        "sap/ui/core/library",
        "sap/ui/model/odata/v4/ODataModel"
    ],
    function(BaseController,Fragment,History,MessageToast,MenuItem,JSONModel,CoreLibrary,ODataModel) {
      "use strict";
      let getModelData = [];
      let getModelData2 = [];
 
      return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.VendorDataSyncing", {
        
        onInit() {

            // getting entries from business partner set 
            let oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, "businessService");

            let oModel3 = this.getOwnerComponent().getModel();
            let oBindList3 = oModel3.bindList("/BusinessPartnerSet");
            
            oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                  getModelData.push(oContext.getObject());
                });
                oModel.setData(getModelData);
                this.getView().getModel("businessService").refresh();
        
            }.bind(this))

            console.log("mydata", getModelData.length, getModelData)


            // getting nautivend data from 

            let oModel1 = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel1, "nautiNewVendModel");
            let oModel2 = this.getOwnerComponent().getModel();
            let oBindList2 = oModel2.bindList("/xNAUTIxnewvend_btp");
            
            oBindList2.requestContexts(0, Infinity).then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                  getModelData2.push(oContext.getObject());
                });
                oModel1.setData(getModelData2);
                this.getView().getModel("nautiNewVendModel").refresh();
                        
            }.bind(this))

            console.log("getModelData2",getModelData2)

        },
        
 
        onClearSelection: function() {
             // clear selected rows
            let oTable = this.byId("table")
            oTable.clearSelection();
        },
        onBackPress: function() {
            this.resetPage()
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteBusinessPartnerDashboard");
        },
        
        onPressHome: function() {
            this.resetPage()

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHome");
        },

        resetPage: function() {
            // Clear selection in the table
            this.byId("table").clearSelection();
    
             // Get the filter bar control
            let oFilterBar = this.byId("filterbar");
            
            // clear internal searche value 
            if (oFilterBar) {
              oFilterBar.setInternalConditions()
            }
        },

        onLiveSearch: function (oEvent) {
            // Get the FilterBar instance
            const oFilterBar = this.byId("filterbar");
        
            const sValue = oEvent.getParameter("value");
      
            if (sValue) {
              // console.log("key triggered")
                const oEnterKeyEvent = new KeyboardEvent('keydown', {
                   key: 'Enter',
                   keyCode: 13,
                   which: 13,
                   bubbles: true,
                   cancelable: true
                });
      
                // Find the target input field (or element) where you want to dispatch the event
              const oInputField = oFilterBar.getBasicSearchField().getFocusDomRef();
      
              // Dispatch the Enter key event to simulate the key press
              oInputField.dispatchEvent(oEnterKeyEvent);
            }
      
            if (sValue.length < 1) {
              oFilterBar.getBasicSearchField().setConditions()
            }
            
          }, 

        
        // create payload from selected entries
        onSelectionSubmit: function () {
            var oTable = this.byId("table");
            var aSelectedContexts = oTable.getSelectedContexts(true);
            console.log("aSelectedContexts",aSelectedContexts)

            var aSelectedKeys = aSelectedContexts.map(function (oContext) {
                return oContext.getObject().Lifnr; 
            });
            
            // Filter the data from getModelData2 based on the selected keys
            var aSelectedItems = getModelData2.filter(function (item) {
                return aSelectedKeys.includes(item.Lifnr);
            });

            if (aSelectedItems.length === 0) {
                MessageToast.show("No items selected.");
                return;
            }
        
            var aPayloads = aSelectedItems.map(function (item) {

                var sName1 = item.Name1;
                if (sName1 && sName1.length > 35) {
                    sName1 = sName1.substring(0, 35); // Truncate to 35 characters'
                }

                console.log("smtp", item.SmtpAddr)
                console.log("item", item)


                return {
                    Lifnr: item.Lifnr,
                    PartnerRole: "",
                    Anred: item.Anred,
                    Name1: sName1 ,
                    Name2: item.Name2,
                    Name3: item.Name3,
                    Sort1: item.Sort1,
                    StrSuppl1: "",
                    StrSuppl2: "",
                    HouseNum1: "",
                    Stras: item.Stras,
                    Pstlz: item.Pstlz,
                    Ort01: item.Ort01,
                    Land1: item.Land1,
                    Regio: item.Regio,
                    TimeZone: "",
                    Spras: item.Spras,
                    Telf1: item.Telf1,
                    Telf2: item.Telf2,
                    Telfx: item.Telfx,
                    SmtpAddr: item.SmtpAddr,
                    Erdat: item.Erdat + "T00:00:00.000Z",
                    
                };

            });

            
        
            console.log(aPayloads);
            // Check and create entries
            this._checkAndCreateEntries(aPayloads);
        },
        

        // create unique entries from payload   

        _checkAndCreateEntries: function (aPayloads) {
            var oModel = this.getView().getModel("businessService");
            var oModelV4 = this.getOwnerComponent().getModel();
            var existingData = oModel.getData(); // Get the latest data from the model
        
            // Arrays to track the results
            var createdItems = [];
            var existingItems = [];
        
            // Confirm before creating entries
            sap.m.MessageBox.confirm("Do you want to create new entries?", {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
    
                            // Create and open BusyDialog
                        var oBusyDialog = new sap.m.BusyDialog({
                          text: "Creating entries, please wait...",
                          title: "Processing"
                        });
                        oBusyDialog.open();
    
    
                        this.byId("table").clearSelection();
        
                        var oBindListV4 = oModelV4.bindList("/BusinessPartnerSet");
        
                        // Fetch latest existing data to ensure up-to-date comparison
                        oBindListV4.requestContexts(0, Infinity).then(function (aContexts) {
                            existingData = aContexts.map(function (oContext) {
                                return oContext.getObject();
                            });
        
                            aPayloads.forEach(function (oPayload) {
                                var bExists = existingData.some(function (oEntry) {
                                    return oEntry.Lifnr === oPayload.Lifnr; // Assuming Lifnr is the unique identifier
                                });
        
                                console.log("bExists", bExists);
        
                                if (!bExists) {
                                    console.log("Creating payload:", oPayload); // Log the complete payload
                                    oBindListV4.create(oPayload);
                                    oModelV4.refresh();
                                    createdItems.push(oPayload.Lifnr); // Track created item
                                } else {
                                    existingItems.push(oPayload.Lifnr); // Track existing item
                                }
                            })  
                            

        
                            // Prepare messages based on the number of created and existing items
                            var createdMessage = createdItems.length === 1 ? 
                                `Entry: ${createdItems.join(", ")} created successfully` : 
                                `Entries created successfully`;
                            
                            var existingMessage = existingItems.length === 1 ? 
                                `Entry: ${existingItems.join(", ")} already exists` : 
                                `Entries: ${existingItems.join(", ")} already exist`;
        
                            
                            // Display messages separately with a slight delay to prevent overlap
                            if (createdItems.length > 0) {
                                sap.m.MessageToast.show(createdMessage, {
                                    duration: 1000 // Display for 3 seconds
                                });
                            }

                            if (existingItems.length > 5) {
                                setTimeout(function () {
                                    sap.m.MessageToast.show(`${existingItems.length} Entries already exist `, {
                                        duration: 3000 // Display for 3 seconds
                                    });
                                }, 1500); // Show this message after a slight delay to avoid overlap
                            }
                            else if (existingItems.length > 0) {
                                setTimeout(function () {
                                    sap.m.MessageToast.show(existingMessage, {
                                        duration: 3000 // Display for 3 seconds
                                    });
                                }, 1500); // Show this message after a slight delay to avoid overlap
                            }
                            else {
                                this.resetPage()
                            }

                            oBusyDialog.close();
        
                        }.bind(this));
                        
    
                    } else {
                        sap.m.MessageToast.show("Creation of new entries cancelled.");
                        this.resetPage()
                    }
                }.bind(this) // Ensure proper context inside the callback
            });
        },      

        onNavigateDetails: function(oEvent) {

            var oBindingContext = oEvent.getParameter("bindingContext");                         
             // Retrieve the data object for the pressed rowvar 
            let data = oBindingContext.getObject();
            
            // let data = oSource.getBindingContext("").getObject();
            let tempModel = new sap.ui.model.json.JSONModel();
            tempModel.setData([data]);
            var oView = this.getView();
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("com.ingenx.nauti.masterdashboard.fragments.VendorDataSyncing", this);
                oView.addDependent(this._oDialog); 
            }
            this._oDialog.setModel(tempModel,"nautiNewVendModel1")
            this._oDialog.open();
        },

        oncancell: function () {
            this._oDialog.close();
          },

 
     });
    }
);