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
    let LoggedInUser;

    return BaseController.extend("com.ingenx.nauti.createvoyage.controller.VoyageApproval", {
      onInit: function () {


        let oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "dataModel");

        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/voyapprovalSet");
        oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            getModelData.push(oContext.getObject());
          });
          oModel.setData(getModelData);
          console.log("Voyage approcal total data", getModelData, getModelData.length);
        }.bind(this))
        let testData = [{
          "Vreqno": "2000000191",
          "Zemail": "",
          "Voyno": "1000000161",
          "Zlevel": "03",
          "Uname": "PIYUSH",
          "Zdate": "2024-06-03T00:00:00Z",
          "Ztime": "10:32:03",
          "Zcomm": "",
          "Zaction": "PEND"
        },
        {
          "Vreqno": "2000000191",
          "Zemail": "",
          "Voyno": "1000000161",
          "Zlevel": "01",
          "Uname": "A.SHARMA",
          "Zdate": "2024-06-03T00:00:00Z",
          "Ztime": "08:36:08",
          "Zcomm": "test appr",
          "Zaction": "APPR"
        },
        {
          "Vreqno": "2000000191",
          "Zemail": "",
          "Voyno": "1000000161",
          "Zlevel": "02",
          "Uname": "PANKAJ.J",
          "Zdate": "2024-06-03T00:00:00Z",
          "Ztime": "08:37:31",
          "Zcomm": "testING APPROVARED",
          "Zaction": "APPR"
        }]

      },
      ValueHelpVoyage: function () {
        var oView = this.getView();

        if (!this._voyageValueHelpDiaolog) {
          this._voyageValueHelpDiaolog = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.createvoyage.fragments.valueHelpVoyage", this);
          oView.addDependent(this._voyageValueHelpDiaolog);
        }
        this._voyageValueHelpDiaolog.open();

      },

      VoyageValueHelpClose: function (evt) {

        var oMultiInput = this.byId("VoyageNo");
        var oDescriptionInput = this.byId("_voyageAppReqField");
        var aSelectedContexts = evt.getParameter("selectedContexts"),

          oVBox = this.byId("tab")
        var selectedValues = [];
        var selectedValues2 = [];

        var oModel = this.getView().getModel("VoyApprovalModel")
        var aExistingData = oModel ? oModel.getData() : [];

        if (!oModel) {
          oModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel, "VoyApprovalModel");
          // this.getView().getModel("VoyApprovalModel").refresh();

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
          // code for multiple selected entry
          var aCombinedData = aExistingData.concat(aFilteredData);

          aCombinedData = aCombinedData.filter((entry, index, self) =>
            index === self.findIndex((t) => (
              (t.Voyno === entry.Voyno && t.Vreqno === entry.Vreqno)
            ))
          );
          console.log("aCombinedData", aCombinedData);
          // oModel.setData(aFilteredData);

          // console.log("Filtered data based on selected vendors:", aFilteredData);
        } else {

          oVBox.setVisible(false);
        }
        var oTable = this.byId("approvalTable")
        oTable.setVisible(true);
        // console.log(selectedValues, "ye bhi ha")

        let testData = aFilteredData;
        // let transformedData = {
        //   Voyno: testData[0].Voyno,
        //   Vreqno: testData[0].Vreqno,
        //   Approvers: testData.map(item => ({
        //     Zlevel: item.Zlevel,
        //     Uname: item.Uname,
        //     Ztime: item.Ztime,
        //     Zcomm: item.Zcomm,
        //     Zdate: item.Zdate,
        //     Zaction: item.Zaction,
        //     Zemail: item.Zemail
        //   }))
        // };
        let transformedData = this.transformData(testData);
        console.log(transformedData);
        oModel.setData(transformedData);

        LoggedInUser = "PANKAJ.J";
        let that = this;
        transformedData.forEach(data => {
          that.createDynamicColumns(data.Approvers);
        });
      },
      transformData: function transformData(aFilteredData) {
        const distinctVoynos = [...new Set(aFilteredData.map(item => item.Voyno))];

        return distinctVoynos.map(voyno => {
          const filteredItems = aFilteredData.filter(item => item.Voyno === voyno);
          return {
            Voyno: voyno,
            Vreqno: filteredItems[0].Vreqno,
            Approvers: filteredItems.map(item => ({
              Zlevel: item.Zlevel,
              Uname: item.Uname,
              Ztime: item.Ztime,
              Zcomm: item.Zcomm,
              Zdate: item.Zdate,
              Zaction: item.Zaction,
              Zemail: item.Zemail
            }))
          };
        });
      },

      // dynamic creation of colums
      createDynamicColumns: function (approvers) {

        var oTable = this.getView().byId("approvalTable");
        var oColumnTemplate = new sap.m.Text(); // Column template for text

        // Remove existing columns (except fixed columns)

        oTable.removeAllColumns();

        // CONDITION TO CHECK WHETHER USER IS either creator or Approver
        let userNotMatched = false;
        approvers.forEach(approver => {
          if (LoggedInUser === approver.Uname) {

            userNotMatched = true;
            return
          }

          console.log(" Matched so hide the table ");;
        })
        // IF USER not MATCHED then Hide the VOYAGE APPROVAL TABLE
        if (!userNotMatched) {

          oTable.setVisible(false);
          return;
        }

        // Add fixed columns
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Approval Req No" })
        }));
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Voyage No" })
        }));
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Created By" })
        }));
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Created On" })
        }));

        // Add dynamic columns for approvers
        var stopCreatingColumns = false;

        // Add dynamic columns for approvers

        approvers.forEach((approver, index) => {
          if (!stopCreatingColumns && approver.Zlevel !== "00") {
            if (approver.Uname === LoggedInUser) {
              var approverIndex = index; // Dynamic index for column headers
              oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Approver " + approverIndex })
              }));
              oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Status " })
              }));
              oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Approved on " })
              }));
              stopCreatingColumns = true; // Stop creating further columns
            }
          }
        });

        // Bind items to table

        oTable.bindItems({
          path: "VoyApprovalModel>/",
          template: new sap.m.ColumnListItem({
            cells: this.createCells(approvers)
          })
        });
      },

      createCells: function (approvers) {
        var cells = [];

        // Fixed cells
        cells.push(new sap.m.Text({ text: "{VoyApprovalModel>Vreqno}" }));
        cells.push(new sap.m.Text({ text: "{VoyApprovalModel>Voyno}" }));
        cells.push(new sap.m.Text({ text: "{VoyApprovalModel>Approvers/0/Uname}" })); // Creator's name
        cells.push(new sap.m.Text({
          text: {
            path: "VoyApprovalModel>Approvers/0/Zdate",
            formatter: this.formatDate.bind(this)
          }
        })); // Creator's date

        // Dynamic cells for approvers
        var stopCreatingCells = false;
        let that = this;
        approvers.forEach((approver, index) => {

          if (!stopCreatingCells && approver.Zlevel !== "00") {

            if (approver.Uname === LoggedInUser) {
              cells.push(new sap.m.Text({
                text: "{VoyApprovalModel>Approvers/" + index + "/Uname}"
              }));
              cells.push(new sap.m.Text({
                text: "{VoyApprovalModel>Approvers/" + index + "/Zaction}"
              }));
              cells.push(new sap.m.Text({
                text: {
                  parts: [{ path: "VoyApprovalModel>Approvers/" + index + "/Zdate" }, { path: "VoyApprovalModel>Approvers/" + index + "/Zaction" }],
                  formatter: this.formatDate.bind(this)
                }
              }));
              stopCreatingCells = true; // Stop creating further cells
            }
          }
        });

        return cells;
      },

      formatDate: function (date, status) {
        if (status == undefined) {

          return date.split('T')[0];
        } else {
          if (status === 'PEND') {
            return "";
          } else {
            return date.split('T')[0];

          }
        }

      },

      onSelectionChange: function (oEvent) {
        var selectedItem = oEvent.getParameter("selectedItem").getText();
        var oTable1 = this.getView().byId("statusTable");
        var oTable2 = this.getView().byId("approvalTable");
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

        aSelectedItems.forEach(selectedItem => {
          let oText = selectedItem.getCells()[5].getText();
          if (oText && oText === "PEND") {

            this.byId("approveButton").setEnabled(true);
            this.byId("rejectButton").setEnabled(true);
          }
        }
        )
        // var bEnableApprove = aSelectedItems.length > 0;
        // var bEnableReject = aSelectedItems.length > 0;

      },

      onApprove: function () {
        let oDialog = this.byId("approvalDialog");
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
        let sComment = oEvent.getParameter("value");
        sap.m.MessageToast.show("Comment: " + sComment);
      }
      ,
      onCloseDialogApproval: function () {
        // this.onRefresh();
        console.log("closed  Dialog  approval ");
      },
      onCloseDialogRejected: function () {
        // this.onRefresh();
        console.log("closed  Dialog rejection");
      },
      onSaveCommentApproval: function () {
        var sComment = this.byId("commentTextArea").getValue().trim();
        if (sComment === "") {
          new sap.m.MessageToast.show("This field is mandatory");
          return;
        }

        sap.m.MessageToast.show("Comment: " + sComment);
        this.byId("approvalDialog").close();


        //  temporary  for single line item
        this.updateStatus(sComment, "APPR");

      },
      onSaveCommentRejected: function () {
        var sComment = this.byId("commentTextArea2").getValue().trim();
        if (sComment === "") {
          new sap.m.MessageToast.show("This field is mandatory");
          return;
        }

        sap.m.MessageToast.show("Comment: " + sComment);
        this.byId("RejectedDialog").close();


        //  temporary  for single line item
        this.updateStatus(sComment, "REJ");

      },

      updateStatus: async function (sComment, stat) {
        let oTable = this.byId("approvalTable");
        let selectedItems = oTable.getSelectedItems();
        let userName = selectedItems[0].getCells()[4].getText();   // currently assuming only single entry

        let data = selectedItems[0].getBindingContext('VoyApprovalModel').getObject();
        let userData = data.Approvers.filter(item => item.Zlevel !== "00" && item.Uname === userName);
        let payload = {
          Zcomm: sComment,
          Zaction: stat
        }
        // Remember : usetData is  an array , --  but question ? if approver 1, approver 2 , approver3 same
        let url = `/voyapprovalSet(Vreqno='${data.Voyno}',Voyno='${data.Vreqno}',Zlevel='${userData[0].Zlevel}',Uname='${userName}')`;
        console.log("Url", url);
        // return




        let oModelVoyalApp = this.getOwnerComponent().getModel(); // Get Table model instance

        // Create a filter for the entity ID
        let fVreqno = new sap.ui.model.Filter("Vreqno", sap.ui.model.FilterOperator.EQ, data.Vreqno);
        let fVoyno = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, data.Voyno);
        let fZlevel = new sap.ui.model.Filter("Zlevel", sap.ui.model.FilterOperator.EQ, userData[0].Zlevel);
        let fUname = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.EQ, userName);
        let vyreq = data.Vreqno;
        let vyno = data.Voyno;
        let zlvl = userData[0].Zlevel;
        let uname = userName
        // Bind to the entity set with the filter
        let oBindList = oModelVoyalApp.bindList("/voyapprovalSet", undefined, undefined, [fVreqno, fVoyno, fZlevel, fUname]);

        // Request the contexts that match the filter
        let res = await oBindList.requestContexts(0, Infinity).then(function (aContexts) {
          let filterContext = aContexts.filter((x, i) => x.getProperty('Voyno') === data.Voyno && x.getProperty('Zlevel') === zlvl)
          filterContext[0].setProperty("Zcomm", sComment);
          filterContext[0].setProperty("Zaction", stat);

          oModelVoyalApp.refresh();


        })
        return;





        let oModel = this.getOwnerComponent().getModel("modelV2");

        let statusText = (status === "APPR") ? "Approved" : "Rejected";

        oModel.update(url, payload, {

          success: function (result) {
            console.log(result);
            new sap.m.MessageBox.success(`Successfully ${statusText} by ${userName}`, {
              title: "Approval Done",
              onClose: function () {

                window.location.reload();


              }
            });
            oTable.removeSelections();
            // this.byId("approveButton").setEnabled(false);
            // this.byId("rejectButton").setEnabled(false);
          },
          error: function (err) {
            new sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);
            console.log("error occured while approving ", err);
            // window.location.reload();  

          }
        });
        oTable.removeSelections();

      },

      onCancelCommentApproval: function () {
        this.byId("approvalDialog").close();
        var oTable2 = this.byId("approvalTable");
        oTable2.removeSelections();
        this.byId("approveButton").setEnabled(false);
        this.byId("rejectButton").setEnabled(false);

      },
      onCancelCommentRejected: function () {
        this.byId("RejectedDialog").close();
        var oTable2 = this.byId("approvalTable");
        oTable2.removeSelections();
        this.byId("approveButton").setEnabled(false);
        this.byId("rejectButton").setEnabled(false);

      },

      onReject: function () {

        let oDialog = this.byId("RejectedDialog");
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



      onDialogCancel: function () {
        var oDialog = this.byId("approvalDialog");
        if (oDialog) {
          oDialog.close();
        }
      },

      onTokenUpdate: function (oEvent) {
        var aRemovedTokens = oEvent.getParameter("removedTokens");
        if (aRemovedTokens && aRemovedTokens.length > 0) {
          aRemovedTokens.forEach(function (oToken) {
            var sRemovedValue = oToken.getKey();
            console.log("Removed token value:", sRemovedValue);

            var oTableData = this.getView().getModel("VoyApprovalModel").getData();
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

              this.getView().getModel("VoyApprovalModel").setData(oTableData);
              console.log("Row removed from table.");
            } else {
              console.log("No matching value found in the table.");
            }
          }.bind(this));
        }
      },


      ValueHelpVoyage: function () {

        var oView = this.getView();
        if (!this.oVoyageDialog) {
          this.oVoyageDialog = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.createvoyage.fragments.valueHelpVoyage", this);
          oView.addDependent(this.oVoyageDialog);
        }
        this.oVoyageDialog.open();
      },


      onVoyageSearch1: function (oEvent) {
        // debugger;
        var sValue = oEvent.getParameter("value");

        var oFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.Contains, sValue);

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onRefresh: function () {
        // Reset multi inputs
        var oMultiInput = this.byId("VoyageNo");
        var oDescriptionInput = this.byId("_voyageAppReqField");
        oMultiInput.removeAllTokens();
        oDescriptionInput.removeAllTokens();

        // Hide tables and other elements
        var oTable1 = this.byId("statusTable");
        var oTable2 = this.byId("approvalTable");
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

        var oModel = this.getView().getModel("VoyApprovalModel");
        if (oModel) {
          oModel.setData([]);
        }
      },


    });

  }
);