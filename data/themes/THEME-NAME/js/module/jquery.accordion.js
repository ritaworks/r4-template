// option

// size: pc(初期値) tb
// SP_WIDTH: 768(初期値)
// aTagAutoClose: false(初期値) true
// textChange: false(初期値) true
// aTagClassAdd: false（初期値） true
// position: normal(初期値) absolute
// borderRadius：0（初期値）

(function (a) {
  a.fn.accordion = function (option) {
    //accordionのオプション一覧
    var s = {
      size: 'pc', // accordionが動くサイズを設定します。（tbで設定する場合タブレット以下のみ動く）
      SP_WIDTH: 768, // タブレット時に動かす横幅のサイズを設定します。
      aTagAutoClose: false, // accordionで開いたボックスの中にあるaタグをクリックした場合に自動的に開いたボックスをそのままにするか閉じるかする（otherCloseとは違います）
      textChange: false, // accordionで開いたボックスの中にあるaタグをクリックした時にaccordionのテキストをaタグと同じテキストにするかどうか
      aTagClassAdd: false, // accordionで開いたボックスの中にあるaタグをクリックした場合、aタグのclassをaccodionのタグにもclassを追加する（親要素のタブによって色などが変わる場合、使います。、addClassとは違います。）
      position: 'normal', // accordionボックスのpositionを設定できます。
      borderRadius: 0 //accordionのテキストにborder-radiusが設定されている場合その数値と同じくする
    }

    // 横幅のresize時にも反応できるようにするためのもの
    var oneChange = [0, 1];

    s = $.extend({}, s, option);

    // accordionの動きを動きを入れてくれるイベント（slideToggle）
    function accordionEvent(e) {
      e.toggleClass('active');
      e.next().slideToggle();
      e.next().addClass('check');
    }

    // accordionボタンにマウスポイントのCSSを追加
    function pointEvent(e) {
      e.css('cursor', 'pointer');
      e.next().css('display', 'none');
    }

    // accordionで開かれるボックスのposition設定
    function positionEvent(e) {
      e.parent().css('position', 'relative');
      e.parent().css('z-index', '10');
      e.next().css('position', 'absolute');
      e.next().css('top', e.outerHeight() - 1 - s['borderRadius'] + 'px');
    }

    // pcかtbかを判別してマウスポイントのcssを出すかどうかの判別
    if (s['size'] == 'pc') {
      pointEvent($(this));
      if (s['position'] == 'absolute') {
        positionEvent($(this));
      }
    } else if (s['size'] == 'tb') {
      if ($(window).width() <= s['SP_WIDTH']) {
        pointEvent($(this));
        oneChange[0]++;
        oneChange[1]--;

        if (s['position'] == 'absolute') {
          positionEvent($(this));
        }
      }
    }

    // accordionを動かすかどうか（pc、tb）
    $(this).on('click', function () {
      if (s['size'] == 'pc') {
        accordionEvent($(this));
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['SP_WIDTH']) {
          accordionEvent($(this));
        }
      }
    });

    // accordionで開いたボックスの中にあるaタグをクリックした場合、aタグのclassをaccodionのタグにもclassを追加する（親要素のタブによって色などが変わる場合、使います。、addClassとは違います。）
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
        if ($(window).width() <= s['SP_WIDTH']) {
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


    // 画面のresizeにも対応できる
    var tag = $(this);
    $(window).resize(function () {
      if (s['size'] == 'pc') {
        pointEvent(tag);
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['SP_WIDTH']) {
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