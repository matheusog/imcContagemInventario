sap.ui.define([ 
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History",
	"imc/sap/mm/contageminventario/util/Formatter",
	"sap/ui/model/json/JSONModel"
], function(Controller,History, Formatter, JSONModel) {
	"use strict";
	
	return Controller.extend("imc.sap.mm.contageminventario.controller.S0_App", {
		oFormatter: Formatter, 
		
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