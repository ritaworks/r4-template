const PC_FIXED = false;
const SP_FIXED = false;
const SP_WIDTH = 769;
const SPEED = 500;

// 1. スクロール関連

function scrollPosition(position) {
  let offsetFromTop = $('header');
  position -= PC_FIXED && $(window).innerWidth() >= SP_WIDTH || SP_FIXED && $(window).innerWidth() < SP_WIDTH ? offsetFromTop.innerHeight() : 0;
  $('html, body').animate({
    scrollTop: position
  }, SPEED);
}

$(function () {
  let body = $(document.body);
  let menu_open = false;
  let menu_btn = $('.slidemenu-btn');
  // let menu_img = $(".slidemenu-btn").find('img'); // 画像のスライドメニューボタン
  // let menu_txt = $(".slidemenu-btn").find('.ttl'); // テキストのスライドメニューボタン

  function slidemenuOpen() {
    // $(menu_img).attr("src", $(menu_img).attr("src").replace("menu", "close"));
    // $(menu_txt).text("close");
    menu_btn.addClass('active');
    body.addClass('open');
    body.removeAttr('style');
    menu_open = true;
  }

  function slidemenuClose() {
    // $(menu_img).attr("src", $(menu_img).attr("src").replace("close", "menu"));
    // $(menu_txt).text("menu");
    menu_btn.removeClass('active');
    body.removeClass('open');
    body.removeAttr('style');
    if (top != 0) {
      // ページ内スクロールのため
      $(window).scrollTop(top);
      top = 0; //リセット
    }
    menu_open = false;
  }

  // <a href="#top">の様に記述すると滑らかにスクロールする。
  $('a[href*="#"]').on('click', function (e) {
    let current = location.pathname;
    let full_current = location.origin + current;
    let link = $(this).attr('href').split('#')[0];
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

    if (current === link || full_current === link || link == "") {
      e.preventDefault();
      slidemenuClose();
      let position = $(this.hash).length > 0 ? $(this.hash).offset().top : 0;
      scrollPosition(position);
    }
  });

  // スライドメニューの開閉
  let top = 0;
  menu_btn.on('click', function () {
    if (!menu_open) {
      top = $(window).scrollTop();
    }
    if (body.hasClass('open')) {
      slidemenuClose();
    } else {
      slidemenuOpen();
      body.css({
        'height': window.innerHeight,
        'top': -top
      });
    }
  });
  // PC時overlayを設置する場合
  // $("#overlay").on("click", function () {
  //   slidemenuClose();
  // });
});

// 一定量スクロールするとページトップに戻るが表示される（場所等の指定はcommon.scssにて）
$(function () {
  let top_btn = $('.pagetop');
  top_btn.hide();
  $(window).scroll(function () {
    $(this).scrollTop() > 100 ? top_btn.fadeIn() : top_btn.fadeOut();
  });

  top_btn.click(function () {
    scrollPosition(0);
    return false;
  });

  // 1.5秒で表示消す
  if ($(window).innerWidth() < SP_WIDTH) {
    var scrollStopEvent = new $.Event("scrollstop");
    var delay = 1500;
    var timer;
    function scrollStopEventTrigger() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        top_btn.fadeOut();
        $(window).trigger(scrollStopEvent)
      }, delay);
    }
    $(window).on("scroll", scrollStopEventTrigger);
    $("body").on("touchmove", scrollStopEventTrigger);
  };
});

// アンカーリンク付きのページ遷移をするとき：ヘッダーが固定分調整するjs
$(window).on('load', function () {
  if (location.hash != "") {
    if (PC_FIXED && $(window).innerWidth() >= SP_WIDTH || SP_FIXED && $(window).innerWidth() < SP_WIDTH) {
      let pos = $(location.hash).offset().top - $('header').innerHeight();
      $("html, body").animate({
        scrollTop: pos
      }, 1, "swing");
    } else {
      return false;
    }
  }
});

// 2. rollover（_offと末尾についた画像をオンマウスで_onとついた画像に切り替える）
$(function () {
  $('img').hover(
    function () {
      $(this).attr('src', $(this).attr('src').replace('_off.', '_on.'));
    },
    function () {
      $(this).attr('src', $(this).attr('src').replace('_on.', '_off.'));
    }
  );
});

// 3. 横幅375px以下のviewportの設定
new ViewportExtra(375)

// 4. httpが含まれる場合にwordbreakを付与するjs
// 直下のテキストのみを取得するプラグイン
$.fn.textNodeText = function () {
  let result = "";
  $(this).contents().each(function () {
    if (this.nodeType === 3 && this.data) {
      result += jQuery.trim($(this).text());
    }
  });
  return result;
};
//httpが含まれる場合にwordbreakを付与
$(function () {
  $("*").each(function () {
    let http = $(this).textNodeText();
    if (http.match(/http/)) {
      $(this).css("word-break", "break-all");
    }
  });
});

// 5. youtubeの自動レスポンシブ対応
// iframeタグの親要素に、divタグが追加される
$(function () {
  $('iframe[src*="youtube"]').wrap('<div class="youtube-wrap"></div>');
});

// ------------------------------------------------------------
// 追加分ここから
// スライドメニューに関しては、slidemenuOpen/slidemenuCloseへ記載する
// ------------------------------------------------------------
