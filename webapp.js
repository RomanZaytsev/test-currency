module.exports = function(main) {
  var app = express();
	app.onlyAdmin = function(context) {
	    if(!context.req.session || !context.req.session.user || !context.req.session.user.id) {
	      context.res.status(403).send('Forbidden');
				return false;
	    }
			return true;
	};
  app.use(express.static(__dirname+"/"+main.config.dirPublic)); // сообщаем Node где лежат ресурсы сайта
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(function (req, res, next) {
    res.removeHeader("X-Powered-By");
    res.set('href', req.protocol + '://' + req.get('host') + req.originalUrl);
    //res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Credentials', true); // Set to true if you need the website to include cookies in the requests sent
    next(); // Pass to next layer of middleware
  });
  app.get('/protected/*', function(req, res, next) {
    if(app.onlyAdmin({req, res})) {
      var path = __dirname+req._parsedUrl.pathname;
      res.send( fs.readFileSync(path, 'utf8') );
    }
  });

  app.all('*', function (req, res) {
    var urla = req._parsedUrl.pathname.split("/");
    if(urla[0] == "") urla = urla.splice(1);
    if(urla[urla.length-1] == "") urla = urla.splice(0,urla.length-1);
    var pathToCurrentModule = main.config.path;
    var module = main;
    var controllerName = "main";
    var actionName = "";

    for(var i in urla) {
      var e = urla[i];
      if(module.modules && e in module.modules) {
        module = module.modules[e];
        pathToCurrentModule = pathToCurrentModule + "/" + module.name;
        if("getMainController" in module) controllerName = module.getMainController();
      }
      else {
        if(i == urla.length-2) {
          controllerName = urla[urla.length-2];
          actionName = urla[urla.length-1];
          break;
        }
        else {
          if(i == urla.length-1) {
            controllerName = urla[urla.length-1];
            break;
          }
        }
      }
    };

    var context = { module:module, name:actionName, req:req, res:res, variables:{pathToCurrentModule:pathToCurrentModule, mainPath:main.config.path, authorized:!!(req.session && req.session.user)?1:''} };

    if(module.controllers[controllerName] == undefined) {
      res.status(404).send('Not found');
    } else {
      var controller = module.controllers[controllerName];
      if(typeof controller.action == "function") {
        controller.action(context);
      }
      else {
        res.status(404).send('Not found');
      }
    }
  });
  return app;
}
