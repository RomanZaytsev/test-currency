function cartController() { };
cartController.prototype = new function () {
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
		if (context.req.method == 'POST') {
			if('product' in context.req.body && Array.isArray(context.req.body.product)) {
				https.get('https://www.cbr-xml-daily.ru/daily_json.js', (resp) => {
				  let data = '';
				  resp.on('data', (chunk) => { data += chunk; });
				  resp.on('end', () => {
						var response = this.exchangePrice(context.req.body.product, JSON.parse(data));
						var jsonResponse = JSON.stringify( response );
						context.res.send(jsonResponse);
				  });
				}).on("error", (err) => { console.log("Error: " + err.message); });
			} else {
				context.res.send(JSON.stringify( {"RUB": 0,"EUR": 0,"USD": 0} ));
			}
			return;
		}
		else {
			var params = {
				tag_title: "Корзина",
				tag_h1: "Корзина",
				tag_main: context.module.render("cart.ejs", {}),
			};
			main.controllers.template.main(context, params);
		}
	};
	this.exchangePrice = function(products, market) {
		var result = {
				"RUB": 0,
				"EUR": 0,
				"USD": 0
		};
		var summa = {"RUB": 0,"EUR": 0,"USD": 0};
		products.forEach(function(product,k){
			if('price' in product && 'currency' in product && 'quantity' in product) {
				if(product.currency in summa) {
					summa[ product.currency ] += product.price * product.quantity;
				}
			}
		});
		result["RUB"] = summa["RUB"];
		result["RUB"] += market.Valute["EUR"].Value * summa["EUR"];
		result["RUB"] += market.Valute["USD"].Value * summa["USD"];
		result["EUR"] = (result["RUB"] / market.Valute["EUR"].Value).toFixed(2);
		result["USD"] = (result["RUB"] / market.Valute["USD"].Value).toFixed(2);
		result["RUB"] = result["RUB"].toFixed(2);

		return result;
	}
};
module.exports = new cartController;
