(function() {
  var Loader, Model;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Model = (function() {
    function Model(number, data, shown) {
      this.number = number;
      this.data = data;
      this.shown = shown != null ? shown : false;
      this.superimpose = __bind(this.superimpose, this);
      this.toggle_display = __bind(this.toggle_display, this);
      this.hide = __bind(this.hide, this);
      this.display = __bind(this.display, this);
      this.style = __bind(this.style, this);
      this.load = __bind(this.load, this);
    }
    Model.prototype.load = function(url, neighborhood) {
      var display;
      if (neighborhood == null) {
        neighborhood = false;
      }
      display = this.display;
      return $.post(url, {
        model: this.data
      }, function(d) {
        jmolScript("load DATA \"append structure\"\n" + d + 'end "append structure";');
        return display(neighborhood);
      });
    };
    Model.prototype.style = function() {
      jmolScript('select [U]/' + this.number + '.1; color navy;');
      jmolScript('select [G]/' + this.number + '.1; color chartreuse;');
      jmolScript('select [C]/' + this.number + '.1; color gold;');
      jmolScript('select [A]/' + this.number + '.1; color red;');
      jmolScript('select */' + this.number + '.2; color grey;');
      jmolScript('select ' + this.number + '.2; color translucent 0.8;');
      return jmolScript('select ' + this.number + '.0;spacefill off;center 1.1;');
    };
    Model.prototype.display = function(neighborhood) {
      if (neighborhood) {
        jmolScript("frame *;display displayed or " + this.number + '.0');
      } else {
        jmolScript("frame *;display displayed or " + this.number + '.1');
        jmolScript("frame *;display displayed and not " + this.number + '.2');
      }
      this.superimpose();
      this.style();
      jmolScript('center 1.1');
      return this.shown = true;
    };
    Model.prototype.hide = function() {
      jmolScript("frame *; display displayed and not " + this.number + '.0');
      return this.shown = false;
    };
    Model.prototype.toggle_display = function(neighborhood) {
      if (this.shown) {
        return this.hide();
      } else {
        return this.display(neighborhood);
      }
    };
    Model.prototype.superimpose = function() {
      var i, _fn;
      if (this.number > 1) {
        _fn = function() {};
        for (i = 0; i <= 2; i++) {
          _fn();
        }
      }
      jmolScript('x=compare({*.P/' + this.number + '.1},{*.P/1.1});');
      return jmolScript('select ' + this.number + '.0; rotate selected @{x};');
    };
    return Model;
  })();
  Loader = (function() {
    function Loader(url, data_key, neighborhood) {
      this.url = url;
      this.data_key = data_key != null ? data_key : 'data-nt';
      this.neighborhood = neighborhood != null ? neighborhood : false;
      this.toggle_neighborhood = __bind(this.toggle_neighborhood, this);
      this.toggle = __bind(this.toggle, this);
      this.hide_active = __bind(this.hide_active, this);
      this.add_model = __bind(this.add_model, this);
      this.models = [];
      this.active = [];
      this.size = 1;
    }
    Loader.prototype.add_model = function(id, data) {
      var model;
      model = new Model(this.size, data);
      model.load(this.url, this.neighborhood);
      this.models[id] = model;
      this.size += 1;
      return model;
    };
    Loader.prototype.hide_active = function() {
      var id, _i, _len, _ref;
      _ref = this.active;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        this.models[id].hide();
      }
      this.active = [];
      return true;
    };
    Loader.prototype.toggle = function(id, data) {
      if (!this.models[id]) {
        this.add_model(id, data);
      }
      this.models[id].toggle_display(this.neighborhood);
      if (this.models[id]['shown']) {
        return this.active.push(id);
      }
    };
    Loader.prototype.toggle_neighborhood = function() {
      var id, _i, _len, _ref;
      this.neighborhood = !this.neighborhood;
      _ref = this.active;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        this.models[id].display(this.neighborhood);
      }
      return this.neighborhood;
    };
    return Loader;
  })();
  $(document).ready(function() {
    var loader, update_data;
    loader = new Loader('http://leontislab.bgsu.edu/Motifs/jmolInlineLoader/nt_coord.php');
    update_data = function(box_selector, id, data) {
      $(box_selector).attr('model', id);
      return $(box_selector).attr('data', data);
    };
    $('.display-nt').click(function() {
      loader.toggle($(this).attr('model'), $(this).attr('data'));
      return true;
    });
    $('#neighborhood').click(function() {
      this.value = (loader['neighborhood'] ? 'Show neighborhood' : 'Hide neighborhood');
      loader.toggle_neighborhood();
      return true;
    });
    $('.load_analysis_image').click(function() {
      var show_if;
      show_if = function(box_selector, id, data) {
        if ($(box_selector).attr('checked')) {
          return loader.toggle(id, data);
        }
      };
      update_data('#ec-box', $(this).attr('id') + '-ec', $(this).attr('ec'));
      update_data('#tt-box', $(this).attr('id') + '-tt', $(this).attr('tt'));
      loader.hide_active();
      show_if('#ec-box', $(this).attr('id') + '-ec', $(this).attr('ec'));
      show_if('#tt-box', $(this).attr('id') + '-tt', $(this).attr('tt'));
      return true;
    });
    return true;
  });
}).call(this);
