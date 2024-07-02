
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
   
  ],
  function (Controller,History,Fragment,MessageToast, MessageBox ) {
    "use strict";
    let aSelectedIds=[];
 
    return Controller.extend("com.ingenx.nauti.masterdashboard.controller.ApiUrl", {
 
      onInit: function () {
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("updateTypeTable").setVisible(false);
 
 
      },
      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteMasterDashboard");
      },
      onPressHome: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },

      onPress: function () {

        var oView = this.getView(),
         oButton = oView.byId("button");

        if (!this._oMenuFragment) {

          this._oMenuFragment = Fragment.load({
            name: "nauticalfe.fragments.MastOptionsDropDown",
                        id: oView.getId(),
            controller: this
          }).then(function(oMenu) {
            oMenu.openBy(oButton);
            this._oMenuFragment = oMenu;
            return this._oMenuFragment;
          }.bind(this));
        } 
        else {
          this._oMenuFragment.openBy(oButton);
        }
      },

      selectedItems: function (oEvent) {
        // console.log("hello");
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();
       
 
        aSelectedIds = aSelectedItems.map(function (oSelectedItem) {
 
          // console.log(oSelectedItem.getBindingContext());
 
          if (oSelectedItem.getBindingContext()) {
 
            let cells = oSelectedItem.getCells();
            console.log(cells);
           
            return [oSelectedItem.getBindingContext().getProperty("IND"), 
                      oSelectedItem.getBindingContext().getProperty("API_KEY"),
                      oSelectedItem.getBindingContext().getProperty("API_URL"),
                      oSelectedItem.getBindingContext().getProperty("EPATH1")
                   ]
 
             } else {
 
                }
 
            });
        console.log(aSelectedIds);
        // console.log("Selected Travel IDs: " + aSelectedTravelIds.join(","));
        return aSelectedIds;
 
      },
     
      newEntries: function () {
        this.getView().byId("createTypeTable").setVisible(false)
        this.getView().byId("entryTypeTable").setVisible(true)
        this.getView().byId("mainPageFooter").setVisible(true)
 
      },
     
      pressEdit : function(){
 
        if( aSelectedIds.length){
          if( aSelectedIds.length > 1){
             MessageToast.show("Please select one row");
             return
          }
        }else {
          MessageToast.show("Please select a row");
          return;
        }
 
        this.getView().byId("createTypeTable").setVisible(false);
        let apiurl = aSelectedIds[0][2];
        let apikey = aSelectedIds[0][1];
        let Ind = aSelectedIds[0][0];
        let path = aSelectedIds[0][3];
        this.getView().byId("Ind1").setValue(Ind);
        this.getView().byId("apikey1").setValue(apikey);
        this.getView().byId("apiurl1").setText(apiurl);
        this.getView().byId("path1").setValue(path);

        this.getView().byId('updateTypeTable').setVisible(true);
        
        this.getView().byId("mainPageFooter2").setVisible(true);
 
        
 
      },
      onUpdate : function(){
         
        let value1 =  aSelectedIds[0][2];
        let value2 =  this.getView().byId("apikey1").getValue() ;
        let value3 =  this.getView().byId("Ind1").getValue() ;
        let value4 =  this.getView().byId("path1").getValue() ;

 
       
        let data = {
          API_URL : value1,
          API_KEY: value2,
          IND: value3,
          EPATH1: value4
 
        };
        console.log(data);
 
 
        var oView = this.getView();
        var JsonData = JSON.stringify(data)
        let EndPoint = "/odata/v4/nautical/EPATH/"+ data.API_URL;
        console.log(data.API_URL);

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
                    MessageToast.show(data.error.message);
                    return
                }
                });
            }
          })
          .catch(function (err) {
            console.log("error", err);
          })
         
      },
     
      onSave: function () {
 
        var value1 =  this.getView().byId("Ind").getValue();
        var value2 =  this.getView().byId("apikey").getValue();
        var value3 =  this.getView().byId("apiurl").getValue();
        var value4 =  this.getView().byId("path").getValue();
 
        var data = {
 
          IND: value1,
          API_KEY: value2,
          API_URL: value3,
          EPATH1: value4
 
        };
        console.log(data);
 
        var that = this.getView();
        var JsonData = JSON.stringify(data)
        let EndPoint = "/odata/v4/nautical/EPATH";
        fetch(EndPoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JsonData
        })
          .then(function (res) {
           
            if (res.ok) {
              
              console.log("Entry created successfully");
              MessageBox.success(`Entry created successfully`);
              that.getModel().refresh();
              that.byId("costCode").setValue("");
              that.byId("costCodeDesc").setValue("");
             
 
            }
            else {
              res.json().then((data) => {
                if (data && data.error && data.error.message) {
                    // Show the error message from the backend
                    MessageBox.error(data.error.message);
                }
                });
            }
          })
          .catch(function (err) {
            console.log("error", err);
          })
          this.getView().byId("createTypeTable").setVisible(true)
          this.getView().byId("entryTypeTable").setVisible(false)
          this.getView().byId("mainPageFooter").setVisible(false)
 
 
      },
      onCancel: function(){
        this.getView().byId("createTypeTable").setVisible(true);
        this.getView().byId("updateTypeTable").setVisible(false);
        this.getView().byId("entryTypeTable").setVisible(false);
        this.getView().byId("mainPageFooter").setVisible(false);
        this.getView().byId("mainPageFooter2").setVisible(false);
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
 
        }, // ending fn
      deleteSelectedItems: function (aItems) {
            aItems.forEach(function (oItem) {
              oItem.getBindingContext().delete().catch(function (oError) {
                if (!oError.canceled) {
                  // Error was already reported to message model
                  MessageToast.show(oError)
                }
              });
            });
       },
       pressCopy: function () {

        if( aSelectedIds.length){
          if( aSelectedIds.length > 1){
             MessageToast.show("Please select one row");
             return
          }
        }else {
          MessageToast.show("Please select a row");
          return;
        }

        this.getView().byId("createTypeTable").setVisible(false);
        let Ind = aSelectedIds[0][0];
        let apikey = aSelectedIds[0][1];
        let apiurl = aSelectedIds[0][2];
        let path = aSelectedIds[0][3];

        this.getView().byId("Ind").setValue(Ind);
        this.getView().byId("apikey").setValue(apikey);
        this.getView().byId("apiurl").setValue(apiurl);
        this.getView().byId("path").setValue(path);

        this.getView().byId('entryTypeTable').setVisible(true);

        // console.log(aSelectedIds[0][0], aSelectedIds[0][1]);
        this.getView().byId("mainPageFooter").setVisible(true);


       

      }
   


     
     
 
     
 
    });
 
  });