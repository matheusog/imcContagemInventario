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
		},
		
		getMateriais: function() {
			return new JSONModel({"ProductCollection": [
		{
			"ProductId": "HT-1000",
			"Category": "Laptops",
			"MainCategory": "Computer Systems",
			"TaxTarifCode": "1",
			"SupplierName": "Very Best Screens",
			"WeightMeasure": 4.2,
			"WeightUnit": "KG",
			"Description": "Notebook Basic 15 with 2,80 GHz quad core, 15\" LCD, 4 GB DDR3 RAM, 500 GB Hard Disc, Windows 8 Pro",
			"Name": "Notebook Basic 15",
			"DateOfSale": "2017-03-26",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1000.jpg",
			"Status": "Available",
			"Quantity": 10,
			"UoM": "PC",
			"CurrencyCode": "EUR",
			"Price": 956,
			"Width": 30,
			"Depth": 18,
			"Height": 3,
			"DimUnit": "cm"
		},
		{
			"ProductId": "HT-1001",
			"Category": "Laptops",
			"MainCategory": "Computer Systems",
			"TaxTarifCode": "1",
			"SupplierName": "Very Best Screens",
			"WeightMeasure": 4.5,
			"WeightUnit": "KG",
			"Description": "Notebook Basic 17 with 2,80 GHz quad core, 17\" LCD, 4 GB DDR3 RAM, 500 GB Hard Disc, Windows 8 Pro",
			"Name": "Notebook Basic 17",
			"DateOfSale": "2017-04-17",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1001.jpg",
			"Status": "Available",
			"Quantity": 20,
			"UoM": "PC",
			"CurrencyCode": "EUR",
			"Price": 1249,
			"Width": 29,
			"Depth": 17,
			"Height": 3.1,
			"DimUnit": "cm"
		}
		]})},
		
		createDatabase: function(){
			const request = window.indexedDB.open("inventario2db", 1);
			// Create schema
			request.onupgradeneeded = event => {
    		const db = event.target.result;
    
    		const invoiceStore = db.createObjectStore(
        		"invoices",
        		{ keyPath: "invoiceId" }
    		);
    		invoiceStore.createIndex("VendorIndex", "vendor");
		    const itemStore = db.createObjectStore(
		        "invoice-items",
		        { keyPath: [ "invoiceId", "row" ] }
		    );
		    itemStore.createIndex("InvoiceIndex", "invoiceId");
		    const fileStore = db.createObjectStore(
		        "attachments",
		        { autoIncrement: true }
		    );
		    fileStore.createIndex("InvoiceIndex", "invoiceId");    
		};	
		}
	};
});