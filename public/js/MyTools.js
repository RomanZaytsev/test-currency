var MyTools = {
	start_safariWebAppClicker : function () {// Код предназначен для правильного открывания ссылок через Safari Web App
		(function(a,b) {
			var d,e=a.location,f=/^(a|html)$/i;
			a.addEventListener("click",function(a){
				d=a.target;
				while(!f.test(d.nodeName))d=d.parentNode;
				if(d.href !== undefined && d.href.trim() !== "") {
				("href" in d) && (d.href.toLowerCase().indexOf("http") || ~d.href.toLowerCase().indexOf(e.host.toLowerCase())) && (a.preventDefault(),e.href=d.href);
				}
			},!1);
		})(document,window.navigator);
	},
	rollMoreListeners : function () { // Сворачивать блоки
		$('.roll-more').not('.opened').each(function(key,val){ $(val).closest( "div.information" ).find('.more').first().hide() });
		$('.roll-more.opened').each(function(key,val){ $(val).closest( "div.information" ).find('.more').first().show() });
		$('.roll-more').not('.found').click(function() {
			var form = $( this ).closest( "div.information" );
			if($(this).hasClass('opened')) {
				form.find('.more').first().slideUp(500);
				$(this).removeClass('opened');
			} else {
				form.find('.more').first().slideDown(500);
				$(this).addClass('opened');
			}
		}).addClass("found");
	},
	fillBlock : function (block,area) { // Вписать блок в рамки окна
		block.style.height = area.innerHeight - parseInt(block.getBoundingClientRect().top) -20 +"px";
		block.style.width = area.innerWidth - parseInt(block.getBoundingClientRect().left) -20 +"px";
	},
	PopupCenter: function(url, title, w, h) {
		var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
		var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 2) - (h / 2)) + dualScreenTop;
		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

		if (window.focus) {
		    newWindow.focus();
		}
		return newWindow;
	},
	isFunction : function (functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	},
	encode_utf8 : function ( s ) { // из windows-1251 (cp1251) в utf-8
		return unescape( encodeURIComponent( s ) );
	},
	decode_utf8 : function ( s ) { // из utf-8 в windows-1251 (cp1251)
		return decodeURIComponent( escape( s ) );
	},
	ajax : function (obj) {
		var xhr = new XMLHttpRequest();
		var method = ("method" in obj) ? obj.method :"GET";
		var dataString = "";
		for(var name in obj.data) {
			if(dataString != "") dataString += "&";
			dataString += ( encodeURIComponent(name)+"="+encodeURIComponent(obj.data[name]) );
		}
		var body = "";
		var params = "";
		if(method.toLowerCase() == "get" && dataString != "") {
			if(obj.url.indexOf('?') < 0) params = "?"+dataString;
			else params = "&"+dataString;
		} else {
			body = dataString;
		}
		//xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		if(method.toLowerCase() == "post") {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Accept", "*/*");
		}
		xhr.onreadystatechange = function ()
		{
			switch(xhr.readyState) {
				case 4: // DONE
					try{
						if(xhr.status === 200 || xhr.status == 0)
						{
							if(typeof obj.success == 'function') {
								obj.success({
									data: (obj.dataType=="json" ? JSON.parse( xhr.responseText ) : xhr.responseText),
									status: xhr.status,
								});
							}
						} else {
							if(typeof obj.error == 'function') {
								obj.error({
									data: xhr.responseText,
									status: xhr.status,
								});
							}
						}
					} catch(e) {}
					if(typeof obj.complete == 'function') {
						obj.complete();
					}
					break;
			}
		}
		xhr.open(method, (obj.url+params), true);
		xhr.send(body);
		/*
		ajax({
			url:"http://localhost",
			data: {period:'week'},
			method:"GET",
			success:function(response){ console.log(response.data); }
		})
		*/
	},
	trim: function (s, c) {
	if (c === "]") c = "\\]";
	if (c === "\\") c = "\\\\";
	return s.replace(new RegExp(
		"^[" + c + "]+|[" + c + "]+$", "g"
	), "");
	},
	serialize: function (form) {
		var obj = {};
		var elements = form.querySelectorAll( "input, select, textarea" );
		for( var i = 0; i < elements.length; ++i ) {
			var element = elements[i];
			var name = element.name;
			var value = element.value;
			if( name ) {
				if(element.getAttribute("type") == "radio" || element.getAttribute("type") == "checkbox") {
					if(element.checked) {
						obj[ name ] = value;
					}
				}
				else {
					obj[ name ] = value;
				}
			}
		}
		return obj;
	},
	sortByParameter: function(arr, name) {
		if(typeof this.propComparator == "undefined") {
			this.propComparator = function(prop) {
		    return function(a, b) {
		        return a[prop] - b[prop];
		    }
			}
		}
		return arr.sort(propComparator(name));
	},
	xmlNodeToText : function (xmlNode) {
		var xmlText = (new XMLSerializer()).serializeToString(xmlNode);
		return xmlText;
	},
	newBlob : function (data, mimeString) {
		try {
			return new Blob([data], {type: mimeString});
		} catch (e) {
			// The BlobBuilder API has been deprecated in favour of Blob, but older
			// browsers don't know about the Blob constructor
			// IE10 also supports BlobBuilder, but since the `Blob` constructor
			//  also works, there's no need to add `MSBlobBuilder`.
			var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder || window.BlobBuilder;
			var bb = new BlobBuilder();
			bb.append(data);
			return bb.getBlob(mimeString);
		}
	},
	writeBlobToFile : function (blob, file) {
		file.entry.createWriter(function(fileWriter) {
			fileWriter.onwriteend = function(e) {
				console.log('Write completed.');
			};
			fileWriter.onerror = function(e) {
				console.log('Write failed: ' + e.toString());
			};
			fileWriter.write(blob);
		}, function(e){console.error(e);} );
	},
	nextTabindex : function (el) {
		var frm = el.form;
		for (var i = 0; i < frm.elements.length; i++) {
			if (frm.elements[i].tabIndex == el.tabIndex + 1) {
				frm.elements[i].focus();
			}
		}
	},
	addResizeendEventListener : function (element, action) {
		var event; // The custom event that will be created
		if (document.createEvent) {
			event = document.createEvent("HTMLEvents");
			event.initEvent("resizeend", true, true);
		} else {
			event = document.createEventObject();
			event.eventType = "resizeend";
		}
		event.eventName = "resizeend";
		var rtime;
		var timeout = false;
		var delta = 50;
		function resizeend() {
			if (new Date() - rtime < delta) {
				setTimeout(resizeend, delta);
			} else {
				timeout = false;
				if(typeof action == "function") {
					action(event);
				} else {
					if (document.createEvent) {
						element.dispatchEvent(event);
					} else {
					  element.fireEvent("on" + event.eventType, event);
					}
				}
			}
		}
		element.addEventListener("resize",function() {
			rtime = new Date();
			if (timeout === false) {
				timeout = true;
				setTimeout(resizeend, delta);
			}
		});
	},
	event_personal : new (function() {
		var self = this;
		this.add = function (element, event, listener){
			if (element.addEventListener) {
				element.addEventListener(event, listener, false);
			} else if (element.attachEvent)  {
				element.attachEvent("on"+event, listener); }
		};
		this.remove = function (element, event, listener){
			if (element.removeEventListener) {
				element.removeEventListener( event, listener );
			} else if (element.detachEvent)  {
				element.detachEvent("on"+event, listener); }
		};
		this.fireEvent = function(element,eventName,params) {
			if (document.createEventObject)
			{
				// Создаем объект событие (для IE не обязательно, но полезно знать, чтоб
				// передавать "синтетические" свойства события обработчику(ам)):
				var evt = document.createEventObject();
				for(var key in params) { evt[key] = params[key]; }
				// Запускаем событие на элементе:
				element.fireEvent(eventName, evt);
			} else if (document.createEvent) {
				// Создаем объект событие:
				var evt = document.createEvent("HTMLEvents");
				for(var key in params) { evt[key] = params[key]; }
				// Инициализируем:
				evt.initEvent(eventName, false, false);
				// Запускаем на элементе:
				element.dispatchEvent(evt);
			} else {
				return false;
			}
		}
		this.AET = function (element, listener){ // Устанавливает обработчик для CSS события TransitionEnd
			self.add( element, "webkitTransitionEnd", listener );
			self.add( element, "transitionend", listener );
			self.add( element, "msTransitionEnd", listener );
			self.add( element, "oTransitionEnd", listener );
		};
		this.RET = function (element, listener){ // Удаляет обработчик для CSS события TransitionEnd
			self.remove( element, "webkitTransitionEnd", listener );
			self.remove( element, "transitionend", listener );
			self.remove( element, "msTransitionEnd", listener );
			self.remove( element, "oTransitionEnd", listener );
		};
	})(),
	getObjectClass : function (obj) {
		if (typeof obj === "undefined")
			return "undefined";
		if (obj === null)
			return "null";
		if (obj.constructor) {
			if(obj.constructor.name) {
				return obj.constructor.name;
			}
			if(obj.constructor.toString) {
				var arr = obj.constructor.toString().match(/function\s*(\w+)/);
				if (arr && arr.length == 2) {
					return arr[1];
				}
			}
		}
		if (Object.prototype && Object.prototype.toString) {
			return Object.prototype.toString.call(obj)
				match(/^\[object\s(.*)\]$/)[1];
		}
		return undefined;
	},
	objectToString: function(obj) {
		var result = "";
		switch (typeof obj) {
			case "object":
			  for (var name in obj) {
					var value = null;
					if(obj[name] != null) {
						if(typeof obj[name] == "number") {
							value = obj[name].toString();
						}
						else {
							value = `\"`+obj[name].toString()+`\"`;
						}
					}
			    result += name + ":" + value + ",\n";
			  }
				return '{'+result+'}';
				break;
			case "function":
				return obj.toString();
				break;
			default:
		}
	},
	stringToObject: function(str) {
		try {
			return eval("(function() { return "+str+"; })()");
		} catch (e) { } finally { }
	},
	evalObject: function(data) {
		switch (typeof data) {
			case 'function':
				data();
				break;
			case 'object':
				for (var index in data) {
					this.evalObject(data[index]);
				}
				break;
		};
	},
	randomString : function (number) {
		if(number == undefined) number = 6;
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < number; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	},
	cookie: {
		create : function (name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		read : function (name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		erase : function (name) {
			this.create(name,"",-1);
		}
	},
	getRandomColor:	function () {
			if(this.number == undefined) this.number = 0.23387129164964926;
		    var letters = '0123456789ABCDEF';
		    var color = "";
		    for (var i = 0; i < 6; i++ ) {
					this.number = (this.number+0.9096207405260299);
					this.number = this.number - parseInt(this.number);
	        color += letters[parseInt(this.number*1000)%16];
		    }
		    return '#'+color;
		},
	destroy: function (obj) {
    for(var prop in obj){
        var property = obj[prop];
        if(property != null && typeof(property) == 'object') {
            this.destroy(property);
        }
        obj[prop] = null;
				delete obj[prop];
    }
	},
	starter : function(functions, callback) {
		if(functions.length == 0) {
			if(this.isFunction(callback)) callback();
		}
		else {
			var counter = 0;
			functions.forEach(function(f){
				setTimeout(function(){
					f(function() {
						if(++counter == functions.length && MyTools.isFunction(callback) ) {
							callback();
						}
					});
				},0);
			});
		}
	},
	dirLoader : function(fs,dir,obj,callback) {
		if(fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
			fs.readdir(dir, function(err, files) {
				files.forEach(function(file) {
					var fileMatch = file.match("(.*)\.js$");
					if((fileMatch instanceof Array) && (1 in fileMatch)) {
						obj[ fileMatch[1] ] = require(dir+"/"+file);
					}
				});
				callback(obj);
			});
		} else {
			callback(obj);
		}
	},
	moduleLoader : function(fs, path, obj, callback) {
		MyTools.starter([
			function(callback_1) {
				if(obj.controllers == undefined) obj.controllers = {};
				MyTools.dirLoader(fs, path+"/controllers", obj.controllers, callback_1);
			},
			function(callback_1) {
				if(obj.libs == undefined) obj.libs = {};
				MyTools.dirLoader(fs, path+"/libs", obj.libs, callback_1);
			},
			function(callback_1) {
				if(obj.models == undefined) obj.models = {};
				MyTools.dirLoader(fs, path+"/models", [], function(modelsfiles) {
					for (var name in modelsfiles) {
						obj.models[name] = modelsfiles[name].init(obj);
					}
					callback_1();
				});
			},
			function(callback_1) {
				fs.readdir(path+"/modules", function(err, dirs) {
					if(dirs) {
						var modules = [ ];
						dirs.forEach(function(dir) {
							var module_path = path+"/modules/"+dir;
							if(fs.lstatSync(module_path).isDirectory()) {
								if(obj.modules == undefined) obj.modules = {};
								obj.modules[dir] = new (require(module_path+"/index.js"))();
								obj.modules[dir].parentModule = obj;
								obj.modules[dir].name = dir;
								modules.push( {obj:obj.modules[dir], path:module_path} );
							}
						});
						var modules_loaders = [];
						modules.forEach(function(module) {
							modules_loaders.push(function(callback_2){ MyTools.moduleLoader(fs, module.path, module.obj, callback_2); } );
						});
						MyTools.starter(modules_loaders,callback_1);
					}
					else { callback_1(); }
				});
			},
		], callback );
	},
	evalInContext : function(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
	},
	dump : function (obj,depth,tab) {
		var out = '';
		if(typeof depth == "undefined") depth = 1;
		if(typeof tab == "undefined") tab = '';
		for (var i in obj) {
			out += tab+i + ": ";
			if(typeof obj[i] == "object" && obj[i] && depth) {
				out += "{\n";
				out += this.dump(obj[i], depth-1, tab+"	");
				out += tab+"}";
			}
			else {
				try {
					if(this.isFunction(obj[i])) {
						out += "[function]";
					} else if(obj[i] == null) {
						out += "[null]";
					} else {
						out += obj[i];
					}
				} catch (e) { out += "[object Object]"; }
			}
			out += "\n";
		}
		return out;
	},
	SHA256 : function (s) {
	    var chrsz = 8;
	    var hexcase = 0;

	    function safe_add(x, y) {
	        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	        return (msw << 16) | (lsw & 0xFFFF);
	    }

	    function S(X, n) {
	        return (X >>> n) | (X << (32 - n));
	    }

	    function R(X, n) {
	        return (X >>> n);
	    }

	    function Ch(x, y, z) {
	        return ((x & y) ^ ((~x) & z));
	    }

	    function Maj(x, y, z) {
	        return ((x & y) ^ (x & z) ^ (y & z));
	    }

	    function Sigma0256(x) {
	        return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	    }

	    function Sigma1256(x) {
	        return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	    }

	    function Gamma0256(x) {
	        return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	    }

	    function Gamma1256(x) {
	        return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	    }

	    function core_sha256(m, l) {
	        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
	        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
	        var W = new Array(64);
	        var a, b, c, d, e, f, g, h, i, j;
	        var T1, T2;
	        m[l >> 5] |= 0x80 << (24 - l % 32);
	        m[((l + 64 >> 9) << 4) + 15] = l;
	        for (var i = 0; i < m.length; i += 16) {
	            a = HASH[0];
	            b = HASH[1];
	            c = HASH[2];
	            d = HASH[3];
	            e = HASH[4];
	            f = HASH[5];
	            g = HASH[6];
	            h = HASH[7];
	            for (var j = 0; j < 64; j++) {
	                if (j < 16) W[j] = m[j + i];
	                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
	                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
	                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
	                h = g;
	                g = f;
	                f = e;
	                e = safe_add(d, T1);
	                d = c;
	                c = b;
	                b = a;
	                a = safe_add(T1, T2);
	            }
	            HASH[0] = safe_add(a, HASH[0]);
	            HASH[1] = safe_add(b, HASH[1]);
	            HASH[2] = safe_add(c, HASH[2]);
	            HASH[3] = safe_add(d, HASH[3]);
	            HASH[4] = safe_add(e, HASH[4]);
	            HASH[5] = safe_add(f, HASH[5]);
	            HASH[6] = safe_add(g, HASH[6]);
	            HASH[7] = safe_add(h, HASH[7]);
	        }
	        return HASH;
	    }

	    function str2binb(str) {
	        var bin = Array();
	        var mask = (1 << chrsz) - 1;
	        for (var i = 0; i < str.length * chrsz; i += chrsz) {
	            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
	        }
	        return bin;
	    }

	    function Utf8Encode(string) {
	        string = string.replace(/\r\n/g, "\n");
	        var utftext = "";
	        for (var n = 0; n < string.length; n++) {
	            var c = string.charCodeAt(n);
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            } else if ((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            } else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	        }
	        return utftext;
	    }

	    function binb2hex(binarray) {
	        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	        var str = "";
	        for (var i = 0; i < binarray.length * 4; i++) {
	            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
	                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
	        }
	        return str;
	    }
	    s = Utf8Encode(s);
	    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
	},
};
try {
	module.exports = MyTools;
} catch(e) {}
