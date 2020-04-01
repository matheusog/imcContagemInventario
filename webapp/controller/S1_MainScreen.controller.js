sap.ui.define([
	"imc/sap/mm/contageminventario/controller/BaseController",
	"sap/ui/core/UIcomponent", 
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/Device",
	"imc/sap/mm/contageminventario/model/models", 
	"imc/sap/mm/contageminventario/model/formatter",
	"sap/ui/util/Storage"
], function(BaseController, UIcomponent, MessageBox, Filter, Device, Models, Formatter, Storage) {
	"use strict";

	return BaseController.extend("imc.sap.mm.contageminventario.controller.S1_MainScreen", {
		
		oFormatter: Formatter,
		
		oStorage: Storage,
		
		onInit: function(){
			this.getRouter().getRoute("S1_MainScreen").attachMatched(this._routeMatched, this);
			
			this._createInitialViews(); 
			
			this._oNavContainer 	= this.byId("idAppControl");
			this._oToolPage			= this.byId("pageS1MainScreen");
			this._oResourceBundle	= this.getOwnerComponent().getModel('i18n').getResourceBundle();
			this.oStorage = new Storage(Storage.Type.local, "imcLocalDB");
			this.byId("listMaterial").getBinding("items").attachChange(e => this._bindingUpdated(e));
			//this._oViewMain.setProperty("/visible", true);
			
			/*
			(function($) {
			  $.fn.inputFilter = function(inputFilter) {
			    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
			      if (inputFilter(this.value)) {
			        this.oldValue = this.value;
			        this.oldSelectionStart = this.selectionStart;
			        this.oldSelectionEnd = this.selectionEnd;
			      } else if (this.hasOwnProperty("oldValue")) {
			        this.value = this.oldValue;
			        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			      } else {
			        this.value = "";
			      }
			    });
			  };
			}(jQuery));
			*/
			/*
			var oInput = this.getView().byId("inputIncrement");
			oInput.addEventDelegate({
				onAfterRendering: function(oEvent) {
					if(sap.m.Input.prototype.onAfterRendering) {
		    			sap.m.Input.prototype.onAfterRendering.apply(this, arguments);
		    		} 
		    		var oDOMEl = document.getElementById(oEvent.srcControl.getId()); 
		    		oDOMEl.firstChild.firstElementChild.type	= "number";
		    		oDOMEl.firstChild.firstElementChild.pattern = "\\d*"; //"/^-?\d*[,]?\d*$/"
				}
			})
			*/
			/*
			var oInput = this.getView().byId("inputIncrement");
			$(document).ready(function() {
				$("#" + oInput.getId()).inputFilter(function(value) {
					return /^-?\d*[,]?\d*$/.test(value); });
			} );
			*/
			var oInput = this.getView().byId("inputIncrement");
			oInput.addEventDelegate({
				onAfterRendering: function(oEvent) {
					if(sap.m.Input.prototype.onAfterRendering) {
		    			sap.m.Input.prototype.onAfterRendering.apply(this, arguments);
		    		} 
		    		oEvent.srcControl.$().keydown(function(evt){
						return (evt.keyCode !== 190);
					});
				}
			});
		},
		
		onAfterNavigate: function(oEvent) {
			var sId = oEvent.getParameter("toId");
			sId = sId.substring(sId.lastIndexOf("S1_MainScreen--") + 15);
			this._defineInitialFocus(sId); 
		}, 
		
		onDataChangeModel: function(oEvent){
			var o2= oEvent.getParameters();
			var stData = this._oViewListaMaterial.getProperty("/materiais");
			this.oStorage.put("materiais",stData);
		},
		
		_bindingUpdated: function(oEvent){
			var o1 = oEvent.getParameters();
			var aData = oEvent.getSource().getModel().getProperty("/materiais");
			if(aData && aData.length > 0) {
				this.oStorage.put("materiais", aData);
			}
		},
		
		_back : function(oEvent) {
			if(this._oViewContMaterial.getProperty("/material/Input")){
				this._oViewContMaterial.setProperty("/material/QuantityCount",this._oViewContMaterial.getProperty("/material/Input"));
			}
			/*if(this._oViewContMaterial.getProperty("/originalCount")){
				this._oViewContMaterial.setProperty("/material/QuantityCount",this._oViewContMaterial.getProperty("/originalCount"));
			}*/
			this._oViewContMaterial.setProperty("/material/Input", ''); 
			this._oViewContMaterial.setProperty("/material/InputIncrement", '');
			this._oNavContainer.back();	
			this._oViewContagem.setProperty("/inMaterial", '');
			//this.getView().byId("txb_Codigo").focus();
			if(this._oNavContainer.currentPageIsTopPage()) {
				this._initialize(); 
			}
		},
		
		_callSuccess : function(oXmlHttpReq, fnCallback, fnError, oResponse) {
			if(oXmlHttpReq.status && oXmlHttpReq.status >= 400){
				if(fnError) {
					fnError(this);
				} else {
					this._genericErrorDisplay(oXmlHttpReq);
				}
			} else {
				if(fnCallback) {
					fnCallback(oXmlHttpReq);
				}
			}
		}, 
		
		_callFinished : function(oResponse) {
		
		},
		
		_callFailed : function(oXmlHttpReq, fnError, oResponse) {
			this._genericErrorDisplay(oXmlHttpReq);
			fnError(this);
		}, 
		
		_callCanceled : function(oXmlHttpReq, fnError, oResponse){
			this._genericErrorDisplay(oXmlHttpReq);
			fnError(this);
		}, 
		
		_createInitialViews : function() {
			this._oViewMain = Models.createViewModel();
			var oCentro = { "Plant": undefined , "PlantName": undefined };
			this._oViewMain.setProperty("/centro", oCentro);
			this.getView().setModel(this._oViewMain, "viewMain");
			
			this._oViewContagem = Models.createViewModel();
			this.getView().setModel(this._oViewContagem, "viewContagem");
			
			this._oViewContMaterial = Models.createViewModel();
			this.getView().setModel(this._oViewContMaterial, "viewContMaterial");
			
			this._oViewListaMaterial = Models.createViewModel();
			this.getView().setModel(this._oViewListaMaterial, "viewListaMaterial");
		}, 
		
		_defineInitialFocus: function(sKey) {
			var oInput = undefined;
			switch(sKey) {
				case "S2_Contagem":
					oInput = this.getView().byId("txb_Codigo");
					break;
				case "S3_ContarMaterial": 
					oInput = this.getView().byId("inputIncrement");
					break;
			}
			
			if(oInput) {
				jQuery.sap.delayedCall(500, this, function() {
					oInput.focus();
				});
				/*
				oInput.addEventDelegate({
					onAfterRendering: function(oEvent) {
						oEvent.srcControl.focus();
					}
				});
				*/
			}
		},
		
		_handleFilterDialogConfirm : function(oEvent) {
			var oList = this.byId("listMaterial"),
				oBinding = oList.getBinding("items"),
				mParams = oEvent.getParameters(),
				aFilters = [], 
				aFiltersCurrent = [];
			
			//if(oBinding.aFilters) {
			if(this._oViewListaMaterial.getProperty("/filterMaterial")) {
				aFiltersCurrent = this._oViewListaMaterial.getProperty("/filterMaterial");
			}
			
			mParams.filterItems.forEach(function(oItem) {
				var oFilter = undefined,
					sOperator = sap.ui.model.FilterOperator.EQ,
					sPath = "Processed",
					sValue1 = true;
					//sPath = "UnitCount",
					//sValue1 = "";	
				if(oItem.getKey() === "contOrig"){
					sOperator = sap.ui.model.FilterOperator.NE;
					oFilter = new Filter(sPath, sOperator, sValue1, null);
				} else if (oItem.getKey() === "contAlter") {
					//sOperator = sap.ui.model.FilterOperator.NE;
					oFilter = new Filter(sPath, sOperator, sValue1, null);
				}
				if(oFilter){
					aFilters.push(oFilter);
				}
				
			});
			
			this._oViewListaMaterial.setProperty("/filterUnit", aFilters);
			aFilters = $.extend([], aFilters);
			if(aFiltersCurrent){
				aFiltersCurrent.forEach( oObj => aFilters.push(oObj) );
			}
			
			oBinding.filter(aFilters);
		}, 
		
		_handleSearchMaterial : function(oEvent) {
			var sQuery = oEvent.getParameter("query");	
			//var sQuery = oEvent.getSource().getValue();
			var oList = this.byId("listMaterial"); 
			var oBinding = oList.getBinding("items");
			var aFilters = [], 
				aFiltersCurrent = [];
			
			//if(oBinding.aFilters) {
			if(this._oViewListaMaterial.getProperty("/filterUnit")) {
				aFiltersCurrent = this._oViewListaMaterial.getProperty("/filterUnit");
			}
			if (sQuery && sQuery.length > 0) {
				var oFilter = new Filter({
					filters: [
						new Filter("MaterialName", sap.ui.model.FilterOperator.Contains, sQuery),
						new Filter("Material", sap.ui.model.FilterOperator.Contains, sQuery)
					], 
					and: false
				}); 
				aFilters.push(oFilter);
			}
			
			this._oViewListaMaterial.setProperty("/filterMaterial", aFilters);
			aFilters = $.extend([], aFilters);
			if(aFiltersCurrent){
				aFiltersCurrent.forEach( oObj => aFilters.push(oObj) );
			}
			oBinding.filter(aFilters);
		}, 
		
		_genericErrorDisplay : function(oResponse) {
			if(oResponse && oResponse.response){
				var oData = JSON.parse(oResponse.response);
			}
			
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			
			if(oData) {
				if(oData.error && oData.error.message){
					var sMsg = oData.error.message;
					if(oData.error.message.value) {
						sMsg = oData.error.message.value;
					}
                    MessageBox.show( sMsg, 
						{
							icon: sap.m.MessageBox.Icon.ERROR,
							title: this._oResourceBundle.getText("msgError"),
							actions: [sap.m.MessageBox.Action.CLOSE],
							id: "msgGenericError",
							details: oData,
							styleClass: bCompact ? "sapUiSizeCompact" : "",
							contentWidth: "auto"

					});
				} else {

					MessageBox.show( this._oResourceBundle.getText("msgGenericError"), 
						{
							icon: sap.m.MessageBox.Icon.ERROR,
							title: this._oResourceBundle.getText("msgError"),
							actions: [sap.m.MessageBox.Action.CLOSE],
							id: "msgGenericError",
							details: oData,
							styleClass: bCompact ? "sapUiSizeCompact" : "",
							contentWidth: "auto"

					});
				}
			} else {
				MessageBox.show( this._oResourceBundle.getText("msgGenericError"), 
					{
						icon: sap.m.MessageBox.Icon.ERROR,
						title: this._oResourceBundle.getText("msgError"),
						actions: [sap.m.MessageBox.Action.CLOSE],
						id: "msgGenericError",
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						contentWidth: "auto"
	
				});
			}
		}, 
		
		_getContagemInitFilter : function(sCentro, bInvLoad) {
			var sFilter = 
				"(PostingDate lt datetime'0001-01-01T00:00:00')";
			
			if(bInvLoad) {
				sFilter = `${sFilter} and CountFinished eq false`
			}
			
			return sCentro && sCentro.trim() !== '' ?
				`(${sFilter} and Plant eq '${sCentro}')` : 
				sFilter;
					
		}, 
		
		_initialize : function() {
			this._oViewContagem.setProperty("/inMaterial", '');
			this._oViewContagem.setProperty("/contagem", {});
			this._oViewContMaterial.setProperty("/material", {}); 
			this._oViewContMaterial.setProperty("/unidades", []);
			this._oViewListaMaterial.setProperty("/materiais", []);
		}, 
		
		_navPage : function(sKey, sType, bOffline) {
				
				var sCentro = this._oViewMain.getProperty("/centro/Plant");
				if(!this._oViewMain.getProperty("/centro/Plant") && sType !== "Offline" ) {
					this._onConfigPress(null, this._navPage.bind(this, sKey, sType, bOffline));
				} else {
					function navToOffline(sKey) {
						this._oNavContainer.to(this.getView().createId(sKey));
						//this._defineInitialFocus(sKey);
						
						if(this._oToolPage.getSideExpanded()) {
							this._oToolPage.setSideExpanded(!this._oToolPage.getSideExpanded());
						} 
						if(sType === "Offline"){
							this._oViewMain.setProperty("/centro", this.oStorage.get("centro"));
							this._oViewListaMaterial.setProperty("/materiais", this.oStorage.get("materiais"));
							var contagem = this.oStorage.get("contagem");
							contagem.PhysInventoryPlannedCountDate = new Date(contagem.PhysInventoryPlannedCountDate);
							this._oViewContagem.setProperty("/contagem", contagem);
							this._oViewMain.setProperty("/busy",false);
							//this.afterLoading(sKey);
						}
					}
					function navToOnline(sKey) {
						navToOffline.bind(this)(sKey);
						this._readInvent(sCentro);	
						this._oViewMain.setProperty("/busy", false);
						//this.afterLoading(sKey);
					}
					
					if(bOffline || sType === "Offline") {
						navToOffline.bind(this)(sKey);
					} else {
						this._oViewMain.setProperty("/busy", true);
						
						var oPromise = new Promise(function(resolve, reject) {
								this._readPlannedCountDate(sCentro, resolve, reject);
							}.bind(this)
						);
						
						oPromise
							.then(navToOnline.bind(this, sKey), 
								function(oResponse) {
									this._genericErrorDisplay(oResponse); 
									this._oViewMain.setProperty("/busy", false);
									//this.afterLoading(sKey);
								}.bind(this)
							);
					}
				}
		}, 
		
		_onCancelCentro : function(oEvent) {
			this._oViewMain.setProperty("/centroState", undefined);
			this._oViewMain.setProperty("/centroStateMsg", undefined);
			
			this._oDialogCentro.close();
			this._oViewMain.setProperty("/centro/Plant", this._oViewMain.getProperty("/centroOld"));
			if(this._fnCallback) { 
				this._fnCallback		= undefined;
			}
			
		},
		
		_onConfigPress : function(oEvent, fnCallback) {
			if (!this._oDialogCentro) {
				this._oDialogCentro = 
					sap.ui.xmlfragment(this.getView().getId(), "imc.sap.mm.contageminventario.view.fragment.F1_PopUpCentro", this);
				if (Device.system.desktop) {
					this._oDialogCentro.addStyleClass("sapUiSizeCompact");
				}
				this.getView().addDependent(this._oDialogCentro);
				var oInput = this.getView().byId('inCentro');
				oInput.addEventDelegate({
					onAfterRendering: function(oEvent) {
						jQuery.sap.delayedCall(500, this, function() {
							oEvent.srcControl.focus();
						});
						
					}
				});
			}
			if(this._oViewMain.getProperty("/centro/Plant")) {
				this._oViewMain.setProperty("/centroOld", this._oViewMain.getProperty("/centro/Plant"));	
			}
			if(fnCallback){
				this._fnCallback		= fnCallback;
			}
			this._oDialogCentro.open();
		},
		
		_onConfirmCentro : function(oEvent) {
			this._oViewMain.setProperty("/busy", true);
			this._initialize();
			this._oViewMain.setProperty("/centro/Plant",this._oViewMain.getProperty("/centro/Plant").toUpperCase());
			var sCentro = this._oViewMain.getProperty("/centro/Plant");
			this._readDataPlant(sCentro);
			this._oNavContainer.to(this.getView().createId("S1_empty"));
		},
		
		_onFilterListPress : function(oEvent) {
			if (!this._oFDialogList) {
				this._oFDialogList = 
					sap.ui.xmlfragment("imc.sap.mm.contageminventario.view.fragment.F2_MaterialListFilterDialog", this);
				if (Device.system.desktop) {
					this._oFDialogList.addStyleClass("sapUiSizeCompact");
				}
				this.getView().addDependent(this._oFDialogList);
			}
		
			this._oFDialogList.open();	
		}, 
		
		_onNavItem : function(oEvent) {
			var oItem = oEvent.getParameter('item');
			if(oItem){ 
				var sType = oItem.getKey().split("#")[1];
				var sKey =  oItem.getKey().split("#")[0];
				if(sType === "Cont"|| sType === "ReCont"){
					MessageBox.show(
						"Os dados em memória serão apagados. Deseja mesmo realizar a operação?", {
						icon: MessageBox.Icon.INFORMATION,
						title: "Atenção!",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: sButton => { 
							if(sButton === MessageBox.Action.YES){
								this._oViewMain.setProperty("/centro/Plant",undefined);
								this._oViewMain.setProperty("/viewType",sType);
								this._navPage(sKey, sType, false);
							}
						}
					});
				}else {
					if(this.oStorage.get("materiais") !== undefined){
						MessageBox.show("Contagem recuperada",{
							icon: MessageBox.Icon.INFORMATION,
							title: "Sucesso!",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: sButton => {
								this._oViewMain.setProperty("/viewType",sType);
								this._navPage(sKey, sType, true);
							}
							
						});
					}else{
						MessageBox.show(
						"Não existem dados em memória", {
						icon: MessageBox.Icon.Error,
						title: "Erro!",
					});
					}
				}
			}
		}, 
		
		_onSubmitCentro : function(oEvent) {
			var sCentro = oEvent.getParameter("value");
			if(sCentro && sCentro.trim() !== ''){
				this._onConfirmCentro(oEvent);
			}
		},
		
		_onSubmitMaterial: function(oEvent) {
			//var sMaterial = oEvent.getParameter("value");
			this.onPressS2_PesquisaMaterial();
		}, 
		
		_onSubmitQuantity : function(oEvent) {
			var qtdCount = parseFloat(this._oViewContMaterial.getProperty("/material/QuantityCount".replace(',','.'))) || 0;
			var qtdSomar = parseFloat(this._oViewContMaterial.getProperty("/material/InputIncrement").replace(',','.')) || 0;
			this._oViewContMaterial.setProperty("/material/QuantityCount",qtdCount+qtdSomar);
			this._oViewContMaterial.setProperty("/material/Input",qtdCount+qtdSomar);
			this._oViewContMaterial.setProperty("/material/InputIncrement","");
			this._oViewContMaterial.setProperty("/material/Processed", true);
			
			var MaterialSelect = this._oViewContMaterial.getProperty("/material/Material");
			var listX = this._oViewListaMaterial.getProperty("/materiais");
			for(let i = 0; i < listX.length; i++){
				if(listX[i].Material == MaterialSelect){
                    var contagemMaterial = this._oViewContMaterial.getProperty("/material");
                    var sPath = "/materiais/"+i;
                    //this._oViewListaMaterial.setProperty(sPath,contagemMaterial);
                    listX[i] = contagemMaterial;
                    break;
				}		
			}
			
			/*this._oViewListaMaterial.getProperty("/materiais").forEach(
				function(oObject, iIndex) {
					if(oObject.Material !== this._oViewContMaterial.getProperty("/material/Material" )) {
						return; 
					}

					oObject = this._oViewContMaterial.getProperty("/material");

					var sPath = "/materiais/" + iIndex;
					this._oViewListaMaterial.setProperty(sPath, oObject);
				}.bind(this)
			);*/

			this._back();
			//this._oViewContagem.setProperty("/inMaterial", '');
			this.onDataChangeModel(oEvent);
		}, 
		
		_readDataPlant : function(sCentro) {
			
			function onSuccess(oResponse) {
				var oData = JSON.parse(oResponse.response);
				this.oStorage.clear();
				this.oStorage.removeAll();
				this.oStorage.put("centro", oData.d);
				this._oViewMain.setProperty("/busy", false);
				
				this._oViewMain.setProperty("/centroState", undefined);
				this._oViewMain.setProperty("/centroStateMsg", undefined);
				
				this._oViewMain.setProperty("/centro", oData.d);
				this._oViewMain.setProperty("/centroOld", this._oViewMain.getProperty("/centro/Plant"));
				
				this._oDialogCentro.close();
				
				if(this._fnCallback) { 
					this._fnCallback();
					this._fnCallback = undefined;
				}
			}
			
			function onError(sCentro, oResponse) {
				this._oViewMain.setProperty("/busy", false);
				var oInput = this.getView().byId('inCentro');
				jQuery.sap.delayedCall(500, this, function() {
					oInput.focus();
				});
				
			}
			
			function onCallError(sCentro, oResponse) {
				this._oViewMain.setProperty("/centroState", "Error");
				this._oViewMain.setProperty("/centroStateMsg", 
					this._oResourceBundle.getText("msgCentroNotFound", sCentro));
				onError.bind(this)(sCentro, oResponse)
			}
			var sURL = 
					this._sServiceURL + this._sEntityPlant + "('" + sCentro + "')?$format=json";
				
			var oRequest = new XMLHttpRequest();
			oRequest.open('GET', 
				sURL,
				'async');
			
			
			oRequest.addEventListener("load", this._callSuccess.bind(this, oRequest, onSuccess.bind(this), onCallError.bind(this, sCentro)));
			oRequest.addEventListener("error", this._callFailed.bind(this, oRequest, onError.bind(this, sCentro)));
			oRequest.addEventListener("abort", this._callCanceled.bind(this, oRequest, onError.bind(this, sCentro)));
			
			oRequest.send();
		},
		
		_readDataInvent : function(sCentro, resolve, reject) {
			function onSuccess(oResponse) {
				var oData = JSON.parse(oResponse.response);
				
				if(oResponse.status === 200) {
					if(oData && oData.d && oData.d.results) {
						if(resolve && oData.d.results.length > 0){
							oData.d.results.forEach(element => {
								element.QuantityCount = undefined;
								element.Processed = false;
							});
							this._oViewListaMaterial.setProperty("/materiais", oData.d.results);
							//this.oStorage.put("materiais",oData.d.results);
							resolve(oResponse);
						} else {
							var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							var sMsg = this._oViewMain.getProperty("/viewType") === "ReCont" ?
								this._oResourceBundle.getText("msgNoRecountAvailable") :
								this._oResourceBundle.getText("msgNoCountAvailable");
							MessageBox.show( sMsg, 
								{
									icon: sap.m.MessageBox.Icon.ERROR,
									title: this._oResourceBundle.getText("msgError"),
									actions: [sap.m.MessageBox.Action.CLOSE],
									id: "msgInvError",
									//details: sMsg, 
									styleClass: bCompact ? "sapUiSizeCompact" : ""
							});
							reject(oResponse);
						}
					}
				} else {
					reject(oResponse);
				}
			}
			
			function onError(oResponse) {
				if(oResponse.response) {
					var oData = JSON.parse(oResponse.response);
				}
				reject(oResponse);
			}
			
			var sURL = ""; 
			
			if(this._oViewMain.getProperty("/viewType") === "ReCont"){
				sURL = sCentro ?
					`${this._sServiceURL}${this._sEntityInvent}?$format=json&` +
					`$filter=((PostingDate lt datetime'0001-01-01T00:00:00' and PhysicalInventoryLastCountDate gt datetime'0001-01-01T00:00:00')and Plant eq '${sCentro}'` + 
					` and RecountAllowed eq true)&$orderby=MaterialName` :
					this._sServiceURL + this._sEntityInvent;
				this.oStorage.remove("isRecontagem");
				this.oStorage.put("isRecontagem", true);
			}else{
				sURL = sCentro ?
					this._sServiceURL + this._sEntityInvent + "?$format=json&$filter=" + this._getContagemInitFilter(sCentro, true) + '&$orderby=MaterialName':
					this._sServiceURL + this._sEntityInvent;
				this.oStorage.remove("isRecontagem");
				this.oStorage.put("isRecontagem", false);
			}
				
			var oRequest = new XMLHttpRequest();
			oRequest.open('GET', 
				sURL,
				'async');
			
			oRequest.addEventListener("load", this._callSuccess.bind(this, oRequest, onSuccess.bind(this), onError.bind(this)));
			oRequest.addEventListener("error", this._callFailed.bind(this, oRequest, onError.bind(this)));
			oRequest.addEventListener("abort", this._callCanceled.bind(this, oRequest, onError.bind(this)));
			
			oRequest.send();
			//var db = indexedDB.open("inventario2db", 1);
			//var transaction = db.transaction(json, "readwrite");
		},
		
		_readInvent : function(sCentro) {
			this._oViewContagem.setProperty("/busy", true);
			
			var oPromiseData = new Promise(
				function(resolve, reject) {
					this._readDataInvent(sCentro, resolve, reject); 
				}.bind(this)
			);
			
			oPromiseData.then(
				function(oResponse, oData) {
					this._oViewContagem.setProperty("/busy", false);
				}.bind(this), 
				function(oResponse, oData) {
					this._oViewContagem.setProperty("/busy", false);
					this._back();
				}.bind(this)
			);
		}, 
		
		_readPlannedCountDate :  function(sCentro, resolve, reject) {
			
			function onSuccess(oResponse) {
				var oData = JSON.parse(oResponse.response);
				
				if(oResponse.status === 200) {
					if(	oData	&& 
						oData.d && 
						oData.d.__count	&&
						oData.d.__count >= "1") {
						if(oData.d.results) {
							
							var dataPlanejada = oData.d.results[0].PhysInventoryPlannedCountDate;
							var flagDataCorreta = true;
							
							oData.d.results.forEach(element =>{
								if(element.PhysInventoryPlannedCountDate != dataPlanejada){
									flagDataCorreta = false;
								}	
							});
							
							if(flagDataCorreta){
								var oObject =  oData.d.results[0];
							
								oObject.PhysInventoryPlannedCountDate = 
									this.oFormatter.formatStringOdataDate(oObject.PhysInventoryPlannedCountDate);
								
								this._oViewContagem.setProperty("/contagem", oObject);
								this.oStorage.put("contagem",oObject);
								if(resolve){
									resolve(oResponse);
								}
							}else{
								var sMsg = undefined; 
								var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
								if(	oData && oData.d) { 
									if(oData.d.__count) {
										sMsg = 
											this._oResourceBundle.getText("msgPlannedCountDateNo", oData.d.__count);
									}
									if(oData.d.results && oData.d.results.length > 0) {
										sMsg = sMsg.concat("<ul>"); 
										oData.d.results.forEach(
											function(oObject, iIndex) {
												sMsg = sMsg.concat(
													this._oResourceBundle.getText("msgPlannedCountdateRow", 
														this.oFormatter.formatStringOdataDateDisplay(oObject.PhysInventoryPlannedCountDate))); 
														//new sap.ui.model.type.Date(oObject.PhysInventoryPlannedCountDate)));
											}.bind(this));
										sMsg = sMsg.concat("</ul>");
									}
								}
								MessageBox.show( this._oResourceBundle.getText("msgPlannedCountDateError"), 
									{
										icon: sap.m.MessageBox.Icon.ERROR,
										title: this._oResourceBundle.getText("msgError"),
										actions: [sap.m.MessageBox.Action.CLOSE],
										id: "msgPlanDateError",
										details: sMsg, 
										styleClass: bCompact ? "sapUiSizeCompact" : ""
								});
								this._oViewMain.setProperty("/busy", false);
							}
						}
						} else if (oData	&& 
							oData.d && 
							oData.d.__count	&&
							oData.d.__count === "0"){
							MessageBox.show( this._oResourceBundle.getText("msgNoInventory"), 
								{
									icon: sap.m.MessageBox.Icon.ERROR,
									title: this._oResourceBundle.getText("msgError"),
									actions: [sap.m.MessageBox.Action.CLOSE],
									id: "msgNoInventory",
									details: sMsg, 
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								});
							this._oViewMain.setProperty("/busy", false);
						} else {
						var sMsg = undefined; 
						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
						if(	oData && oData.d) { 
							if(oData.d.__count) {
								sMsg = 
									this._oResourceBundle.getText("msgPlannedCountDateNo", oData.d.__count);
							}
							if(oData.d.results && oData.d.results.length > 0) {
								sMsg = sMsg.concat("<ul>"); 
								oData.d.results.forEach(
									function(oObject, iIndex) {
										sMsg = sMsg.concat(
											this._oResourceBundle.getText("msgPlannedCountdateRow", 
												this.oFormatter.formatStringOdataDateDisplay(oObject.PhysInventoryPlannedCountDate))); 
												//new sap.ui.model.type.Date(oObject.PhysInventoryPlannedCountDate)));
									}.bind(this));
								sMsg = sMsg.concat("</ul>");
							}
						}
						MessageBox.show( this._oResourceBundle.getText("msgPlannedCountDateError"), 
							{
								icon: sap.m.MessageBox.Icon.ERROR,
								title: this._oResourceBundle.getText("msgError"),
								actions: [sap.m.MessageBox.Action.CLOSE],
								id: "msgPlanDateError",
								details: sMsg, 
								styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						this._oViewMain.setProperty("/busy", false);
					}
				} else {
					reject(oResponse);
				}
			}
			function onError(oResponse) {
				reject(oResponse);
				//var oData = JSON.parse(oResponse.response);
				//this._genericErrorDisplay(oResponse); 
				//this._oViewMain.setProperty("/busy", false);
			}
			
			var sURL;
			if(this._oViewMain.getProperty("/viewType") === "ReCont"){
				var sURL = 
				`${this._sServiceURL}${this._sEntityPlanDate}?$filter=((PostingDate lt datetime'0001-01-01T00:00:00' 
				and PhysicalInventoryLastCountDate gt datetime'0001-01-01T00:00:00')
				and Plant eq '${sCentro}')&$inlinecount=allpages&$format=json`;
			}else{
				var sURL = 
				`${this._sServiceURL}${this._sEntityPlanDate}?$filter=${this._getContagemInitFilter(sCentro)}&$inlinecount=allpages&$format=json`;
			}	
			var oRequest = new XMLHttpRequest();
			oRequest.open('GET', 
				sURL,
				'async');
			
			oRequest.addEventListener("load", this._callSuccess.bind(this, oRequest, onSuccess.bind(this), onError.bind(this)));
			oRequest.addEventListener("error", this._callFailed.bind(this, oRequest, onError.bind(this)));
			oRequest.addEventListener("abort", this._callCanceled.bind(this, oRequest, onError.bind(this)));
			
			oRequest.send();
			
		}, 
		
		_routeMatched : function(oEvent) {

		},
		
		_searchMaterial : function(sMaterial, resolve, reject) {
			this._oViewContMaterial.setProperty("/material","");
			//this._oViewContMaterial.setProperty("/unidades", "");
			this._oViewListaMaterial.getProperty("/materiais").forEach(
				function(oObject, iIndex) {
					if(oObject.Material !== sMaterial) {
						return; 
					}
					
					var oUnit = [], 
						oQuantity = 0; 
						
					if(!oObject.Processed){
						oObject.Processed = false
					}
					
					if(oObject.MaterialBaseUnit) {
						oUnit.push({ Unit: oObject.MaterialBaseUnit });
						oObject.UnitCount = oObject.MaterialBaseUnit;
					}
					if(oObject.MaterialAlternativeUnit) {
						oUnit.push({ Unit: oObject.MaterialAlternativeUnit });
					}
					if(oObject.QuantityCount) {
						oQuantity = oObject.QuantityCount;
					}
					/*if(oObject.QuantityCount > 0 ){
						
					}*/
					
					this._oViewContMaterial.setProperty("/unidades", oUnit);
					this._oViewContMaterial.setProperty("/originalCount", oQuantity);
					this._oViewContMaterial.setProperty("/material", oObject);
				}.bind(this)
			);
			if(this._oViewContMaterial.getProperty("/material")) {
				var oMaterial = this._oViewContMaterial.getProperty("/material");
				var oObject = $.extend({}, oMaterial);
				if(oMaterial.QuantityCount > 0) {
					MessageBox.show(
							"Já existe contagem para este inventário, deseja substituir ou adicionar ?", {
							icon: MessageBox.Icon.INFORMATION,
							title: "Atenção!",
							actions: ["Substituir", "Adicionar"],
							onClose:
								function(sButton) { 
									//Tratativa do problema de binding do Unit com combobox
									oMaterial.Unit = oObject.Unit;
									if(sButton == "Substituir"){
										oObject.Input = oObject.QuantityCount;
										oObject.QuantityCount = 0;
									}
									//this._defineInitialFocus("S3_ContarMaterial");
									this._oViewContMaterial.setProperty("/material", oObject);
									resolve();
							    }.bind(this)
							/*sButton => { 
								if(sButton == "Substituir"){
									oObject.Input = oObject.QuantityCount;
									oObject.QuantityCount = 0;
								}
								//this._defineInitialFocus("S3_ContarMaterial");
								this._oViewContMaterial.setProperty("/material", oObject);
								resolve();
							}*/
						});
				} else {
					resolve();
				}
				
			} else {
				MessageBox.show( this._oResourceBundle.getText("msgSearchError"), 
					{
						icon: sap.m.MessageBox.Icon.ERROR,
						title: this._oResourceBundle.getText("msgError"),
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: sButton => { 
							this._oViewContagem.setProperty("/inMaterial","");
							reject();
						}						
				});
			}
		},
		
		onSideNavButtonPress : function(oEvent) {
			var oToolPage = oEvent.getSource().getParent().getParent();
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		}, 
		
		onPressS2_PesquisaMaterial: function(oEvent){
			var sMaterial = this._oViewContagem.getProperty("/inMaterial");
			var sType = this._oViewMain.getProperty("/viewType");
			if(sMaterial) {
				var oPromise = new Promise(
					function (resolve, reject) {
						this._searchMaterial.bind(this)(sMaterial, resolve, reject);
					}.bind(this)
				);
				
				oPromise.then(
					function () {
						this._navPage("S3_ContarMaterial", sType, true);
					}.bind(this), 
					function () {
						this._defineInitialFocus("S2_Contagem");
						return;
					}.bind(this)
				);
			}
		},
		
		onPressS2_ListaMateriais: function(){
			var sType = this._oViewMain.getProperty("/viewType");
			this._oViewListaMaterial.refresh();
			this._navPage("S3_ListarMateriais", sType, true);
		}, 
		
		fetchToken: function(bFinish){
			var sURL = `${this._sServiceURL}/$metadata`
			var oRequest = new XMLHttpRequest();
			oRequest.open('GET',sURL,'async');
			oRequest.setRequestHeader("x-csrf-token", "fetch");
			
			oRequest.onload = e => {
				var token = oRequest.getResponseHeader("x-csrf-token");
				this.sendPost(token, bFinish);
			};
			
			oRequest.onerror = e =>{
				this._oViewMain.setProperty("/busy", false);
				MessageBox.show( this._oResourceBundle.getText("msgTokenError"), 
					{
						icon: sap.m.MessageBox.Icon.ERROR,
						title: this._oResourceBundle.getText("msgError"),
						actions: [sap.m.MessageBox.Action.CLOSE],
				});
			};
			
			oRequest.send();
		},
		
		sendPost: function(token, bFinish){
			var sURL = `${this._sServiceURL}${this._sEntityPlanDate}`
			var oRequest = new XMLHttpRequest();
			oRequest.open('POST',sURL,'async');
			oRequest.setRequestHeader("x-csrf-token",token);
			oRequest.setRequestHeader("Content-Type","application/json");
			oRequest.setRequestHeader("Accept","application/json");
			oRequest.onload = e => {
				this._oViewMain.setProperty("/busy", false);
				if(e.target.status == 201){
					//this.oStorage.clear();
					this._back();
					MessageBox.show( "Inventário enviado!", 
					{
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Sincronizado com sucesso",
						actions: [sap.m.MessageBox.Action.CLOSE]
					});
				}else{
					this._genericErrorDisplay(oRequest);
					/*
					MessageBox.show( this._oResourceBundle.getText("msgGenericError"), 
					{
						icon: sap.m.MessageBox.Icon.ERROR,
						title: this._oResourceBundle.getText("msgError"),
						actions: [sap.m.MessageBox.Action.CLOSE],
						id: "msgGenericError",
						details: oRequest.response,
						contentWidth: "auto"
					});*/
				}		
			};
			
			oRequest.onerror = e =>{
				this._oViewMain.setProperty("/busy", false);
				this._genericErrorDisplay(oRequest);
				/*
				MessageBox.show( this._oResourceBundle.getText("msgGenericError"), 
					{
						icon: sap.m.MessageBox.Icon.ERROR,
						title: this._oResourceBundle.getText("msgError"),
						actions: [sap.m.MessageBox.Action.CLOSE],
						id: "msgGenericError",
						details: oRequest.response,
						contentWidth: "auto"
	
				});
				*/
			};
			var centroStorage = this.oStorage.get("centro");
			var materiaisStorage = this.oStorage.get("materiais");
			var listMateriaisEnviar =  [];
			var bRecontagem = this.oStorage.get("isRecontagem"); 
			
			materiaisStorage.forEach(element => {
				delete element.Input;
				delete element.InputIncrement;
				//delete element.Processed;
				if(bFinish && !bRecontagem &&
					!element.Processed ){ 
					//( element.UnitCount === "" || element.Quantity === undefined )){
                    element.UnitCount		= element.MaterialBaseUnit;
					element.QuantityCount	= 0;
					element.Processed		= true;
                }
				//if(element.UnitCount !== ""){
				if(element.Processed) {
					if(element.QuantityCount || element.QuantityCount === 0){
						element.QuantityCount = String(element.QuantityCount);
					}
					delete element.Processed;
                    listMateriaisEnviar.push(element);
				}
			});
			var jsonDataSend = JSON.stringify({
				"Plant": centroStorage.Plant,
				"PhysInventoryPlannedCountDate": "/Date(1562716800000)/",
				"PlantName": centroStorage.PlantName,
				"PostingDate": null,
				"PhysicalInventoryLastCountDate": null,
				"InventoryCount": materiaisStorage.length,
				"isRecontagem": bRecontagem,
				"finishCount": bFinish, 
				"to_InventoryCount": listMateriaisEnviar,
			});
			oRequest.send(jsonDataSend);
		},
		
		//FH - 18.01.2020 - MOG - Melhoria Inventário (MM10) - Inicio
		onPressS2_Save: function(oEvent) {
			MessageBox.show(
						this._oResourceBundle.getText("msgS2ConfirmSave"), {
						icon: MessageBox.Icon.QUESTION,
						title: this._oResourceBundle.getText("msgConfirm"),
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: sButton => { 
							if(sButton === MessageBox.Action.YES){
								this._oViewMain.setProperty("/busy", true);
								this.fetchToken(false);
							}
						}
			});
		},
		//FH - 18.01.2020 - MOG - Melhoria Inventário (MM10) - Fim
		
		onPressS2_Sync: function(oEvent){
			MessageBox.show(
						"Deseja realmente finalizar o inventário?", {
						icon: MessageBox.Icon.INFORMATION,
						title: "Atenção!",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: sButton => { 
							if(sButton === MessageBox.Action.YES){
								this._oViewMain.setProperty("/busy", true);
							//FH - 18.01.2020 - MOG - Melhoria Inventário (MM10) - Inicio
							//	this.fetchToken();
								this.fetchToken(true);
							//FH - 18.01.2020 - MOG - Melhoria Inventário (MM10) - Fim
							}
						}
			});
		},
		
		handleLiveChangeQuantity: function(oEvent){
			var _oInput = oEvent.getSource();
			var sValue = _oInput.getValue();
			
			if((sValue && /^-?\d*[.]?\d*$/.test(sValue)) || !sValue) {
				_oInput._oOldValue = sValue;
			} else {
				_oInput.setValue(_oInput._oOldValue);
			}
			/*
			var val = _oInput.getValue();
			val = val.replace(".", '');
			val = val.replace(/^[a-zA-Z]*$/,'');
			_oInput.setValue(val);
			*/
		},
		
		_handleLiveChangeCentro: function(oEvent){
			var _oInput = oEvent.getSource();
			var val = _oInput.getValue();
			this._oViewMain.setProperty("/centro/Plant",val);
		}
		
	});
});