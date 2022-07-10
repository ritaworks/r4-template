/*
  UPDATE 2022.07.05
  想定している内容
  1.タブ
    #tab01, #tab02, #tab03
  2.タブの中へのリンク
    #tab01_01, #tab01_02, #tab01_tab02_01
*/
(function ($) {
  $.fn.tab = function(params) {

    // 0.セッティング
    var defs = {
      position: 0,       // タブよりposition分上にスクロールする
      scroll_target: '', // 読み込み時毎度特定の場所へスクロールする（※ページャーなど）
      reload_actie: ['.pagination', '.blog-calendar', '.archive-list'], // パラメータ付与でリロードを行う場合の親クラス
      PC_WIDTH: 769,     // PCのブレイクポイント
      SP_WIDTH: 768,     // TB以下のブレイクポイント
      PC_FIXED: 'header',// PCのヘッダー高さ要素
      SP_FIXED: 'header' // TB以下のヘッダー高さ要素
    };
    var config = $.extend({}, defs, params);
    var tab_link = this;
    var params_position = config.position;
    var headerFixed = 0;
    var tabHash = [];
    var offset = 0;
    let tabdesu = false;
    let speed = 500;
    if(window.matchMedia( "(min-width: " + config.PC_WIDTH + "px)" ).matches) {
      headerFixed = $(config.PC_FIXED).innerHeight();
    } else if(window.matchMedia( "(max-width: " + config.SP_WIDTH + "px)" ).matches) {
      headerFixed = $(config.SP_FIXED).innerHeight();
    }

    // 1.function設定
    function hash_directories(tabHash, loading) {
      // exist_numでページ内に対象の要素があるかチェックする
      let exist_num = -1;
      // 1-1.タブ切り替えを実行する
      for (var i = 0; tabHash.length > i; i++) {
        if ($('a[data-href="#' + tabHash[i] + '"]').length > 0) {
          // 1-1-1.タブ切り替え
          tab_check($('a[data-href="#' + tabHash[i] + '"]'), tabHash, i);
          if ($('a[data-href="#' + tabHash[i] + '"]').closest(tab_link).find($('a[data-href="#' + tabHash[i] + '"]')).length) {
            tabdesu = true;
          } else {
            tabdesu = false;
          }
          exist_num = i;
        } else if ($('#' + tabHash[i]).length > 0) {
          // 1-1-2.ページ内リンク
          exist_num = i;
          tabdesu = false;
        }
      }
      // 1-2.表示が整って（タブ切り替えが終わって）からスクロールの処理を行う
      if (loading) {
        // 1-2-1.読み込み時の場合
        $(window).on("load", function () {
          // 1-2-1-1.タブ切り替えできていない箇所の対応
          tab_link.each(function () {
            list_target = $(this);
            list_target.find('a').css("cursor", "pointer");
            if (list_target.find('a[data-href="#' + tabHash[0] + '"]').length < 1) {
              if (list_target.find('.current').length < 1) {
                list_target.find('a').each(function () {
                  $($(this).attr('data-href')).css("display", "none");
                });
                tab_target = list_target.children().first().find('a');
                tab_target.addClass('current');
                $(tab_target.attr('data-href')).css('display', 'block');
              }
            }
          });
          // 1-2-1-2.読み込み完了後にスクロール
          if ($(config.scroll_target).length < 1 && exist_num > -1) {
            if (tabdesu) {
              scroll_action('a[data-href="#' + tabHash[exist_num] + '"]', tabdesu, loading);
            } else {
              scroll_action('#' + tabHash[exist_num], tabdesu, loading);
            }
          } else if (config.scroll_target && $(config.scroll_target).length) {
            scroll_action(config.scroll_target, tabdesu, loading);
          } else {
            // 無効なハッシュ || 有効なクラスが指定されていない場合
            $('html, body').css('opacity', 1);
          }
        });
      } else {
        // 1-2-2.クリック時の処理（※内部リンクがない場合はスクロールしない）
        if (exist_num > -1) {
          if (tabdesu) {
            scroll_action('a[data-href="#' + tabHash[exist_num] + '"]', tabdesu, loading);
          } else {
            scroll_action('#' + tabHash[exist_num], tabdesu, loading);
          }
        }
      }
    }
    function tab_check(target, tabHash, i) {
      // タブ切り替え
      if (target.closest(tab_link).find(target).length) {
        target.closest(tab_link).find('a').each(function () {
          $($(this).attr('data-href')).css("display", "none");
        });
        $('#' + tabHash[i]).css("display", "block");
        target.closest(tab_link).find('a').removeClass('current');
        target.addClass('current');
        tabdesu = true;
      }
    }
    function scroll_action(target, tabdesu, loading) {
      // タブ内部へのリンク
      if (tabdesu) {
        // リンク先がタブ切り替えの場合
        offset = $(target).closest(tab_link).offset().top;
      } else {
        // リンク先がタブ切り替え以外の場合
        offset = $(target).offset().top;
      }
      if (offset) {
        let scroll_position = offset - params_position - headerFixed;
        if (loading) {
          $('html, body').animate({
            scrollTop: scroll_position
          }, 0, function () {
            $('html, body').css('opacity', 1);
          });
        } else {
          $('html, body').animate({
            scrollTop: scroll_position
          }, speed);
        }
      }
    }

    // 2.読み込み時の処理
    if (location.hash) {
      tabHash = location.hash.split('#')[1].split('_');
      // タブ指定がある場合は、その部分までスクロールするので、表示は消す
      $('html, body').css('opacity', 0);
    } else {
      tabHash = '';
    }
    hash_directories(tabHash, true);

    // 3.クリック時の処理
    // $('a[href*="#"], a[data-href *= "#"]').on("click", function (e) {
    // hrefを含むと、common.jsと競合してしまい、スクロール後に一時スクロールできなくなる。
    $('a[data-href *= "#"]').on("click", function (e) {
      let reload_num = 0;
      for (var i = 0; config.reload_actie.length > i; i++) {
        if ($(config.reload_actie[i]).find($(this)).length) {
          reload_num += 1;
        }
        if (reload_num < 1 && config.reload_actie.length == i + 1) {
          //// common.js同様に処理を止める（ここから）////
          let current = location.pathname;
          let full_current = location.origin + current;
          let link = "";
          if ($(this).attr('href')) {
            link = $(this).attr('href').split('#')[0];
          }
          // トップページ及びカテゴリトップの場合は、すべてindex.htmlありとして判定する
          // aタグは@link()#00 or #00で指定すること（aaa.html#00は動きません）
          if (link != '') {
            if (link.indexOf('.html') == -1) {
              if (link.slice(-1) == '/') {
                link += 'index.html';
              } else {
                link += '/index.html';
              }
            }
            if (full_current.indexOf('.html') == -1) {
              if (full_current.slice(-1) == '/') {
                full_current += 'index.html';
              } else {
                full_current += '/index.html';
              }
            }
          }
          // このページ内のことであればイベントを止める
          if (current === link || full_current === link || link == "") {
            e.preventDefault();
            //// common.js同様に処理を止める（ここまで） ////

            //// 本来の処理（タブ切り替え＋スクロール）（ここから） ////
            if ($(this).attr('data-href')) {
              tabHash = $(this).attr('data-href').split('#')[1].split('_');
            } else {
              tabHash = $(this).attr('href').split('#')[1].split('_');
            }
            if ($(this).closest(tab_link).find(this).length) {
              // 3-1.タブそのものをクリックした場合（スクロール不要）
              tab_check($(this), tabHash, 0);
            } else {
              // 3-2.本来のタブ以外からタブ切り替えやタブタブ内部へのスクロールしたい場合
              hash_directories(tabHash, false);
            }
            //// 本来の処理（タブ切り替え＋スクロール）（ここまで） ////

          }
        };
      }
    })

    return tab_link;
  };
})(jQuery);
