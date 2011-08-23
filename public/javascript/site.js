$.tablesorter.addParser({
  id: 'positions',
  is: function(s) { return false; },
  format: function(s) { return s.match(/\d+/); },
  type: 'numeric'
});

$(document).ready(function() {

  $("#position-table").tablesorter({ sortList: [[0, 0]] });

  $(".load_analysis_image").click(function(){
    var sibs = $(this).parent().siblings();
    var to_text = function(n) { return n.firstChild.data };
    var pos = to_text(sibs[0]) + "-" + to_text(sibs[1]);
    var family = sibs[3].children[0].text;
    var img_src = '/images/positions/' + family + '_' + pos + '.png';
    $("#analysis_image").attr('src', img_src);
  });

  $(".load_family_image").click(function(){
    var family = $(this).text();
    var img_src = '/images/families/' + family + '.png';
    $("#analysis_image").attr('src', img_src);
  });
});
