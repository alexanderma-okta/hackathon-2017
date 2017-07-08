/* global $ */
$(document).ready(function () {
  $('#nav-primary > li.top-menu a').each(function () {
    var id = '#' + $(this).attr('id');
    $(id).parent('li').hoverIntent({
      // sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
      interval: 30,   // number = milliseconds of polling interval
      over: function () {
        $(id + ' + ul').show();
      },
      timeout: 30,   // number = milliseconds delay before onMouseOut function call
      out: function () {
        $(id + ' + ul').hide();
      }
    });
  });
});