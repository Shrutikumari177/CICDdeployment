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
    let userEmail;
    let username;

    return BaseController.extend("com.ingenx.nauti.chartering.controller.CharteringApproval", {
      onInit: async function () {

        await this.getLoggedInUserInfo();
        await this.getSUerIdInfo()

      },

      getLoggedInUserInfo : async function(){
        try {
          let User = await sap.ushell.Container.getService("UserInfo");
          let userID = User.getId();
          userEmail = User.getEmail();
          let userFullName = User.getFullName();
          console.log("userEmail", userEmail);
          console.log("userFullName", userFullName);
          console.log("userID", userID);
        } catch (error) {
          
          userEmail = "ashwani.sharma@ingenxtec.com";
        }
      },
      getSUerIdInfo :async function(){
        let userMail = userEmail;
        let oModel = this.getOwnerComponent().getModel();
        let aFilter = new sap.ui.model.Filter("SmtpAddr", sap.ui.model.FilterOperator.EQ, userMail);


        let oBindList = oModel.bindList("/xNAUTIxuserEmail", null, null, aFilter);
       
        
        let res = await oBindList.requestContexts().then(function (aContexts) {
            let aFilteredData = aContexts.map(context => context.getObject());
            
            if (aFilteredData.length > 0) {
                username = aFilteredData[0].username; 
            }
        
            console.log("filterdata", aFilteredData);
            console.log("user login", username);
           
            return username;
        });
        
        
      },
       

      ValueHelpChartering: function () {
        let oView = this.getView();

        if (!this._voyageValueHelpDiaolog) {
          this._voyageValueHelpDiaolog = sap.ui.xmlfragment(oView.getId(), "com.ingenx.nauti.chartering.fragments.valueHelpApprChartering", this);
          oView.addDependent(this._voyageValueHelpDiaolog);
        }
        
        this._voyageValueHelpDiaolog.open();

      },

      ChartingValueHelpClose: async function (evt) {
        let userlogin = username;
        console.log("hii",userlogin);
        let oInput = this.byId("CharteringNo");
        let oDescriptionInput = this.byId("_CharteringAppReqField");
        let aSelectedContexts = evt.getParameter("selectedContexts");


        let oChrnmin = aSelectedContexts[0].getObject().Chrnmin;
        let oCreqno = aSelectedContexts[0].getObject().Creqno;
        oInput.setValue(oChrnmin);
        let aFilteredData = [];

        let oVBox = this.byId("tab")


        oApprovalModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oApprovalModel, "VoyApprovalModel");

        oApprovalStatusModel = new sap.ui.model.json.JSONModel();

        this.getView().setModel(oApprovalStatusModel, "VoyApprovalStatusModel");


        if (aSelectedContexts && aSelectedContexts.length > 0) {


          let oModel = this.getOwnerComponent().getModel();

          let aFilter = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, oChrnmin);

          let oBindList = oModel.bindList("/chartapprSet", null, null, aFilter);

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

       
        let xCreqno = await this.getCreqnoToshow(oChrnmin);

        let transformedData = this.transformData(testData);
        console.log(transformedData);
        

        LoggedInUser = username;
        this.approverMatched = false;
        let that = this;
        transformedData.forEach(data => {
          if (data.Creqno == xCreqno) {
            oApprovalModel.setData([data]);

            that.createDynamicColumns(data.Approvers);
          }
        });
        let transformedStatusData = that.transformStatusData([...testData]);
        oApprovalStatusModel.setData(transformedStatusData);
        transformedStatusData.forEach(data => {
          that.createStatusDynamicColumns(data.Approvers);
        });


        let oFilter = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.Contains, "");

        evt.getSource().getBinding("items").filter([oFilter]);


      },
      getCreqnoToshow: async function (chrnmin) {
        let oCreqno;
        let oModel = this.getOwnerComponent().getModel();
        let oBinding = oModel.bindContext(`/cha_statusSet(Chrnmin='${chrnmin}')`);

        await oBinding.requestObject().then((oContext) => {
          console.log(oContext);

          if (oContext) {
            let Zaction = oContext.Zaction;
            console.log(oContext.Chrnmin);
            console.log(Zaction, oContext.Creqno);
            oCreqno = oContext.Creqno;

          } else {

            console.log("oContext not found");
          }
        }).catch(error => {

          console.error("Error while fetching contexts: ", error);
        });
        return oCreqno;
      },
      transformData: function transformData(aFilteredData) {

        const distinctVreqnos = [...new Set(aFilteredData.map(item => item.Creqno))];

        return distinctVreqnos.map(creqno => {

          const filteredItems = aFilteredData.filter(item => item.Creqno === creqno);


          const chrnmin = filteredItems[0].Chrnmin;

          return {
            Creqno: creqno,
            Chrnmin: chrnmin,
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

   
     
      createDynamicColumns: function (approvers) {
              let oTable = this.getView().byId("approvalTable");
              let oColumnTemplate = new sap.m.Text(); // Column template for text
         
              oTable.removeAllColumns();
         
              let approverMatched = false;
              let userLevel = null;
         
              for (const approver of approvers) {
                  if (LoggedInUser === approver.Uname && approver.Zlevel !== '00') {
                      approverMatched = true;
                      userLevel = parseInt(approver.Zlevel, 10); // Convert Zlevel to integer for comparison
                      console.log("User matched at level: ", userLevel);
                      break;
                  }
              }
         
              if (!approverMatched) {
                  oTable.setVisible(false);
                  console.log("Logged-in user is not an approver or has Zlevel '00'");
                  return;
              }
         
              // Check if all lower levels (excluding '00') are approved
              let allLowerLevelsApproved = true;
              for (const approver of approvers) {
                  let approverLevel = parseInt(approver.Zlevel, 10);
                  if (approverLevel < userLevel && approverLevel > 0 && approver.Zaction !== 'APPR') {
                      allLowerLevelsApproved = false;
                      console.log("Lower level not approved: ", approver);
                      break;
                  }
              }
         
              // Hide table if not all lower levels are approved
              if (!allLowerLevelsApproved) {
                  oTable.setVisible(false);
                  console.log("Not all lower levels approved");
                  return;
              }
         
              // Adding fixed columns
              oTable.addColumn(new sap.m.Column({
                  header: new sap.m.Label({ text: "Approval Req No" })
              }));
              oTable.addColumn(new sap.m.Column({
                  header: new sap.m.Label({ text: "Chartering No." })
              }));
              oTable.addColumn(new sap.m.Column({
                  header: new sap.m.Label({ text: "Created By" })
              }));
              oTable.addColumn(new sap.m.Column({
                  header: new sap.m.Label({ text: "Created On" })
              }));
         
              let stopCreatingColumns = false;
              let hideTableApproval = true;
         
              for (let i = 0; i < approvers.length; i++) {
                  const approver = approvers[i];
         
                  if (!stopCreatingColumns && approver.Zlevel !== "00") {
                      if (approver.Uname === LoggedInUser && (approver.Zcomm === "PEND" || approver.Zcomm === "")) {
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
                          stopCreatingColumns = true;
                          console.log("Columns added for user: ", LoggedInUser);
                          break; // Exit the loop after adding columns
                      }
                  }
              }
              if (hideTableApproval) {
                  oTable.setVisible(false);
                  console.log("Table hidden due to no pending approvals for logged-in user");
              }
         
              console.log("voyModel data: ", this.getView().getModel("VoyApprovalModel").getData());
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
        cells.push(new sap.m.Text({ text: "{VoyApprovalModel>Creqno}" }));
        cells.push(new sap.m.Text({ text: "{VoyApprovalModel>Chrnmin}" }));
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
        const distinctVreqnos = [...new Set(aFilteredData.map(item => item.Creqno))];

        return distinctVreqnos.map(Creqno => {
          const filteredItems = aFilteredData.filter(item => item.Creqno === Creqno);
          

          return {
            Creqno: Creqno,
            Chrnmin: filteredItems[0].Chrnmin,
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
          header: new sap.m.Label({ text: "Chartering No." }),
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
        cells.push(new sap.m.Text({ text: "{VoyApprovalStatusModel>Creqno}" }));
        cells.push(new sap.m.Text({ text: "{VoyApprovalStatusModel>Chrnmin}" }));

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

        if (selectedItem === "Chartering Approval Status Report") {
          oTable1.setVisible(true);
          // oTable2.setVisible(false);
          oVBox1.setVisible(true);
          oVBox2.setVisible(false);
        } else if (selectedItem === "Chartering Approval") {
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


        let url = `/chartapprSet(Creqno='${data.Creqno}',Chrnmin='${data.Chrnmin}',Zlevel='${userData[0].Zlevel}',Uname='${userName}')`;
        console.log("Url", url);

        let oModel = this.getOwnerComponent().getModel(); // Get Table model instance

        // Create a filter for the entity ID
        let fCreqno = new sap.ui.model.Filter("Creqno", sap.ui.model.FilterOperator.EQ, data.Creqno);
        let fChrnmin = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, data.Chrnmin);
        let fZlevel = new sap.ui.model.Filter("Zlevel", sap.ui.model.FilterOperator.EQ, userData[0].Zlevel);
        let fUname = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.EQ, userName);

        let zlvl = userData[0].Zlevel;
        let uname = userName
        // Bind to the entity set with the filter
        let oBindList = oModel.bindList("/chartapprSet", undefined, undefined, [fCreqno, fChrnmin, fZlevel, fUname]);

        // Request the contexts that match the filter
        let that = this;
        sap.ui.core.BusyIndicator.show(0);
        try {

          let res = await oBindList.requestContexts(0, Infinity).then(function (aContexts) {
            let filterContext = aContexts.filter((x, i) => x.getProperty('Chrnmin') === data.Chrnmin && x.getProperty('Zlevel') === zlvl)
            filterContext[0].setProperty("Zcomm", sComment);
            filterContext[0].setProperty("Zaction", stat);

            // Refresh the model and rebind the table after 1.5 seconds
            setTimeout(function () {
              oModel.refresh();

              sap.ui.core.BusyIndicator.hide();

              that.rebindApprovalTable(data.Chrnmin);
            }.bind(that), 1500);



          })
        } catch (error) {
          console.log("Errro in updating status");
        }


      },
      rebindApprovalTable: async function (chrnmin) {
        let apprTable = this.byId("approvalTable");
        apprTable.setVisible(false);
        
        this.byId("approveButton").setEnabled(false);
        this.byId("rejectButton").setEnabled(false);

        let oModel = this.getOwnerComponent().getModel();

        let aFilter = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.EQ, chrnmin);
        let oBindList = oModel.bindList("/chartapprSet", null, null, aFilter);

        let aFilteredData = await oBindList.requestContexts().then(function (aContexts) {
          return aContexts.map(context => context.getObject());
        });

        aFilteredData.sort((a, b) => a.Zlevel.localeCompare(b.Zlevel));
        console.log("filterdata after updating status", aFilteredData);
        let testData = aFilteredData;

        let transformedData = this.transformData(testData);
        let transformedStatusData = this.transformStatusData([...testData]);
        oApprovalStatusModel.setData(transformedStatusData);

        let xCreqno = await this.getCreqnoToshow(chrnmin);

        LoggedInUser = "username";

        this.approverMatched = false;
        transformedData.forEach(data => {
          if (data.Creqno === xCreqno) {
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
              if (oTableData[i].Chrnmin === sRemovedValue) {
                foundIndex = i;
                aVreqnoToRemove.push(oTableData[i].Creqno);

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
          aVreqnoToRemove.forEach(function (creqno) {
            for (let j = 0; j < aTokens.length; j++) {
              if (aTokens[j].getKey() === creqno) {
                oVoyageAppReqField.removeToken(aTokens[j]);
                console.log("Removed token for creqno:", creqno);
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


      onCharteringSearch: function (oEvent) {
        
        var sValue1 = oEvent.getParameter("value");
        var oFilter1 = new sap.ui.model.Filter("Chrnmin", sap.ui.model.FilterOperator.Contains, sValue1);
        var oBinding = oEvent.getSource().getBinding("items");
        var oSelectDialog = oEvent.getSource();
    
        oBinding.filter([oFilter1]);
    
        oBinding.attachEventOnce("dataReceived", function() {
            var aItems = oBinding.getCurrentContexts();
    
            if (aItems.length === 0) {
                oSelectDialog.setNoDataText("No data found");
            } else {
                oSelectDialog.setNoDataText("Loading");
            }
        });
      },

      onRefresh: function () {
        let oInput = this.byId("CharteringNo");
       

        oInput.setValue("");
       

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