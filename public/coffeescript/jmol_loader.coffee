class Model
  constructor: (@number, @data, @shown = false) ->

  load: (url) ->
    console.log([@number, @data])
    $.post url, { model: @data },
      (d) ->
        jmolScript("load DATA \"append structure\"\n" + d + 'end "append structure";')
        display()

  style: ->
    jmolScript('select [U]/' + @number + '.1; color navy;')
    jmolScript('select [G]/' + @number + '.1; color chartreuse;')
    jmolScript('select [C]/' + @number + '.1; color gold;')
    jmolScript('select [A]/' + @number + '.1; color red;')
    jmolScript('select */' + @number + '.2; color grey;')
    jmolScript('select ' + @number + '.2; color translucent 0.8;')
    jmolScript('select ' + @number + '.0;spacefill off;center 1.1;')

  display: (neighborhood) ->
    if neighborhood
      jmolScript("frame *;display displayed or " + @number + '.0')
    else
      jmolScript("frame *;display displayed or " + @number + '.1')
      jmolScript("frame *;display displayed and not " + @number + '.2')
    jmolScript('center 1.1')
    @shown = true

  hide: ->
    jmolScript("frame *;display displayed and not " + @number + '.2')
    @shown = false

  toggle_display: (neighborhood) =>
    if @shown then this.hide() else this.display(neighborhood)

  superimpose: ->
    if @number > 1
      for i in [0..2]
        do () ->
					jmolScript('x=compare({*.P/' + @number + '.1},{*.P/1.1});')
					jmolScript('select ' + @number + '.0; rotate selected @{x};')

class Loader
  constructor: (@url, @data_key = 'data-nt', @neighborhood = false, @models = {}) ->

  add_model: (id, data) =>
    model = new Model(@models.length, data)
    model.load(@url)
    @models[id] = model
    model

  toggle_model: (id, data) =>
    if !@models[id]
      this.add_model(id, data)
      @models[id].display(@neighborhood)
    else
      @models[id].toggle_display(@neighborhood)

  toggle_neighborhood: () =>
    @neighborhood = !@neighborhood
    m.display(@neighborhood) for id,m of @models
    @neighborhood


$(document).ready ->
  loader = new Loader('http://rna.bgsu.edu/research/anton/MotifAtlas/nt_coord.php')
  $('.display-nt').click ->
    loader.toggle_model($(this).attr('id'), $(this).attr('data-nt'))
    true
  $('#neighborhood').click ->
    loader.toggle_neighborhood
    true

# vim: ft=coffee
