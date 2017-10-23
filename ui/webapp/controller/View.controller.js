sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.ui.controller.View", {
		onInit: function() {
			this.getView().setModel(new JSONModel({
				item: "",
				items: []
			}));
			this.getItems();
		},
		onAddItem: function() {
			var oData = this.getView().getModel().getData();

			var that = this;
			jQuery.ajax({
				method: "POST",
				url: "/item/",
				data: {
					item: {
						item: oData.item
					}
				}
			}).done(function(msg) {
				that.getItems();
			});
		},
		getItems: function() {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			var that = this;
			jQuery.ajax({
				method: "GET",
				url: "/items"
			}).done(function(data) {
				oData.items = data;
				oModel.setData(oData);
			});
		}
	});
});