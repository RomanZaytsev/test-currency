function mainController() { };
mainController.prototype = new function() {
	var self = this;
	this.action = function(context) {
		var actionName = context.name+"Action";
		if(actionName=="Action") actionName = "indexAction";
		if(this[actionName] == undefined) {
			context.res.status(404).send('Not found');
		} else {
			this[actionName](context);
		}
	};
	this.indexAction = function(context) {
		var params = {
			tag_title: "",
			tag_main: main.render("index.ejs",{}),
		};
		main.controllers.template.main(context, params);
	};

	this.testAction = function(context) {
		context.res.cookie('rememberme', '1', { path: '/', expires: 0, httpOnly: false, maxAge: 24*60*60*1000 });
		var params = {
			tag_title: "Тест",
			tag_main: "",
		};
		main.controllers.template.main(context, params);
	};

	this.headersAction = function(context) {
		var params = {
			tag_title: "Заголовок запроса",
			tag_main: JSON.stringify(context.req.headers),
		};
		main.controllers.template.main(context, params);
	};
};
module.exports = new mainController;
