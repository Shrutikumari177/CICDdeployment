sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/export/library",
    "sap/m/Dialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Spreadsheet,Dialog) {
        "use strict";

 
        return Controller.extend("com.ingenx.nauti.masterdashboard.controller.UploadSection", {
          _oPortLocPreviewDialog: null,
          _oPortUpdPreviewDialog: null,
          _oMarinePathPreviewDialog: null,
          _oMarineDistancePreviewDialog: null,

            onInit: function () {
 
            },
            onBackPress: function () {
              const oRouter = this.getOwnerComponent().getRouter();
              const oFileUploader = this.getView().byId("fileUploader");
              const oFileUploader2 = this.getView().byId("fileUploader2");
              const oFileUploader3 = this.getView().byId("fileUploader3");
              const oFileUploader4 = this.getView().byId("fileUploader4");
              oFileUploader.clear();
              // oFileUploader2.clear();
              oFileUploader3.clear();
              // oFileUploader4.clear();
              oRouter.navTo("RouteMasterDashboard");
            },
            onPressHome: function () {
              const oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("RouteHome");
            },

          // Port Location Upload 

            onPortLocUploadPress: function () {
              var fileUploader = this.getView().byId("fileUploader");
              var file = fileUploader.oFileUpload.files[0];
        
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("Please select a file to upload.");
                return; // Exit the function
              }
        
              // Proceed with file upload logic
              fileUploader.upload();
            },
        
            onPortLocUploadComplete: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader");
              var file = fileUploader.oFileUpload.files[0];
        
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("No file uploaded.");
                
                return; // Exit the function
              }
        
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
        
              reader.onload = function (e) {
                try {
                  var data = new Uint8Array(e.target.result);
                  var workbook = XLSX.read(data, { type: "array" });
                  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  var jsonData = XLSX.utils.sheet_to_json(worksheet);
        
                  // Create a JSON model and set the data
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData(jsonData);
        
                  // Set the model to the view
                  var oView = that.getView();
                  oView.setModel(oModel);
                  console.log("Excelsheet Data ", jsonData);
        
                  // Show success message
                  sap.m.MessageToast.show(
                    "Excel file uploaded and parsed successfully"
                  );
                  fileUploader.clear();
                } catch (error) {
                  // Log the error
                  console.error("Error parsing Excel file:", error);
                  // Show error message to the user
                  sap.m.MessageToast.show(
                    "Error parsing Excel file. Please upload a valid Excel file."
                  );
                  fileUploader.clear();
                }
              };
        
              reader.readAsArrayBuffer(file);
            },
        
            _onPortLoccreateColumnListItem: function () {
              return new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({ text: "{CountryID}" }),
                  new sap.m.Text({ text: "{PortCode}" }),
                  new sap.m.Text({ text: "{PortName}" }),
                  new sap.m.Text({ text: "{Reancho}" }),
                  new sap.m.Text({ text: "{Latitude}" }),
                  new sap.m.Text({ text: "{Longitude}" }),
                  new sap.m.Text({ text: "{CountryName}" }),
                  new sap.m.Text({ text: "{LocID}" }),
                  new sap.m.Text({ text: "{IND}" }),
                ],
              });
            },

            onPortLocPreviewPress: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader");
              var file = fileUploader.oFileUpload.files[0];
              // Check if a file is selected
              if (!file) {
                  // Show an error message to the user using MessageToast
                  sap.m.MessageToast.show("No file uploaded.");
                  return; // Exit the function
              }
              
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
          
              reader.onload = function (e) {
                  try {
                      var data = new Uint8Array(e.target.result);
                      var workbook = XLSX.read(data, { type: "array" });
                      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                      var jsonData = XLSX.utils.sheet_to_json(worksheet);
          
                      // Check if column headers match the expected headers
                      var expectedHeaders = [
                          "CountryID",
                          "PortCode",
                          "PortName",
                          "Reancho",
                          "Latitude",
                          "Longitude",
                          "CountryName",
                          "LocID",
                          "IND",
                      ];
                      var actualHeaders = Object.keys(jsonData[0]); // Get the actual headers from the first row of data
          
                      // Compare the expected headers with the actual headers
                      var invalidColumns = [];
                      expectedHeaders.forEach(function (header) {
                          if (actualHeaders.indexOf(header) === -1) {
                              invalidColumns.push(header);
                          }
                      });
          
                      // If any invalid columns found, show error message
                      if (invalidColumns.length > 0) {
                          var errorMessage =
                              "The following columns are missing in the uploaded file: " +
                              invalidColumns.join(", ");
                          sap.m.MessageToast.show(errorMessage);
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      // Validate each field for special characters
                      var errorFields = [];
                      jsonData.forEach(function (rowData, rowIndex) {
                          Object.keys(rowData).forEach(function (field) {
                              if (field === "CountryID" || field === "PortCode" || field === "PortName" || field === "Reancho" || field === "CountryName" ) {
                                  if (!/^[a-zA-Z]+$/.test(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              }
                          });
                      });
          
                      // If any fields contain non-alphabetic characters, show error message
                      if (errorFields.length > 0) {
                          var errorMessage = "";
                          errorFields.forEach(function (error) {
                              errorMessage += "Invalid alphabetic value found in '" + error.field + "' field for row " + error.row + "\n";
                          });
                          sap.m.MessageToast.show(errorMessage);
                          // Clear file uploader
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      let latitudeErrors = [];
                      let longitudeErrors = [];
                      let countryErrors = [];
          
                      for (let i = 0; i < jsonData.length; i++) {
                          // Check if Latitude and Longitude are numbers and Country is not a number
                          if (typeof jsonData[i].Latitude !== "number") {
                              latitudeErrors.push(i + 1);
                          }
                          if (typeof jsonData[i].Longitude !== "number") {
                              longitudeErrors.push(i + 1);
                          }
                          if (!isNaN(jsonData[i].Country)) {
                              countryErrors.push(i + 1);
                          }
                      }
          
                      let finalErrorMessage = ""; // Declare a variable to hold the final error message
          
                      if (latitudeErrors.length > 0) {
                          finalErrorMessage += "Invalid latitude for rows: " + latitudeErrors.join(", ") + "\n";
                      }
                      if (longitudeErrors.length > 0) {
                          finalErrorMessage += "Invalid longitude for rows: " + longitudeErrors.join(", ") + "\n";
                      }
                      if (countryErrors.length > 0) {
                          finalErrorMessage += "Numeric value found in Country for rows: " + countryErrors.join(", ");
                      }
          
                      if (finalErrorMessage) {
                          sap.m.MessageToast.show(finalErrorMessage);
                          // Clear file uploader
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      // Proceed with opening the preview dialog
                      that._onPortLocopenPreviewDialog(jsonData);
                  } catch (error) {
                      // Log and handle any errors
                      console.error("Error processing Excel file:", error);
                      sap.m.MessageToast.show(
                          "Error processing Excel file. Please upload a valid Excel file."
                      );
                      // Clear file uploader
                      fileUploader.clear();
                  }
              };
          
              reader.readAsArrayBuffer(file);
            },
          
            _onPortLocopenPreviewDialog: function (jsonData) {
              // Create a JSON model and set the data
              var oModel = new sap.ui.model.json.JSONModel();
              oModel.setData(jsonData);
          
              // Set the model to the view
              var oView = this.getView();
          
              // Instantiate the dialog fragment if it's not already instantiated
              if (!this._oPortLocPreviewDialog) {
                  this._oPortLocPreviewDialog = sap.ui.xmlfragment(
                      oView.getId(),
                      "nauticalfe.fragments.previewSheetDialog",
                      this
                  );
                  oView.addDependent(this._oPortLocPreviewDialog);
              }
          
              // Bind data to the table in the dialog
              var oTable = this._oPortLocPreviewDialog.getContent()[0];
              oTable.setModel(oModel);
              oTable.bindAggregation("items", "/", this._onPortLoccreateColumnListItem());
          
              // Open dialog
              this._oPortLocPreviewDialog.open();
            },

            onPortLocPreviewDialogClose: function () {
              this._oPortLocPreviewDialog.close();
            },
          
            onPortLocDownloadPress: function () {
              const oFileUploader = this.getView().byId("fileUploader");
              oFileUploader.clear();

              let sFileName =  "PortUpload"
              // Create dummy data for the template (replace with your actual template data)
              var templateData = [
                [
                  "CountryID",
                  "PortCode",
                  "PortName",
                  "Reancho",
                  "Latitude",
                  "Longitude",
                  "CountryName",
                  "LocID",
                  "IND",
                ],
                // Add more rows as needed
              ];
        
              // Create spreadsheet
              var oSpreadsheet = new sap.ui.export.Spreadsheet({
                workbook: {
                  columns: [
                    // Define columns for the spreadsheet
                    { label: "CountryID", property: "CountryID" },
                    { label: "PortCode", property: "PortCode" },
                    { label: "PortName", property: "PortName" },
                    { label: "Reancho", property: "Reancho" },
                    { label: "Latitude", property: "Latitude" },
                    { label: "Longitude", property: "Longitude" },
                    { label: "CountryName", property: "CountryName" },
                    { label: "LocID", property: "LocID" },
                    { label: "IND", property: "IND" },
                  ],
                  rows: {
                    // Bind data rows to the template data
                    path: "/",
                  },
                },
                dataSource: templateData,
                fileName: sFileName
              });
        
              // Download the spreadsheet
              oSpreadsheet.build();
            }, 


          // Marine path Upload

            onMarinePathUploadPress: function () {
              var fileUploader = this.getView().byId("fileUploader3");
              var file = fileUploader.oFileUpload.files[0];
       
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("Please select a file to upload.");
                return; // Exit the function
              }
       
              // Proceed with file upload logic
              fileUploader.upload();
            },
       
            onMarinePathUploadComplete: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader3");
              var file = fileUploader.oFileUpload.files[0];
       
              if (!file) {
                sap.m.MessageToast.show("No file uploaded.");
                return; 
              }
       
              var reader = new FileReader();
              var that = this; 
       
              reader.onload = function (e) {
                try {
                  var data = new Uint8Array(e.target.result);
                  var workbook = XLSX.read(data, { type: "array" });
                  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  var jsonData = XLSX.utils.sheet_to_json(worksheet);
       
                  // Create a JSON model and set the data
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData(jsonData);
       
                  // Set the model to the view
                  var oView = that.getView();
                  oView.setModel(oModel);
                  console.log("Excelsheet Data ", jsonData);
       
                  // Show success message
                  sap.m.MessageToast.show(
                    "Excel file uploaded and parsed successfully"
                  );
                  fileUploader.clear();
                } catch (error) {
                  // Log the error
                  console.error("Error parsing Excel file:", error);
                  // Show error message to the user
                  sap.m.MessageToast.show(
                    "Error parsing Excel file. Please upload a valid Excel file."
                  );
                }
              };
       
              reader.readAsArrayBuffer(file);
            },
       
            _onMarinePathcreateColumnListItem: function () {
              return new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({ text: "{StartPort}" }),
                  new sap.m.Text({ text: "{EndPort}" }),
                  new sap.m.Text({ text: "{RouteID}" }),
                  new sap.m.Text({ text: "{LocationID}" }),
                  new sap.m.Text({ text: "{Latitude}" }),
                  new sap.m.Text({ text: "{Longitude}" }),
                  new sap.m.Text({ text: "{Distance}" }),
                  
                ],
              });
            },

            onMarinePathPreviewPress8: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader3");
              var file = fileUploader.oFileUpload.files[0];
              // Check if a file is selected
              if (!file) {
                  // Show an error message to the user using MessageToast
                  sap.m.MessageToast.show("No file uploaded.");
                  fileUploader.clear();
                  return; // Exit the function
              }
          
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
          
              reader.onload = function (e) {
                  try {
                      var data = new Uint8Array(e.target.result);
                      var workbook = XLSX.read(data, { type: "array" });
                      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                      var jsonData = XLSX.utils.sheet_to_json(worksheet);
          
                      // Check if column headers match the expected headers
                      var expectedHeaders = [
                          "StartPort",
                          "EndPort",
                          "RouteID",
                          "LocationID",
                          "Latitude",
                          "Longitude",
                          "Distance",
                      ];
                      var actualHeaders = Object.keys(jsonData[0]); // Get the actual headers from the first row of data
          
                      // Compare the expected headers with the actual headers
                      var invalidColumns = [];
                      expectedHeaders.forEach(function (header) {
                          if (actualHeaders.indexOf(header) === -1) {
                              invalidColumns.push(header);
                          }
                      });
          
                      // If any invalid columns found, show error message
                      if (invalidColumns.length > 0) {
                          var errorMessage =
                              "The following columns are missing in the uploaded file: " +
                              invalidColumns.join(", ");
                          sap.m.MessageToast.show(errorMessage);
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      // Validate each field
                      var errorFields = [];
                      jsonData.forEach(function (rowData, rowIndex) {
                          Object.keys(rowData).forEach(function (field) {
                              // Check if the field is "Latitude" or "Longitude"
                              if (field === "Latitude" || field === "Longitude" || field === "Distance") {
                                  // Check if the value is not a number
                                  if (isNaN(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              } else {
                                  // Check if the value is not alphabetic
                                  if (!/^[a-zA-Z]+$/.test(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              }
                          });
                      });
          
                      // If any fields contain non-alphabetic characters (except "Latitude" and "Longitude"), show error message
                      if (errorFields.length > 0) {
                          var errorMessage = "";
                          errorFields.forEach(function (error) {
                              errorMessage += "Invalid value found in '" + error.field + "' field for row " + error.row + "\n";
                          });
                          sap.m.MessageToast.show(errorMessage);
                          // Clear file uploader
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      // Proceed with opening the preview dialog
                      that._onMarinePathopenPreviewDialog(jsonData);
                  } catch (error) {
                      // Log and handle any errors
                      console.error("Error processing Excel file:", error);
                      sap.m.MessageToast.show(
                          "Error processing Excel file. Please upload a valid Excel file."
                      );
                      // Clear file uploader
                      fileUploader.clear();
                  }
              };
          
              reader.readAsArrayBuffer(file);
            },

            onMarinePathPreviewPress: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader3");
              var file = fileUploader.oFileUpload.files[0];
              // Check if a file is selected
              if (!file) {
                  // Show an error message to the user using MessageToast
                  sap.m.MessageToast.show("No file uploaded.");
                  fileUploader.clear();
                  return; // Exit the function
              }
              
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
              
              reader.onload = function (e) {
                  try {
                      var data = new Uint8Array(e.target.result);
                      var workbook = XLSX.read(data, { type: "array" });
                      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                      var jsonData = XLSX.utils.sheet_to_json(worksheet);
              
                      // Check if column headers match the expected headers
                      var expectedHeaders = [
                          "StartPort",
                          "EndPort",
                          "RouteID",
                          "LocationID",
                          "Latitude",
                          "Longitude",
                          "Distance",
                      ];
                      var actualHeaders = Object.keys(jsonData[0]); // Get the actual headers from the first row of data
              
                      // Compare the expected headers with the actual headers
                      var invalidColumns = [];
                      expectedHeaders.forEach(function (header) {
                          if (actualHeaders.indexOf(header) === -1) {
                              invalidColumns.push(header);
                          }
                      });
              
                      // If any invalid columns found, show error message
                      if (invalidColumns.length > 0) {
                          var errorMessage =
                              "The following columns are missing in the uploaded file: " +
                              invalidColumns.join(", ");
                          sap.m.MessageToast.show(errorMessage);
                          fileUploader.clear();
                          return; // Exit the function
                      }
              
                      // Validate each field
                      var errorFields = [];
                      jsonData.forEach(function (rowData, rowIndex) {
                          Object.keys(rowData).forEach(function (field) {
                              // Check if the field is "Latitude" or "Longitude" or "Distance"
                              if (field === "Latitude" || field === "Longitude" || field === "Distance") {
                                  // Check if the value is not a number
                                  if (isNaN(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              } else {
                                  // Check if the value is not alphabetic
                                  if (!/^[a-zA-Z]+$/.test(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              }
                          });
                      });
              
                      // If any fields contain non-alphabetic characters (except "Latitude" and "Longitude" and "Distance"), show error message
                      if (errorFields.length > 0) {
                          var errorMessage = "";
                          errorFields.forEach(function (error) {
                              errorMessage += "Invalid value found in '" + error.field + "' field for row " + error.row + "\n";
                          });
                          sap.m.MessageToast.show(errorMessage);
                          // Clear file uploader
                          fileUploader.clear();
                          return; // Exit the function
                      }
              
                      // Proceed with opening the preview dialog
                      that._onMarinePathopenPreviewDialog(jsonData);
                  } catch (error) {
                      // Log and handle any errors
                      console.error("Error processing Excel file:", error);
                      sap.m.MessageToast.show(
                          "Error processing Excel file. Please upload a valid Excel file."
                      );
                      // Clear file uploader
                      fileUploader.clear();
                  }
              };
              
              reader.readAsArrayBuffer(file);
            },        
          
            _onMarinePathopenPreviewDialog: function (jsonData) {
              // Create a JSON model and set the data
              var oModel = new sap.ui.model.json.JSONModel();
              oModel.setData(jsonData);
       
              // Set the model to the view
              var oView = this.getView();
       
              // Instantiate the dialog fragment
              if (!this._oMarinePathPreviewDialog) {
                this._oMarinePathPreviewDialog = sap.ui.xmlfragment(
                  oView.getId(),
                  "nauticalfe.fragments.marinepathUpdSheetDialog",
                  this
                );
                oView.addDependent(this._oMarinePathPreviewDialog);
              }
       
              // Bind data to the table in the dialog
              var oTable = this._oMarinePathPreviewDialog.getContent()[0];
              oTable.setModel(oModel);
              oTable.bindAggregation("items", "/", this._onMarinePathcreateColumnListItem());
       
              // Open dialog
              this._oMarinePathPreviewDialog.open();
            },

            onMarinePathPreviewDialogClose: function () {
              this._oMarinePathPreviewDialog.close();
            },
       
            onMarinePathDownloadPress: function () {
              const oFileUploader = this.getView().byId("fileUploader3");
              oFileUploader.clear();
              let sFileName =  "MarineUpload"
              // Create dummy data for the template (replace with your actual template data)
              var templateData = [
                [
                  "StartPort",
                  "EndPort",
                  "RouteID",
                  "LocationID",
                  "Latitude",
                  "Longitude",
                  "Distance",
                 
                ],
                // Add more rows as needed
              ];
       
              // Create spreadsheet
              var oSpreadsheet = new sap.ui.export.Spreadsheet({
                workbook: {
                  columns: [
                    // Define columns for the spreadsheet
                    { label: "StartPort", property: "StartPort" },
                    { label: "EndPort", property: "EndPort" },
                    { label: "RouteID", property: "RouteID" },
                    { label: "LocationID", property: "LocationID" },
                    { label: "Latitude", property: "Latitude" },
                    { label: "Longitude", property: "Longitude" },
                    { label: "Distance", property: "Distance" },
                    
                  ],
                  rows: {
                    // Bind data rows to the template data
                    path: "/",
                  },
                },
                dataSource: templateData,
                fileName: sFileName
              });
       
              // Download the spreadsheet
              oSpreadsheet.build();
            },
















          // These two is not taking right now

          // Marine Distance Upload

            onMarineDistanceUploadPress: function () {
              var fileUploader = this.getView().byId("fileUploader4");
              var file = fileUploader.oFileUpload.files[0];
      
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("Please select a file to upload.");
                return; // Exit the function
              }
      
              // Proceed with file upload logic
              fileUploader.upload();
            },
      
            onMarineDistanceUploadComplete: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader4");
              var file = fileUploader.oFileUpload.files[0];
      
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("No file uploaded.");
                return; // Exit the function
              }
      
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
      
              reader.onload = function (e) {
                try {
                  var data = new Uint8Array(e.target.result);
                  var workbook = XLSX.read(data, { type: "array" });
                  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  var jsonData = XLSX.utils.sheet_to_json(worksheet);
      
                  // Create a JSON model and set the data
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData(jsonData);
      
                  // Set the model to the view
                  var oView = that.getView();
                  oView.setModel(oModel);
                  console.log("Excelsheet Data ", jsonData);
      
                  // Show success message
                  sap.m.MessageToast.show(
                    "Excel file uploaded and parsed successfully"
                  );
                  fileUploader.clear();
                
                } catch (error) {
                  // Log the error
                  console.error("Error parsing Excel file:", error);
                  // Show error message to the user
                  sap.m.MessageToast.show(
                    "Error parsing Excel file. Please upload a valid Excel file."
                  );
                }
              };
      
              reader.readAsArrayBuffer(file);
            },
      
            _onMarineDistancecreateColumnListItem: function () {
              return new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({ text: "{FromPort}" }),
                  new sap.m.Text({ text: "{ToPort}" }),
                  new sap.m.Text({ text: "{Distance}" }),
                  
                  
                ],
              });
            },
      
            onMarineDistancePreviewDialogClose: function () {
              this._oMarineDistancePreviewDialog.close();
            },
            onMarineDistancePreviewPress: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader4");
              var file = fileUploader.oFileUpload.files[0];
              // Check if a file is selected
              if (!file) {
                  // Show an error message to the user using MessageToast
                  sap.m.MessageToast.show("No file uploaded.");
                  fileUploader.clear();
                  return; // Exit the function
              }
          
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
          
              reader.onload = function (e) {
                  try {
                      var data = new Uint8Array(e.target.result);
                      var workbook = XLSX.read(data, { type: "array" });
                      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                      var jsonData = XLSX.utils.sheet_to_json(worksheet);
          
                      // Check if column headers match the expected headers
                      var expectedHeaders = [
                          "FromPort",
                          "ToPort",
                          "Distance",
                      ];
                      var actualHeaders = Object.keys(jsonData[0]); // Get the actual headers from the first row of data
          
                      // Compare the expected headers with the actual headers
                      var invalidColumns = [];
                      expectedHeaders.forEach(function (header) {
                          if (actualHeaders.indexOf(header) === -1) {
                              invalidColumns.push(header);
                          }
                      });
          
                      // If any invalid columns found, show error message
                      if (invalidColumns.length > 0) {
                          var errorMessage =
                              "The following columns are missing in the uploaded file: " +
                              invalidColumns.join(", ");
                          sap.m.MessageToast.show(errorMessage);
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      // Validate each field
                      var errorFields = [];
                      jsonData.forEach(function (rowData, rowIndex) {
                          Object.keys(rowData).forEach(function (field) {
                              // Check if the field is "Distance"
                              if (field === "Distance") {
                                  // Check if the value is not a number
                                  if (isNaN(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              } else {
                                  // Check if the value is not alphabetic
                                  if (!/^[a-zA-Z]+$/.test(rowData[field])) {
                                      errorFields.push({ row: rowIndex + 1, field: field });
                                  }
                              }
                          });
                      });
          
                      // If any fields contain non-alphabetic characters (except "Distance"), show error message
                      if (errorFields.length > 0) {
                          var errorMessage = "";
                          errorFields.forEach(function (error) {
                              errorMessage += "Invalid value found in '" + error.field + "' field for row " + error.row + "\n";
                          });
                          sap.m.MessageToast.show(errorMessage);
                          // Clear file uploader
                          fileUploader.clear();
                          return; // Exit the function
                      }
          
                      // Proceed with opening the preview dialog
                      that._onMarineDistanceopenPreviewDialog(jsonData);
                  } catch (error) {
                      // Log and handle any errors
                      console.error("Error processing Excel file:", error);
                      sap.m.MessageToast.show(
                          "Error processing Excel file. Please upload a valid Excel file."
                      );
                      // Clear file uploader
                      fileUploader.clear();
                  }
              };
          
              reader.readAsArrayBuffer(file);
          },
          
          
            onMarineDistancePreviewPress1: function (oEvent) {
              var fileUploader = this.getView().byId("fileUploader4");
              var file = fileUploader.oFileUpload.files[0];
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("No file uploaded.");
                return; // Exit the function
              }
              var fileUploader = this.getView().byId("fileUploader4");
      
              var reader = new FileReader();
              var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
      
              reader.onload = function (e) {
                try {
                  var data = new Uint8Array(e.target.result);
                  var workbook = XLSX.read(data, { type: "array" });
                  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  var jsonData = XLSX.utils.sheet_to_json(worksheet);
      
                  // Check if column headers match the expected headers
                  var expectedHeaders = [
                    "FromPort",
                    "ToPort",
                    "Distance",
                    
                  
                  ];
                  var actualHeaders = Object.keys(jsonData[0]); // Get the actual headers from the first row of data
      
                  // Compare the expected headers with the actual headers
                  var invalidColumns = [];
                  expectedHeaders.forEach(function (header) {
                    if (actualHeaders.indexOf(header) === -1) {
                      invalidColumns.push(header);
                    }
                  });
      
                  // If any invalid columns found, show error message
                  if (invalidColumns.length > 0) {
                    var errorMessage =
                      "The following columns are missing in the uploaded file: " +
                      invalidColumns.join(", ");
                    sap.m.MessageToast.show(errorMessage);
                    return; // Exit the function
                  }
      
                  // Proceed with opening the preview dialog
                  that._onMarineDistanceopenPreviewDialog(jsonData);
                } catch (error) {
                  // Log and handle any errors
                  console.error("Error processing Excel file:", error);
                  sap.m.MessageToast.show(
                    "Error processing Excel file. Please upload a valid Excel file."
                  );
                }
              };
      
              reader.readAsArrayBuffer(file);
            },
      
            _onMarineDistanceopenPreviewDialog: function (jsonData) {
              // Create a JSON model and set the data
              var oModel = new sap.ui.model.json.JSONModel();
              oModel.setData(jsonData);
      
              // Set the model to the view
              var oView = this.getView();
      
              // Instantiate the dialog fragment
              if (!this._oMarineDistancePreviewDialog) {
                this._oMarineDistancePreviewDialog = sap.ui.xmlfragment(
                  oView.getId(),
                  "nauticalfe.fragments.marinedisUpdsheetDialog",
                  this
                );
                oView.addDependent(this._oMarineDistancePreviewDialog);
              }
      
              // Bind data to the table in the dialog
              var oTable = this._oMarineDistancePreviewDialog.getContent()[0];
              oTable.setModel(oModel);
              oTable.bindAggregation("items", "/", this._onMarineDistancecreateColumnListItem());
      
              // Open dialog
              this._oMarineDistancePreviewDialog.open();
            },
      
            onMarineDistanceDownloadPress: function () {
              const oFileUploader = this.getView().byId("fileUploader4");
              oFileUploader.clear();
              let sFileName =  "MarineDistanceUpload"
              // Create dummy data for the template (replace with your actual template data)
              var templateData = [
                [
                  "FromPort",
                  "ToPort",
                  "Distance",
                  
                
                ],
                // Add more rows as needed
              ];
      
              // Create spreadsheet
              var oSpreadsheet = new sap.ui.export.Spreadsheet({
                workbook: {
                  columns: [
                    // Define columns for the spreadsheet
                    { label: "FromPort", property: "FromPort" },
                    { label: "ToPort", property: "ToPort" },
                    { label: "Distance", property: "Distance" },
                  
                    
                  ],
                  rows: {
                    // Bind data rows to the template data
                    path: "/",
                  },
                },
                dataSource: templateData,
                fileName: sFileName
              });
      
              // Download the spreadsheet
              oSpreadsheet.build();
            },



            // For Port Upload

            onPortUploadPress: function () {
              var fileUploader = this.getView().byId("fileUploader2");
              var file = fileUploader.oFileUpload.files[0];
      
              // Check if a file is selected
              if (!file) {
                // Show an error message to the user using MessageToast
                sap.m.MessageToast.show("Please select a file to upload.");
                return; // Exit the function
              }
      
              // Proceed with file upload logic
              fileUploader.upload();
              },
      
              onPortUploadComplete: function (oEvent) {
                var fileUploader = this.getView().byId("fileUploader2");
                var file = fileUploader.oFileUpload.files[0];
        
                // Check if a file is selected
                if (!file) {
                  // Show an error message to the user using MessageToast
                  sap.m.MessageToast.show("No file uploaded.");
                  return; // Exit the function
                }
        
                var reader = new FileReader();
                var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
        
                reader.onload = function (e) {
                  try {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: "array" });
                    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    var jsonData = XLSX.utils.sheet_to_json(worksheet);
        
                    // Create a JSON model and set the data
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(jsonData);
        
                    // Set the model to the view
                    var oView = that.getView();
                    oView.setModel(oModel);
                    console.log("Excelsheet Data ", jsonData);
        
                    // Show success message
                    sap.m.MessageToast.show(
                      "Excel file uploaded and parsed successfully"
                    );
                    fileUploader.clear();
                  } catch (error) {
                    // Log the error
                    console.error("Error parsing Excel file:", error);
                    // Show error message to the user
                    sap.m.MessageToast.show(
                      "Error parsing Excel file. Please upload a valid Excel file."
                    );
                  }
                };
        
                reader.readAsArrayBuffer(file);
              },
      
              _onPortUploadcreateColumnListItem: function () {
                return new sap.m.ColumnListItem({
                  cells: [
                    new sap.m.Text({ text: "{Value}" }),
                    new sap.m.Text({ text: "{Description}" }),
                    new sap.m.Text({ text: "{Country}" }),
                    new sap.m.Text({ text: "{Countryn}" }),
                  
                  ],
                });
              },
  
              onPortUploadPreviewPress: function (oEvent) {
                var fileUploader = this.getView().byId("fileUploader2");
                var file = fileUploader.oFileUpload.files[0];
                // Check if a file is selected
                if (!file) {
                    // Show an error message to the user using MessageToast
                    sap.m.MessageToast.show("No file uploaded.");
                    fileUploader.clear();
                    return; // Exit the function
                }
            
                var reader = new FileReader();
                var that = this; // Preserve the reference to the controller for use inside the FileReader's onload function
            
                reader.onload = function (e) {
                    try {
                        var data = new Uint8Array(e.target.result);
                        var workbook = XLSX.read(data, { type: "array" });
                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
            
                        // Check if column headers match the expected headers
                        var expectedHeaders = [
                            "Value",
                            "Description",
                            "Country",
                            "Countryn",
                        ];
                        var actualHeaders = Object.keys(jsonData[0]);
            
                        // Compare the expected headers with the actual headers
                        var invalidColumns = [];
                        expectedHeaders.forEach(function (header) {
                            if (actualHeaders.indexOf(header) === -1) {
                                invalidColumns.push(header);
                            }
                        });
            
                        // If any invalid columns found, show error message
                        if (invalidColumns.length > 0) {
                            var errorMessage =
                                "The following columns are missing in the uploaded file: " +
                                invalidColumns.join(", ");
                            sap.m.MessageToast.show(errorMessage);
                            fileUploader.clear();
                            return; // Exit the function
                        }
            
                        // Validate each field for alphabetic characters
                        var errorRows = [];
                        jsonData.forEach(function (rowData, rowIndex) {
                            Object.keys(rowData).forEach(function (field) {
                                if (!/^[a-zA-Z]+$/.test(rowData[field])) {
                                    errorRows.push(rowIndex + 1); // Push the row index for the error message
                                }
                            });
                        });
                        if (errorRows.length > 0) {
                            var errorMessage =
                                "Non-alphabetic value found in one or more fields for rows: " +
                                errorRows.join(", ");
                            sap.m.MessageToast.show(errorMessage);
                            // Clear file uploader
                            fileUploader.clear();
                            return; // Exit the function
                        }
            
                        // Proceed with opening the preview dialog
                        that._onPortUploadopenPreviewDialog(jsonData);
                    } catch (error) {
                        // Log and handle any errors
                        console.error("Error processing Excel file:", error);
                        sap.m.MessageToast.show(
                            "Error processing Excel file. Please upload a valid Excel file."
                        );
                    }
                };
            
                reader.readAsArrayBuffer(file);
              },
            
              _onPortUploadopenPreviewDialog: function (jsonData) {
                // Create a JSON model and set the data
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(jsonData);
            
                // Set the model to the view
                var oView = this.getView();
            
                // Instantiate the dialog fragment if it's not already instantiated
                if (!this._oPortUpdPreviewDialog) {
                    this._oPortUpdPreviewDialog = sap.ui.xmlfragment(
                        oView.getId(),
                        "nauticalfe.fragments.portUpdSheetDialog",
                        this
                    );
                    oView.addDependent(this._oPortUpdPreviewDialog);
                }
            
                // Bind data to the table in the dialog
                var oTable = this._oPortUpdPreviewDialog.getContent()[0];
                oTable.setModel(oModel);
                oTable.bindAggregation("items", "/", this._onPortUploadcreateColumnListItem());
            
                // Open dialog
                this._oPortUpdPreviewDialog.open();
              },
  
              onPortUploadPreviewDialogClose: function () {
                this._oPortUpdPreviewDialog.close();
              },
      
              onPortUploadDownloadPress: function () {
                const oFileUploader = this.getView().byId("fileUploader2");
                oFileUploader.clear();
                let sFileName =  "PortUpload"
                // Create dummy data for the template (replace with your actual template data)
                var templateData = [
                  [
                    "Value",
                    "Description",
                    "Country",
                    "Countryn",
                              ],
                  // Add more rows as needed
                ];
        
                // Create spreadsheet
                var oSpreadsheet = new sap.ui.export.Spreadsheet({
                  workbook: {
                    columns: [
                      // Define columns for the spreadsheet
                      { label: "Value", property: "Value" },
                      { label: "Description", property: "Description" },
                      { label: "Country", property: "Country" },
                      { label: "Countryn", property: "Countryn" },
                    
                    ],
                    rows: {
                      // Bind data rows to the template data
                      path: "/",
                    },
                  },
                  dataSource: templateData,
                  fileName: sFileName
                });
        
                // Download the spreadsheet
                oSpreadsheet.build();
              },

        });
    });