function templateController() { };
templateController.prototype = new function() {
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
	this.main = function(context,params) {
		//if(!context.req.xhr) {}
		if(!('context' in params)) params.context = context;
		params.variables = context.variables;
		var response = main.render("_main.ejs",params);
		context.res.status(context.res.statusCode).send(response);
	};
};
module.exports = new templateController;
