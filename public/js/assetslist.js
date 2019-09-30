function AssetsList(el) {
  var self = this;
  this.el = el;
  this.update = function(obj) {
    var updated = {};
    for (var sectionId in obj.sections) {
      var section = this.el.querySelector("[data-id='"+sectionId+"']");
      if(!section) {
        var section = document.createElement("ul");
        section.classList.add('assetslist');
        section.dataset.id = sectionId;
        this.el.appendChild( section );
      }
      updated[sectionId] = {};
      for (var i in obj.sections[sectionId]) {
        var elId = obj.sections[sectionId][i].id;
        var el = section.querySelector("[data-id='"+elId+"']");
        var newEl = this.createLi(null, obj.sections[sectionId][i]);
        if(!el) {
          el = newEl;
          section.appendChild( el );
        }
        else {
          el.querySelector('.assetslist-header').innerHTML = newEl.querySelector('.assetslist-header').innerHTML;
        }
        updated[sectionId][elId] = {};
      }
    }
    for (var sectionIndex in this.el.children) {
      var section = this.el.children[sectionIndex];
      if(section.dataset) {
        if (section.dataset.id in updated) {
          for (var elIndex in section.children) {
            var el = section.children[elIndex];
            if(el.dataset) {
              if (!(el.dataset.id in updated[section.dataset.id])) {
                el.remove();
              }
            }
          }
        } else {
          section.remove();
        }
      }
    }
  };
  this.createLi = function(content, options) {
    var liHTML = ejs.compile(self.template)(options);
    var rootDiv = document.createElement("div");
    rootDiv.id = "rootDiv";
    rootDiv.innerHTML = liHTML;
    var liNew = rootDiv.firstChild;
    li = liNew;
    // if(options.events) {
    //   for(var event_name in options.events) {
    //     li.addEventListener(event_name, options.events[event_name]);
    //   }
    // }
    self.initLi(li);
    setEventHandler(li);
    return li;
  };
  this.initLi = function(li) {
    if(self.el.dataset.selectable == '1') {
      li.addEventListener('click', function(e) {
        if(li.dataset.selected == true) {
          self.input.value = '';
          var list = self.el.querySelectorAll("li");
        	for (var i = 0, len = list.length; i < len; i++) {
            var liEl = list[i];
            liEl.dataset.selected = 0;
            liEl.style.display = "";
          }
        } else {
          li.dataset.selected = 1;
          self.input.value = li.dataset.id;
          var list = self.el.querySelectorAll("li");
        	for (var i = 0, len = list.length; i < len; i++) {
            var liEl = list[i];
            if(li != liEl) {
              liEl.dataset.selected = 0;
              liEl.style.display = "none";
            }
          };
        }
        //MyTools.event_personal.fireEvent(self.input,"change");
        $(self.input).change();
      });
    }
  };
  if(this.el) {
    if("name" in this.el.dataset) {
      this.input = document.createElement('input');
      this.input.name = this.el.dataset.name;
      this.input.type = 'hidden';
      this.el.appendChild(this.input);
      //this.input.addEventListener('change', function(e){ if(self.onChange) self.onChange(e); });
      $(self.input).change(function(e){ if(self.onChange) self.onChange(e); });
    }
    (function() {
      var list = self.el.querySelectorAll("li");
    	for (var i = 0, len = list.length; i < len; i++) {
        var liEl = list[i];
        self.initLi(liEl);
      }
    })();
  }
}

AssetsList.isReady = false;
AssetsList.readyList = [];
AssetsList.ready = function(f) {
  if(f) {
    if(AssetsList.isReady) { f(); }
    else { AssetsList.readyList.push(f); }
  }
  else {
    AssetsList.isReady = true;
    for (var i in AssetsList.readyList) {
      var f = AssetsList.readyList[i];
      setTimeout(f,0);
    }
  }
};
document.addEventListener("DOMContentLoaded", function(){
  if(!("template" in AssetsList.prototype)) {
    $.ajax({ url:"/js/assetslist.ejs",
      success:function(response){
        AssetsList.prototype.template = response;
      },
      complete:function(){
        AssetsList.ready();
      }
    });
  } else {
    AssetsList.ready();
  }
});
