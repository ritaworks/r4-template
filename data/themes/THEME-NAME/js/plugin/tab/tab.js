/*
  UPDATE 2024.02.07
  1.タブのdata-hrefの内容が同じタブにcurrentがつくように調整しました。

  UPDATE 2023.02.15
  1.sectionタグにも動くようにしました。
    selectタグに#allすることで全てのタブが表示するようになりました。

  UPDATE 2022.02.05
  想定している内容
  1.タブ
    #tab01, #tab02, #tab03
  2.タブの中へのリンク
    #tab01_01, #tab01_02, #tab01_tab02_01
*/

// 更新　全体的に a[data-href → [data-href
(function ($) {
  $.fn.tab = function (params) {

    // 0.セッティング
    var defs = {
      position: 0, // タブよりposition分上にスクロールする
      scroll_target: '', // 読み込み時毎度特定の場所へスクロールする（※ページャーなど）
      reload_actie: [], // パラメータ付与でリロードを行う場合の親クラス
      SP_WIDTH: 769, // ブレイクポイント
      PC_FIXED: false, // PCのヘッダー固定
      SP_FIXED: false, // TB以下のヘッダー固定
      PC_FIXED_ELE: 'header', // PCのヘッダー高さ要素
      SP_FIXED_ELE: 'header' // TB以下のヘッダー高さ要素
    };
    var config = $.extend({}, defs, params);
    var tab_link = this;
    var params_position = config.position;
    var headerFixed = 0;
    var tabHash = [];
    var offset = 0;
    let tabdesu = false;
    let speed = 500;
    if (window.matchMedia("(min-width: " + config.SP_WIDTH + "px)").matches && config.PC_FIXED) {
      headerFixed = $(config.PC_FIXED_ELE).innerHeight();
    } else if (window.matchMedia("(max-width: " + config.SP_WIDTH + "px)").matches && config.SP_FIXED) {
      headerFixed = $(config.SP_FIXED_ELE).innerHeight();
    }

    // 1.function設定
    function hash_directories(tabHash, loading) {
      // exist_numでページ内に対象の要素があるかチェックする
      let exist_num = -1;
      // 1-1.タブ切り替えを実行する
      for (var i = 0; tabHash.length > i; i++) {
        if ($('[data-href="#' + tabHash[i] + '"]').length > 0) {
          // 1-1-1.タブ切り替え
          tab_check($('[data-href="#' + tabHash[i] + '"]'), tabHash, i);
          if ($('[data-href="#' + tabHash[i] + '"]').closest(tab_link).find($('[data-href="#' + tabHash[i] + '"]')).length) {
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
        // $(window).on("load", function () { // Androidでの不具合のため
        // 1-2-1-1.タブ切り替えできていない箇所の対応
        tab_link.each(function () {
          list_target = $(this);
          list_target.find('a').css("cursor", "pointer");
          if (list_target.find('[data-href="#' + tabHash[0] + '"]').length < 1) {
            if (list_target.find('.current').length < 1) {
              list_target.find('a,option').each(function () {
                // 追加（optionのvalue追加）
                $(this).val($(this).attr('data-href'));
                $($(this).attr('data-href')).css("display", "none");
              });
              tab_target = list_target.first().find('a,option');
              $(tab_target[0]).addClass('current');
              $(tab_target.attr('data-href')).css('display', 'block');
              if (tab_target.attr('data-href') == '#all') {
                tab_target.each(function () {
                  $($(this).attr('data-href')).css('display', 'block');
                })
              }
            }
          }
        });
        // 1-2-1-2.読み込み完了後にスクロール
        if ($(config.scroll_target).length < 1 && exist_num > -1) {
          if (tabdesu) {
            scroll_action('[data-href="#' + tabHash[exist_num] + '"]', tabdesu, loading);
          } else {
            scroll_action('#' + tabHash[exist_num], tabdesu, loading);
          }
        } else if (config.scroll_target && $(config.scroll_target).length) {
          if (tabHash) {
            tabdesu = false;
            scroll_action(config.scroll_target, tabdesu, loading);
          }
        } else {
          // 無効なハッシュ || 有効なクラスが指定されていない場合
          $('html, body').css('opacity', 1);
        }
        // });
      } else {
        // 1-2-2.クリック時の処理（※内部リンクがない場合はスクロールしない）
        if (exist_num > -1) {
          if (tabdesu) {
            scroll_action('[data-href="#' + tabHash[exist_num] + '"]', tabdesu, loading);
          } else {
            scroll_action('#' + tabHash[exist_num], tabdesu, loading);
          }
        }
      }
    }

    function tab_check(target, tabHash, i) {
      // タブ切り替え
      if (target.closest(tab_link).find(target).length || $(target).prop("tagName") == "SELECT") {
        // 更新 a → [data-href]
        target.closest(tab_link).find('[data-href]').each(function () {
          // 追加
          if ($(target).data().href == '#all') {
            $(this).val($(this).attr('data-href'));
            $($(this).attr('data-href')).css("display", "block");
          } else {
            $(this).val($(this).attr('data-href'));
            $($(this).attr('data-href')).css("display", "none");
          }
        });
        $('#' + tabHash[i]).css("display", "block");

        tab_link.find('a').each(function () {
          $(this).removeClass('current');
          if ($(this).attr('data-href') == target.attr('data-href')) {
            $(this).addClass('current');
          }
        });

        // 追加select設定
        target.closest(tab_link).val(target.val());

        tabdesu = true;
      }
    }

    function scroll_action(target, tabdesu, loading) {
      // タブ内部へのリン
      // 更新
      if (target != '#all') {
        if (tabdesu) {
          // リンク先がタブ切り替えの場合
          offset = $(target).closest(tab_link).offset().top;
        } else {
          // リンク先がタブ切り替え以外の場合
          offset = $(target).offset().top;
        }
      } else {
        // 追加
        offset = $($('[data-href="' + target + '"]').next().data().href).offset().top;
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
      } else {
        $('html, body').css('opacity', 1);
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
    //更新 slectのchangeを追加
    $(this).on("change",function(e){
      clickEvent(e,$(this));
    });
    $($(this).find('a')).on("click", function (e) {
      clickEvent(e,$(this));
    });
    function clickEvent(e,tag){
      let result = "";
      let reload_num = 0;
      for (var i = 0; config.reload_actie.length > i; i++) {
        if ($(config.reload_actie[i]).find($(tag)).length) {
          reload_num += 1;
        }
      }
      if (reload_num < 1) {
        // $('a[href*="#"]')処理は不要だが、別ページと同じidが設定されていると動いてしまうので処理追加
        //// common.js同様に処理を止める（ここから）////
        result = thisPage();
        // このページ内のことであればイベントを止める
        if (result) {
          e.preventDefault();
          //// common.js同様に処理を止める（ここまで） ////
          //// 本来の処理（タブ切り替え＋スクロール）（ここから） ////
          if ($(tag).attr('data-href')) {
            tabHash = $(tag).attr('data-href').split('#')[1].split('_');
          } else if ($(tag).val().includes('#')) {
            // selectの場合
            tabHash = $(tag).val().split('#')[1].split('_');
          } else {
            // 普通のselectが動かないようにする
            if ($(tag).prop("tagName") == 'SELECT') return false;
            tabHash = $(tag).attr('href').split('#')[1].split('_');
          }
          if($(tag).prop("tagName") == "SELECT"){
            tab_check($(tag), tabHash, 0);
          } else if ($(tag).closest(tab_link).find(tag).length) {
            // 3-1.タブそのものをクリックした場合（スクロール不要）
            tab_check($(tag), tabHash, 0);
          } else {
            // 3-2.本来のタブ以外からタブ切り替えやタブタブ内部へのスクロールしたい場合
            hash_directories(tabHash, false);
          }
          //// 本来の処理（タブ切り替え＋スクロール）（ここまで） ////

        }
      } else {
        if ($(tag).attr('href')) {
          result = thisPage();
          // このページ内のことであればリロードさせる
          if (result) {
            // リロードをさせるために?も設定する
            location.href = location.origin + location.pathname + '?' + $(tag).attr('data-href').split('#')[1] + '#' + $(tag).attr('data-href').split('#')[1];
          } else {
            location.href = $(tag).attr('href');
          }
        } else {
          // リロードをさせるために"?"も設定する
          location.href = location.origin + location.pathname + '?' + $(tag).attr('data-href').split('#')[1] + '#' + $(tag).attr('data-href').split('#')[1];
        }
      }
      function thisPage() {
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
        return Boolean(current === link || full_current === link || link == "");
      }
    }

    return tab_link;
  };
})(jQuery);