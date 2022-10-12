/*
  UPDATE 2022.10.12
  ver 1.1
  2022.5.13 CREATED
  2022.10.12 UPDATED checkboxParent追加
*/
(function ($) {
  $.fn.resultStay = function (params) {
    var defs = {
      type: ['radio', 'checkbox', 'text', 'select'], //ボタン(['radio','checkbox','text','selectbox'])
      checkboxParent: [] //checkboxの親要素
    };
    // データ上書き
    var config = $.extend({}, defs, params);
    var form = this;
    var type_setting = config.type;
    var checkbox_setting = config.checkboxParent;
    var checkbox_value = [];

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

    if (type_setting.includes('checkbox')) {
      function valueSetting(i) {
        let num01 = 0;
        $('input[name = "' + checkbox_setting[i].slice(1) + '"]').val('');
        for (let num02 = 0; checkbox_value[checkbox_setting[i].slice(1)].length > num02; num02++) {
          if (checkbox_value[checkbox_setting[i].slice(1)][num02]) {
            if (num01 > 0) {
              $('input[name = "' + checkbox_setting[i].slice(1) + '"]').val($('input[name = "' + checkbox_setting[i].slice(1) + '"]').val() + ',');
            }
            $('input[name = "' + checkbox_setting[i].slice(1) + '"]').val($('input[name = "' + checkbox_setting[i].slice(1) + '"]').val() + checkbox_value[checkbox_setting[i].slice(1)][num02]);
            num01++;
          }
        }
      }

      for (let i = 0; checkbox_setting.length > i; i++) {
        if ($(checkbox_setting[i]).length > 0) {
          // 読み込み時
          checkbox_value[checkbox_setting[i].slice(1)] = [];
          $(checkbox_setting[i]).append('<input id="" name="' + checkbox_setting[i].slice(1) + '" type="radio" value="" hidden checked>')
          $(checkbox_setting[i]).find('input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
              checkbox_value[checkbox_setting[i].slice(1)].push($(this).attr('name'));
            }
          })
          valueSetting(i);

          // チェックボックスクリック時
          $(checkbox_setting[i]).find('input[type="checkbox"]').change(function (e) {
            if (e.target.checked) {
              checkbox_value[checkbox_setting[i].slice(1)].push($(e.target).attr('name'));
            } else {
              delete checkbox_value[checkbox_setting[i].slice(1)][$.inArray($(e.target).attr('name'), checkbox_value[checkbox_setting[i].slice(1)])];
            }
            valueSetting(i);
          });
        }
      }
    }

  };
})(jQuery);
