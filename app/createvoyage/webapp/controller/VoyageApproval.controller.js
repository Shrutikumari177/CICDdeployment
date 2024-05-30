sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/m/Token',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (BaseController, Token, IconPool, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";
    let getModelData = [];
    let getModelData2 = [];
    let sloc;

    return BaseController.extend("com.ingenx.nauti.createvoyage.controller.VoyageApproval", {
      onInit: function () {


        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");

        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/xNAUTIxvoyapproval1");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
          console.log(getModelData, "hello");
        }.bind(this))

      },








      ValueHelpVoyage: function () {
        var oView = this.getView();


        if (!this._opurchaseGroup) {
          this._opurchaseGroup = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.createvoyage.fragments.valueHelpVoyage", this);
          oView.addDependent(this._opurchaseGroup);
        }
        this._opurchaseGroup.open();

      },
      VoyageValueHelpClose: function (evt) {

        var oMultiInput = this.byId("VoyageNo");
        var oDescriptionInput = this.byId("searchField3");
        var aSelectedContexts = evt.getParameter("selectedContexts"),

          oVBox = this.byId("tab")
        var selectedValues = [];
        var selectedValues2 = [];

        var oModel = this.getView().getModel("chartner")
        var aExistingData = oModel ? oModel.getData() : [];

        if (!oModel) {
          oModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel, "chartner")

        }

        var aExistingTokens = oMultiInput.getTokens();
        var aExistingTokens2 = oDescriptionInput.getTokens();
        if (aSelectedContexts && aSelectedContexts.length > 0) {
          selectedValues = aSelectedContexts.map(function (oContext) {
            var sPath = oContext.getPath();
            var match = /Voyno='(\d+)'/g.exec(sPath);
            console.log("match", match);
            var VoynoValue = match ? match[1] : null;
            console.log("VoynoValue", VoynoValue);
            return VoynoValue;
          }).filter(function (value) {
            return value !== null;
          });

          selectedValues2 = aSelectedContexts.map(function (oContext) {
            var sPath = oContext.getPath();
            var match = /Vreqno='(\d+)'/g.exec(sPath);
            console.log("match2", match);
            var VreqnoValue = match ? match[1] : null;
            console.log("Vreqno", VreqnoValue);
            return VreqnoValue;
          }).filter(function (value) {
            return value !== null;
          });

          console.log("Selected Values2:", selectedValues2);
          console.log("Selected Values:", selectedValues);
          selectedValues = Array.from(new Set(selectedValues));
          selectedValues.forEach(function (sVendorID) {
            if (!aExistingTokens.some(function (oToken) {
              return oToken.getKey() === sVendorID;
            })) {
              oMultiInput.addToken(new sap.m.Token({
                key: sVendorID,
                text: sVendorID
              }));
            }
          });
          selectedValues2.forEach(function (sVendorID) {
            if (!aExistingTokens2.some(function (oToken) {
              return oToken.getKey() === sVendorID;
            })) {
              oDescriptionInput.addToken(new sap.m.Token({
                key: sVendorID,
                text: sVendorID
              }));
            }
          });

          oVBox.setVisible(false)
          var aFilteredData = getModelData.filter(function (data) {
            return selectedValues.includes(data.Voyno);
          });
          console.log("aFilteredData", aFilteredData);

          var aCombinedData = aExistingData.concat(aFilteredData);

          aCombinedData = aCombinedData.filter((entry, index, self) =>
            index === self.findIndex((t) => (
              (t.Voyno === entry.Voyno && t.Vreqno === entry.Vreqno)
            ))
          );
          console.log("aCombinedData", aCombinedData);
          oModel.setData(aCombinedData);

          console.log("Filtered data based on selected vendors:", aFilteredData);
        } else {

          oVBox.setVisible(false);
        }
        var oTable = this.byId("myTable")
        oTable.setVisible(true);
        console.log(selectedValues, "ye bhi ha")
      },


      //    voyno() {
      //     // alert("fcvg");
      //     // create dialog lazily
      //     this.pDialog ??= this.loadFragment({
      //         name: "com.ingenx.nauti.chartering.view.voyagefrag"
      //     });

      //     this.pDialog.then((oDialog) => oDialog.open());
      // },  






      onSelectionChange: function (oEvent) {
        var selectedItem = oEvent.getParameter("selectedItem").getText();
        var oTable1 = this.getView().byId("myTable");
        var oTable2 = this.getView().byId("myTable2");
        var oVBox1 = this.getView().byId("tab");
        var oVBox2 = this.getView().byId("tab2");

        if (selectedItem === "Voyage Approval Status Report") {
          oTable1.setVisible(true);
          oTable2.setVisible(false);
          oVBox1.setVisible(true);
          oVBox2.setVisible(false);
        } else if (selectedItem === "Voyage Approval") {
          oTable1.setVisible(false);
          oTable2.setVisible(true);
          oVBox1.setVisible(false);
          oVBox2.setVisible(true);
        } else {

          oTable1.setVisible(false);
          oTable2.setVisible(false);
          oVBox1.setVisible(false);
          oVBox2.setVisible(false);
        }
      },

      onTableSelectionChange: function (oEvent) {
        var oTable = oEvent.getSource();
        var aSelectedItems = oTable.getSelectedItems();
        var bEnableApprove = aSelectedItems.length > 0;
        var bEnableReject = aSelectedItems.length > 0;

        this.byId("approveButton").setEnabled(bEnableApprove);
        this.byId("rejectButton").setEnabled(bEnableReject);
      },

      onApprove: function () {
        var oDialog = this.byId("approvalDialog");
        if (!oDialog) {
          oDialog = new sap.m.Dialog("approvalDialog", {
            title: "Add Comment",
            contentWidth: "300px",
            content: new sap.m.TextArea("commentTextArea", {
              rows: 3,
              width: "100%",
              placeholder: "Add your comment...",
              liveChange: this.onCommentChange.bind(this)
            })
          });
          this.getView().addDependent(oDialog);
        }
        oDialog.open();
      },
      onCommentChange: function (oEvent) {
        var sComment = oEvent.getParameter("value");
        sap.m.MessageToast.show("Comment: " + sComment);
      }
      ,
      onCloseDialog: function () {
        // this.onRefresh();
      },
      onSaveComment: function () {
        var sComment = this.byId("commentTextArea").getValue();

        sap.m.MessageToast.show("Comment: " + sComment);
        this.byId("approvalDialog").close();
        var oTable2 = this.byId("myTable2");
        oTable2.removeSelections();
      },

      onCancelComment: function () {
        this.byId("approvalDialog").close();
        var oTable2 = this.byId("myTable2");
        oTable2.removeSelections();
      }
      ,
     

      onDialogOK: function () {
        var sComment = this.byId("commentTextArea").getValue();
        var oDialog = this.byId("approvalDialog");
        if (oDialog) {
          oDialog.destroyButtons();
          oDialog.addButton(new sap.m.Button({
            text: "OK",
            press: function () {

              sap.m.MessageToast.show("Comment saved: " + sComment);
              oDialog.close();
            }
          }));
        }
      },

      onDialogCancel: function () {
        var oDialog = this.byId("approvalDialog");
        if (oDialog) {
          oDialog.close();
        }
      },

      onReject: function () {
        var that = this;
        sap.m.MessageBox.confirm(
          "Are you sure you want to reject the approval?", {
          title: "Confirmation",
          onClose: function (oAction) {
            if (oAction === sap.m.MessageBox.Action.OK) {
              that.handleApprovalRejection();
            }
          }
        }
        );
      },

      handleApprovalRejection: function () {
        sap.m.MessageToast.show("Approval Rejected");
        var oTable = this.getView().byId("myTable2");
        oTable.removeSelections();
      },



      onCharterNoSelectionChange: function (oEvent) {
        var oMultiInput = oEvent.getSource();
        var sSelectedCharterNo = oMultiInput.getTokens()[0].getKey();

        var oModel = oMultiInput.getModel();

        if (oModel) {
          var aData = oModel.getProperty("/voyapprovalSet");
          var oSelectedCharter = aData.find(function (oCharter) {
            return oCharter.CharteringNo === sSelectedCharterNo;
          });

          var sCharterApprovalReqNo = oSelectedCharter ? oSelectedCharter.Vreqno : "";

          var oApprovalReqNoInput = this.getView().byId("searchField3");
          oApprovalReqNoInput.setValue(sCharterApprovalReqNo);
        }
      },

      onTokenUpdate: function (oEvent) {
        var aRemovedTokens = oEvent.getParameter("removedTokens");
        if (aRemovedTokens && aRemovedTokens.length > 0) {
          aRemovedTokens.forEach(function (oToken) {
            var sRemovedValue = oToken.getKey();
            console.log("Removed token value:", sRemovedValue);

            var oTableData = this.getView().getModel("chartner").getData();
            var foundIndex = null;
            for (var i = 0; i < oTableData.length; i++) {
              if (oTableData[i].Chrnmin === sRemovedValue) {
                foundIndex = i;
                break;
              }
            }

            if (foundIndex !== null) {
              console.log("Matching value found in table at index:", foundIndex);

              oTableData.splice(foundIndex, 1);

              this.getView().getModel("chartner").setData(oTableData);
              console.log("Row removed from table.");
            } else {
              console.log("No matching value found in the table.");
            }
          }.bind(this));
        }
      },
      // CharterNo: function () {
      //   var oView = this.getView();
      //   if (!this.oChartering) {
      //     this.oChartering = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.charter", this);
      //     oView.addDependent(this.oChartering);
      //   }
      //   this.oChartering.open();
      // },

      ValueHelpVoyage: function () {

        var oView = this.getView();
        if (!this.oChartering) {
          this.oChartering = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.createvoyage.fragments.valueHelpVoyage", this);
          oView.addDependent(this.oChartering);
        }
        this.oChartering.open();
      },

      onValueHelpCloseChar: function (evt) {

        var oMultiInput = this.byId("VoyageNo");
        var oDescriptionInput = this.byId("searchField3");
        var aSelectedContexts = evt.getParameter("selectedContexts"),

          oVBox = this.byId("tab")
        var selectedValues = [];
        var selectedValues2 = [];

        var oModel = this.getView().getModel("chartner")
        var aExistingData = oModel ? oModel.getData() : [];

        if (!oModel) {
          oModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel, "chartner")

        }

        var aExistingTokens = oMultiInput.getTokens();
        var aExistingTokens2 = oDescriptionInput.getTokens();
        if (aSelectedContexts && aSelectedContexts.length > 0) {
          selectedValues = aSelectedContexts.map(function (oContext) {
            var sPath = oContext.getPath();
            var match = /Voyno='(\d+)'/g.exec(sPath);
            console.log("match", match);
            var VoynoValue = match ? match[1] : null;
            console.log("VoynoValue", VoynoValue);
            return VoynoValue;
          }).filter(function (value) {
            return value !== null;
          });

          selectedValues2 = aSelectedContexts.map(function (oContext) {
            var sPath = oContext.getPath();
            var match = /Vreqno='(\d+)'/g.exec(sPath);
            console.log("match2", match);
            var VreqnoValue = match ? match[1] : null;
            console.log("Vreqno", VreqnoValue);
            return VreqnoValue;
          }).filter(function (value) {
            return value !== null;
          });

          console.log("Selected Values2:", selectedValues2);
          console.log("Selected Values:", selectedValues);
          selectedValues = Array.from(new Set(selectedValues));
          selectedValues.forEach(function (sVendorID) {
            if (!aExistingTokens.some(function (oToken) {
              return oToken.getKey() === sVendorID;
            })) {
              oMultiInput.addToken(new sap.m.Token({
                key: sVendorID,
                text: sVendorID
              }));
            }
          });
          selectedValues2.forEach(function (sVendorID) {
            if (!aExistingTokens2.some(function (oToken) {
              return oToken.getKey() === sVendorID;
            })) {
              oDescriptionInput.addToken(new sap.m.Token({
                key: sVendorID,
                text: sVendorID
              }));
            }
          });

          oVBox.setVisible(false)
          var aFilteredData = getModelData.filter(function (data) {
            return selectedValues.includes(data.Voyno);
          });
          console.log("aFilteredData", aFilteredData);

          var aCombinedData = aExistingData.concat(aFilteredData);

          aCombinedData = aCombinedData.filter((entry, index, self) =>
            index === self.findIndex((t) => (
              (t.Voyno === entry.Voyno && t.Vreqno === entry.Vreqno)
            ))
          );
          console.log("aCombinedData", aCombinedData);
          oModel.setData(aCombinedData);

          console.log("Filtered data based on selected vendors:", aFilteredData);
        } else {

          oVBox.setVisible(false);
        }
        var oTable = this.byId("myTable")
        oTable.setVisible(true);
        console.log(selectedValues, "ye bhi ha")
      },






      onRefresh: function () {
        // Reset multi inputs
        var oMultiInput = this.byId("VoyageNo");
        var oDescriptionInput = this.byId("searchField3");
        oMultiInput.removeAllTokens();
        oDescriptionInput.removeAllTokens();

        // Hide tables and other elements
        var oTable1 = this.byId("myTable");
        var oTable2 = this.byId("myTable2");
        var oVBox1 = this.byId("tab");
        var oVBox2 = this.byId("tab2");
        oTable1.setVisible(false);
        oTable2.setVisible(false);
        oVBox1.setVisible(false);
        oVBox2.setVisible(false);

        // Reset button states if needed
        // var oApproveButton = this.byId("approveButton");
        // var oRejectButton = this.byId("rejectButton");
        // oApproveButton.setEnabled(false);
        // oRejectButton.setEnabled(false);
        var oSelect = this.byId("_IDGenSelect1"); // Replace "yourSelectControlId" with the actual ID of your select control
        if (oSelect) {
          oSelect.setSelectedKey(null);
        }

        var oModel = this.getView().getModel("chartner");
        if (oModel) {
          oModel.setData([]);
        }
      },


    });

  }
);