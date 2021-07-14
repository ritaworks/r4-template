var PC_FIXED = false;
var SP_FIXED = false;
var SP_WIDTH = 769;
var SPEED = 500;

function scrollPosition(position) {
  var offsetFromTop = $('header')
  position -= PC_FIXED && $(window).innerWidth() >= SP_WIDTH || SP_FIXED && $(window).innerWidth() < SP_WIDTH ? offsetFromTop.innerHeight() : 0;
  $('html, body').animate({
    scrollTop: position
  }, SPEED);
}

$(function () {
  var menu_btn = $('.slidemenu-btn');
  var body = $(document.body);
  var menu_open = false;

  //（<a href="#top">の様に記述すると滑らかにスクロールする。）
  $('a[href*="#"]:not(.tab)').on('click', function (e) {
    var current = $(location).attr('pathname')
    var link = $(this).attr('href').split('#')[0];
    if (current === link || link == "") {
      e.preventDefault();
      menu_btn.removeClass('active');
      body.removeClass('open');
      body.removeAttr('style');
      menu_open = false;
      var position = $(this.hash).length > 0 ? $(this.hash).offset().top : 0;
      scrollPosition(position);
    }
  });

  //スライドメニューの開閉
  var top = 0;
  menu_btn.on('click', function () {
    if (!menu_open) {
      top = $(window).scrollTop();
    }
    body.toggleClass('open');
    menu_btn.toggleClass('active');
    menu_open = true;
    if (body.hasClass('open')) {
      body.css({
        'height': window.innerHeight,
        'top': -top
      });
    } else {
      body.removeAttr('style');
      $(window).scrollTop(top);
      menu_open = false;
    }
  });
});

// 一定量スクロールするとページトップに戻るが表示される（場所等の指定はcommon.scssにて）
$(function () {
  var top_btn = $('.pagetop');
  top_btn.hide();
  $(window).scroll(function () {
    $(this).scrollTop() > 100 ? top_btn.fadeIn() : top_btn.fadeOut();
  });

  top_btn.click(function () {
    scrollPosition(0);
    return false;
  });
});

//アンカーリンク付きのページ遷移をするとき：ヘッダーが固定分調整するjs
$(function () {
  $(document).on('ready', function () {
    if (location.hash != "") {
      var pos = $(location.hash).offset().top;
      if (PC_FIXED && $(window).innerWidth() >= SP_WIDTH || SP_FIXED && $(window).innerWidth() < SP_WIDTH) {
        pos -= $('header').innerHeight();
        $("html, body").animate({
          scrollTop: pos
        }, 1, "swing");
      } else {
        return false;
      }
    }
  });
});

// ※※※※※　スクロール関連ここまで　※※※※※

// rollover（_offと末尾についた画像をオンマウスで_onとついた画像に切り替える）
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


//横幅375px以下のviewportの設定
new ViewportExtra(375)

//httpが含まれる場合にwordbreakを付与するjs
//直下のテキストのみを取得するプラグイン
$.fn.textNodeText = function() {
  var result = "";
  $(this).contents().each(function() {
    if (this.nodeType === 3 && this.data) {
      result += jQuery.trim( $(this).text() );
    }
  });
  return result;
};
//httpが含まれる場合にwordbreakを付与
$("*").each(function () {
  var http = $(this).textNodeText();
  if (http.match(/http/)) {
    $(this).css("word-break", "break-all");
  }
});

//youtubeの自動レスポンシブ対応
//iframeタグの親要素に、divタグが追加される
$(function(){
	$('iframe[src*="youtube"]').wrap('<div class="youtube-wrap"></div>');
});
