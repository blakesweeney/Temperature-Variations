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

  $("#position-table").tablesorter({ 
    sortList: [[0, 0]],
    headers: { 
      3: { sorter: 'bpfamily' }
    }
  });

  $(".load_analysis_image").click(function(){
    var sibs = $(this).parent().siblings();
    var to_text = function(n) { return n.firstChild.data };
    var pos = to_text(sibs[0]) + "-" + to_text(sibs[1]);
    var family = to_text(sibs[3]);
    var img_src = base_image() + 'positions/' + family + '_' + pos + '.png';

    // Set color
    $(this).closest("tr").siblings().removeClass("selected_color");
    $(this).parents("tr").toggleClass("selected_color");

    $("#analysis_image").attr('src', img_src);
    $("#analysis_data").text(pos);
  });

  $(".load_family_image").click(function(){
    var family = $(this).text();
    var img_src = base_image() + 'families/' + family + '.png';
    $("#analysis_image").attr('src', img_src);
    $("#analysis_data").text(family);
  });
});

function is_production() {
  return window.location.hostname.match("rna");
}

function base_image() {
  return (is_production() ? "/variation_data/images/" : "/images/");
}
