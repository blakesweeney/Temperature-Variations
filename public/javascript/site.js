$.tablesorter.addParser({
  id: 'positions',
  is: function(s) { return false; },
  format: function(s) { return s.match(/\d+/); },
  type: 'numeric'
});

$.tablesorter.addParser({
  id: 'bpfamily',
  is: function(s) { return false; },
  format: function(s) { 
    return s.toLowerCase().
      replace(/cww/,1).
      replace(/tww/,2).
      replace(/cwh/,3).
      replace(/twh/,4).
      replace(/cws/,5).
      replace(/tws/,6).
      replace(/chh/,7).
      replace(/thh/,8).
      replace(/chs/,8).
      replace(/ths/,10).
      replace(/css/,11).
      replace(/tss/,12)
    },
    type: 'numeric'
});

$(document).ready(function() {

  var selected_row = null;

  $("#position-table").tablesorter({ 
    sortList: [[0, 0]],
    headers: { 
      2: { sorter: 'bpfamily' },
      6: { sorter: 'bpfamily' }
    }
  });

  $("#position-search").quicksearch("#position-table tbody tr");

  $(".load_analysis_image").click(function(){
    selected_row = $(this);
    var row_id = $(this).attr('id');
    var ind_id = row_id.replace(/\-\w+/, '');
    var pos1 = $("#" + ind_id + "-epos1");
    var pos2 = $("#" + ind_id + "-epos2");
    var pos = pos1.text() + '-' + pos2.text();
    var family = $("#" + ind_id + "-family").text().trim();
    var img_src = base_image() + 'positions/' + family + '_' + pos + '.png';

    var selected_class = "red"
    $(this).removeClass(selected_class);
    $(this).siblings().removeClass(selected_class);
    $(this).toggleClass(selected_class);

    $("#analysis_image").attr('src', img_src);
    $("#analysis_data").text(pos1.text() + ' ' + pos2.text());
  });

  $(".load_family_image").click(function(){
    var family = $(this).text();
    var img_src = base_image() + 'families/' + family + '.png';
    $("#analysis_image").attr('src', img_src);
    $("#analysis_data").text(family);
  });

  key('down', function() {
    if(selected_row == null) {
      selected_row = $('#position-table tbody tr:first');
      selected_row.trigger('click');
    } else {
      selected_row.next().trigger('click');
    }
    return false;
  });

  key('up', function() {
    if (selected_row == null) {
      selected_row = $("#position-table tbody tr:last");
      selected_row.trigger('click');
    } else {
      selected_row.prev().trigger('click');
    }
    return false;
  });
});


function is_production() {
  return window.location.hostname.match("rna");
}

function base_image() {
  return (is_production() ? "/variation_data/images/" : "/images/");
}
