sap.ui.define([
	"imc/sap/mm/contageminventario/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("imc.sap.mm.contageminventario.controller.S2_Contagem", {

		onInit: function(){
			this.getRouter().getRoute("S2_Contagem").attachMatched(this._routeMatched, this);
			var oModel = new JSONModel();
			oModel.setData({
				dateValue: new Date()
			});
			this.getView().setModel(oModel);
			this.byId("DP3").setDateValue(new Date());
		},
		
		_routeMatched : function(oEvent) {

		}

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf imc.sap.mm.contageminventario.view.S2_Contagem
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf imc.sap.mm.contageminventario.view.S2_Contagem
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf imc.sap.mm.contageminventario.view.S2_Contagem
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf imc.sap.mm.contageminventario.view.S2_Contagem
		 */
		//	onExit: function() {
		//
		//	}

	});

});