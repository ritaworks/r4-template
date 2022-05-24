/*

■ フォーム機能を使う前に確認して下さい
  1. 住所自動入力
    - form.js
    - form/jquery.jpostal.js
  2. 電話番号調整
    - form.js
    - form/libphonenumber-js.min.js
  3. 日付選択
    - デフォルト機能
        OR
    - ../../css/module/form/jquery-ui.min.css（色を変更したい場合は、違うcssを読み込む）
    - form/jquery-ui.min.js
    - form/jquery.ui.datepicker-ja.min.js
  4. 合計金額計算
    - form/jquery.sum.js

■ 絞り込み機能
  1. form/jquery.resultStay.js

※※※ 具体的な使用方法についてはwiki等を確認して下さい ※※※

*/


(function ($) {
  $.fn.form = function (params) {

    ////////////
    // Settings
    // オプションはそれぞれ設定する
    ////////////
    var defs = {
      //form_xxxxxx  ex) ['inq01', 'inq02']
      address: [],
      tel: [],
    };
    // データ上書き
    var config = $.extend({}, defs, params);
    var form = this;

    ////////////
    // 郵便番号
    // 入力欄が複数ある場合は追加設定必要
    ////////////
    if (config.address.length > 0) {
      let address_zipcode = '';
      let address_address = '';
      let zipcode = '';
      for (let i = 0; config.address.length > i; i++) {
        address_zipcode = 'input[name="form_' + config.address[i] + '_zipcode"]';
        address_address = 'input[name="form_' + config.address[i] + '_address"]';
        form.find(address_zipcode).jpostal({
          postcode: [address_zipcode],
          address: {
            [address_address]: '%3%4%5',
          }
        });
        form.find(address_zipcode).change(function () {
          zipcode = $(this).val();
          if (zipcode.slice(3, 4) != "-" && zipcode.length > 2) {
            zipcode = zipcode.slice(0, 3) + "-" + zipcode.slice(3);
            $(this).val(zipcode);
          }
        });
      }
    }

    ////////////
    // 電話番号
    ////////////
    if (config.tel.length > 0) {
      let tel_name = '';
      // バリデーション関数
      var validateTelNeo = function (value) {
        return /^[0０]/.test(value) && libphonenumber.isValidNumber(value, 'JP');
      }
      // 整形関数
      var formatTel = function (value) {
        return new libphonenumber.AsYouType('JP').input(value);
      }
      var main = function (tel) {
        if (!validateTelNeo(tel)) {
          return tel;
        }
        var formattedTel = formatTel(tel)
        return formattedTel;
      }
      for (let i = 0; config.tel.length > i; i++) {
        tel_name = '[name="form_' + config.tel[i] + '"]';
        form.find(tel_name).blur(function () {
          $(this).val(main($(this).val()));
        });
      }
    }

  };
})(jQuery);
