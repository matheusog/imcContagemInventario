sap.ui.define([], function() {
	"use strict";

	return {
		
		formatCentro : function(sPlant, sPlantName) {
			return sPlantName && sPlantName.trim() !== "" ?
				`${sPlant} (${sPlantName})` : sPlant;
		}, 
		
		formatStringOdataDate :function(sOdataDate) {
			if(sOdataDate) {
				var dDate		= eval('new ' + sOdataDate.replace(/\//g, ''));
				return dDate;
			}
		},
		
		formatQuantity : function(nQuantity) {
			return nQuantity.toString();
		},
		
		formatX: function(nQuantity){
			/*if(nQuantity == 0){
				nQuantity = undefined;	
				return nQuantity;
			}else{
				return nQuantity;	
			}*/
			return nQuantity;
		},
		
		formatStringOdataDateDisplay : function(sOdataDate) {
			//var dDate		= eval('new ' + sOdataDate.replace(/\//g, ''));
			var dDate = this.formatStringOdataDate(sOdataDate);
			
			var oFormatOptions = {
				style: "medium", 
				strictParsing: true
//				pattern: "dd.MM.DDDD"
			}
			
			var oDateFormat 	= sap.ui.core.format.DateFormat.getDateInstance(oFormatOptions);
			var sDateFormatted	= oDateFormat.format(dDate);
			
			return sDateFormatted;
		}
	};
});