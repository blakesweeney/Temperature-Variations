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
  var previous_row = null;
  var data_key = 'data-nt';

  $("#position-table").tablesorter({
    sortList: [[0, 0]],
    headers: {
      2: { sorter: 'bpfamily' },
      6: { sorter: 'bpfamily' }
    }
  });

  $("#position-search").quicksearch("#position-table tbody tr");

  function update_nt_data (selector, data) {
    $(selector).attr(data_key, data);
    $(selector).attr('id', data.replace(/,/g, '-'));
  }

  function watch_box(box_selector, cur_selector, prev_selector) {
    $(box_selector).click(function() {
      $(cur_selector).trigger('click');
      // Toggle the prev so we always hide the previous structures
      $(prev_selector).trigger('click');
      $(prev_selector).trigger('click');
    });
  }

  watch_box("#ec-box", ".current-ec", ".previous-ec");
  watch_box("#tt-box", ".current-tt", ".previous-tt");

  $(".load_analysis_image").click(function(){
    if (selected_row && $(this).attr('id') == selected_row.attr('id')) {
      return false;
    }

    previous_row = selected_row;
    selected_row = $(this);

    if (previous_row) {
      update_nt_data(".previous-ec", previous_row.attr('ec'));
      update_nt_data(".previous-tt", previous_row.attr('tt'));
    }

    update_nt_data(".current-ec", selected_row.attr("ec"));
    update_nt_data(".current-tt", selected_row.attr("tt"));

    var row_id = $(this).attr('id');
    var ind_id = row_id.replace(/\-\w+/, '');
    var pos1 = $("#" + ind_id + "-epos1");
    var pos2 = $("#" + ind_id + "-epos2");
    var pos = pos1.text() + '-' + pos2.text();
    var family = $("#" + ind_id + "-efamily").text().trim();
    var img_src = base_image() + 'positions/' + family + '_' + pos + '.png';

    var selected_class = "red"
    $(this).removeClass(selected_class);
    $(this).siblings().removeClass(selected_class);
    $(this).toggleClass(selected_class);

    $("#analysis_image").attr('src', img_src);
    $("#analysis_data").text(pos1.text() + ' ' + pos2.text());
  });

  function key_action(row, method, default_selector) {
    if (row == null) {
      $(default_selector).trigger('click');
    } else {
      row[method]().trigger('click');
    }
    return false;
  }

  key('down', function() {
    return key_action(selected_row, 'next', '#position-table tbody tr:first');
  });

  key('up', function() {
    return key_action(selected_row, 'prev', '#position-table tbody tr:last');
  });

  // jmol
  jmolInlineLoader.initialize({
    chbxClass: 'display-nt',
    serverUrl: 'http://rna.bgsu.edu/Motifs/jmolInlineLoader/nt_coord.php',
    neighborhoodButtonId: 'neighborhood'
  });
});

function base_image() {
  return (window.location.hostname.match("rna") ? "/variation_data/images/" : "/images/");
}
