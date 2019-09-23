sap.ui.define([ 
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function(Controller,History, JSONModel) {
	"use strict";
	
	return Controller.extend("imc.sap.mm.contageminventario.controller.BaseController", {
		
		_sServiceURL: "/sap/opu/odata/sap/ZGW_MM_INVENTARIO_SRV",
		_sEntityInvent: "/ZC_MM_INVENTARIO", 
		_sEntityPlant: "/ZI_MM_INVENTORYPLANT",
		_sEntityPlanDate: "/ZC_MM_INVENTARIO_DT_CONT_PLAN", 
		
		getRouter : function() {
			return this.getOwnerComponent().getRouter();
		}, 
		
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("mainScreen", {}, true /*no history*/);
			}
		}
	});
});