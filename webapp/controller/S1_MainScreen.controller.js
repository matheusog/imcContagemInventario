sap.ui.define([
	"imc/sap/mm/contageminventario/controller/BaseController",
	"sap/ui/core/UIcomponent", 
	"imc/sap/mm/contageminventario/model/models"
], function(BaseController, UIcomponent, Models) {
	"use strict";

	return BaseController.extend("imc.sap.mm.contageminventario.controller.S1_MainScreen", {

		onInit: function(){
			this.getRouter().getRoute("S1_MainScreen").attachMatched(this._routeMatched, this);
			this._oViewModel = Models.createViewModel();
			this.getView().setModel("viewModel", this._oViewModel);
			
			this._oViewModel.setProperty("/visible", true);
			
			var request = new XMLHttpRequest();
			XMLReq.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
			request.open('GET', 
			"http://euawsspdvfr01.grupoimc.com.br:8000/sap/opu/odata/sap/Z_MM_TEST_CDS/Z_MM_TEST?$format=json&sap-client=150",
			'async',
			'LGUIMARAES',
			'Mexicano_556');
			
			request.onload = function(){
				var data = JSON.parse(this.response);
				
				
				data.forEach(objectResp => {
					console.log(objectResp.PhysicalInventoryDocument)
				});
			};
			request.send();
			
			
			
		},
		
		_routeMatched : function(oEvent) {

		},
		
		actionS1_tileContagem: function(){
			this.getView().byId("S1_MainScreen").setVisible(false);
			this.getView().byId("S2_Contagem").setVisible(true);
		},
		
		actionS1_tileRecontagem: function() {
			this.getView().byId("S1_MainScreen").setVisible(false);
			this.getView().byId("S2_Contagem").setVisible(true);
		},
		
		actionS1_tileRecuperarContagem: function(){
			this.getView().byId("S1_MainScreen").setVisible(false);
			this.getView().byId("S2_Contagem").setVisible(true);
		},
		
		onPressS2_Back: function(){
			this.getView().byId("S2_Contagem").setVisible(false);
			this.getView().byId("S1_MainScreen").setVisible(true);
		},
		
		onPressS2_PesquisaMaterial: function(){
			this.getView().byId("S2_Contagem").setVisible(false);
			this.getView().byId("S3_ContarMaterial").setVisible(true);
		},
		
		onPressS2_ListaMateriais: function(){
			this.getView().byId("S2_Contagem").setVisible(false);
			this.getView().byId("S3_ListarMateriais").setVisible(true);
		},
		
		onPressS3Contar_Cancel: function(){
			this.getView().byId("S3_ContarMaterial").setVisible(false);
			this.getView().byId("S2_Contagem").setVisible(true);
		},
		
		onPressS3Listar_Cancel: function(){
			this.getView().byId("S3_ListarMateriais").setVisible(false);
			this.getView().byId("S2_Contagem").setVisible(true);
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