sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (BaseController,History,MessageToast,JSONModel,MessageBox) {
    "use strict";
    let aSelectedIds = [];
 
    return BaseController.extend("com.ingenx.nauti.masterdashboard.controller.RouteMaster", {
      onInit() {
      }, 
      selectedItems: function (oEvent) {
        // console.log("hello");
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();
 
 
        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {
          if (oSelectedItem.getBindingContext()) {
            let cells = oSelectedItem.getCells();
            console.log(cells);
 
            return [
              oSelectedItem.getBindingContext().getProperty("BNAME"),
              oSelectedItem.getBindingContext().getProperty("CODE"),
              oSelectedItem.getBindingContext().getProperty("VALUE"),
              oSelectedItem.getBindingContext().getProperty("CVALUE_code"),
              oSelectedItem.getBindingContext().getProperty("CUNIT_code"),
              oSelectedItem.getBindingContext().getProperty("DATATYPE"),
              oSelectedItem.getBindingContext().getProperty("TABLENAME"),
              oSelectedItem.getBindingContext().getProperty("MULTI_CHOICE"),
            ]
          } else {
          }
 
        });
        console.log(aSelectedIds);
        return aSelectedIds;
 
      },

      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteMasterDashboard");
      },
      onPressHome: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      }, 
      newEntries: function () {
        this.getView().byId("createTypeTable").setVisible(false)
        this.getView().byId("entryTypeTable").setVisible(true)
        this.getView().byId("mainPageFooter").setVisible(true)
      },

      onSave: function () {
        // var that = this.getView();
        var BNAME =  this.byId("BNAME").getValue();
        var CODE =  this.byId("CODE").getValue();
        var VALUE =  this.byId("VALUE").getValue();
        var CVALUE =  this.byId("CVALUE").getValue();
        var CUNIT =  this.byId("CUNIT").getValue();
        var DATATYPE =  this.byId("DATATYPE").getValue();
        var TABLENAME =  this.byId("TABLENAME").getValue();
        var MULTI_CHOICE =  this.byId("MULTI_CHOICE").getSelected();
       
        // Validation check
        if (!BNAME || !CODE || !VALUE || !CVALUE || !CUNIT || !DATATYPE || !TABLENAME) {
            sap.m.MessageToast.show("Error: Please enter all data.");
            return;
        }
    
        let oModel = this.getView().getModel();
        let oBindListSP = oModel.bindList("/MAS");
    
        oBindListSP.attachEventOnce("dataReceived", () => {
          try {
            let existingEntries = oBindListSP.getContexts().map(function (context) {
                return context.getProperty("CODE");
            });
    
            if (existingEntries.includes(CODE)) {
                sap.m.MessageToast.show("Duplicate Voyage Code is not allowed");
            } else { 
                oBindListSP.create({
                    BNAME: BNAME,
                    CODE: CODE,
                    VALUE: VALUE,
                    CVALUE: CVALUE,
                    CUNIT: CUNIT,
                    DATATYPE: DATATYPE,
                    TABLENAME: TABLENAME,
                    MULTI_CHOICE: MULTI_CHOICE
                });
    
             
    
                // Clear input fields
                this.getView().getContent().forEach(function (control) {
                  if (control instanceof sap.m.Input) {
                      control.setValue("");
                  }
              });
    
                sap.m.MessageToast.show("Data created successfully");
                oModel.refresh();
    
                this.byId("createTypeTable").setVisible(true);
                this.byId("entryTypeTable").setVisible(false);
                this.byId("mainPageFooter").setVisible(false);
            }
          } catch (error) {
            console.error("Error while saving data:", error);
            sap.m.MessageToast.show("Error while saving data. See console for details.");
          }
        });
    
        oBindListSP.getContexts(0, 100);
      },

      pressCopy: function () {
        if (aSelectedIds.length) {
            if (aSelectedIds.length > 1) {
                MessageToast.show("Please select one row");
                return;
            }
        } else {
            MessageToast.show("Please select a row");
            return;
        }
        var view = this.getView();
        this.getView().byId("createTypeTable").setVisible(false);
    
        var BNAME = aSelectedIds[0][0];
        var CODE = aSelectedIds[0][1];
        var VALUE = aSelectedIds[0][2];
        var CVALUE = aSelectedIds[0][3];
        var CUNIT = aSelectedIds[0][4];
        var DATATYPE = aSelectedIds[0][5];
        var TABLENAME = aSelectedIds[0][6];
        var MULTI_CHOICE = aSelectedIds[0][7];
    
        view.byId("BNAME").setValue(BNAME);
        view.byId("CODE").setValue(CODE);
        view.byId("VALUE").setValue(VALUE);
        view.byId("CVALUE").setValue(CVALUE);
        view.byId("CUNIT").setValue(CUNIT);
        view.byId("DATATYPE").setValue(DATATYPE);
        view.byId("TABLENAME").setValue(TABLENAME);
        view.byId("MULTI_CHOICE").setSelected(MULTI_CHOICE);
    
        view.byId("entryTypeTable").setVisible(true);
        view.byId("mainPageFooter").setVisible(true);
      },
    
      
      pressEdit: function () {
        if (aSelectedIds.length) {
            if (aSelectedIds.length > 1) {
                sap.m.MessageToast.show("Please select one row");
                return;
            }
        } else {
            sap.m.MessageToast.show("Please select a row");
            return;
        }
    
        var view = this.getView();
        view.byId("createTypeTable").setVisible(false);
    
        var BNAME = aSelectedIds[0][0];
        var CODE = aSelectedIds[0][1];
        var VALUE = aSelectedIds[0][2];
        var CVALUE = aSelectedIds[0][3];
        var CUNIT = aSelectedIds[0][4];
        var DATATYPE = aSelectedIds[0][5];
        var TABLENAME = aSelectedIds[0][6];
        var MULTI_CHOICE = aSelectedIds[0][7];
    
        view.byId("bname").setValue(BNAME);
        view.byId("code").setValue(CODE);
        view.byId("value").setValue(VALUE);
        view.byId("cvalue").setValue(CVALUE);
        view.byId("cunit").setValue(CUNIT);
        view.byId("datatype").setValue(DATATYPE);
        view.byId("tablename").setValue(TABLENAME);
        view.byId("multichoice").setSelected(MULTI_CHOICE);
    
        view.byId("updateTypeTable").setVisible(true);
        view.byId("mainPageFooter2").setVisible(true);
      },
    
      onUpdate : function(){
         
        let BNAME = this.getView().byId("bname").getValue() ;
        let CODE =   aSelectedIds[0][1];
        let VALUE =  this.getView().byId("value").getValue();
        let CVALUE =  this.getView().byId("cvalue").getValue();
        let CUNIT =  this.getView().byId("cunit").getValue();
        let DATATYPE =  this.getView().byId("datatype").getValue();
        let TABLENAME =  this.getView().byId("tablename").getValue();
        let MULTI_CHOICE =  this.getView().byId("multichoice").getSelected();
        
        let data = {
          BNAME: BNAME,
          CODE: CODE,
          VALUE: VALUE,
          CVALUE: CVALUE,
          CUNIT: CUNIT,
          DATATYPE: DATATYPE,
          TABLENAME: TABLENAME,
          MULTI_CHOICE: MULTI_CHOICE
        };
        console.log(data);
 
 
        var oView = this.getView();
        var JsonData = JSON.stringify(data)
        console.log(data.CODE);
        let EndPoint = "/odata/v4/nautical/MAS/"+data.CODE;
        console.log(EndPoint);
        fetch(EndPoint, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JsonData
        })
          .then(function (res) {
           
            if (res.ok) {
              // location.reload();
              console.log("Entry updated successfully");
              MessageToast.show(`Entry updated successfully`);
              oView.getModel().refresh();
              oView.byId("createTypeTable").setVisible(true)
       
             oView.byId("mainPageFooter2").setVisible(false);
             oView.byId("updateTypeTable").setVisible(false);
             
 
            }
            else {
              res.json().then((data) => {
                if (data && data.error && data.error.message) {
                    // Show the error message from the backend
                    MessageBox.error(data.error.message);
                    return
                }
                });
            }
          })
          .catch(function (err) {
            console.log("error", err);
          })
         
 
      },
    
      onDeletePress: function () {
 
        let aItems = this.byId("createTypeTable").getSelectedItems();
 
        if (!aItems.length) {
 
          MessageToast.show("Please Select  Items ");
 
          return;
        }
 
        const that = this;  // creatinh reference for use in Dialog
        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
          MessageBox.confirm(
            "Are you sure  to delete the selected items?", {
            title: "Confirm ",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                // User confirmed deletion
                that.deleteSelectedItems(aItems);
              } else {
                // User canceled deletion
                sap.m.MessageToast.show("Deletion canceled");
              }
            }
          }
          );
        });
 
      }, 

      deleteSelectedItems: function (aItems) {
        aItems.forEach(function (oItem) {
          oItem.getBindingContext().delete().catch(function (oError) {
            if (!oError.canceled) {
              // Error was already reported to message model
            }
          });
        });
      },

      onCancel: function () {
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
      },

      

      
      
 
 
 
      
 
      



    });
  }
);