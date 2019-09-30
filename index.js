global.util = require('util');
global.crypto = require('crypto');
global.MyTools = require(__dirname+'/public/js/MyTools.js');
global.express = require('express');
global.http = require('http');
global.https = require('https');
global.request = require('request');
global.bodyParser = require('body-parser');
global.cookieParser = require('cookie-parser');
global.ejs = require('ejs');
global.fs = require('fs');
global.querystring = require('querystring');
global.PROJECT_DIR = __dirname;

global.main = new (function(config) {
	var main = this;
	main.config = config;
	main.host = config.host;
	main.views = {};
	main.dirname = __dirname;
	main.templates = {};
	main.render = function(path,data) {
		try {
			if(path[0] != "/") path = main.dirname + "/views/" + path;
			main.templates[path] = fs.readFileSync(path, 'utf8');
			return ejs.compile(main.templates[path], { filename: path, cache:null })(data);
		} catch (e) { return e.message; }
	};
	main.webserver = new (require(__dirname+"/webapp.js"))(main);
	main.http = http.createServer(main.webserver);
	main.onInit = function() {
		for(var i in main.modules) {
			if(typeof main.modules[i].onInit == "function") main.modules[i].onInit();
		}
	};
	MyTools.moduleLoader(fs, __dirname, main, function() {
		main.onInit();
		main.http.listen(main.config.httpPort, function() { console.log('HTTP	Сервер стартовал на '+main.config.httpPort+' порту!'); });
	});
})((require(__dirname+"/config.json")));

const repl = require('repl');
repl.start({
	prompt: '> ',
  input: process.stdin,
  output: process.stdout
});
