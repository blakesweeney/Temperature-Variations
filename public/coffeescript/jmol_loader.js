(function() {
  var Loader, Model;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Model = (function() {
    function Model(number, data, shown) {
      this.number = number;
      this.data = data;
      this.shown = shown != null ? shown : false;
      this.toggle_display = __bind(this.toggle_display, this);
    }
    Model.prototype.load = function(url) {
      console.log([this.number, this.data]);
      return $.post(url, {
        model: this.data
      }, function(d) {
        jmolScript("load DATA \"append structure\"\n" + d + 'end "append structure";');
        return display();
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
      jmolScript('center 1.1');
      return this.shown = true;
    };
    Model.prototype.hide = function() {
      jmolScript("frame *;display displayed and not " + this.number + '.2');
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
    function Loader(url, data_key, neighborhood, models) {
      this.url = url;
      this.data_key = data_key != null ? data_key : 'data-nt';
      this.neighborhood = neighborhood != null ? neighborhood : false;
      this.models = models != null ? models : {};
      this.toggle_neighborhood = __bind(this.toggle_neighborhood, this);
      this.toggle_model = __bind(this.toggle_model, this);
      this.add_model = __bind(this.add_model, this);
    }
    Loader.prototype.add_model = function(id, data) {
      var model;
      model = new Model(this.models.length, data);
      model.load(this.url);
      this.models[id] = model;
      return model;
    };
    Loader.prototype.toggle_model = function(id, data) {
      if (!this.models[id]) {
        this.add_model(id, data);
        return this.models[id].display(this.neighborhood);
      } else {
        return this.models[id].toggle_display(this.neighborhood);
      }
    };
    Loader.prototype.toggle_neighborhood = function() {
      var id, m, _ref;
      this.neighborhood = !this.neighborhood;
      _ref = this.models;
      for (id in _ref) {
        m = _ref[id];
        m.display(this.neighborhood);
      }
      return this.neighborhood;
    };
    return Loader;
  })();
  $(document).ready(function() {
    var loader;
    loader = new Loader('http://rna.bgsu.edu/research/anton/MotifAtlas/nt_coord.php');
    $('.display-nt').click(function() {
      loader.toggle_model($(this).attr('id'), $(this).attr('data-nt'));
      return true;
    });
    return $('#neighborhood').click(function() {
      loader.toggle_neighborhood;
      return true;
    });
  });
}).call(this);
