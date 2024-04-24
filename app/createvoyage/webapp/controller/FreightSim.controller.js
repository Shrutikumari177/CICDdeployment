sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "com/ingenx/nauti/createvoyage/model/formatter",
      "com/ingenx/nauti/createvoyage/utils/bufferedEventHandler",
    ],
    function (Controller, JSONModel, formatter, bufferedEventHandler) {
      "use strict";
  
      let pertModel, lumpsumModel, toNMModel;
      
      return Controller.extend("com.ingenx.nauti.createvoyage.controller.FreightSim", {
        formatter: formatter,
        onInit: function () {
          let oRouter = this.getOwnerComponent().getRouter();
          this.initLiveChangeCalculationBuffer();
          oRouter.getRoute("freightsim").attachPatternMatched(this._onObjectMatched, this);
          this.byId("pertFCost").setValue("");
          this.byId("lumpsumFCost").setValue("");
          this.byId("tonNMFCost").setValue("");
        },
  
        initLiveChangeCalculationBuffer: function () {
          let PertInputField = this.byId("pertFCost");
          let LumpsumInputField = this.byId("lumpsumFCost");
          let TonNMInputField = this.byId("tonNMFCost");
  
          bufferedEventHandler.bufferEvents(
            PertInputField,
            500,
            "liveChange",
            null,
            this.pertFCostChange,
            this,
            this.pertCalcProgress,
            null
          );
          bufferedEventHandler.bufferEvents(
            LumpsumInputField,
            500,
            "liveChange",
            null,
            this.lumpsumFCostChange,
            this,
            this.lsumCalcProgress,
            null
          );
          bufferedEventHandler.bufferEvents(
            TonNMInputField,
            500,
            "liveChange",
            null,
            this.tonNMFCostChange,
            this,
            this.tonNMCalcProgress,
            null
          );
        },
        _onObjectMatched: function (oEvent) {
          let portData = this.getOwnerComponent().getModel("oJsonModel").getData().portData;
          // console.log(portData);
          pertModel = new JSONModel(portData);
          lumpsumModel = new JSONModel(portData);
          toNMModel = new JSONModel(portData);
          this.getView().setModel(pertModel, "pertmodel");
          this.getView().setModel(lumpsumModel, "lumpsummodel");
          this.getView().setModel(toNMModel, "tonmmodel");
          this.byId("pertFCost").setValue("");
          this.byId("lumpsumFCost").setValue("");
          this.byId("tonNMFCost").setValue("");
          this.byId("tonNMTotalCost").setValue("");
          this.byId("lumpsumTotalCost").setValue("");
          this.byId("pertTotalCost").setValue("");

        },
  
        pertFCostChange: function (oEvent) {
          let progressIndicator = this.byId('progressIndicatorPert');
          try {
            const FCost = oEvent.getParameter("value") || 0;
            // if (FCost) {
            const pertPortData = this.getView().getModel("pertmodel").getData();
            let totalCost = 0,
              tempCost = 0;
            pertPortData.forEach((element, index, arr) => {
              if (index === 1) {
                tempCost = Number(Decimal(element.CargoSize).mul(FCost).toString());
              } else if (index > 1) {
                tempCost = Number(
                  Decimal(arr[index - 2].CargoSize)
                    .sub(arr[index - 1].CargoSize)
                    .mul(FCost)
                    .toString()
                );
              }
              pertPortData[index].FreightCost = tempCost;
              pertPortData[index].OtherCost = 0;
              pertPortData[index].PortProjectedCost = Decimal(tempCost).add(pertPortData[index].OtherCost);
              totalCost += tempCost;
              tempCost = 0;
              pertModel.refresh();
            });
            this.byId("pertTotalCost").setValue(formatter.costFormat(totalCost));
            progressIndicator.setState("Success");
            // } else {
            //   this.byId("pertTotalCost").setValue(formatter.costFormat(0));
            // }
          } catch (error) {
            progressIndicator.setState("Error");
            throw new Error(error);
          }
        },
  
        pertCalcProgress: function(progress) {
          let progressIndicator = this.byId('progressIndicatorPert');
          progressIndicator.setState("Information");
          let percentValue = progress*100;
          progressIndicator.setPercentValue(percentValue);
        },
  
        lumpsumFCostChange: function (oEvent) {
          let progressIndicator = this.byId('progressIndicatorLSUM');
          try {
            const FCost = oEvent.getParameter("value") || 0;
  
            // if (FCost) {
            const lumpsumPortData = this.getView().getModel("lumpsummodel").getData();
            let totalCost = 0,
              last = 0,
              tempCost = 0;
            lumpsumPortData.forEach((element, index) => {
              if (last) {
                tempCost = Number(Decimal(FCost).div(last).mul(element.CargoSize).toString());
              } else {
                last = element.CargoSize;
              }
              lumpsumPortData[index].FreightCost = tempCost;
              lumpsumPortData[index].OtherCost = 0;
              lumpsumPortData[index].PortProjectedCost = Decimal(tempCost).add(lumpsumPortData[index].OtherCost);
              totalCost += tempCost;
              tempCost = 0;
              lumpsumModel.refresh();
            });
            this.byId("lumpsumTotalCost").setValue(formatter.costFormat(totalCost));
            progressIndicator.setState("Success")
            // } else {
            //   this.byId("lumpsumTotalCost").setValue(formatter.costFormat(0));
            // }
          } catch (error) {
            progressIndicator.setState("Error");
            throw new Error(error);
          }
        },
  
        lsumCalcProgress: function(progress){
          let progressIndicator = this.byId('progressIndicatorLSUM');
          progressIndicator.setState("Information");
          let percentValue = progress*100;
          progressIndicator.setPercentValue(percentValue);
        },
  
        tonNMFCostChange: function (oEvent) {
          let progressIndicator = this.byId('progressIndicatorTonNM');
          try {
            const FCost = oEvent.getParameter("value") || 0;
            // if (FCost) {
            const toNMPortData = this.getView().getModel("tonmmodel").getData();
            let totalCost = 0,
              tempCost = 0;
            toNMPortData.forEach((element, index) => {
              tempCost = Number(Decimal(FCost).mul(element.CargoSize).mul(element.Distance).toString());
              toNMPortData[index].FreightCost = tempCost;
              toNMPortData[index].OtherCost = 0;
              toNMPortData[index].PortProjectedCost = Decimal(tempCost).add(toNMPortData[index].OtherCost);
              totalCost += tempCost;
              tempCost = 0;
              toNMModel.refresh();
            });
            this.byId("tonNMTotalCost").setValue(formatter.costFormat(totalCost));
            progressIndicator.setState("Success");
            // } else {
            //   this.byId("tonNMTotalCost").setValue(formatter.costFormat(0));
            // }
          } catch (error) {
          progressIndicator.setState("Error");
            throw new Error(error);
          }
        },
        tonNMCalcProgress: function(progress){
          let progressIndicator = this.byId('progressIndicatorTonNM');
          progressIndicator.setState("Information");
          let percentValue = progress*100;
          progressIndicator.setPercentValue(percentValue);
        },
      });
    }
  );
  