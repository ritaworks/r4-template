// option
// size: pc(初期値) tb
// tbsize: 768(初期値)
// aTagAutoClose: false(初期値) true
// textChange: false(初期値) true
// aTagClassAdd: false（初期値） true
// position: normal(初期値) absolute
// borderRadius：0（初期値）

(function (a) {
  a.fn.accordion = function (option) {
    var s = {
      size: 'pc',
      tbsize: 768,
      aTagAutoClose: false,
      textChange: false,
      aTagClassAdd: false,
      position: 'normal',
      borderRadius: 0
    }

    var oneChange = [0, 1];
    if (option) {
      if (option['size']) {
        s['size'] = option['size'];
      }

      if (option['position']) {
        s['position'] = option['position'];
      }

      if (option['tbsize']) {
        s['tbsize'] = option['tbsize'];
      }

      if (option['aTagAutoClose']) {
        s['aTagAutoClose'] = option['aTagAutoClose'];
      }

      if (option['textChange']) {
        s['textChange'] = option['textChange'];
      }

      if (option['aTagClassAdd']) {
        s['aTagClassAdd'] = option['aTagClassAdd'];
      }

      if (option['borderRadius']) {
        s['borderRadius'] = option['borderRadius'];
      }
    }

    function accordionEvent(e) {
      e.toggleClass('active');
      e.next().slideToggle();
      e.next().addClass('check');
    }

    function pointEvent(e) {
      e.css('cursor', 'pointer');
      e.next().css('display', 'none');
    }

    function positionEvent(e) {
      e.parent().css('position', 'relative');
      e.parent().css('z-index', '2');
      e.next().css('position', 'absolute');
      e.next().css('top', e.outerHeight() - 1 - s['borderRadius'] + 'px');
    }
    if (s['size'] == 'pc') {
      pointEvent($(this));
      if (s['position'] == 'absolute') {
        positionEvent($(this));
      }
    } else if (s['size'] == 'tb') {
      if ($(window).width() <= s['tbsize']) {
        pointEvent($(this));
        oneChange[0]++;
        oneChange[1]--;

        if (s['position'] == 'absolute') {
          positionEvent($(this));
        }
      }
    }

    $(this).on('click', function () {
      if (s['size'] == 'pc') {
        accordionEvent($(this));
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['tbsize']) {
          accordionEvent($(this));
        }
      }
    });

    var classChange = '';
    $(this).next().find('a').on('click', function () {
      if (s['size'] == 'pc') {
        if (s['textChange']) {
          $(this).parents('.check').prev().text($(this).text());
        }
        if (s['aTagClassAdd']) {
          console.log(classChange);
          if (classChange) {
            $(this).parents('.check').prev().removeClass(classChange);
            console.log(classChange);
          }
          classChange = this.classList[0];
          $(this).parents('.check').prev().addClass(this.classList[0]);
        }
        if (s['aTagAutoClose']) {
          $(this).parents('.check').prev().removeClass('active');
          $(this).parents('.check').slideToggle();
          $(this).parents('.check').removeClass('check');
        }
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['tbsize']) {
          if (s['textChange']) {
            $(this).parents('.check').prev().text($(this).text());
          }
          if (s['aTagClassAdd']) {
            if (classChange) {
              $(this).parents('.check').prev().removeClass(classChange);
            }
            classChange = this.classList[0];
            $(this).parents('.check').prev().addClass(this.classList[0]);
          }
          if (s['aTagAutoClose']) {
            $(this).parents('.check').prev().removeClass('active');
            $(this).parents('.check').slideToggle();
            $(this).parents('.check').removeClass('check');
          }
        }
      }
    });

    var tag = $(this);
    $(window).resize(function () {
      if (s['size'] == 'pc') {
        pointEvent(tag);
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['tbsize']) {
          if (oneChange[0] == 0) {
            pointEvent(tag);
            oneChange[0]++;
            oneChange[1]--;

            if (s['position'] == 'absolute') {
              positionEvent(tag);
            }
          }
        } else {
          if (oneChange[1] == 0) {
            tag.css('cursor', '');
            tag.next().css('display', '');
            tag.parent().css('position', '');
            tag.next().css('position', '');
            tag.next().css('top', '');
            oneChange[0]--;
            oneChange[1]++;
          }
        }
      }
    })
  }
})(jQuery);