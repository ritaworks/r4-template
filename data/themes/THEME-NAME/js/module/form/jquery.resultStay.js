/*
  UPDATE 2022.10.20
  ver 1.3
  1.0 2022.5.13 CREATED
  1.1 2022.10.12 UPDATED checkboxParent追加
  1.2 2022.10.19 UPDATED モーダルへの対応: checkboxOutput追加, text追加
  1.3 2022.10.20 UPDATED タグ複数軸へ対応
*/
(function ($) {
  $.fn.resultStay = function (params) {
    var defs = {
      type: ['radio', 'checkbox', 'text', 'select'], //ボタン(['radio','checkbox','text','selectbox'])
      checkboxValue: 'value', //value,name,id
      checkboxParent: [], //checkboxの親要素
      checkboxOutput: [], //checkした項目を一括表示する欄※parentと並べること
      checkboxTag: [], //タグ使用時の複数軸対応 ※全てcheckboxであること
      autoSubmit: false
    };
    // データ上書き
    var config = $.extend({}, defs, params);
    var form = this;
    var type_setting = config.type;
    var checkbox_setting = {
      value: config.checkboxValue,
      parent: config.checkboxParent,
      output: config.checkboxOutput,
      text: [],
      tag: config.checkboxTag,
      submit: config.autoSubmit,
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
        let s_name = '[name="' + target_name + '"]';
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
      });
    }

    for (let i = 0; i < type_setting.length; i++) {
      switch (type_setting[i]) {
        case 'radio':
          target_selector = form.find('input[type="' + type_setting[i] + '"]');
          loadingCheck(type_setting[i], target_selector);
          target_selector.click(function () {
            if (config.autoSubmit && arg[$(this).prop('name')] != $(this).val()) {
              form.submit();
            }
          });
          break;
        case 'select':
          target_selector = form.find(type_setting[i]);
          loadingCheck(type_setting[i], target_selector);
          target_selector.change(function () {
            if (config.autoSubmit) {
              form.submit();
            }
          });
          break;
        case 'text':
          target_selector = form.find('input[type="' + type_setting[i] + '"]');
          loadingCheck(type_setting[i], target_selector);
          target_selector.keypress(function(e) {
            if(e.keyCode === 13) {
              form.submit();
            }
          });
          break;
        case 'checkbox':
          break;
      }
    }
    // radio, text, select(ここまで)

    // checkbox（ここから）
    if (type_setting.includes('checkbox')) {
      // checkbox用function
      function checkStep(arg, input_name, loading, i, j) {
        let textVal = '';
        let double = false;
        for (k = 0; arg.length > k; k++) {
          if ($($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + arg[k] + '"]').length > 0) {
            if (loading) {
              // checkbox_value,checked
              $($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + arg[k] + '"]').prop('checked', true);
              checkbox_value[input_name].push(arg[k]);
            }
            if (double) {
              textVal += ',';
            } else {
              double = true;
            }
            if (checkbox_setting.tag[i]) {
              if ($($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + arg[k] + '"]').attr('data-name')) {
                textVal += $($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + arg[k] + '"]').attr('data-name');
              } else {
                textVal += $($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"][' + checkbox_setting.value + '="' + arg[k] + '"]').val();
              }
            } else {
              textVal += arg[k];
            }
          }
        }
        if (checkbox_setting.output[i]) {
          if (loading) {
            checkbox_setting.text[i] = $(checkbox_setting.output[i]).text();
          }
          if (textVal) {
            $(checkbox_setting.output[i]).text(textVal);
          } else {
            $(checkbox_setting.output[i]).text(checkbox_setting.text[i]);
          }
        } else {
          checkbox_setting.text[i] = '';
        }
        if (!loading) {
          if (checkbox_setting.submit) {
            $(form).submit();
          }
        }

      }

      var checkbox_value = [];
      for (let i = 0; checkbox_setting.parent.length > i; i++) {
        let input_name = "";
        // parentごとのループ
        if ($(checkbox_setting.parent[i]).length > 0) {

          // 同じparentが複数存在する場合のループ
          for (let j = 0; $(checkbox_setting.parent[i]).length > j; j++) {
            // 読み込み時
            if (checkbox_setting.tag[i]) {
              input_name = 'tags';
            } else if ($($(checkbox_setting.parent[i])[j]).attr('data-search')) {
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
              // val設置
              $('input[name = "' + input_name + '"]').val(arg[input_name]);

              // checkbox_value,checked,text
              checkStep(arg[input_name].split(','), input_name, true, i, j);
            }

            // クリック時
            $($(checkbox_setting.parent[i])[j]).find('input[type="checkbox"]').change(function (e) {
              // checkbox_value,checked
              if (checkbox_setting.tag[i]) {
                input_name = 'tags';
              } else if ($($(checkbox_setting.parent[i])[j]).attr('data-search')) {
                input_name = $($(checkbox_setting.parent[i])[j]).attr('data-search');
              } else {
                input_name = checkbox_setting.parent[i].slice(1);
              }
              if (e.target.checked) {
                checkbox_value[input_name].push($(e.target).attr(checkbox_setting.value));
              } else {
                delete checkbox_value[input_name][$.inArray($(e.target).attr(checkbox_setting.value), checkbox_value[input_name])];
              }

              // val設置
              let double = false;
              let newVal = '';
              $('input[name = "' + input_name + '"]').val('');
              for (let num02 = 0; checkbox_value[input_name].length > num02; num02++) {
                if (checkbox_value[input_name][num02]) { //emptyを除く
                  if (double) {
                    newVal += ',';
                  } else {
                    double = true;
                  }
                  newVal += checkbox_value[input_name][num02];
                }
              }
              $('input[name = "' + input_name + '"]').val(newVal);

              // text
              checkStep(checkbox_value[input_name], input_name, false, i, j);
            });
          }
        }
      }
    }
    // checkbox（ここまで）

  };
})(jQuery);