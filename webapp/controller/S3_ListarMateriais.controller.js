sap.ui.define([
	"imc/sap/mm/contageminventario/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"imc/sap/mm/contageminventario/util/Formatter",
	"imc/sap/mm/contageminventario/model/models"
], function(BaseController, JSONModel, Formatter, Models) {
	"use strict";

	return BaseController.extend("imc.sap.mm.contageminventario.controller.S3_ListarMateriais", {
		
		onInit: function(){
			var oModel = new JSONModel();
			this.getView().setModel(oModel);
		},
		
		handleSearch : function (evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}
		
			// update list binding
			var list = this.getView().byId("List");
			var binding = list.getBinding("items");
			binding.filter(filters);
		}
	
	});

});