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
  5. コピペ禁止
    - form.js
  6. 禁止ワード設定
    - form.js

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
      nopaste: [],
      phrase: {},
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

    ////////////
    // コピペ禁止
    ////////////
    if (config.nopaste.length > 0) {
      for (let i = 0; config.nopaste.length > i; i++) {
        nopaste_content = 'input[name="form_' + config.nopaste[i] + '"]';
        $(nopaste_content).on('paste', function (e) {
          e.preventDefault();
        });
      }
    }

    ////////////
    // 特定のキーワードはエラーにする
    // submitしたタイミングでconfig.phraseの内容に沿って、該当する入力欄に該当する文字が含まれている場合にsubmitさせない
    ////////////
    var buildPhraseMap = function (phraseConfig) {
      var map = {};
      if (!phraseConfig) return map;
      // 配列形式は非推奨・サポート外とする
      if (Array.isArray(phraseConfig)) {
        try {
          console && console.warn && console.warn('form.js: phrase 配列形式はサポートされません。マップ形式 { "inq01": [..] } を使用してください。');
        } catch (e) {}
        return map;
      }
      if (typeof phraseConfig === 'object') {
        for (var k in phraseConfig) {
          if (!phraseConfig.hasOwnProperty(k)) continue;
          map[k] = phraseConfig[k];
        }
      }
      return map;
    };

    var phraseMap = buildPhraseMap(config.phrase || []);

    // エラーメッセージ表示ユーティリティ
    var showFieldError = function ($field, message) {
      // 既存のエラーメッセージ領域があれば使う。なければ小さな <div> を生成して追加する
      var $err = $field.siblings('.form-error-forbidden');
      if ($err.length === 0) {
        $err = $('<div class="form-error-forbidden" style="color:#f00;"></div>');
        $field.after($err);
      }
      $err.text(message).show();
      $field.addClass('has-error');
    };

    var clearFieldError = function ($field) {
      $field.siblings('.form-error-forbidden').hide();
      $field.removeClass('has-error');
    };

    // グローバルエラーメッセージ表示領域を取得または作成
    var getOrCreateGlobalError = function () {
      var $submit = form.find('input[type="submit"], button[type="submit"]').last();
      if ($submit.length === 0) {
        return $('<div class="form-error-global" style="color:#f00;"></div>');
      }
      var $err = $submit.siblings('.form-error-global');
      if ($err.length === 0) {
        $err = $('<div class="form-error-global" style="color:#f00;"></div>');
        $submit.after($err);
      }
      return $err;
    };

    // フォーム送信時の検証（各キーごとにチェックし、全体で1つのメッセージを表示）
    form.on('submit', function (e) {
      var hasError = false;

      // 各フィールドに対応する禁止句を確認
      for (var key in phraseMap) {
        if (!phraseMap.hasOwnProperty(key)) continue;
        var selector = '[name="form_' + key + '"]';
        var $field = form.find(selector);
        if ($field.length === 0) continue;

        var value = String($field.val() || '').toLowerCase();
        var forbiddenList = phraseMap[key] || [];

        for (var j = 0; j < forbiddenList.length; j++) {
          var forbidden = String(forbiddenList[j] || '').toLowerCase();
          if (!forbidden) continue;
          if (value.indexOf(forbidden) !== -1) {
            hasError = true;
            break;
          }
        }

        if (hasError) break;
      }

      var $globalError = getOrCreateGlobalError();

      if (hasError) {
        e.preventDefault();
        // エラーを送信ボタン下に表示
        $globalError.text('入力内容に不適切な表現が含まれている可能性があります。修正して再送信してください。').show();
        // 表示位置までスクロール
        // var top = $globalError.offset().top - 20;
        // $('html, body').animate({ scrollTop: top }, 300);
      } else {
        $globalError.hide();
      }
    });

    // フォーカス時にエラークリア
    form.on('input change', 'input, textarea', function () {
      clearFieldError($(this));
    });
  };
})(jQuery);