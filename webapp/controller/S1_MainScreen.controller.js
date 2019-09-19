sap.ui.define([
	"imc/sap/mm/contageminventario/controller/BaseController",
	"sap/ui/core/UIcomponent", 
	"imc/sap/mm/contageminventario/model/models"
], function(BaseController, UIcomponent, Models) {
	"use strict";

	return BaseController.extend("imc.sap.mm.contageminventario.controller.S1_MainScreen", {

		onInit: function(){
			this.getRouter().getRoute("S1_MainScreen").attachMatched(this._routeMatched, this);
			
			this._createInitialViews(); 
			
			this._oNavContainer = this.byId("idAppControl");
			this._oToolPage		= this.byId("pageS1MainScreen");
			
			//this._oViewMain.setProperty("/visible", true);
			//this._readData();
		},
		
		_back : function(oEvent) {
			this._oNavContainer.back();	
		},
		
		_createInitialViews : function() {
			this._oViewMain = Models.createViewModel();
			this.getView().setModel(this._oViewMain, "viewMain");
			
			this._oViewContagem = Models.createViewModel();
			this.getView().setModel(this._oViewContagem, "viewContagem");
			
			this._oViewContMaterial = Models.createViewModel();
			this.getView().setModel(this._oViewContMaterial, "viewContMaterial");
			
			this._oViewListaMaterial = Models.createViewModel();
			this.getView().setModel(this._oViewListaMaterial, "viewListaMaterial");
		}, 
		
		_navHome : function() {
				
		},
		
		_navPage : function(sKey) {
				if(!this._oViewMain.getProperty("/centro")) {
					this._onConfigPress(null, this._navPage.bind(this, sKey));
				} else {
					this._oNavContainer.to(this.getView().createId(sKey));
					this._oToolPage.setSideExpanded(!this._oToolPage.getSideExpanded());
				}
		}, 
		
		_onCancelCentro : function(oEvent) {
			this._oDialogCentro.close();
			this._oViewMain.setProperty("/centro", this._oViewMain.getProperty("/centroOld"));
			if(this._fnDialogNav) { 
				this._fnDialogNav		= undefined;
			}
			
		},
		
		_onConfigPress : function(oEvent, fnNav) {
			if (!this._oDialogCentro) {
				this._oDialogCentro = 
					sap.ui.xmlfragment("imc.sap.mm.contageminventario.view.fragment.F1_PopUpCentro", this);
				this.getView().addDependent(this._oDialogCentro);
			}
			if(this._oViewMain.getProperty("/centro")) {
				this._oViewMain.setProperty("/centroOld", this._oViewMain.getProperty("/centro"));	
			}
			if(fnNav){
				this._fnDialogNav		= fnNav;
			}
			this._oDialogCentro.open();
		},
		
		_onConfirmCentro : function(oEvent) {
			this._oViewMain.setProperty("/centroOld", this._oViewMain.getProperty("/centro"));
			this._oDialogCentro.close();
			this._readData(this._oViewMain.getProperty("/centro"));
			if(this._fnDialogNav) { 
				this._fnDialogNav(); 
				this._fnDialogNav = undefined;
			}
		},
		
		_onNavItem : function(oEvent) {
			var oItem = oEvent.getParameter('item');
			if(oItem){ 
				var sKey = oItem.getKey();
				this._navPage(sKey);
			}
		}, 
		
		_readData : function(sCentro) {
			var sURL = 
				sCentro ?
					this._sServiceURL + this._sEntityInvent + "&$filter= Plant eq '" + sCentro + "'":
					this._sServiceURL + this._sEntityInvent;
				
			var request = new XMLHttpRequest();
			//request.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
			request.open('GET', 
				sURL,
				'async');
			//'LGUIMARAES',
			//'Mexicano_556');
			
			request.onload = function(){
				var data = JSON.parse(this.response);
				
				if(data && data.d && data.d.results) {
					data.d.results.forEach(function(oObjResp, iIndex){
						console.log(oObjResp.PhysicalInventoryDocument);
					});
				}
			};
			request.send();
			//var db = indexedDB.open("inventario2db", 1);
			//var transaction = db.transaction(json, "readwrite");
		},
		
		_routeMatched : function(oEvent) {

		},
		
		onSideNavButtonPress : function(oEvent) {
			var oToolPage = oEvent.getSource().getParent().getParent();
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		}, 
		
		onPressS2_PesquisaMaterial: function(){
			this._navPage("S3_ContarMaterial");
		},
		
		onPressS2_ListaMateriais: function(){
			this._navPage("S3_ListarMateriais");
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