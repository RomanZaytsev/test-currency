function userController() { };
userController.prototype = new function () {
	var self = this;
	this.action = function(context) {
		var actionName = context.name+"Action";
		if(actionName=="Action") actionName = "indexAction";
		if(this[actionName] == undefined) {
			if(isNaN(context.name)) {
				context.res.status(404).send('Not found');
			}
			else {
				context.module.models.user.findOne({ where: {id:context.name} }).then(function(user) {
					if(user) {
						var params = {
							tag_title: "Your profile",
							tag_h1: "Your profile",
							tag_main: main.render("user/profile.ejs",{
								model: user
							}),
						};
						main.controllers.template.main(context, params);
					}
					else {
						context.res.status(404).send('Not found');
					}
				});
			}
		} else {
			this[actionName](context);
		}
	};
	this.indexAction = function(context) {
		context.module.models.user.findAll().then(function(users) {
			var params = {
				tag_title: "Users",
				tag_h1: "Users",
				tag_main: main.render("user/index.ejs",{
					users: users,
				}),
			};
			main.controllers.template.main(context, params);
		});
	}
	this.loginAction = function(context) {
		var params = {
			tag_title: "Log in",
			tag_h1: "Log in",
			tag_main: main.render("user/login.ejs",{}),
		};
		main.controllers.template.main(context, params);
	};
	this.logoutAction = function(context) {
		var returnPage = () => {
			context.res.redirect('/');
			/*main.controllers.template.main(context, {
				tag_title: "",
				tag_main: main.render("user/logout.ejs",{ tag_h1: "" }),
			});*/
		};
		if(context.req.session) {
			context.req.session.destroy().then((u) => {
				context.req.session = null;
				context.res.clearCookie('sessionId');
				returnPage();
			});
		}
		else {
			returnPage();
		}
	};
	this.signupAction = function(context) {
		var params = {
			tag_title: "Signup",
			tag_h1: "Signup",
			tag_main: main.render("user/signup.ejs",{ }),
		};
		main.controllers.template.main(context, params);
	};
	this.recoveryAction = function(context) {
		var params = {
			tag_title: "Recovery password",
			tag_main: null,
		};
		if(context.req.query.key && context.req.query.email) {
			params.tag_h1 = "New password";
			params.tag_main = main.render("user/recovery_newpassword.ejs",{
				key: context.req.query.key,
				email: context.req.query.email
			});
		} else {
			params.tag_h1 = "Recovery password";
			params.tag_main = main.render("user/recovery.ejs",{ });
		}
		main.controllers.template.main(context, params);
	};
	this.confirmAction = function(context) {
		var params = {
			tag_title: "Confirm email",
			tag_main: null,
		};
		main.models.user.confirm(context.req.query, function(response) {
			if(response.status == "OK") {
				params.tag_main = "Email confirmed";
			} else {
				params.tag_h1 = "Confirm email";
				params.tag_main = main.render("user/confirm.ejs",{ });
			}
			main.controllers.template.main(context, params);
		});
	};
};
module.exports = new userController;
