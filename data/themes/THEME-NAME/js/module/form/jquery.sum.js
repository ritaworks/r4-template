
(function ($) {
  $.fn.sum = function (params) {
    var defs = {
      type: ['radio', 'checkbox', 'text', 'select'], //ボタン(['radio','checkbox','text','selectbox'])
      pre_split: '｜',
      post_split: '円',
      sum_field: 'form_sum', //合計金額表示欄（自由文「form_inqXX」）
      sum_class: '', //合計数字を表示する場合
      add_price: [], //追加料金（3桁区切りなし） ※add_fieldと順番を合わせること
      add_field: [], //追加料金のname「form_inqXX」 ※add_priceと順番を合わせること
      remove_field: [], //郵便番号や電話番号など数字でも対象外の項目
      // memo:
      // target_fieldを選択する方法では、input/select等それぞれ対応するのが難しいため、減点方式とする。
    };
    // データ上書き
    var config = $.extend({}, defs, params);
    var form = this;
    var type_setting = config.type;
    var total_field = $('[name=' + config.sum_field + ']');
    var total_class = '';
    if (config.sum_class) {
      total_class = $('.' + config.sum_class);
    }
    var add_contents = [];
    if (config.add_price && config.add_field) {
      for (let i = 0; config.add_price.length > i; i++) {
        add_contents[config.add_field[i]] = config.add_price[i];
      }
    }

    // function（ここから）
    // radioボタンの数値を全て記憶する
    function sum_calculation() {
      let target_name = '';
      let target_selector = '';
      let target_val = '';
      let price = 0;
      let sum = 0;
      let sum_check = true;
      for (let i = 0; type_setting.length > i; i++) {
        // step01：値を含むセレクタ（）
        switch (type_setting[i]) {
          case 'radio':
          case 'checkbox':
            target_selector = form.find('input[type="' + type_setting[i] + '"]:checked');
            break;
          case 'text':
            target_selector = form.find('input[type="' + type_setting[i] + '"]');
            break;
          case 'select':
            target_selector = form.find(type_setting[i]);
            break;
        }
        target_selector.each(function () {
          target_name = $(this).prop('name');
          // step02：値を入れる（※合計は除く）
          if ($(this).val() && target_name != config.sum_field) {
            // 合計以外に除外する項目のチェック
            for (let i = 0; config.remove_field.length > i; i++) {
              if (target_name == config.remove_field[i]) {
                sum_check = false;
              }
            }
            if (sum_check) {
              target_val = $(this).val(); // 項目名　｜　12,345円
              if (isNaN(target_val)) { //数字であれば処理不要
                if (target_val && target_val.indexOf(config.pre_split) > -1) {
                  target_val = target_val.split(config.pre_split)[1]; // 12,345円
                }
                if (target_val && target_val.indexOf(config.post_split) > -1) {
                  target_val = target_val.split(config.post_split)[0]; // 12,345
                }
                // 3桁区切りがあれば
                if (target_val && target_val.indexOf(',') > -1) {
                  target_val = target_val.split(',')[0] + target_val.split(',')[1] // 12345
                }
              }
              if (isNaN(target_val)) {
                // 性別など計算に含まない値は「0」
                price = 0;
              } else {
                price = parseInt(target_val, 10);
              }
              // step03：追加金額を足す
              if (add_contents[target_name]) {
                price += parseInt(add_contents[target_name], 10);
              }
            } else {
              price = 0;
            }
          } else {
            price = 0;
          }
          // step04：合計を出す
          sum += price;
          // console.log(price);
          // console.log(sum);
        });
      }
      // if (
      //   $("#checkbox-form_inq36-1")[0].checked ||
      //   $("#checkbox-form_inq36-2")[0].checked ||
      //   $("#checkbox-form_inq36-3")[0].checked ||
      //   $("#checkbox-form_inq36-4")[0].checked ||
      //   $("#checkbox-form_inq36-5")[0].checked ||
      //   $("#checkbox-form_inq36-6")[0].checked
      // ) {
      //   sum += 1474;
      // }
      // 日本円には小数点以下がありません
      let sum_text = new Intl.NumberFormat().format(sum) + '円';
      total_field.val(sum_text);
      if (total_class.length > 0) {
        total_class.text(sum_text);
      }
    }

    $(document).ready(function () {
      // 初期設定
      if (total_class.length > 0) {
        total_field.parents('.field').parent('.fields').css('display', 'none');
      } else {
        total_field.prop('readonly', true);
        total_field.css('background', '#ddd');
      }
      // 合計計算
      sum_calculation();
    })

    for (let i = 0; type_setting.length > i; i++) {
      switch (type_setting[i]) {
        case 'radio':
          $('input[type="radio"]').click(function () {
            // 合計計算
            sum_calculation();
          });
          break;
        case 'checkbox':
          $('input[type="checkbox"]').click(function () {
            // 合計計算
            sum_calculation();
          });
          break;
        case 'text':
          $('input[type="text"]').blur(function () {
            // 合計計算
            sum_calculation();
          });
          break;
        case 'select':
          $('select').change(function () {
            // 合計計算
            sum_calculation();
          });
          break;
      }
    }
  };
})(jQuery);
