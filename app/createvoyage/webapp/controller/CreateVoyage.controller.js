
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/Token",
    "com/ingenx/nauti/createvoyage/model/formatter",
    "com/ingenx/nauti/createvoyage/utils/helperFunctions",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, MessageBox, MessageToast, Fragment, ColumnListItem, Label, Token, formatter, helperFunctions) {
    "use strict";

    let pathVariable = [];
    var latLngArr = [];
    var routeArr = [];
    var map;
    var oJsonModel;
    var DataNode = {
      portData: [],
      allPort: [],
      temp: latLngArr,
      temp1: routeArr,
      oEdit: true,
    };
    var portMasterData
    var oVoyageDetailModel;
    var pathFetchedFromDb;
    let boolPortsLoaded = false;
    let pathToExclude = [];

    let selectedPort = undefined
    let startPort;
    let endPort;


    return Controller.extend("com.ingenx.nauti.createvoyage.controller.CreateVoyage", {
      formatter: formatter,
      helperFunctions: helperFunctions,


      onInit: function () {

        this._BusyDialog = new sap.m.BusyDialog({
          title: "Loading...",
        });
        this._BusyTimeout = setTimeout(() => {
          if (this._BusyDialog) this._BusyDialog.setText("This is taking time, please wait...");
        }, 5000);

        this._BusyTimeout = setTimeout(() => {
          if (this._BusyDialog) {
            this._BusyDialog.setText("Please relaunch the Application.");
            this._BusyDialog.setShowCancelButton(true);
            this._BusyDialog.attachClose(function () {
              if (!boolPortsLoaded) history.back();
            }, this);
          }
        }, 10000);
        this._oRootPath = jQuery.sap.getModulePath("com.ingenx.nauti.createvoyage"); // your resource root

        const oPlanModel = new JSONModel([
          {
            voynm: "",
            voyty: "",
            carty: "",
            curty: "",
            bidty: "",
          },
        ]);
        // console.log(oPlanModel.getData());
        this.getView().setModel(oPlanModel, "planmodel");
        oVoyageDetailModel = new JSONModel({
          voyage: [],
        });
        this.getView().setModel(oVoyageDetailModel, "oVoyDetail");
        oJsonModel = new sap.ui.model.json.JSONModel();
        oJsonModel.setData(DataNode);
        oJsonModel.setDefaultBindingMode("TwoWay");

        this.getOwnerComponent().setModel(oJsonModel, "oJsonModel");
        window.that = this;



      },


      handleDateChange1: function (oEvent) {
        let oDatePicker = oEvent.getSource();

        // let sPortDays = oEvent.getSource().getParent().getCells()[7].getValue();

        // if( !sPortDays){
        //   sap.m.MessageBox.error("Please Select Port Days");
        //   oDatePicker.setValueState("None");
        //   return;
        // }
        let sValue = oEvent.getParameter("value");
        let oSelectedDate = new Date(sValue);
        let oMinDate = new Date(); // Today's date
        let minTimeGap = 15;

        oMinDate.setDate(oMinDate.getDate() + parseInt(minTimeGap, 10));

        // Check if the selected date is before today's date
        if (oSelectedDate < oMinDate) {
          // Set ValueState to Error and clear the date value
          oDatePicker.setValueState("Error");
          oDatePicker.setValueStateText(`Select Date should be ${minTimeGap} days after Today onwards.`);
          oDatePicker.setDateValue(null);
        } else {
          // Reset ValueState to None if the date is valid
          oDatePicker.setValueState("None");
        }
      },


     //   var aDatePickers = oView.findAggregatedObjects(true, function(oControl) {
      //       return oControl instanceof sap.m.DatePicker;
      //   });

      //   aDatePickers.forEach(function(oControl) {
      //       oControl.addEventDelegate({
      //           onAfterRendering: function() {
      //               var $input = oControl.$().find("input");
      //               $input.prop("readonly", true);
      //           }
      //       });
      //   });
      // }, 

      // function to get Route from  external api  

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
      // new js fn for convert date object to required format
      // formatDateToISOString: function (date) {
      //   const year = date.getFullYear();
      //   const month = String(date.getMonth() + 1).padStart(2, '0');
      //   const day = String(date.getDate()).padStart(2, '0');
      //   const hours = String(date.getHours()).padStart(2, '0');
      //   const minutes = String(date.getMinutes()).padStart(2, '0');
      //   const seconds = String(date.getSeconds()).padStart(2, '0');
      //   const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
      //   const timezoneOffsetInMinutes = date.getTimezoneOffset();
      //   const timezoneOffsetSign = timezoneOffsetInMinutes > 0 ? '-' : '+';
      //   const timezoneOffsetHours = String(Math.abs(Math.floor(timezoneOffsetInMinutes / 60))).padStart(2, '0');
      //   const timezoneOffsetMinutes = String(Math.abs(timezoneOffsetInMinutes % 60)).padStart(2, '0');

      //   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
      // },

      onAfterRendering: function () {
        let that = this;
        setTimeout(() => { that._renderMap(); }, 500);
        window.addEventListener("resize", (e) => {
          setTimeout(() => {
            // if (!map?.getContainer()?.childElementCount) {
            if (map && map.getContainer() && map.getContainer().childElementCount === 0) {
              map.remove();
              that._renderMap();
            } else {
              map.invalidateSize(true);
            }
          }, 1000);
        });
      },

      _renderMap: async function () {
        try {

          map = L.map("map", {
            center: [23, 98],
            zoom: 4,
            maxZoom: 10,
            minZoom: 2,
            zoomSnap: 1,
            zoomDelta: 1,
          });
          const apiKey =
            "AAPKe27e88812313402183412454166a77bfxD0NeqearqElOoWipt7HJRkpfNICD533yGyWnO-xYLxgs9GZ-S6l5yIA9rtKDfqQ";
          const basemapEnum = "ArcGIS:Navigation";
          L.esri.Vector.vectorBasemapLayer(basemapEnum, {
            apiKey: apiKey,
          }).addTo(map);

          // show the scale bar on the lower left corner
          L.control
            .scale({
              imperial: true,
              metric: true,
            })
            .addTo(map);
          var anchorIcon = L.icon({
            iconUrl: `${this._oRootPath}/Img/Anchor.png`,
            //	shadowUrl: './Img/Anchor-shadow.png',
            iconSize: [20, 20], // size of the icon
            //	shadowSize: [41, 41], // size of the shadow
            iconAnchor: [7, 12], // point of the icon which will correspond to marker's location
            // shadowAnchor: [4, 62], // the same for the shadow
            popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
          });

          const oDataModel = this.getOwnerComponent().getModel();

          var that = this;
          this._BusyDialog.setTitle("Loading Ports...");
          this._BusyDialog.setText("Please wait...");
          this._BusyDialog.open();
          window.that = this;

          const portModel = new JSONModel({
            sPortMasterData: [],
          });
          let fetchedPortData = await helperFunctions.readEntity(oDataModel, "PortMasterSet", undefined, undefined, undefined, undefined);
          // console.log("Port data", fetchedPortData);

          portModel.getData().sPortMasterData.push(...fetchedPortData);


          console.log("oPort Master ", portModel.getData().sPortMasterData);

          portMasterData = portModel.getData().sPortMasterData;
          let oData = portModel.getData().sPortMasterData;
          oJsonModel.getData().allPort = oData;
          // console.log(oData.results);
          for (var i = 0; i < oData.length; i++) {

            L.marker([Number(oData[i].Latitude), Number(oData[i].Longitude)], {
              icon: anchorIcon,
            })
              .bindPopup(oData[i].Portn)
              .bindTooltip(oData[i].Portn, {
                direction: "bottom",
                permanent: true,
                offset: L.point(3, 2),
                className: "leaflet-tooltip-own",
              })
              .addTo(map)
              .on("click", that.onMarkerClick);
          }
          if (that._BusyDialog) {
            boolPortsLoaded = true;
            that._BusyDialog.close();
            clearTimeout(that._BusyTimeout);
            map.invalidateSize(true);
          }

        } catch (error) {
          console.log("Error occured :", error);
          sap.m.MessageBox.error(error.message);
        }
      },



      groupBy: function (array, property) {
        var hash = {};
        for (var i = 0; i < array.length; i++) {
          if (!hash[array[i][property]]) hash[array[i][property]] = [];
          hash[array[i][property]].push(array[i]);
        }
        // console.log(hash);
        return hash;
      },

      onMarkerClick: async function (oEvent) {


        let lastPortData = structuredClone(oJsonModel.getData());

        sap.ui.core.BusyIndicator.show();
        if (oJsonModel.getData().portData.length) {
          if (oJsonModel.getData().portData[oJsonModel.getData().portData.length - 1].PortName === "Total") {
            oJsonModel.getData().portData.pop();
          }
        }
        oJsonModel.getData().oEdit = true;
        oJsonModel.refresh();
        var selectedPort = oJsonModel.getData().allPort.find((element) => element.Portn === oEvent.target._popup._source._popup._content);

        let isPortDuplicated = oJsonModel.getData().portData.findIndex(x => x.PortName === selectedPort.Portn);
        // console.log(isPortDuplicated);
        if (isPortDuplicated !== -1) {
          var that = window.that;
          sap.ui.core.BusyIndicator.hide();
          MessageBox.warning("Port Already Selected.");
          return;
        }

        let legId = oJsonModel.getData().portData.length + 1;
        var portObj = {
          LegId: legId.toString(),
          PortId: selectedPort.Portc,
          PortName: selectedPort.Portn,
          Distance: "",

          Weather: "",
          CargoSize: "",
          CargoUnit: "",
          Speed: "",
          SeaDays: "",
          PortDays: "",

          ArrivalDate: null,
          ArrivalTime: null,
          DepartureDate: null,
          DepartureTime: null,
        };
        if (!oJsonModel.getData().portData.length) {
          portObj.Distance = "00000";
        }
        oJsonModel.getData().portData.push(portObj);
        // console.log("json model ", oJsonModel.getData());
        // console.log("json model port data", oJsonModel.getData().portData);
        oJsonModel.refresh();

        // fn for DatePicker to realonly mode 

        window.that.attachDatePickerHandlers();


        var portLng = oJsonModel.getData().portData.length;
        var that = window.that;

        if (portLng < 2) {
          var that = window.that;
          sap.ui.core.BusyIndicator.hide();
          that.byId("speedInput").setEditable(true);
          return;
        } else {
          that.byId("createVoyageButton").setEnabled(true);
          that.byId("freighSimButton").setEnabled(true);
          that.byId("calculateVoyageButton").setEnabled(true);
          that.byId("CongestionButton").setEnabled(true);
          var oDataModel = that.getOwnerComponent().getModel();
          var IvToPort = oJsonModel.getData().portData[portLng - 1].PortId;
          let ToPortName = oJsonModel.getData().portData[portLng - 1].PortName;
          var IvFromPort = oJsonModel.getData().portData[portLng - 2].PortId;
          let FromPortName = oJsonModel.getData().portData[portLng - 2].PortName;



          var IvOptimized;
          // if (that.getView().byId("idRoutes").getState()) {
          // IvOptimized = "";
          // } else {
          IvOptimized = "X";
          // }
          var aFilter = [];
          var aFilter = [];
          aFilter.push(new sap.ui.model.Filter("IvFromPort", "EQ", IvFromPort));
          aFilter.push(new sap.ui.model.Filter("IvToPort", "EQ", IvToPort));
          // Create a filter for IvOptimized with a boolean value as a string
          aFilter.push(new sap.ui.model.Filter("IvOptimized", "EQ", IvOptimized));

          // addding new vairable for port conjestion
          startPort = IvFromPort;
          console.log("start Port ", startPort);

          endPort = IvToPort;
          console.log("End Port ", endPort);

          const esModel = new JSONModel({
            sEsRoutePathData: [],
          });
          let fromPort = that.getLatLongForPort(portMasterData, IvFromPort);
          let toPort = that.getLatLongForPort(portMasterData, IvToPort);
          console.log(fromPort, toPort);
          var oData = await that.getRouteData(IvFromPort, IvToPort, IvOptimized);
          pathFetchedFromDb = oData;
          console.log("pathFetchedFromDb ", pathFetchedFromDb);
          if (!oData.route.length) {
            console.log("Clicked   ");
            oData = await that.getRouteSeaPath(fromPort.Latitude, fromPort.Longitude, toPort.Latitude, toPort.Longitude);
          }

          prepareData(oData, FromPortName, ToPortName);
          sap.ui.core.BusyIndicator.hide();


          let oTable = that.byId("idPortTab");

          let currentDate = new Date();
          oTable.getRows()[0].getCells()[10].setMinDate(new Date(currentDate.getTime() + 15*24*3600*1000));
         
        }


        function prepareData(oData, FromPortName, ToPortName) {

          // if (!oData.results[0].route.results.length) {
          if (!oData.route.length) {
            MessageBox.error(`No Route between Ports ${FromPortName} and ${ToPortName}`, {
              onClose: () => {
                oJsonModel.setData(lastPortData);
                oJsonModel.refresh();
              }
            });
          } else {
            // for (var i = 0; i < oData.results[0].route.results.length; i++) {
            for (var i = 0; i < oData.route.length; i++) {
              // console.log(oData.results[0].route.results);
              // var arrNew = that.groupBy(oData.results[0].route.results, "PathId");
              var arrNew = that.groupBy(oData.route, "PathId");
            }
            for (var i = 1; i < Object.keys(arrNew).length + 1; i++) {
              var path = ["M"];
              for (var j = 0; j < arrNew[i].length; j++) {

                path.push([Number(arrNew[i][j].Latitude), Number(arrNew[i][j].Longitude)]);
              }

            }
            console.log("ODATYTAA ", path);
            // Added reference to each path that is drawn on the map, so it is now possible to refresh/remove it later "Khushal
            let pathVarLengthBefore = pathVariable.length;
            pathVariable.push(
              L.curve([...path], {
                color: "red",
                fill: false,
              })
            );
            for (let i = pathVarLengthBefore; i < pathVariable.length; i++) {
              pathVariable[i].addTo(map);
            }
            console.log("asdfghj ", pathFetchedFromDb.marineApiRoute.EvDistance);
            if (pathFetchedFromDb.marineApiRoute.EvDistance) {
              console.log("asdfghj ", pathFetchedFromDb.marineApiRoute.EvDistance);
              oJsonModel.getData().portData[portLng - 1].Distance = pathFetchedFromDb.marineApiRoute.EvDistance
            }
            else {
              oJsonModel.getData().portData[portLng - 1].Distance = parseInt(oData.seaDistance)
            }
            oJsonModel.refresh();
          }
        }
      },
      attachDatePickerHandlers: function () {
        let uiTable = window.that.byId("idPortTab");

        var aDatePickers = window.that.getView().findAggregatedObjects(
          true,
          function (oControl) {
            return oControl instanceof sap.m.DatePicker;
          }
        );

        aDatePickers.forEach(function (oControl) {
          var $input = oControl.$().find("input");
          $input.prop("readonly", true);
        });
      },
      isVetddDatePickerEditable : function ( data){
        console.log(data);
      },

      getRouteData: function (from, to, optimized) {
        let oModel = this.getView().getModel();
        let oBindList = oModel.bindList("/es_route_map", null, null, null, {
          $expand: "route",
          $select: "IvFromPort,IvToPort,IvOptimized,marineApiRoute"
        });

        let oFilterFromPort = new sap.ui.model.Filter("IvFromPort", sap.ui.model.FilterOperator.EQ, from);
        let oFilterToPort = new sap.ui.model.Filter("IvToPort", sap.ui.model.FilterOperator.EQ, to);
        let oFilterOptimized = new sap.ui.model.Filter("IvOptimized", sap.ui.model.FilterOperator.EQ, optimized);
        let oData = {};
        oBindList.filter([oFilterFromPort, oFilterToPort, oFilterOptimized]);
        return new Promise((resolve, reject) => {
          oBindList.requestContexts().then(function (context) {
            context.forEach((oContext, index) => {
              // oData["results"] = [{
              //   route: {
              //     results: oContext.getObject()?.route
              //   }
              // }]
              oData = oContext.getObject()
            })
            resolve(oData)
          });

        })
      },
      //  for canal selection
      onCheckBoxSelect: function (oEvent) {

        let selectedPortslength = oJsonModel.getData().portData().length;
        if (selectedPortslength <= 1) {
          sap.m.MessageToast.show("Please choose choose atleast two ports");
          return
        }
        let oSource = oEvent.getSource();
        let textType = oSource.getText();
        let isSelected = oEvent.getParameter("selected");
        console.log(textType, isSelected);
        if (!pathToExclude.includes(textType) && isSelected) {
          pathToExclude.push(textType);
        } else {
          let index = pathToExclude.indexOf(textType);
          pathToExclude.splice(index, 1);
        }
        console.log(pathToExclude);

        // that.onMarkerClick();

      },
      // congestion dialog close function
      oncancell: function () {
        this._voyageValueHelpDialog.close();
      },
      navToCongestion: function (oEvent) {
        let oView = this.getView();
        let oBusyDialog = new sap.m.BusyDialog({
            text: "Predicting, please wait...",
            title: "Processing"
        });
        oBusyDialog.open();
    
        // Sample Data
        let rawDataINBOM = [
            { Date: "August 1 2024", MedianDelay: 2.0 },
            { Date: "August 5 2024", MedianDelay: 1.5 },
            { Date: "August 10 2024", MedianDelay: 1.5 },
            { Date: "August 15 2024", MedianDelay: 1.5 },
            { Date: "August 20 2024", MedianDelay: 1.0 },
            { Date: "August 25 2024", MedianDelay: 1.5 },
            { Date: "August 30 2024", MedianDelay: 2.5 },
            { MedianDelay: 3.5, Port: "Hazira" },
            { MedianDelay: 2.5, Port: "KAKINADA" },
            { MedianDelay: 3.2, Port: "Mormugao" }
        ];
    
        let rawDataKOCHI = [
            { Date: "August 1 2024", MedianDelay: 2.0 },
            { Date: "August 5 2024", MedianDelay: 1.5 },
            { Date: "August 10 2024", MedianDelay: 1.5 },
            { Date: "August 15 2024", MedianDelay: 1.5 },
            { Date: "August 20 2024", MedianDelay: 1.0 },
            { Date: "August 25 2024", MedianDelay: 1.5 },
            { Date: "August 30 2024", MedianDelay: 2.5 },
            { MedianDelay: 3.2, Port: "KOCHI" },
            { MedianDelay: 3.2, Port: "Krishnapatnam" },
            { MedianDelay: 3.2, Port: "Chennai" }
        ];
    
        let rawDataINVTZ = [
            { Date: "August 1 2024", MedianDelay: 1.0 },
            { Date: "August 5 2024", MedianDelay: 1.2 },
            { Date: "August 10 2024", MedianDelay: 2.5 },
            { Date: "August 15 2024", MedianDelay: 3.0 },
            { Date: "August 20 2024", MedianDelay: 1.5 },
            { Date: "August 25 2024", MedianDelay: 2.5 },
            { Date: "August 30 2024", MedianDelay: 1.5 },
            { MedianDelay: 1.0, Port: "Kakinada" },
            { MedianDelay: 3.2, Port: "Gangavaram" },
            { MedianDelay: 3.2, Port: "Krishnapatnam" },
            { MedianDelay: 3.2, Port: "Chennai" },
            { MedianDelay: 1.2, Port: "Vishakhapatnam" }
        ];
    
        let rawDataINPRT = [
            { Date: "August 1 2024", MedianDelay: 2.0 },
            { Date: "August 5 2024", MedianDelay: 3.5 },
            { Date: "August 10 2024", MedianDelay: 2.5 },
            { Date: "August 15 2024", MedianDelay: 1.5 },
            { Date: "August 20 2024", MedianDelay: 2.0 },
            { Date: "August 25 2024", MedianDelay: 1.5 },
            { Date: "August 30 2024", MedianDelay: 2.5 },
            { MedianDelay: 1.0, Port: "Chennai" },
            { MedianDelay: 3.2, Port: "Kolkata" },
            { MedianDelay: 3.2, Port: "Paradeep" }
        ];
    
        let oModel = this.getOwnerComponent().getModel();
        let oEndPortBinding = oModel.bindContext(`/xNAUTIxnewportcds(Portc='${endPort}')`);
        let oStartPortBinding = oModel.bindContext(`/xNAUTIxnewportcds(Portc='${startPort}')`);
    
        Promise.all([
            oEndPortBinding.requestObject(),
            oStartPortBinding.requestObject()
        ]).then(([oEndPortContext, oStartPortContext]) => {
            let endPortName = oEndPortContext.Portn; 
            let startPortName = oStartPortContext.Portn; 
    
            let rawData;
            switch (endPort) {
                case "INBOM":
                    rawData = rawDataINBOM;
                    break;
                case "INVTZ":
                    rawData = rawDataINVTZ;
                    break;
                case "INPRT":
                    rawData = rawDataINPRT;
                    break;
                case "KOCHI":
                    rawData = rawDataKOCHI;
                    break;
                default:
                    rawData = rawDataINBOM;
                    break;
            }
    
            let dateMedianDelayData = rawData.filter(item => item.Date).map(item => ({ Date: item.Date, MedianDelay: item.MedianDelay }));
            let portMedianDelayData = rawData.filter(item => item.Port).map(item => ({ Port: item.Port, MedianDelay: item.MedianDelay }));
    
            let oData = {
                ChartDataDate: dateMedianDelayData,
                ChartDataPort: portMedianDelayData,
                StartPort: startPortName,
                EndPort: endPortName,
            };
    
            let oChartModel = new sap.ui.model.json.JSONModel(oData);
    
            if (!this._voyageValueHelpDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.ingenx.nauti.createvoyage.fragments.CongestionShow",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    this._voyageValueHelpDialog = oDialog;
                    this._voyageValueHelpDialog.setModel(oChartModel);
                    this._voyageValueHelpDialog.open();
                    this._setChartTitles();
                    oBusyDialog.close(); 
                }.bind(this));
            } else {
                this._voyageValueHelpDialog.setModel(oChartModel);
                this._voyageValueHelpDialog.open();
                this._setChartTitles();
                oBusyDialog.close(); 
            }
        }).catch((error) => {
            console.error("Error fetching data", error);
            oBusyDialog.close(); 
        });
    },
    
     
    
      _setChartTitles: function () {
        let oVizFrame1 = this.byId("vizFrame");
        let oVizFrame2 = this.byId("vizFrame2");

        oVizFrame1.setVizProperties({
          title: {
            visible: true,
            text: "Median Delay Over Time "
          }
        });

        oVizFrame2.setVizProperties({
          title: {
            visible: true,
            text: "Median Delay by Port"
          }
        });
      },


      onClear: function (oEvent) {

        latLngArr.length = 0;
        oJsonModel.getData().portData.length = 0;
        oJsonModel.refresh();
        pathVariable.forEach((path) => path.remove());
        pathVariable = [];
        this.byId("calculateVoyageButton").setEnabled(false);
        this.byId("createVoyageButton").setEnabled(false);
        this.byId("freighSimButton").setEnabled(false);
        this.byId("CongestionButton").setEnabled(false);
        this.byId("speedInput").setEditable(false).setValue(null);
        this.byId("daysInput").setValue(null);
        this.byId("headerVoynm").setValue("");
        this.byId("headerVoyty").setValue("");
        this.byId("headerCarty").setValue("");
        this.byId("headerCurr").setValue("");
        this.byId("headerBidty").setValue("");

      },

      onCalc: function (oEvent) {
        try {
          let selectedPorts = oJsonModel.getData().portData;
          console.log("Selected port ", selectedPorts.length);
          // let GvSpeed = selectedPorts[1].Speed;

          let ZCalcNav = [];
          for (let i = 0; i < selectedPorts.length; i++) {
            if (!selectedPorts[i].Weather) {
              selectedPorts[i].Weather = "0";
            }
            if (!selectedPorts[i].CargoSize) {
              MessageBox.error("Please enter CargoSize");
              return false;
            }
            if (!selectedPorts[i].CargoUnit) {
              MessageBox.error("Please enter Cargo Unit");
              return false;
            }
            // changes  source port speed to be Zero only
            if (i !== 0 && !selectedPorts[i].Speed) {
              MessageBox.error("Please enter Speed");
              return false;
            }
            if (i !== 0 && selectedPorts[i].Speed == "0") {
              MessageBox.error("Destination Port Speed Can't be Zero");
              return;
            }

            if (!selectedPorts[i].PortDays) {
              MessageBox.error("Please enter Port Days");
              return false;
            }
          }
          if (!selectedPorts[0].DepartureDate) {
            MessageBox.error("Please select Departure Date");
            return false;
          }
          if (!selectedPorts[0].DepartureTime) {
            MessageBox.error("Please select Departure Time");
            return false;
          }

          // ZCalcNav.push({
          //   Portc: selectedPorts[0].PortId,
          //   Portn: selectedPorts[0].PortName,
          //   Pdist: selectedPorts[0].Distance,
          //   Medst: "NM",
          //   Vspeed: GvSpeed,
          //   Ppdays: selectedPorts[0].PortDays,
          //   Vetdd: selectedPorts[0].DepartureDateValue,
          //   Vetdt: selectedPorts[0].DepartureTime,
          //   Vwead: selectedPorts[0].Weather,
          // });
          // for (let i = 1; i < selectedPorts.length; i++) {
          //   ZCalcNav.push({
          //     Portc: selectedPorts[i].PortId,
          //     Portn: selectedPorts[i].PortName,
          //     Pdist: selectedPorts[i].Distance,
          //     Medst: "NM",
          //     Vspeed: GvSpeed,
          //     Ppdays: selectedPorts[i].PortDays,
          //     Vwead: selectedPorts[i].Weather,
          //   });
          // }
          // let oPayload = {
          //   GvSpeed: GvSpeed,
          //   ZCalcNav: ZCalcNav,
          // };
          // console.log(oPayload);
          MessageToast.show("Calculating Arrival Date and Time ...", { duration: 1200 });

          for (let i = 0; i < selectedPorts.length; i++) {
            let dummySelectedPorts = {
              ArrivalDate: "",
              ArrivalTime: "",
              CargoSize: "",
              CargoUnit: "",
              DepartureDateValue: "",
              DepartureTime: "",
              Distance: "",
              LegId: "",
              PortDays: "",
              PortId: "",
              PortName: "",
              SeaDays: "",
              Speed: "",
              Weather: ""
            }
            dummySelectedPorts.ArrivalDate = selectedPorts[i].ArrivalDate;
            dummySelectedPorts.ArrivalTime = selectedPorts[i].ArrivalTime;
            dummySelectedPorts.CargoSize = selectedPorts[i].CargoSize;
            dummySelectedPorts.CargoUnit = selectedPorts[i].CargoUnit;
            dummySelectedPorts.DepartureDateValue = selectedPorts[i].DepartureDateValue;
            dummySelectedPorts.DepartureTime = selectedPorts[i].DepartureTime;
            dummySelectedPorts.Distance = selectedPorts[i].Distance.toString();
            dummySelectedPorts.LegId = selectedPorts[i].LegId;
            dummySelectedPorts.PortDays = selectedPorts[i].PortDays;
            dummySelectedPorts.PortId = selectedPorts[i].PortId;
            dummySelectedPorts.PortName = selectedPorts[i].PortName;
            dummySelectedPorts.SeaDays = selectedPorts[i].SeaDays;
            dummySelectedPorts.Speed = selectedPorts[i].Speed;
            dummySelectedPorts.Weather = selectedPorts[i].Weather;

            ZCalcNav.push(dummySelectedPorts);
          }


          const oDataModelV4 = this.getOwnerComponent().getModel();
          let oBindList1 = oDataModelV4.bindList("/calculateDateAndTime");
          let data1 = oBindList1.create(
            {
              "ZCalcNav": ZCalcNav
            }
          ).created().then(context => {
            console.log(context);
          });

          oBindList1.attachCreateCompleted((p) => {
            try {
              let p1 = p.getParameters();
              let oContext = p1.context;
              if (p1.success) {
                let ZCalcNav = oContext.getObject().ZCalcNav;
                console.table(ZCalcNav);

                let totalDays = 0;
                // console.log(ZCalcNav[0].Vetad, ZCalcNav[0].Vetat, ZCalcNav[0].Vetdd, ZCalcNav[0].Vetdt, ZCalcNav[1].Vetad, ZCalcNav[1].Vetat, ZCalcNav[1].Vetdd, ZCalcNav[1].Vetdt);

                ZCalcNav.forEach((data, index) => {
                  selectedPorts[index].SeaDays = data.SeaDays;
                  selectedPorts[index].Speed = data.Speed;
                  selectedPorts[index].Weather = data.Weather;
                  selectedPorts[index].ArrivalDate = formatter.dateStringToDateObj(data.ArrivalDate);
                  selectedPorts[index].ArrivalTime = formatter.timeStringToDateObj(data.ArrivalTime);
                  selectedPorts[index].DepartureDate = formatter.dateStringToDateObj(data.DepartureDateValue);
                  selectedPorts[index].DepartureTime = data.DepartureTime;

                  totalDays += Number(selectedPorts[index].SeaDays) + Number(selectedPorts[index].PortDays);
                  oJsonModel.refresh();
                });

                that.byId("daysInput").setValue(totalDays.toFixed(1));
              } else {
                throw new Error(p1.context.oModel.mMessages[""][0].message);
              }
            } catch (error) {
              MessageBox.error(error.message);
              console.error(error.message);
            } finally {
              // bustDialog1.close();
            }
          });


          return
          let oBindList = oDataModelV4.bindList("/ZCalculateSet", true);
          let bustDialog1 = new sap.m.BusyDialog({
            title: "Fetching data",
          });

          bustDialog1.setText("Calculating Arrival Date and Time ..");
          bustDialog1.open();

          oBindList.create(oPayload, true).created(x => {
            console.log(x);
          });
          oBindList.attachCreateCompleted(function (p) {
            try {
              let p1 = p.getParameters();
              let oContext = p1.context;
              if (p1.success) {
                let oData = oContext.getObject();
                console.table(oData.ZCalcNav);

                let totalDays = 0;
                console.log(oData.ZCalcNav[0].Vetad, oData.ZCalcNav[0].Vetat, oData.ZCalcNav[0].Vetdd, oData.ZCalcNav[0].Vetdt, oData.ZCalcNav[1].Vetad, oData.ZCalcNav[1].Vetat, oData.ZCalcNav[1].Vetdd, oData.ZCalcNav[1].Vetdt);

                oData.ZCalcNav.forEach((data, index) => {
                  selectedPorts[index].SeaDays = data.Vsdays;
                  selectedPorts[index].Speed = GvSpeed;
                  selectedPorts[index].Weather = data.Vwead;
                  selectedPorts[index].ArrivalDate = formatter.dateStringToDateObj(data.Vetad);
                  selectedPorts[index].ArrivalTime = formatter.timeStringToDateObj(data.Vetat);
                  selectedPorts[index].DepartureDate = formatter.dateStringToDateObj(data.Vetdd);
                  selectedPorts[index].DepartureTime = data.Vetdt;

                  totalDays += Number(selectedPorts[index].SeaDays) + Number(selectedPorts[index].PortDays);
                  oJsonModel.refresh();
                });

                that.byId("daysInput").setValue(totalDays.toFixed(1));
              } else {
                throw new Error(p1.context.oModel.mMessages[""][0].message);
              }
            } catch (error) {
              MessageBox.error(error.message);
              console.error(error.message);
            } finally {
              bustDialog1.close();
            }
          });
        } catch (error) {
          MessageBox.error("An unexpected error occurred: " + error.message);
          console.error(error);
        }
      },
      onVoyageNameliveChange : function (oEvent) {
        let oSource = oEvent.getSource();
        let sValue = oSource.getValue().trim();
        if ( sValue.length > 40) {
          let stopValue = sValue.substring(0, 40 );
          oSource.setValue( stopValue );
          oSource.setValueState("Error");
          oSource.setValueStateText("Maximum length is 40 Characters");
          
        }
        // Check if the value doesn't match the decimal pattern
        else  {
          oSource.setValueState("None");
          oSource.setValueStateText("");
          
        }

      },


      onVoyageCreate: function (oEvent) {
        that = window.that;

        let headerData = this.getView().getModel("planmodel").getData();
        let selectedPorts = oJsonModel.getData().portData;
        let GvSpeed = selectedPorts[0].Speed;
        let legOneCargoSize = selectedPorts[0].CargoSize;
        let totalCargoSize = 0;

        if (!headerData[0].voynm.trim()) {
          
          MessageBox.error("Please enter Voyage Name.");
          return false;
        }

        if (!headerData[0].voyty) {
          MessageBox.error("Please select Voyage Type.");
          return false;
        }

        if (!headerData[0].carty) {
          MessageBox.error("Please select Cargo Type.");
          return false;
        }

        if (!headerData[0].curty) {
          MessageBox.error("Please select Currency.");
          return false;
        }
        if (!headerData[0].bidty) {
          MessageBox.error("Please select Bidtype ");
          return false;
        }
        for (let i = 0; i < selectedPorts.length; i++) {
          if (!selectedPorts[i].Weather) {
            // MessageBox.error("Please enter Weather ");
            // return false;
            selectedPorts[i].Weather = "0";
          }
          if (!selectedPorts[i].CargoSize) {
            MessageBox.error("Please enter CargoSize ");
            return false;
          }
          if (!selectedPorts[i].CargoUnit) {
            MessageBox.error("Please enter Cargo Unit");
            return false;
          }
          if (!selectedPorts[i].Speed) {
            MessageBox.error("Please enter Speed ");
            return false;
          }
          if( !selectedPorts[i].PortDays){
            MessageBox.error("Please enter Port Days");
            return false;
          }
        }
        if (!selectedPorts[0].DepartureDate) {
          MessageBox.error("Please select Departure Date and Time");
          return false;
        }

        let ZCreatePlanNav = [];


        for (let i = 0; i < selectedPorts.length; i++) {
          ZCreatePlanNav.push({
            Vlegn: selectedPorts[i].LegId,
            Portn: selectedPorts[i].PortName,
            Portc: selectedPorts[i].PortId,
            Pdist: selectedPorts[i].Distance,
            Medst: "NM",
            Vspeed: selectedPorts[i].Speed,

            Ppdays: selectedPorts[i].PortDays,
            Vsdays: selectedPorts[i].SeaDays,
            Vetad: formatter.dateFormatV4(selectedPorts[i].ArrivalDate),
            Vetat: formatter.timeFormatV4(selectedPorts[i].ArrivalTime),
            Vetdd: formatter.dateFormatV4(selectedPorts[i].DepartureDate),
            Vetdt: selectedPorts[i].DepartureTime,
            Vwead: selectedPorts[i].Weather,
            Cargs: selectedPorts[i].CargoSize,
            Cargu: selectedPorts[i].CargoUnit,
          });
          if (i) {
            totalCargoSize += +selectedPorts[i].CargoSize;
          }
        }
        let oPayload = {
          Voynm: headerData[0].voynm.trim().replace(/\s+/g, ' '),
          Voyty: headerData[0].voyty,
          Carty: headerData[0].carty,
          Curr: headerData[0].curty,
          Bidtype: headerData[0].bidty,
          ZCreatePlanNav: ZCreatePlanNav,
        };
        if (totalCargoSize > legOneCargoSize) {
          sap.m.MessageBox.error("The sum of Leg 2 (and onwards) Cargo Size must be less than Leg One Cargo Size", {
            title: "Cargo Size Exceeded",
          });
          return;
        }
        if (totalCargoSize < legOneCargoSize) {
          sap.m.MessageBox.error("Source cargo size not properly distributed", {
            title: "Cargo Size not utilized",
          });
          return;
        }
        console.log("payload for create:", oPayload);

        // oData V4 model Create method
        sap.m.MessageToast.show("Creating Voyage ... ");

        const oDataModelV4 = this.getOwnerComponent().getModel();
        let oRouter = this.getOwnerComponent().getRouter();
        let oBindList = oDataModelV4.bindList("/ZCreatePlanSet", true);

        oBindList.create(oPayload, true).created(x => { console.log(x) });

        oBindList.attachCreateCompleted(function (p) {
          let p1 = p.getParameters();

          let oContext = p1.context;
          let oData = oContext.getObject();
          if (p1.success) {
            // console.log(oData);

            // let statusBindList = oDataModelV4.bindList("/newallstatusesSet");
            // statusBindList.create({
            //   "Voyage": oData.Voyno,
            //   "Status": "Voyage Created"

            // }, true);
            MessageBox.success(`Successfully created voyage - ${oData.Voyno}`, {
              title: "Voyage Created",
              onClose: function () {

                console.log("sent voyage no. :", oData.Voyno)

                oRouter.navTo("RouteTrChangeVoyage", {
                  "VOYAGE_NO": oData.Voyno
                });

              }
            });

          } else {
            sap.m.MessageBox.error("Error occurred in creating Voyage");
            console.log("error messages : ", oContext.getMessages());
          }
        });


      },

      navToFreightSim1: function (oEvent) {
        oJsonModel.refresh();
        let legOneCargoSize = oJsonModel.getData().portData[0].CargoSize;
        let legTwoCargoSize = oJsonModel.getData().portData[1].CargoSize;


        let totalCargoSize = oJsonModel.getData().portData.reduce((acc, item, index) => {
          return (acc = +acc + (index > 0 ? +item.CargoSize : 0));
        }, 0);
        let oRouter = this.getOwnerComponent().getRouter();
        if (totalCargoSize > legOneCargoSize) {
          sap.m.MessageBox.error("The sum of Leg 2 (and onwards) Cargo Size must be less than Leg One Cargo Size", {
            title: "Cargo Size Exceeded",
          });
          return;
        } else if (totalCargoSize < legOneCargoSize) {
          sap.m.MessageBox.error("The sum of Leg 2 (and onwards) Cargo Size must be equal to Leg One Cargo Size", {
            title: "Total Cargo Size subceeded",
          });
          return
        }
        oRouter.navTo("freightsim");
      },
      navToFreightSim: function (oEvent) {

        oJsonModel.refresh();

        let legOneCargoSize = oJsonModel.getData().portData[0].CargoSize;
        let totalCargoSize = oJsonModel.getData().portData.reduce((acc, item, index) => {
          return (acc = +acc + (index > 0 ? +item.CargoSize : 0));
        }, 0);

        let oRouter = this.getOwnerComponent().getRouter();
        if (totalCargoSize > legOneCargoSize) {
          sap.m.MessageBox.error("The sum of Leg 2 (and onwards) Cargo Size must be less than Leg One Cargo Size", {
            title: "Cargo Size Exceeded",
          });
          return;
        } else if (totalCargoSize < legOneCargoSize) {
          sap.m.MessageBox.error("The sum of Leg 2 (and onwards) Cargo Size must be equal to Leg One Cargo Size", {
            title: "Total Cargo Size subceeded",
          });
          return
        } else if (legOneCargoSize === "" || totalCargoSize === "") {
          sap.m.MessageBox.error("It is mandatory to fill cargo sizes for  all the ports", {
            title: "Cargo Size not Defined",
          });
          return
        }
        oRouter.navTo("freightsim");
      },


      // TODO
      
      validateInputValue: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        // Remove leading zeros, but keep the number as "0" if the input was "0"
        sValue = sValue.replace(/^0+(?!\.|$)/, '');
        // Set the modified value back to the input field
        oInput.setValue(sValue);

        // Regular expression to allow positive decimal numbers with up to 3 digits after the decimal
      
        var oRegex = /^[0-9]\d*(\.\d{0,3})?$/;

        // Check if the value is negative
        if (parseFloat(sValue) < 0) {
          oInput.setValueState("Error");
          oInput.setValueStateText("Negative values are not allowed.");
        }
        // Check if the value doesn't match the decimal pattern
        else if (!oRegex.test(sValue)) {
          oInput.setValueState("Error");
          oInput.setValueStateText("Please enter a valid positve number with up to 3 decimal places.");
        }
        // If the value is valid, clear any error state
        else {
          oInput.setValueState("None");
          oInput.setValueStateText("");
        }
      },
      onPortTabCargoSizeChange: function (oEvent) {
        let oSource = oEvent.getSource();
        let CargoSizePathInModel = oSource.getBindingContext("oJsonModel").getPath();
        let path = oSource.getBindingContext("oJsonModel").getPath();
        let value = oEvent.getParameter("value");
        // Regular expression to allow positive decimal numbers with up to 3 digits after the decimal
        var oRegex = /^\d*\.?\d{0,3}$/;
        if (parseFloat(value) < 0) {
          oSource.setValueState("Error");
          oSource.setValueStateText("Negative values are not allowed.");
          return
        }
        // Check if the value doesn't match the decimal pattern
        else if (!oRegex.test(value)) {
          oSource.setValueState("Error");
          oSource.setValueStateText("Please enter a valid number with up to 3 decimal places.");
          return
        }
        // If the value is valid, clear any error state
        else {
          oSource.setValueState("None");
          oSource.setValueStateText("");
        }
        // removing "," from "12,000.00"
        let formatedValue = value.replace(/\,/g, '');
        oJsonModel.setProperty(path + "/CargoSize", formatedValue);
        if (path == "/portData/0" && oJsonModel.getData().portData.length === 2) {
          oJsonModel.getData().portData[1].CargoSize = formatedValue;
          oJsonModel.refresh();
        }

      },


      onSpeedInputChange: function (oEvent) {


        var oData = oJsonModel.getData();
        var newSpeed = oEvent.getParameter("value");

        // Loop through portData and update the Speed, except for the first port
        for (var i = 1; i < oData.portData.length; i++) {
          oData.portData[i].Speed = newSpeed;
        }

        // Ensure the first port's speed is fixed at 0
        oData.portData[0].Speed = "0";

        oJsonModel.refresh();
      },

      onVoyTyHelpRequest: function (oEvent) {
        let voyageModel = this.getOwnerComponent().getModel("voyagetypes");
        // console.log(voyageModel);
        var aCols = {
          cols: [
            {
              label: "Voyage Type",
              template: "sVoyageType",
            },
            {
              label: "Description",
              template: "sVoyageTypeText",
            },
          ],
        };
        let oColModel = new JSONModel(aCols);
        this._oVoyTyHelpDialog = sap.ui.xmlfragment("com.ingenx.nauti.createvoyage.view.VoyageTypes", this);
        this.getView().addDependent(this._oVoyTyHelpDialog);

        this._oVoyTyHelpDialog.getTableAsync().then(
          function (oTable) {
            oTable.setModel(voyageModel);
            oTable.setModel(oColModel, "columns");

            if (oTable.bindRows) {
              // oTable.bindAggregation("rows", "/sVoyageTypes");
              oTable.bindAggregation("rows", "/sVoyageTypes");
            }

            if (oTable.bindItems) {
              oTable.bindAggregation("items", "/sVoyageTypes", function () {
                return new ColumnListItem({
                  cells: aCols.map(function (column) {
                    return new Label({
                      text: "{" + column.template + "}",
                    });
                  }),
                });
              });
            }
            this._oVoyTyHelpDialog.update();
          }.bind(this)
        );

        // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
        this._oVoyTyHelpDialog.open();
      },

      onVoyTyHelpOkPress: function (oEvent) {
        let aTokens = oEvent.getParameter("tokens");
        console.log(aTokens);
        this.getView().getModel("planmodel").setProperty("/0/voyty", aTokens[0].getKey());
        this._oVoyTyHelpDialog.close();
      },

      onVoyTyHelpCancelPress: function (oEvent) {
        this._oVoyTyHelpDialog.close();
      },

      onVoyTyHelpAfterClose: function (oEvent) {
        this._oVoyTyHelpDialog.destroy();
      },

      onCarTyHelpRequest: function (oEvent) {
        let cargomodel = this.getOwnerComponent().getModel("cargotypes");
        var aCols = {
          cols: [
            {
              label: "Vessel Type",
              template: "sCargoType",
            },
            {
              label: "Description",
              template: "sCargoTypeText",
            },
          ],
        };
        let oColModel = new JSONModel(aCols);
        this._oCarTyHelpDialog = sap.ui.xmlfragment("com.ingenx.nauti.createvoyage.view.CargoTypes", this);
        this.getView().addDependent(this._oCarTyHelpDialog);

        this._oCarTyHelpDialog.getTableAsync().then(
          function (oTable) {
            oTable.setModel(cargomodel);
            oTable.setModel(oColModel, "columns");

            if (oTable.bindRows) {
              oTable.bindAggregation("rows", "/sCargoTypes");
            }

            if (oTable.bindItems) {
              oTable.bindAggregation("items", "/sCargoTypes", function () {
                return new ColumnListItem({
                  cells: aCols.map(function (column) {
                    return new Label({
                      text: "{" + column.template + "}",
                    });
                  }),
                });
              });
            }
            this._oCarTyHelpDialog.update();
          }.bind(this)
        );

        // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
        this._oCarTyHelpDialog.open();
      },

      onCarTyHelpOkPress: function (oEvent) {
        let aTokens = oEvent.getParameter("tokens");
        // console.log(aTokens);
        this.getView().getModel("planmodel").setProperty("/0/carty", aTokens[0].getKey());
        this._oCarTyHelpDialog.close();
      },

      onCarTyHelpCancelPress: function (oEvent) {
        this._oCarTyHelpDialog.close();
      },

      onCarTyHelpAfterClose: function (oEvent) {
        this._oCarTyHelpDialog.destroy();
      },

      onCargoUnitHelpRequest: function (oEvent) {
        this._oCargoInputSource = oEvent.getSource();
        let cargounitmodel = this.getOwnerComponent().getModel("cargounit");
        var aCols = {
          cols: [
            {
              label: "Cargo Unit",
              template: "sCargoUnit",
            },
            {
              label: "Description",
              template: "sCargoUnitText",
            },
          ],
        };
        let oColModel = new JSONModel(aCols);
        this._oCargoUnitHelpDialog = sap.ui.xmlfragment("com.ingenx.nauti.createvoyage.view.CargoUnit", this);
        this.getView().addDependent(this._oCargoUnitHelpDialog);

        this._oCargoUnitHelpDialog.getTableAsync().then(
          function (oTable) {
            oTable.setModel(cargounitmodel);
            oTable.setModel(oColModel, "columns");

            if (oTable.bindRows) {
              oTable.bindAggregation("rows", "/sCargoUnits");
            }

            if (oTable.bindItems) {
              oTable.bindAggregation("items", "/sCargoUnits", function () {
                return new ColumnListItem({
                  cells: aCols.map(function (column) {
                    return new Label({
                      text: "{" + column.template + "}",
                    });
                  }),
                });
              });
            }
            this._oCargoUnitHelpDialog.update();
          }.bind(this)
        );

        // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
        this._oCargoUnitHelpDialog.open();
      },
      // {
      // Voyno: "1000000034",
      // Vlegn: "0000000001",
      // Costcode: "1001",
      // Costu: "LSUM",
      // Prcunit: "",
      // Procost: 10000,
      // Costcurr: "INR",
      // Cstcodes: "PORT CHARGES",
      // CostCheck: false
      // },

      onCargoUnitHelpOkPress: function (oEvent) {
        let aTokens = oEvent.getParameter("tokens");
        // console.log(aTokens);
        this._oCargoInputSource.setValue(aTokens[0].getKey());

        // making all the cargoUnit  value same as for port 
        let allRowData = oJsonModel.getData().portData;
        allRowData.forEach(row => {

          row.CargoUnit = aTokens[0].getKey();
        })
        // this.getView()
        //   .getModel("jsonmodel")
        //   .setProperty("/0/carty", aTokens[0].getKey());
        this._oCargoUnitHelpDialog.close();
      },

      onCargoUnitHelpCancelPress: function (oEvent) {
        this._oCargoUnitHelpDialog.close();
      },

      onCargoUnitHelpAfterClose: function (oEvent) {
        this._oCargoUnitHelpDialog.destroy();
        this._oCargoInputSource = undefined;
      },

      onCurTyHelpRequest: function (oEvent) {
        let currencymodel = this.getOwnerComponent().getModel("currencytypes");
        var aCols = {
          cols: [
            {
              label: "Currency Type",
              template: "sCurrencyType",
            },
            {
              label: "Country",
              template: "sCurrencyTypeText",
            },
          ],
        };
        let oColModel = new JSONModel(aCols);
        this._oCurTyHelpDialog = sap.ui.xmlfragment("com.ingenx.nauti.createvoyage.view.CurrencyTypes", this);
        this.getView().addDependent(this._oCurTyHelpDialog);

        this._oCurTyHelpDialog.getTableAsync().then(
          function (oTable) {
            oTable.setModel(currencymodel);
            oTable.setModel(oColModel, "columns");

            if (oTable.bindRows) {
              oTable.bindAggregation("rows", "/sCurrencyTypes");
            }

            if (oTable.bindItems) {
              oTable.bindAggregation("items", "/sCurrencyTypes", function () {
                return new ColumnListItem({
                  cells: aCols.map(function (column) {
                    return new Label({
                      text: "{" + column.template + "}",
                    });
                  }),
                });
              });
            }
            this._oCurTyHelpDialog.update();
          }.bind(this)
        );

        // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
        this._oCurTyHelpDialog.open();
      },

      getLatLongForPort: function (postMasterData, portCode) {
        for (const portData of postMasterData) {
          if (portData.Portc === portCode) {
            return { Latitude: portData.Latitude, Longitude: portData.Longitude };
          }
        }
        return null; // If no match found
      },


      onCurTyHelpOkPress: function (oEvent) {
        let aTokens = oEvent.getParameter("tokens");
        // console.log(aTokens);
        this.getView().getModel("planmodel").setProperty("/0/curty", aTokens[0].getKey());
        this._oCurTyHelpDialog.close();
      },

      onCurTyHelpCancelPress: function (oEvent) {
        this._oCurTyHelpDialog.close();
      },

      onCurTyHelpAfterClose: function (oEvent) {
        this._oCurTyHelpDialog.destroy();
      },

      onBidTyHelpRequest: function (oEvent) {
        let currencymodel = this.getOwnerComponent().getModel("bidtypes");
        var aCols = {
          cols: [
            {
              label: "Bidding Type",
              template: "sBidType",
            },
            {
              label: "Description",
              template: "sBidTypeText",
            },
          ],
        };
        let oColModel = new JSONModel(aCols);
        this._oBidTyHelpDialog = sap.ui.xmlfragment("com.ingenx.nauti.createvoyage.view.BiddingTypes", this);
        this.getView().addDependent(this._oBidTyHelpDialog);

        this._oBidTyHelpDialog.getTableAsync().then(
          function (oTable) {
            oTable.setModel(currencymodel);
            oTable.setModel(oColModel, "columns");

            if (oTable.bindRows) {
              oTable.bindAggregation("rows", "/sBidTypes");
            }

            if (oTable.bindItems) {
              oTable.bindAggregation("items", "/sBidTypes", function () {
                return new ColumnListItem({
                  cells: aCols.map(function (column) {
                    return new Label({
                      text: "{" + column.template + "}",
                    });
                  }),
                });
              });
            }
            this._oBidTyHelpDialog.update();
          }.bind(this)
        );

        // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
        this._oBidTyHelpDialog.open();
      },

      onBidTyHelpOkPress: function (oEvent) {
        let aTokens = oEvent.getParameter("tokens");
        // console.log(aTokens);
        this.getView().getModel("planmodel").setProperty("/0/bidty", aTokens[0].getKey());
        this._oBidTyHelpDialog.close();
      },

      onBidTyHelpCancelPress: function (oEvent) {
        this._oBidTyHelpDialog.close();
      },

      onBidTyHelpAfterClose: function (oEvent) {
        this._oBidTyHelpDialog.destroy();
      },
      // Event handler for the button press
      onZoomButtonPress: function () {



      }

    });
  }
);