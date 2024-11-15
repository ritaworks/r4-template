// option

// v2024.11.15

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
      otherClose: false,
      aTagAutoClose: false, // accordionで開いたボックスの中にあるaタグをクリックした場合に自動的に開いたボックスをそのままにするか閉じるかする（otherCloseとは違います）
      textChange: false, // accordionで開いたボックスの中にあるaタグをクリックした時にaccordionのテキストをaタグと同じテキストにするかどうか
      aTagClassAdd: false, // accordionで開いたボックスの中にあるaタグをクリックした場合、aタグのclassをaccodionのタグにもclassを追加する（親要素のタブによって色などが変わる場合、使います。、addClassとは違います。）
      position: 'normal', // accordionボックスのpositionを設定できます。
      borderRadius: 0, //accordionのテキストにborder-radiusが設定されている場合その数値と同じくする
      pcHide: false, // pc時にボタンを無くす
      parentAccordion: false, // 直下の要素ではなく親の要素
      btnHeight: true, // parentAccordionがtrueの場合動きます、buttonの高さを入れるか入れないか
      parentHeight_PC: 100, // parentAccordionがtrueの場合動きます、親要素高さの指定
      parentHeight_SP: 100,
      openIndex: [],
      PC_FIXED: false, // PCのヘッダー固定
      SP_FIXED: false, // TB以下のヘッダー固定
      PC_FIXED_ELE: 'header', // PCのヘッダー高さ要素
      SP_FIXED_ELE: 'header', // TB以下のヘッダー高さ要素
    }

    // 横幅のresize時にも反応できるようにするためのもの
    var targetTag = $(this);
    s = $.extend({}, s, option);

    if (location.hash != "" && $(location.hash).length > 0) {
      if (s.PC_FIXED && $(window).innerWidth() >= s.SP_WIDTH || s.SP_FIXED && $(window).innerWidth() < s.SP_WIDTH) {
        console.log('acc:start')
        $('html, body').css('opacity', 0);
      }
    }

    // accordionの動きを動きを入れてくれるイベント（slideToggle）
    function accordionEvent(e) {
      if (e.hasClass('active')) {
        e.removeClass('active');
        e.next().slideToggle();
        e.next().removeClass('check');
      } else {
        if (s['otherClose']) {
          $(targetTag).each(function (i, t) {
            if ($(t).hasClass('active')) {
              $(t).removeClass('active');
              $(t).next().slideToggle();
            }
          })
        }

        e.addClass('active');
        e.next().slideToggle();
        e.next().addClass('check');
      }
    }

    // accordionボタンにマウスポイントのCSSを追加
    function pointEvent(e) {
      e.css('cursor', 'pointer').attr('tabindex', '0').attr('role', 'tab');
      e.next().css('display', 'none').attr('role', 'tabpanel');
    }

    // accordionで開かれるボックスのposition設定
    function positionEvent(e) {
      e.parent().css('position', 'relative');
      e.parent().css('z-index', '2');
      e.next().css('position', 'absolute');
      e.next().css('top', e.outerHeight() - 1 - s['borderRadius'] + 'px');
    }

    function parentAccordionEvent(e) {
      if ($(e).hasClass('active')) {
        $(e).removeClass('active');
        $(e).parent().removeClass('active');
        $(e).parent().height(s['parentHeight_PC']);
      } else {
        var heightNum = 0;
        $(e).siblings().each(function (i, t) {
          heightNum += $(t).outerHeight();
        })
        if (s['btnHeight']) {
          heightNum += $(e).outerHeight() + 20;
        }
        $(e).parent().height(heightNum);
        $(e).addClass('active');
        $(e).parent().addClass('active');
      }
    }

    if (s['parentAccordion']) {
      if (s['size'] == 'pc') {
        $(this).parent().css('overflow', 'hidden');
        $(this).parent().css('position', 'relative');
        $(this).css('cursor', 'pointer');
        $(this).parent().css('transition', '0.3s');
        if ($(window).width() <= s['SP_WIDTH']) {
          $(this).parent().height(s['parentHeight_SP']);
        } else {
          $(this).parent().height(s['parentHeight_PC']);
        }
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['SP_WIDTH']) {
          $(this).parent().height(s['parentHeight_SP']);
          $(this).parent().css('overflow', 'hidden');
          $(this).css('cursor', 'pointer');
          $(this).parent().css('transition', '0.3s');
        } else {
          $(this).css('display', 'none');
          $(this).parent().css('height', '');
          $(this).parent().css('overflow', '');
          $(this).css('cursor', '');
          $(this).parent().css('transition', '');
        }
      }
    } else {
      // pcかtbかを判別してマウスポイントのcssを出すかどうかの判別
      if (s['size'] == 'pc') {
        pointEvent($(this));
        if (s['position'] == 'absolute') {
          positionEvent($(this));
        }
      } else if (s['size'] == 'tb') {
        if ($(window).width() <= s['SP_WIDTH']) {
          pointEvent($(this));

          if (s['position'] == 'absolute') {
            positionEvent($(this));
          }
        }
      }
    }

    $(this).on('click', function () {
      if (s['parentAccordion']) {
        if (s['size'] == 'pc') {
          parentAccordionEvent($(this));
        } else if (s['size'] == 'tb') {
          if ($(window).width() <= s['SP_WIDTH']) {
            parentAccordionEvent($(this));
          }
        }
      } else {
        // accordionを動かすかどうか（pc、tb）
        if (s['size'] == 'pc') {
          accordionEvent($(this));
        } else if (s['size'] == 'tb') {
          if ($(window).width() <= s['SP_WIDTH']) {
            accordionEvent($(this));
          }
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

    function pcHideEvent(e) {
      if (s['pcHide']) {
        if ($(window).width() > s['SP_WIDTH']) {
          $(e).hide();
        } else {
          $(e).show();
        }
      }
    }

    // 自動に何番目のアイテムを開くかのイベント 0からスタート
    function openSpecifiedAccordion() {
      for (let i = 0; i < s.openIndex.length; i++) {
        var item = $(targetTag[s.openIndex[i]]);
        if (!item.hasClass('active')) {
          item.addClass('active');
          item.next().css('display', 'block');
        }
      }
    }

    openSpecifiedAccordion();

    // 自動に何番目のアイテムを開くかのイベント
    //タグに data-autoopen="true"追加が必要
    $(targetTag).each(function () {
      if ($(this).data('autoopen')) {
        $(this).addClass('active');
        $(this).next().css('display', 'block');
      }
    });

    pcHideEvent($(this));

    $(document).keydown(function (event) {
      var firstCheck = true;
      for (let i = 0; i < targetTag.length; i++) {
        // console.log($(targetTag)[i]);
        if (firstCheck) {
          if ($($(targetTag)[i]).is(':focus')) {
            if (event.key == 'Enter') {
              accordionEvent($($(targetTag)[i]));
            } else if (event.key == 'ArrowRight' || event.key == 'ArrowDown') {
              firstCheck = false;
              if ($(targetTag)[i + 1]) {
                $(targetTag)[i + 1].focus();
              }
            } else if (event.key == 'ArrowUp' || event.key == 'ArrowLeft') {
              firstCheck = false;
              if ($(targetTag)[i - 1]) {
                $(targetTag)[i - 1].focus();
              }
            }
          }
        }
      }
    });
    // resize中止

    if (location.hash != "" && $(location.hash).length > 0) {
      let pos = 0;
      if (s.PC_FIXED && $(window).innerWidth() >= s.SP_WIDTH) {
        pos = $(location.hash).offset().top - $(s.PC_FIXED_ELE).innerHeight();
      } else if (s.SP_FIXED && $(window).innerWidth() < s.SP_WIDTH) {
        pos = $(location.hash).offset().top - $(s.SP_FIXED_ELE).innerHeight();
      }
      $("html, body").animate({
        scrollTop: pos
      }, 1, "swing");
      $('html, body').css('opacity', 1);
      console.log('acc:end')
    }
  }
})(jQuery);
