class Model
  constructor: (@number, @data, @shown = false) ->

  load: (url, neighborhood = false) =>
    display = this.display
    $.post url, { model: @data },
      (d) ->
        jmolScript("load DATA \"append structure\"\n" + d + 'end "append structure";')
        display(neighborhood)

  style: =>
    jmolScript('select [U]/' + @number + '.1; color navy;')
    jmolScript('select [G]/' + @number + '.1; color chartreuse;')
    jmolScript('select [C]/' + @number + '.1; color gold;')
    jmolScript('select [A]/' + @number + '.1; color red;')
    jmolScript('select */' + @number + '.2; color grey;')
    jmolScript('select ' + @number + '.2; color translucent 0.8;')
    jmolScript('select ' + @number + '.0;spacefill off;center 1.1;')

  display: (neighborhood) =>
    if neighborhood
      jmolScript("frame *;display displayed or " + @number + '.0')
    else
      jmolScript("frame *;display displayed or " + @number + '.1')
      jmolScript("frame *;display displayed and not " + @number + '.2')
    this.superimpose()
    this.style()
    jmolScript('center 1.1')
    @shown = true

  hide: =>
    jmolScript("frame *; display displayed and not " + @number + '.0')
    @shown = false

  toggle_display: (neighborhood) =>
    if @shown then this.hide() else this.display(neighborhood)

  superimpose: =>
    if @number > 1
      for i in [0..2]
        do () ->
					jmolScript('x=compare({*.P/' + @number + '.1},{*.P/1.1});')
					jmolScript('select ' + @number + '.0; rotate selected @{x};')

class Loader
  constructor: (@url, @data_key = 'data-nt', @neighborhood = false) ->
    @models = []
    @active = []
    @size = 1

  add_model: (id, data) =>
    model = new Model(@size, data)
    model.load(@url, @neighborhood)
    @models[id] = model
    @size += 1
    model

  hide_active: =>
    @models[id].hide() for id in @active
    @active = []
    true

  toggle: (id, data) =>
    if !@models[id]
      this.add_model(id, data)
    @models[id].toggle_display(@neighborhood)
    if @models[id]['shown']
      @active.push(id)

  toggle_neighborhood: () =>
    @neighborhood = !@neighborhood
    @models[id].display(@neighborhood) for id in @active
    @neighborhood

$(document).ready ->
  loader = new Loader('http://leontislab.bgsu.edu/Motifs/jmolInlineLoader/nt_coord.php')

  update_data = (box_selector, id, data) ->
    $(box_selector).attr('model', id)
    $(box_selector).attr('data', data)

  $('.display-nt').click ->
    loader.toggle($(this).attr('model'), $(this).attr('data'))
    true

  $('#neighborhood').click ->
    this.value = (if loader['neighborhood'] then 'Show neighborhood' else 'Hide neighborhood')
    loader.toggle_neighborhood()
    true

  $('.load_analysis_image').click ->
    show_if = (box_selector, id, data) ->
      if $(box_selector).attr('checked')
        loader.toggle(id, data)
    update_data('#ec-box', $(this).attr('id') + '-ec', $(this).attr('ec'))
    update_data('#tt-box', $(this).attr('id') + '-tt', $(this).attr('tt'))
    loader.hide_active()
    show_if('#ec-box', $(this).attr('id') + '-ec', $(this).attr('ec'))
    show_if('#tt-box', $(this).attr('id') + '-tt', $(this).attr('tt'))
    true
  true

# vim: ft=coffee
