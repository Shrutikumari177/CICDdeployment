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
    let oApprovalStatusModel;
    let oApprovalModel;

    let sloc;
    let LoggedInUser;

    return BaseController.extend("com.ingenx.nauti.createvoyage.controller.VoyageApproval", {
      onInit: function () {

        // let testData = [{
        //   "Vreqno": "2000000191",
        //   "Zemail": "",
        //   "Voyno": "1000000161",
        //   "Zlevel": "03",
        //   "Uname": "PIYUSH",
        //   "Zdate": "2024-06-03T00:00:00Z",
        //   "Ztime": "10:32:03",
        //   "Zcomm": "",
        //   "Zaction": "PEND"
        // },
        // {
        //   "Vreqno": "2000000191",
        //   "Zemail": "",
        //   "Voyno": "1000000161",
        //   "Zlevel": "01",
        //   "Uname": "PANKAJ.J",
        //   "Zdate": "2024-06-03T00:00:00Z",
        //   "Ztime": "08:36:08",
        //   "Zcomm": "test appr",
        //   "Zaction": "APPR"
        // },
        // {
        //   "Vreqno": "2000000191",
        //   "Zemail": "",
        //   "Voyno": "1000000161",
        //   "Zlevel": "02",
        //   "Uname": "PANKAJ.J",
        //   "Zdate": "2024-06-03T00:00:00Z",
        //   "Ztime": "08:37:31",
        //   "Zcomm": "testING APPROVARED",
        //   "Zaction": "APPR"
        // }]

      },
      ValueHelpVoyage: function () {
        let oView = this.getView();

        if (!this._voyageValueHelpDiaolog) {
          this._voyageValueHelpDiaolog = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.createvoyage.fragments.valueHelpVoyageApproval", this);
          oView.addDependent(this._voyageValueHelpDiaolog);
        }
        
        this._voyageValueHelpDiaolog.open();

      },

      VoyageValueHelpClose: async function (evt) {

        let oInput = this.byId("VoyageNo");
        let oDescriptionInput = this.byId("_voyageAppReqField");
        let aSelectedContexts = evt.getParameter("selectedContexts");


        let oVoyno = aSelectedContexts[0].getObject().Voyno;
        let oVreqno = aSelectedContexts[0].getObject().Vreqno;
        oInput.setValue(oVoyno);
        let aFilteredData = [];

        let oVBox = this.byId("tab")


        oApprovalModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oApprovalModel, "VoyApprovalModel");

        oApprovalStatusModel = new sap.ui.model.json.JSONModel();

        this.getView().setModel(oApprovalStatusModel, "VoyApprovalStatusModel");


        if (aSelectedContexts && aSelectedContexts.length > 0) {


          let oModel = this.getOwnerComponent().getModel();

          let aFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, oVoyno);

          let oBindList = oModel.bindList("/voyapprovalSet", null, null, aFilter);

          let res = await oBindList.requestContexts().then(function (aContexts) {
            aFilteredData = aContexts.map(context => context.getObject());
            // Sort the aFilteredData array by Zlevel property

            aFilteredData.sort((a, b) => a.Zlevel.localeCompare(b.Zlevel));
            console.log("filterdata", aFilteredData);
            return aFilteredData;
          });

          console.log("aFilteredData", aFilteredData);

        } else {

          oVBox.setVisible(false);
        }



        let testData = aFilteredData;

        // fething last vreqno based on status
        let xVreqno = await this.getVreqnoToshow(oVoyno);

        let transformedData = this.transformData(testData);
        console.log(transformedData);
        // oApprovalModel.setData(transformedData);

        LoggedInUser = "PANKAJ.J";
        this.approverMatched = false;
        let that = this;
        transformedData.forEach(data => {
          if (data.Vreqno == xVreqno) {
            oApprovalModel.setData([data]);

            that.createDynamicColumns(data.Approvers);
          }
        });
        let transformedStatusData = that.transformStatusData([...testData]);
        oApprovalStatusModel.setData(transformedStatusData);
        transformedStatusData.forEach(data => {
          that.createStatusDynamicColumns(data.Approvers);
        });


        let oFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.Contains, "");

        evt.getSource().getBinding("items").filter([oFilter]);


      },
      getVreqnoToshow: async function (voyno) {
        let oVreqno;
        let oModel = this.getOwnerComponent().getModel();
        let oBinding = oModel.bindContext(`/voyappstatusSet(Voyno='${voyno}')`);

        await oBinding.requestObject().then((oContext) => {
          console.log(oContext);

          if (oContext) {
            let Zaction = oContext.Zaction;
            console.log(oContext.Voyno);
            console.log(Zaction, oContext.Vreqno);
            oVreqno = oContext.Vreqno;

          } else {

            console.log("oContext not found");
          }
        }).catch(error => {

          console.error("Error while fetching contexts: ", error);
        });
        return oVreqno;
      },
      transformData: function transformData(aFilteredData) {

        const distinctVreqnos = [...new Set(aFilteredData.map(item => item.Vreqno))];

        return distinctVreqnos.map(vreqno => {

          const filteredItems = aFilteredData.filter(item => item.Vreqno === vreqno);


          const voyno = filteredItems[0].Voyno;

          return {
            Vreqno: vreqno,
            Voyno: voyno,
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
        let oTable = this.getView().byId("approvalTable");
        let oColumnTemplate = new sap.m.Text(); // Column template for text

        // Remove existing columns (except fixed columns)
        oTable.removeAllColumns();

        // CONDITION  WHETHER USER IS either creator or Approver
        let approverMatched = false;

        for (const approver of approvers) {
          if (LoggedInUser === approver.Uname && approver.Zlevel !== '00') {
            approverMatched = true;
            break;
          }
          console.log("Matched so hide the table");
        }

        // IF USER not MATCHED then Hide the VOYAGE APPROVAL TABLE
        if (!approverMatched) {
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
        let stopCreatingColumns = false;
        let hideTableApproval = true;

        for (let i = 0; i < approvers.length; i++) {
          const approver = approvers[i];

          if (!stopCreatingColumns && approver.Zlevel !== "00") {
            if (approver.Uname === LoggedInUser && (approver.Zaction === "PEND" || approver.Zaction === "")) {
              oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Approver" })
              }));
              oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Status" })
              }));
              oTable.addColumn(new sap.m.Column({
                header: new sap.m.Label({ text: "Approved on" })
              }));
              oTable.setVisible(true);
              hideTableApproval = false;
              stopCreatingColumns = true; // Stop creating further columns
              break; // Exit the loop after adding columns
            }
          }
        }
        if( hideTableApproval){
          oTable.setVisible(false);
        }


        console.log("voyModel data: ", oApprovalModel.getData(), this.getView().getModel("VoyApprovalModel").getData());
        oTable.bindItems({
          path: "VoyApprovalModel>/",
          template: new sap.m.ColumnListItem({
            cells: this.createCells(approvers)
          })
        });
      },


      createCells: function (approvers) {
        let cells = [];

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
        let stopCreatingCells = false;

        for (let i = 0; i < approvers.length; i++) {
          const approver = approvers[i];

          if (!stopCreatingCells && approver.Zlevel !== "00") {
            if (approver.Uname === LoggedInUser && approver.Zaction === "PEND") {
              cells.push(new sap.m.Text({
                text: "{VoyApprovalModel>Approvers/" + i + "/Uname}"
              }));
              cells.push(new sap.m.Text({
                text: "{VoyApprovalModel>Approvers/" + i + "/Zaction}"
              }));
              cells.push(new sap.m.Text({
                text: {
                  parts: [
                    { path: "VoyApprovalModel>Approvers/" + i + "/Zdate" },
                    { path: "VoyApprovalModel>Approvers/" + i + "/Zaction" }
                  ],
                  formatter: this.formatDate.bind(this)
                }
              }));
              stopCreatingCells = true; // Stop creating further cells
              break; // Exit the loop after adding cells
            }
          }
        }

        return cells;
      },
      transformStatusData: function (aFilteredData) {
        const distinctVreqnos = [...new Set(aFilteredData.map(item => item.Vreqno))];

        return distinctVreqnos.map(Vreqno => {
          const filteredItems = aFilteredData.filter(item => item.Vreqno === Vreqno);
          

          return {
            Vreqno: Vreqno,
            Voyno: filteredItems[0].Voyno,
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
      createStatusDynamicColumns: function (approvers) {
        let oTable = this.getView().byId("statusTable");

        oTable.removeAllColumns();

        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Approval Req No" }),
          width: "10%",
        }));
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Voyage No." }),
          width: "10%",
        }));
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Created By" }),
        }));
        oTable.addColumn(new sap.m.Column({
          header: new sap.m.Label({ text: "Created On" })
        }));

        // If there are approvers
        if (approvers.length > 0) {
          for (let i = 1; i < approvers.length; i++) {
            oTable.addColumn(new sap.m.Column({
              header: new sap.m.Label({ text: "Approver " + i })
            }));
            oTable.addColumn(new sap.m.Column({
              header: new sap.m.Label({ text: "Status" })
            }));
            oTable.addColumn(new sap.m.Column({
              header: new sap.m.Label({ text: "Date" })
            }));
          }
        }

        // Bind the table items
        oTable.bindItems({
          path: "VoyApprovalStatusModel>/",
          template: new sap.m.ColumnListItem({
            cells: this.createStatusCells(approvers)
          })
        });
      },


      createStatusCells: function (approvers) {
        let cells = [];

        // Add static cells for fixed columns
        cells.push(new sap.m.Text({ text: "{VoyApprovalStatusModel>Vreqno}" }));
        cells.push(new sap.m.Text({ text: "{VoyApprovalStatusModel>Voyno}" }));

        if (approvers.length > 0) {
          cells.push(new sap.m.Text({ text: "{VoyApprovalStatusModel>Approvers/0/Uname}" }));
          cells.push(new sap.m.Text({
            text: {
              path: "VoyApprovalStatusModel>Approvers/0/Zdate",
              formatter: this.formatDate.bind(this)
            }
          }));
        } else {
          cells.push(new sap.m.Text({ text: "" }));
          cells.push(new sap.m.Text({ text: "" }));
        }

        approvers.forEach((approver, index) => {
          if (index > 0) {
            cells.push(new sap.m.Text({ text: `{VoyApprovalStatusModel>Approvers/${index}/Uname}` }));
            cells.push(new sap.m.Text({ text: `{VoyApprovalStatusModel>Approvers/${index}/Zaction}` }));
            cells.push(new sap.m.Text({
              text: {
                parts: [
                  { path: "VoyApprovalStatusModel>Approvers/" + index + "/Zdate" },
                  { path: "VoyApprovalStatusModel>Approvers/" + index + "/Zaction" }
                ],
                formatter: this.formatDate.bind(this)
              }
            }));
          }
        });

        return cells;
      },


      formatDate: function (date, status) {
        if (status === undefined && date) {

          return date.split('T')[0];
        } else {
          if (status === 'PEND' || date === undefined || date === null) {
            return "";
          } else {
            return date.split('T')[0];

          }
        }

      },

      onSelectionChange: function (oEvent) {
        let selectedItem = oEvent.getParameter("selectedItem").getText();
        let oTable1 = this.getView().byId("statusTable");
        let oTable2 = this.getView().byId("approvalTable");
        let oVBox1 = this.getView().byId("tab");
        let oVBox2 = this.getView().byId("tab2");

        if (selectedItem === "Voyage Approval Status Report") {
          oTable1.setVisible(true);
          // oTable2.setVisible(false);
          oVBox1.setVisible(true);
          oVBox2.setVisible(false);
        } else if (selectedItem === "Voyage Approval") {
          oTable1.setVisible(false);
          // oTable2.setVisible(true);
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
        let oTable = oEvent.getSource();
        let aSelectedItems = oTable.getSelectedItems();

        aSelectedItems.forEach(selectedItem => {
          let oText = selectedItem.getCells()[5].getText();
          if (oText && oText === "PEND") {

            this.byId("approveButton").setEnabled(true);
            this.byId("rejectButton").setEnabled(true);
          }
        }
        )
        // let bEnableApprove = aSelectedItems.length > 0;
        // let bEnableReject = aSelectedItems.length > 0;

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
              placeholder: "Add your comment..."
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
        let sComment = this.byId("commentTextArea").getValue().trim();
        if (sComment === "") {
          new sap.m.MessageToast.show("This field is mandatory");
          return;
        }

        sap.m.MessageToast.show("updating status .. ");
        this.byId("approvalDialog").close();


        //  temporary  for single line item
        this.updateStatus(sComment, "APPR");

      },
      onSaveCommentRejected: function () {
        let sComment = this.byId("commentTextArea2").getValue().trim();
        if (sComment === "") {
          new sap.m.MessageToast.show("This field is mandatory");
          return;
        }

        sap.m.MessageToast.show("updating status .. " );
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

        // Remember : usetData is  an array , --  but question ? if approver 1, approver 2 , approver3 same

        let url = `/voyapprovalSet(Vreqno='${data.Voyno}',Voyno='${data.Vreqno}',Zlevel='${userData[0].Zlevel}',Uname='${userName}')`;
        console.log("Url", url);
        // return

        let oModel = this.getOwnerComponent().getModel(); // Get Table model instance

        // Create a filter for the entity ID
        let fVreqno = new sap.ui.model.Filter("Vreqno", sap.ui.model.FilterOperator.EQ, data.Vreqno);
        let fVoyno = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, data.Voyno);
        let fZlevel = new sap.ui.model.Filter("Zlevel", sap.ui.model.FilterOperator.EQ, userData[0].Zlevel);
        let fUname = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.EQ, userName);

        let zlvl = userData[0].Zlevel;
        let uname = userName
        // Bind to the entity set with the filter
        let oBindList = oModel.bindList("/voyapprovalSet", undefined, undefined, [fVreqno, fVoyno, fZlevel, fUname]);

        // Request the contexts that match the filter
        let that = this;
        sap.ui.core.BusyIndicator.show(0);
        try {

          let res = await oBindList.requestContexts(0, Infinity).then(function (aContexts) {
            let filterContext = aContexts.filter((x, i) => x.getProperty('Voyno') === data.Voyno && x.getProperty('Zlevel') === zlvl)
            filterContext[0].setProperty("Zcomm", sComment);
            filterContext[0].setProperty("Zaction", stat);

            // Refresh the model and rebind the table after 1.5 seconds
            setTimeout(function () {
              oModel.refresh();

              sap.ui.core.BusyIndicator.hide();

              that.rebindApprovalTable(data.Voyno);
            }.bind(that), 1500);



          })
        } catch (error) {
          console.log("Errro in updating status");
        }


      },
      rebindApprovalTable: async function (voyno) {
        let apprTable = this.byId("approvalTable");
        apprTable.setVisible(false);
        
        this.byId("approveButton").setEnabled(false);
        this.byId("rejectButton").setEnabled(false);

        let oModel = this.getOwnerComponent().getModel();

        let aFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.EQ, voyno);
        let oBindList = oModel.bindList("/voyapprovalSet", null, null, aFilter);

        let aFilteredData = await oBindList.requestContexts().then(function (aContexts) {
          return aContexts.map(context => context.getObject());
        });

        aFilteredData.sort((a, b) => a.Zlevel.localeCompare(b.Zlevel));
        console.log("filterdata after updating status", aFilteredData);
        let testData = aFilteredData;

        let transformedData = this.transformData(testData);
        let transformedStatusData = this.transformStatusData([...testData]);
        oApprovalStatusModel.setData(transformedStatusData);

        let xVreqno = await this.getVreqnoToshow(voyno);

        LoggedInUser = "PANKAJ.J";

        this.approverMatched = false;
        transformedData.forEach(data => {
          if (data.Vreqno === xVreqno) {
            oApprovalModel.setData([data]);

            this.createDynamicColumns(data.Approvers);
          }
        });
        transformedStatusData.forEach(data => {
          this.createStatusDynamicColumns(data.Approvers);
        });

        let oTable = this.byId("approvalTable");
        oTable.bindItems({
          path: "VoyApprovalModel>/",
          template: new sap.m.ColumnListItem({
            cells: this.createCells(transformedData[0].Approvers)
          })
        });
      },
      onCancelCommentApproval: function () {
        this.byId("approvalDialog").close();
        let oTable2 = this.byId("approvalTable");
        oTable2.removeSelections();
        this.byId("approveButton").setEnabled(false);
        this.byId("rejectButton").setEnabled(false);

      },
      onCancelCommentRejected: function () {
        this.byId("RejectedDialog").close();
        let oTable2 = this.byId("approvalTable");
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
              placeholder: "Add your comment..."

            })
          });
          this.getView().addDependent(oDialog);
        }
        oDialog.open();

      },



      onDialogCancel: function () {
        let oDialog = this.byId("approvalDialog");
        if (oDialog) {
          oDialog.close();
        }
      },

      onTokenUpdate: function (oEvent) {
        let aRemovedTokens = oEvent.getParameter("removedTokens");
        if (aRemovedTokens && aRemovedTokens.length > 0) {

          let aVreqnoToRemove = []
          aRemovedTokens.forEach(function (oToken) {
            let sRemovedValue = oToken.getKey();
            console.log("Removed token value:", sRemovedValue);

            let oTableData = this.getView().getModel("VoyApprovalModel").getData();
            let foundIndex = null;
            for (let i = 0; i < oTableData.length; i++) {
              if (oTableData[i].Voyno === sRemovedValue) {
                foundIndex = i;
                aVreqnoToRemove.push(oTableData[i].Vreqno);

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

          // Remove corresponding tokens from _voyageAppReqField
          let oVoyageAppReqField = this.byId("_voyageAppReqField");
          let aTokens = oVoyageAppReqField.getTokens();
          let that = this;
          aVreqnoToRemove.forEach(function (vreqno) {
            for (let j = 0; j < aTokens.length; j++) {
              if (aTokens[j].getKey() === vreqno) {
                oVoyageAppReqField.removeToken(aTokens[j]);
                console.log("Removed token for vreqno:", vreqno);
                if (oVoyageAppReqField.getTokens().length === 0) {
                  oVoyageAppReqField.setTokens([]);
                  that.onRefresh();
                }
                break;
              }
            }
          });
        }
      },


      ValueHelpVoyage: function () {

        let oView = this.getView();
        if (!this.oVoyageDialog) {
          this.oVoyageDialog = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.createvoyage.fragments.valueHelpVoyageApproval", this);
          oView.addDependent(this.oVoyageDialog);
        }
        this.oVoyageDialog.open();
      },


      onVoyageSearch1: function (oEvent) {
        // debugger;
        let sValue = oEvent.getParameter("value");

        let oFilter = new sap.ui.model.Filter("Voyno", sap.ui.model.FilterOperator.Contains, sValue);

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onRefresh: function () {
        // Reset multi inputs
        let oInput = this.byId("VoyageNo");
        let oDescriptionInput = this.byId("_voyageAppReqField");

        oInput.setValue("");
        oDescriptionInput.setValue("");

        // Hide tables and other elements
        let oTable1 = this.byId("statusTable");
        let oTable2 = this.byId("approvalTable");
        let oVBox1 = this.byId("tab");
        let oVBox2 = this.byId("tab2");
        oTable1.setVisible(false);
        oTable2.setVisible(false);
        oVBox1.setVisible(false);
        oVBox2.setVisible(false);

        // Reset button states if needed
        // let oApproveButton = this.byId("approveButton");
        // let oRejectButton = this.byId("rejectButton");
        // oApproveButton.setEnabled(false);
        // oRejectButton.setEnabled(false);

        let oSelect = this.byId("_IDGenSelect1"); // Replace "yourSelectControlId" with the actual ID of your select control
        if (oSelect) {
          oSelect.setSelectedKey(null);
        }

        let oModel = this.getView().getModel("VoyApprovalModel");
        if (oModel) {
          oModel.setData([]);
        }
      },


    });

  }
);