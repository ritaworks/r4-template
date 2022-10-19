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
      checkboxValue: 'value', //value,name,id
      checkboxParent: [], //checkboxの親要素
    };
    // データ上書き
    var config = $.extend({}, defs, params);
    var form = this;
    var type_setting = config.type;
    var checkbox_setting = {
      value: config.checkboxValue,
      parent: config.checkboxParent,
    };

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

    // radio, text, select(ここから)
    function loadingCheck(type, selecter) {
      selecter.each(function () {
        let target_name = $(this).prop('name');
        s_name = '[name="' + target_name + '"]';
        //nameが照合できた場合（検索対象の場合）
        if (arg[target_name]) {
          switch (type) {
            case 'radio':
              if (arg[target_name] == $(this).val()) {
                $(this).prop('checked', true);
              }
              break;
            case 'text':
            case 'select':
              $(s_name).val(arg[target_name]);
              break;
          }
        }
      })
    }

    for (let i = 0; type_setting.length > i; i++) {
      switch (type_setting[i]) {
        case 'radio':
        case 'text':
          target_selector = form.find('input[type="' + type_setting[i] + '"]');
          loadingCheck(type_setting[i], target_selector);
          break;
        case 'select':
          target_selector = form.find(type_setting[i]);
          loadingCheck(type_setting[i], target_selector);
          break;
        case 'checkbox':
          // 読み込み時処理に含める
          break;
      }
    }
    // radio, text, select(ここまで)

    // checkbox（ここから）
    if (type_setting.includes('checkbox')) {
      var checkbox_value = [];

      for (let i = 0; checkbox_setting.parent.length > i; i++) {
        let input_name = "";
        // parentごとのループ
        if ($(checkbox_setting.parent[i]).length > 0) {

          // 同じparentが複数存在する場合のループ
          for (let j = 0; $(checkbox_setting.parent[i]).length > j; j++) {
            // 読み込み時
            if ($($(checkbox_setting.parent[i])[j]).attr('data-search')) {
              input_name = $($(checkbox_setting.parent[i])[j]).attr('data-search');
            } else {
              input_name = checkbox_setting.parent[i].slice(1);
            }
            if (!checkbox_value[input_name]) {
              checkbox_value[input_name] = [];
            }
            if ($('input[name="' + input_name + '"]').length == 0) {
              form.append('<input id="" name="' + input_name + '" type="hidden" value="" checked>')
            }
            if (arg[input_name]) {
              let pair02 = arg[input_name].split(','); //パラメータをそれぞれ取得
              for (k = 0; pair02.length > k; k++) {
                if ($($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + pair02[k] + '"]').length > 0) {
                  $($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + pair02[k] + '"]').prop('checked', true);
                  checkbox_value[input_name].push(pair02[k]);
                }
              }
              $('input[name = "' + input_name + '"]').val(arg[input_name]);
            }

            // クリック時
            $($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"]').change(function (e) {
              if ($($(checkbox_setting.parent[i])[j]).attr('data-search')) {
                input_name = $($(checkbox_setting.parent[i])[j]).attr('data-search');
              } else {
                input_name = checkbox_setting.parent[i].slice(1);
              }
              if (e.target.checked) {
                checkbox_value[input_name].push($(e.target).attr(checkbox_setting.value));
              } else {
                delete checkbox_value[input_name][$.inArray($(e.target).attr(checkbox_setting.value), checkbox_value[input_name])];
              }
              let num01 = 0;
              $('input[name = "' + input_name + '"]').val('');
              for (let num02 = 0; checkbox_value[input_name].length > num02; num02++) {
                if (checkbox_value[input_name][num02]) {
                  if (num01 > 0) {
                    $('input[name = "' + input_name + '"]').val($('input[name = "' + input_name + '"]').val() + ',');
                  }
                  $('input[name = "' + input_name + '"]').val($('input[name = "' + input_name + '"]').val() + checkbox_value[input_name][num02]);
                  num01++;
                }
              }
            });
          }
        }
      }
    }
    // checkbox（ここまで）

  };
})(jQuery);
