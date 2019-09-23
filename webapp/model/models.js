sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {
		
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createViewModel: function() {
			var oModel = new JSONModel({
				visible: true, 
				busyDelay: 10, 
				busy: false
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}
	};
});