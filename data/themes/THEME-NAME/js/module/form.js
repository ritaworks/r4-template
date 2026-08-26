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
  7. スクロール処理
    - form.js
  8. 任意・必須切り替え
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
      scroll: false,
      toggleDisplay: []
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

    ////////////
    // エラー/確認/完了画面でフォームまでスクロールさせる
    ////////////
    if (config.scroll) {
      if (location.pathname.search("check.html") > 0 || location.pathname.search("comp.html") > 0 || location.search || $('.form_error').filter(':visible').length > 0) {
        let position = $('#form').offset().top;
        scrollPosition(position);
      };
    }

    ////////////
    // 特定の選択肢で自由入力欄の表示を切り替える
    // 対象の値のときに表示し、条件に合わなければ非表示にする
    ////////////
    var requiredRules = [];

    var updateSubmitButtonState = function() {
      var $submit = form.find('input[type="submit"], button[type="submit"]').last();
      if ($submit.length === 0) return;

      var $message = $submit.siblings('.form-required-message');
      if ($message.length === 0) {
        $message = $('<p class="red-txt center-text mt5 form-required-message" style="display:none;"></p>');
        $submit.after($message);
      }

      var missingLabel = '';
      for (var ri = 0; ri < requiredRules.length; ri++) {
        var rule = requiredRules[ri];
        var $field = form.find('[name="form_' + rule.target + '"]');
        if ($field.length === 0 || !$field.is(':visible')) continue;

        // 現在そのフィールドが必須になっているか確認（toggleDisplay の動的 required を尊重）
        if (!$field.prop('required')) continue;

        var value = String($field.val() || '');
        if ($.trim(value) === '') {
          var labelText = $field.closest('.input_preview').find('.input_label').first().text();
          missingLabel = $.trim(labelText) || '入力項目';
          break;
        }
      }

      if (missingLabel) {
        $submit.prop('disabled', true);
        $message.text(missingLabel + 'を入力してください').show();
      } else {
        $submit.prop('disabled', false);
        $message.hide().text('');
      }
    };

    if (config.toggleDisplay && config.toggleDisplay.length > 0) {
      for (let i = 0; i < config.toggleDisplay.length; i++) {
        (function(item) {
          // target は配列またはカンマ区切りの文字列を許容する
          var targets = Array.isArray(item.target) ? item.target : String(item.target).split(/\s*,\s*/);

          for (let ti = 0; ti < targets.length; ti++) {
            let tgt = targets[ti];
            let rule = {
              target: tgt,
              parent: item.parent,
              triggerValue: item.when,
              required: !!item.required,
              always: !!item.always
            };

            if (rule.required) {
              requiredRules.push(rule);
            }

            let $keyField = form.find('[name="form_' + rule.target + '"]');
            if ($keyField.length === 0) {
              // 代替セレクタで再試行: 配列形式、name^=、あるいはフィールドクラス内を検索
              let altSelector = '[name="form_' + rule.target + '"]' + ', [name^="form_' + rule.target + '["]' + ', .field_form_' + rule.target + ' [name]';
              $keyField = form.find(altSelector).first();
              if ($keyField.length === 0) {
                continue;
              }
            }

            let $keyContainer = $keyField.closest('.fields');
            if ($keyContainer.length === 0) {
              $keyContainer = $keyField;
            }

            let parentName = rule.parent;
            let selector = '[name="form_' + parentName + '"]' + ', [name^="form_' + parentName + '["]';

            let toggle = function() {
              var $parents = form.find(selector);

              // トリガー値が一致しているか（required/必須判定の基準）
              var matchedTrigger = false;
              var triggerValues = Array.isArray(rule.triggerValue) ? rule.triggerValue : [rule.triggerValue];
              var valueMatches = function (value) {
                for (var vi = 0; vi < triggerValues.length; vi++) {
                  if (String(triggerValues[vi]) === String(value)) {
                    return true;
                  }
                }
                return false;
              };

              var $checked = $parents.filter(':checked');
              if ($checked.length > 0) {
                var vals = $checked.map(function() { return $(this).val(); }).get();
                for (var vi = 0; vi < vals.length; vi++) {
                  if (valueMatches(vals[vi])) {
                    matchedTrigger = true;
                    break;
                  }
                }
              } else if ($parents.length > 0) {
                var hasChoiceInputs = $parents.filter('input[type="radio"], input[type="checkbox"]').length > 0;
                if (!hasChoiceInputs) {
                  var val = $parents.first().val();
                  if (Array.isArray(val)) {
                    for (var ai = 0; ai < val.length; ai++) {
                      if (valueMatches(val[ai])) {
                        matchedTrigger = true;
                        break;
                      }
                    }
                  } else if (typeof val !== 'undefined') {
                    matchedTrigger = valueMatches(val);
                  }
                }
              }

              // 表示は rule.always またはトリガー一致のどちらかで行う
              var shouldShow = !!rule.always || matchedTrigger;

              if (shouldShow) {
                $keyContainer.addClass('form-other-open').show();
                // 必須はトリガー一致時のみ有効にする（always は表示のみ）
                var isRequiredNow = !!rule.required && matchedTrigger;
                $keyField.prop('required', isRequiredNow);

                var $labelWrap = $keyField.closest('.input_preview').find('.input_labels');
                if ($labelWrap.length > 0) {
                  if (isRequiredNow) {
                    if ($labelWrap.find('.input_required').length === 0) {
                      $labelWrap.find('.input_label').first().after('<span class="input_required">必須</span>');
                    }
                  } else {
                    $labelWrap.find('.input_required').remove();
                  }
                }
              } else {
                $keyContainer.removeClass('form-other-open').hide();
                $keyField.val('');
                $keyField.prop('required', false);
                var $labelWrap = $keyField.closest('.input_preview').find('.input_labels');
                if ($labelWrap.length > 0) {
                  $labelWrap.find('.input_required').remove();
                }
              }

              updateSubmitButtonState();
            };

            $keyField.prop('required', false);
            $keyContainer.hide();
            toggle();

            form.on('change', selector, toggle);
            form.on('input', '[name="form_' + rule.target + '"]', updateSubmitButtonState);
          }
        })(config.toggleDisplay[i]);
      }
    }
  };
})(jQuery);