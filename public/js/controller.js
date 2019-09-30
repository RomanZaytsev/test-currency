var unload_functions = [];
window.focused = document.hasFocus();
window.onfocus = function () {
    window.focused = true;
};
window.onblur = function () {
    window.focused = false;
};

function normalizeLayout() {
	var menu = document.getElementsByTagName("menu")[0];
	var main = document.getElementsByTagName("main")[0];
}
function setEventHandler(root) {
	if(typeof root == "undefined") root = document;
	if(!('querySelectorAll' in root)) return;
	var elements = root.querySelectorAll("*[data-event]");
	function setEvent(element) {
		try {
			var events = eval("(function() { return {"+element.dataset.event+"}; })()");
			for (var name in events) {
				MyTools.event_personal.add(element, name, events[name]);
			}
			element.removeAttribute("data-event");
		} catch(e) { console.error(e); }
	}
	for (var i = 0, len = elements.length; i < len; i++) {
		var element = elements[i];
		setEvent(element);
	}
	if('dataset' in root && 'event' in root.dataset) setEvent(root);

  if( window.authorized ) $("#bodyContent").addClass("authorized");
  else $("#bodyContent").removeClass("authorized");
  if(window.onLoadEvents) {
    for (var eventName in window.onLoadEvents) {
      var event = window.onLoadEvents[eventName];
      event();
      delete window.onLoadEvents[eventName];
    }
  }
}
function openLink(url,pushState) {
	$.ajax({
		url: url,
		data: {},
		method:"GET",
		beforeSend: function(xhr) {
			$('.linePreloader').show();
	    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	  },
		//dataType:'json',
		success: function(html, textStatus, xhr) {
		  for(var i in unload_functions) {
		  	unload_functions[i]();
				delete unload_functions[i];
		  }
			unload_functions = [];
			try { document.title = /<title[^>]*>((.|[\n\r])*)<\/title>/im.exec(html)[1]; } catch(e){}
			var tags = ["#context_variables", "#bodyContent"];
			var $html = $('<div></div>').append(html);
			for(var i in tags) {
				var tag = tags[i];
				var el = $(tag);
				if(0 in el) {
					var matches = false;
					if("body" == tag) {
						matches = html.match("<"+tag+"[^>]*>((.|[\n\r])*)<\/"+tag+">")[0];
					} else {
						var find = $html.find(tag)
						if(0 in find) matches = find[0].outerHTML;
					}
					if(matches) {
						el[0].outerHTML = matches;
						console.log(el[0].attributes);
						var $div = $('<div></div>').append(matches);
						MyTools.evalInContext($div.find("script").text().trim(), window);
					}
				}
			}
			window.scrollTo(0,0);
			setEventHandler();
		},
		error: function(xhr, status, errorThrown) {
			window.location.href = url;
			console.error(status);
		},
		complete: function(xhr) {
      console.log('openLink: ',url);
      if(pushState) history.pushState({ 'title': document.title, 'type':'openLink' }, null, url);
			var href = xhr.getResponseHeader('href');
			if(!href) href = url;
			else href = href.replace('http:',window.location.protocol);
			$('.linePreloader').hide();
			menuToggle("close");
		}
	});
}
MyTools.event_personal.add(document, "DOMContentLoaded", function() {
	normalizeLayout();
	MyTools.event_personal.AET(document.body, normalizeLayout);
	setEventHandler();
})
function menuToggle(action) {
	var container = document.querySelector("#bodyContent");
	if((action!="open") && (action=="close" || $(container).hasClass("menu-opened"))) {
		$(container).removeClass('menu-opened');
	} else {
		$(container).addClass('menu-opened');
	}
	return false;
}
function ajaxFormOpenLink(e) {
	e.preventDefault();
	var form = e.target;
	var url = form.dataset.ajaxaction ? window.location.protocol+"//"+window.location.host+form.dataset.ajaxaction : form.action;
	url += "?";
	var data = MyTools.serialize(form);
	for (var i in data) {
		url += i + "=" + data[i] + "&";
	}
	url = MyTools.trim(url,"&");
	openLink(url,true);
}
function ajaxFormSubmit(e) {
	e.preventDefault();
	var form = e.target;
  var url = form.action;
  if(form.dataset.ajaxaction) {
  	url = form.dataset.ajaxaction;
  	if(url[0] != '/' && typeof pathToCurrentModule == "string") {
  		url = pathToCurrentModule + '/' + url;
  	}
    url = window.mainPath + url;
  }
	var set = {
		url: url,
		data: $( form ).serialize(),
		method:form.getAttribute('method'),
		dataType:'json',
		beforeSend: function(xhr) {
			$('.linePreloader').show();
		},
		success: function(data, textStatus, XHR) {
      MyTools.event_personal.fireEvent(form,"success",{response:data});
		},
		error: function(XHR, status, errorThrown) {
			MyTools.event_personal.fireEvent(form,"error");
		},
		complete: function(xhr) { $('.linePreloader').hide(); }
	};
	$.ajax(set);
}
