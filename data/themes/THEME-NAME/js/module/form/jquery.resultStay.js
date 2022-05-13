
(function ($) {
  $.fn.resultStay = function (params) {
    var defs = {
      type: ['radio', 'checkbox', 'text', 'select'], //ボタン(['radio','checkbox','text','selectbox'])
    };
    // データ上書き
    var config = $.extend({}, defs, params);
    var form = this;
    var type_setting = config.type;

    //パラメータ取得
    let arg = new Object;
    let jp_search = decodeURI(location.search); //urlを日本語のまま取得
    let pair = jp_search.substring(1).split('&'); //パラメータをそれぞれ取得
    for (let i = 0; pair[i]; i++) {
      let kv = pair[i].split('=');
      // ASCII文字変換（必要であれば追加する）
      kv[1] = kv[1].replace(/\+/g, ' ');
      kv[1] = kv[1].replace(/\%2C/g, ',');
      arg[kv[0]] = kv[1];
    }

    let target_name = '';
    for (let i = 0; type_setting.length > i; i++) {
      switch (type_setting[i]) {
        case 'radio':
        case 'checkbox':
        case 'text':
          target_selector = form.find('input[type="' + type_setting[i] + '"]');
          break;
        case 'select':
          target_selector = form.find(type_setting[i]);
          break;
      }
      target_selector.each(function () {
        target_name = $(this).prop('name');
        s_name = '[name="' + target_name + '"]';
        //nameが照合できた場合（検索対象の場合）
        if (arg[target_name]) {
          switch (type_setting[i]) {
            case 'radio':
              if (arg[target_name] == $(this).val()) {
                $(this).prop('checked', true);
              }
              break;
            case 'checkbox':
              $(s_name).prop('checked', true);
              break;
            case 'text':
            case 'select':
              $(s_name).val(arg[target_name]);
              break;
          }
        }
      });
    }

  };
})(jQuery);
