/*
  UPDATE 2022.10.11
  ver 1.0
  holiday: 2022年以降対応(過去分非対応)
*/
(function ($) {
  var settings = {};
  var css = {};
  var annual = {};
  var onetime = {};
  var holidays = {};
  var prepared = {};

  $.fn.holiday = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.holiday');
    }
  };

  var methods = {
    //初期処理
    init: function (options) {
      //datepicker ロードチェック
      if (!$.fn['datepicker']) {
        return this;
      }

      //オプション設定
      settings = $.extend(true, {}, {
        disableHoliday: {
          // 毎年決まった休み（祝日：振替あり[substitute]）
          '01': [{ 'day': '01', 'name': '元日', 'substitute': 'false' }, { 'day': '02', 'name': '三が日', 'substitute': 'flase' }, { 'day': '03', 'name': '三が日', 'substitute': 'flase' }, { 'day': '2/1', 'name': '成人の日' }],
          '02': [{ 'day': '11', 'name': '建国記念日' }, { 'day': '23', 'name': '天皇誕生日' }],
          '03': [{ 'day': 'spring equinox', 'name': '春分の日' }],
          '04': [{ 'day': '29', 'name': '昭和の日' }],
          '05': [{ 'day': '03', 'name': '憲法記念日' }, { 'day': '04', 'name': 'みどりの日' }, { 'day': '05', 'name': 'こどもの日' }],
          '07': [{ 'day': '3/1', 'name': '海の日', 'not': '2020' }],
          '08': [{ 'day': '11', 'name': '山の日' }],
          '09': [{ 'day': '3/1', 'name': '敬老の日' }, { 'day': 'autumnal equinox', 'name': '秋分の日' }],
          '10': [{ 'day': '2/1', 'name': 'スポーツの日' }],
          '11': [{ 'day': '03', 'name': '文化の日' }, { 'day': '23', 'name': '勤労感謝の日' }],
          '12': []
        },
        disableWeek: [
          // 毎週決まった休み（日曜始まり）
          [null],
          [null],
          [null],
          [null],
          [null],
          [null],
          [null]
        ],
        disableDates: {
          // 年によって変わるもの（振替なし）
          '201509': [{ 'day': '22', 'name': '国民の休日' }],
          '202609': [{ 'day': '10', 'name': '国民の休日' }],
          '203209': [{ 'day': '21', 'name': '国民の休日' }],
          '203709': [{ 'day': '22', 'name': '国民の休日' }]
        },
        //曜日、祝祭日のCSSスタイルクラス（曜日や日付で色をつけたい場合）
        'css': [
          { 'day': 0, 'class': 'day-sunday' },
          { 'day': 1, 'class': 'day-monday' },
          { 'day': 2, 'class': 'day-tuesday' },
          { 'day': 3, 'class': 'day-wednesday' },
          { 'day': 4, 'class': 'day-thursday' },
          { 'day': 5, 'class': 'day-friday' },
          { 'day': 6, 'class': 'day-saturday' },
          { 'day': 'holiday', 'class': 'day-holiday' } //休み登録日
        ]
      }, options);

      //スタイルの登録
      $.each(settings.css, function (key, val) {
        if (typeof val['class'] != "undefined") {
          css[val['day']] = val['class'];
        }
      });

      // 毎年定期的な休みの調整
      // デフォルト
      annual = settings.disableHoliday;
      // 追加分
      $.each(settings.addAnnualHoliday, function (key, val) {
        inputFormatMD(val);
        if (annual[m]) {
          annual[m].push({ 'day': d, 'substitute': 'false' });
        } else {
          annual[m] = [{ 'day': d, 'substitute': 'false' }];
        }
      });
      // 削除分
      $.each(settings.removeAnnualHoliday, function (key, val) {
        inputFormatMD(val);
        if (annual[m]) {
          for (var i = 0; i < annual[m].length; i++) {
            if (annual[m][i]['day'] == d) {
              annual[m].splice(i, 1);
              i--;
            }
          }
        }
      });
      // 単発休み
      // デフォルト
      onetime = settings.disableDates;
      // 追加分
      $.each(settings.addOntimeHoliday, function (key, val) {
        inputFormatYMD(val);
        if (onetime[y + m]) {
          onetime[y + m].push({ 'day': d, 'substitute': 'false' });
        } else {
          onetime[y + m] = [{ 'day': d, 'substitute': 'false' }];
        }
      });
      // 削除分はbeforeShowDay内

      return this.each(function () {
        if (typeof $(this).datepicker != "function") {
          return true;
        }
        //初期化済みチェック
        if ($(this).data("holiday")) {
          return true;
        }
        //初期化データ設定
        $(this).data("holiday", {
          init: true
        });

        //祝祭日と日付スタイルの設定（表示する分の日をループでそれぞれの条件に合うのかチェック）
        $(this).datepicker("option", "beforeShowDay", function (day) {
          var $self = $.fn.holiday;
          var attr = $self("attr", day); //90行目:その日の情報取得
          var dow = day.getDay();
          var title = "";
          if (typeof attr['name'] != "undefined") {
            title = attr['name'];
          }
          var style = "";
          var counted_day = countWeek(day);
          //-1を指定した曜日は全部選べない様に
          if (typeof attr['class'] != "undefined") {
            style = attr['class']; //.day-holiday
            return [false, style, title];
          } else if (settings.disableWeek[counted_day.day][0] == -1) {
            return [false, 'ui-state-disabled'];
          } else if (settings.disableWeek[counted_day.day].indexOf(counted_day.count) != -1) {
            return [false, 'ui-state-disabled'];
          } else if (typeof css[dow] != "undefined") {
            style = css[dow]; //.day-***day
          }
          return [true, style, title];
        });
      });

    },

    //終了処理
    destroy: function () {
      return this.each(function () {
        if (typeof $(this).datepicker != "function") {
          return true;
        }
        //祝祭日と日付スタイルの除去
        $(this).datepicker("option", "beforeShowDay", null);
      });
    },

    //祝祭日の属性の取得
    attr: function (day) {
      //日付が文字の場合はDate型に変換する。
      if (typeof day == "string") {
        var match = day.match(/^(20\d{2})(\d{2})(\d{2})$/);
        if (match) {
          match.shift();
          day = new Date(match.join("/"));
        } else {
          day = new Date(day);
        }
      }
      //祝祭日の計算
      var Y = day.getFullYear();
      var M = padzero(day.getMonth() + 1);
      var D = padzero(day.getDate());
      //161行目:prepare:その月の休みリストを取得しているかどうか（その日だけでなく、丸ごと取得する）
      if (typeof prepared[Y + M] == "undefined") {
        prepare(Y, M);
      }
      //祝祭日のチェック
      var YMD = Y + M + D;
      if (typeof holidays[YMD] != "undefined") {
        return holidays[YMD];
      } else {
        return {};
      }
    }
  };

  //祝祭日計算
  var prepare = function (Y, M) {
    //作成済みチェック
    if (typeof prepared[Y + M] != "undefined") {
      return true;
    }

    //年間の祝祭日の計算
    var attr, substitutes = {};
    var d, dayyear;
    //祝祭日をリストに設定
    if (typeof annual[M] != "undefined") {
      $.each(annual[M], function (key, val) {
        holidaysList(Y, M, d, val, substitutes);
      });
    }

    // 個別の祝祭日の追加
    // デフォルト
    if (typeof onetime[Y + M] != "undefined") {
      $.each(onetime[Y + M], function (key, val) {
        holidaysList(Y, M, d, val, substitutes);
      });
    };

    $.each(settings.removeOntimeHoliday, function (key, val) {
      d = inputFormatYMD(val);
      // console.log(holidays, y + m + d)
      if (holidays[y + m + d]) {
        $.each(holidays, function (key, val) {
          console.log(key)
          if (key == y + m + d) {
            delete holidays[key];
            console.log(holidays)
          }
        })
      }
    });

    //振替休日の補正（祝日が続く場合）
    $.each(substitutes, function (key, val) {
      key = new Date(key);
      d = key.getFullYear() + padzero(key.getMonth() + 1) + padzero(key.getDate());
      while (typeof holidays[d] != "undefined") {
        key.setDate(key.getDate() + 1);
        d = key.getFullYear() + padzero(key.getMonth() + 1) + padzero(key.getDate());
      }
      holidays[d] = val;
    });

    prepared[Y + M] = true;
    return true;
  }

  var holidaysList = function (Y, M, d, val, substitutes) {
    d = null;
    // not最優先
    if (val['not']) {
      if (parseInt(val['not']) == Y) {
        return false;
      }
    }
    //祝祭日の日にち
    if (isFinite(val['day'])) {
      //日付固定
      d = val['day'];
    } else if (val['day'] == "spring equinox") {
      //春分の日
      d = parseInt(20.69115 + (Y - 2000) * 0.2421904 - parseInt((Y - 2000) / 4));
    } else if (val['day'] == "autumnal equinox") {
      //秋分の日
      d = parseInt(23.09 + (Y - 2000) * 0.2421904 - parseInt((Y - 2000) / 4));
    } else if (val['day'].match(/\//) && (val.day.match(/\>/) || val.day.match(/\</))) {
      if (val.day.match(/\>/)) {
        //特定年以降
        dayyear = val['day'].split('>');
        if (Y >= dayyear[1]) {
          d = padzero(dayyear[0]);
        }
      } else if (val.day.match(/\</)) {
        //特定年以前
        dayyear = val['day'].split('<');
        if (Y <= dayyear[1]) {
          d = padzero(dayyear[0]);
        }
      }
      if (d) {
        d = padzero(nthday(Y, M, dayyear[0]));
      }
    } else if (val['day'].match(/\//)) {
      //ハッピーマンデー
      d = padzero(nthday(Y, M, val['day']));
    } else if (val.day.match(/\>/)) {
      //特定年以降
      dayyear = val['day'].split('>');
      if (Y >= dayyear[1]) {
        d = padzero(dayyear[0]);
      }
    } else if (val.day.match(/\</)) {
      //特定年以前
      dayyear = val['day'].split('<');
      if (Y <= dayyear[1]) {
        d = padzero(dayyear[0]);
      }
    }

    if (d == null) {
      return true; //continue;
    }

    attr = {};
    attr['name'] = val['name'];
    if (typeof val['class'] != "undefined") {
      attr['class'] = val['class'];
    } else if (typeof css['holiday'] != "undefined") {
      attr['class'] = css['holiday'];
    } else {
      attr['class'] = "";
    }
    if (typeof val['substitute'] != "undefined") {
      attr['substitute'] = val['substitute'];
    } else {
      attr['substitute'] = 'true';
    }

    holidays[Y + M + d] = attr;

    //振替休日のチェック
    if (holidays[Y + M + d]['substitute'] == 'true') {
      d = new Date(Y, M - 1, d);
      if (d.getDay() == 0) {
        d = padzero(d.getDate() + 1);
        substitutes[Y + "/" + M + "/" + d] = {
          'name': words['substitute'] + "(" + val['name'] + ")",
          'class': attr['class']
        };
      }
    }
  }

  //ゼロサプレス
  var padzero = function (val) {
    return ('0' + val).slice(-2);
  }

  //月の第ｎ番目のｍ曜日
  var nthday = function (y, m, val) {
    var dayOfWeek = val.split('/');
    var firstDay = new Date(y, m - 1, 1);
    var adjust = dayOfWeek[1] - firstDay.getDay();
    if (adjust < 0)
      adjust += 7;
    //第ｎ番目のｍ曜日
    return 1 + adjust + (dayOfWeek[0] - 1) * 7;
  }

  // 第ｎ週目
  var countWeek = function (day) {
    return {
      day: day.getDay(),
      count: Math.floor((day.getDate() - 1) / 7) + 1
    };
  }

  var inputFormatMD = function (val) {
    if (val.length > 5) {
      if (val.slice(0, 2).match(/\//)) {
        m = padzero(val.slice(0, 1));
        d = val.slice(2);
      } else {
        m = val.slice(0, 2);
        d = val.slice(3);
      }
    } else {
      if (val.slice(0, 2).match(/\//)) {
        m = padzero(val.slice(0, 1));
      } else {
        m = val.slice(0, 2);
      }
      if (val.slice(-2).match(/\//)) {
        d = padzero(val.slice(-1));
      } else {
        d = val.slice(-2);
      }
    }
    return;
  }

  var inputFormatYMD = function (val) {
    y = val.slice(0, 4);
    if (val.slice(6, 7).match(/\//)) {
      m = padzero(val.slice(5, 6));
    } else {
      m = val.slice(5, 7);
    }
    if (val.slice(-2).match(/\//)) {
      d = padzero(val.slice(-1));
    } else {
      d = val.slice(-2);
    }
    return d;
  }

  //言語対応
  var words = {
    'substitute': '振替休日'
  };
})(jQuery);