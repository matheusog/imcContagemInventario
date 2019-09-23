sap.ui.define([
	"imc/sap/mm/contageminventario/controller/BaseController",
	"sap/ui/core/UIcomponent", 
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"imc/sap/mm/contageminventario/model/models", 
	"imc/sap/mm/contageminventario/model/formatter",
	"sap/ui/util/Storage"
], function(BaseController, UIcomponent, MessageBox, Filter, Models, Formatter,Storage) {
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
		},
		
		onDataChangeModel: function(oEvent){
			var o2= oEvent.getParameters();
			var stData = this._oViewListaMaterial.getProperty("/materiais");
			this.oStorage.put("materiais",stData);
		},
		
		_bindingUpdated: function(oEvent){
			var o1 = oEvent.getParameters();
			this.oStorage.put("materiais",oEvent.getSource().getModel().getProperty("/materiais"));
		},
		
		_back : function(oEvent) {
			this._oNavContainer.back();	
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
				
		}, 
		
		_callCanceled : function(oXmlHttpReq, fnError, oResponse){
				
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
		
		_handleSearchMaterial : function(oEvent) {
			var sQuery = oEvent.getParameter("query");	
			//var sQuery = oEvent.getSource().getValue();
			var aFilters = [];
			var oList = this.byId("listMaterial"); 
			
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

			// update list binding
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		}, 
		
		_genericErrorDisplay : function(oResponse) {
			if(oResponse && oResponse.response){
				var oData = JSON.parse(oResponse.response);
			}
			
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			
			if(oData) {
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
		
		_getContagemInitFilter : function(sCentro) {
			var sFilter = 
				"(PostingDate lt datetime'0001-01-01T00:00:00' and PhysicalInventoryLastCountDate lt datetime'0001-01-01T00:00:00')";
				
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
		
		_navPage : function(sKey, bOffline) {
				var sCentro = this._oViewMain.getProperty("/centro/Plant");
				if(!this._oViewMain.getProperty("/centro/Plant")) {
					this._onConfigPress(null, this._navPage.bind(this, sKey));
				} else {
					function navToOffline(sKey) {
						this._oNavContainer.to(this.getView().createId(sKey));
						if(this._oToolPage.getSideExpanded()) {
							this._oToolPage.setSideExpanded(!this._oToolPage.getSideExpanded());
						} 
					}
					function navToOnline(sKey) {
						navToOffline.bind(this)(sKey);
						this._readInvent(sCentro);	
						this._oViewMain.setProperty("/busy", false);
					}
					
					if(bOffline) {
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
					sap.ui.xmlfragment("imc.sap.mm.contageminventario.view.fragment.F1_PopUpCentro", this);
				this.getView().addDependent(this._oDialogCentro);
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
			var sCentro = this._oViewMain.getProperty("/centro/Plant");
			this._readDataPlant(sCentro);
		},
		
		_onNavItem : function(oEvent) {
			var oItem = oEvent.getParameter('item');
			if(oItem){ 
				var sKey = oItem.getKey();
				this._navPage(sKey);
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
			this._back();
			this._oViewContagem.setProperty("/inMaterial", '');
			this.onDataChangeModel(oEvent);
		}, 
		
		_readDataPlant : function(sCentro) {
			
			function onSuccess(oResponse) {
				var oData = JSON.parse(oResponse.response);
				this.oStorage.removeAll();
				this.oStorage.put("centro", oData);
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
				this._oViewMain.setProperty("/centroState", "Error");
				this._oViewMain.setProperty("/centroStateMsg", 
					this._oResourceBundle.getText("msgCentroNotFound", sCentro));
			}
		
			var sURL = 
					this._sServiceURL + this._sEntityPlant + "('" + sCentro + "')?$format=json";
				
			var oRequest = new XMLHttpRequest();
			oRequest.open('GET', 
				sURL,
				'async');
			
			
			oRequest.addEventListener("load", this._callSuccess.bind(this, oRequest, onSuccess.bind(this), onError.bind(this, sCentro)));
			oRequest.addEventListener("error", this._callFailed.bind(this, oRequest, onError.bind(this, sCentro)));
			oRequest.addEventListener("abort", this._callCanceled.bind(this, oRequest, onError.bind(this, sCentro)));
			
			oRequest.send();
		},
		
		_readDataInvent : function(sCentro, resolve, reject) {
			function onSuccess(oResponse) {
				var oData = JSON.parse(oResponse.response);
				
				if(oResponse.status === 200) {
					if(oData && oData.d && oData.d.results) {
						if(resolve){
							this._oViewListaMaterial.setProperty("/materiais", oData.d.results);
							//this.oStorage.put("materiais",oData.d.results);
							resolve(oResponse);
						}
					}
				} else {
					reject(oResponse);
				}
			}
			
			function onError(oResponse) {
				var oData = JSON.parse(oResponse.response);
				reject(oResponse);
			}
			
			var sURL = 
				sCentro ?
					this._sServiceURL + this._sEntityInvent + "?$format=json&$filter=" + this._getContagemInitFilter(sCentro) :
					this._sServiceURL + this._sEntityInvent;
				
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
						oData.d.__count === "1") {
						if(oData.d.results) {
							var oObject =  oData.d.results[0];
							
							oObject.PhysInventoryPlannedCountDate = 
								this.oFormatter.formatStringOdataDate(oObject.PhysInventoryPlannedCountDate);
							
							this._oViewContagem.setProperty("/contagem", oObject);
						}
						if(resolve){
							resolve(oResponse);
						}
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
			
			var sURL = 
				`${this._sServiceURL}${this._sEntityPlanDate}?$filter=${this._getContagemInitFilter(sCentro)}&$inlinecount=allpages&$format=json`;
				
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
			this._oViewListaMaterial.getProperty("/materiais").forEach(
				function(oObject, iIndex) {
					if(oObject.Material !== sMaterial) {
						return; 
					}
					
					var oUnit = []; 
					if(oObject.MaterialBaseUnit) {
						oUnit.push({ Unit: oObject.MaterialBaseUnit });
						oObject.UnitCount = oObject.MaterialBaseUnit;
					}
					if(oObject.MaterialAlternativeUnit) {
						oUnit.push({ Unit: oObject.MaterialAlternativeUnit });
					}
					
					this._oViewContMaterial.setProperty("/unidades", oUnit);
					this._oViewContMaterial.setProperty("/material", oObject);
				}.bind(this)
			);
			if(this._oViewContMaterial.getProperty("/material")) {
				resolve();	
			} else {
				reject();
			}
		},
		
		onSideNavButtonPress : function(oEvent) {
			var oToolPage = oEvent.getSource().getParent().getParent();
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		}, 
		
		onPressS2_PesquisaMaterial: function(oEvent){
			var sMaterial = this._oViewContagem.getProperty("/inMaterial");
			if(sMaterial) {
				var oPromise = new Promise(
					function (resolve, reject) {
						this._searchMaterial.bind(this)(sMaterial, resolve, reject);
					}.bind(this)
				);
				
				oPromise.then(
					function () {
						this._navPage("S3_ContarMaterial", true);
					}.bind(this), 
					function () {
						return;
					}.bind(this)
				);
			}
		},
		
		onPressS2_ListaMateriais: function(){
			this._oViewListaMaterial.refresh();
			this._navPage("S3_ListarMateriais", true);
		}, 
		
		onSaveContagem: function(oEvent) {
			//_back();
		}
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf imc.sap.mm.contageminventario.view.S1_MainScreen
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf imc.sap.mm.contageminventario.view.S1_MainScreen
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf imc.sap.mm.contageminventario.view.S1_MainScreen
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf imc.sap.mm.contageminventario.view.S1_MainScreen
		 */
		//	onExit: function() {
		//
		//	}

	});

});