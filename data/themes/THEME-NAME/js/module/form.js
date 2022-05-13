////////////
// Settings
// オプションはそれぞれ設定する
////////////
const ADDRESS = false;
const ADDRESS_NAME = 'address'; //form_xxxxxx
const TEL = []; //form_xxxxxx  ex) ['inq01', 'inq02']
const SUM = false;
const DATEPICKER = false;

////////////
// 合計
////////////
if (SUM) {
  $('.inputForm').sum({
    type: ['radio', 'checkbox', 'text', 'select'],
    pre_split: '｜',
    post_split: '円',
    sum_field: 'form_sum', //合計金額表示欄（自由文「form_inqXX」）
    sum_class: '',
    add_price: [], //3桁区切りなし
    add_field: [],
    remove_field: [],
  });
}

////////////
// 郵便番号
// 入力欄が複数ある場合は追加設定必要
////////////
if (ADDRESS && ADDRESS_NAME) {
  let address_zipcode = 'input[name="form_' + ADDRESS_NAME + '_zipcode"]';
  let address_address = 'input[name="form_' + ADDRESS_NAME + '_address"]';
  $(address_zipcode).jpostal({
    postcode: [address_zipcode],
    address: {
      address_address: '%3%4%5',
    }
  });
  $(address_zipcode).change(function () {
    let zipcode = $(this).val();
    if (zipcode.slice(3, 4) != "-" && zipcode.length > 2) {
      zipcode = zipcode.slice(0, 3) + "-" + zipcode.slice(3);
      $(this).val(zipcode);
    }
  });
}

////////////
// 電話番号
////////////
if (TEL.length > 0) {
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
  for (let i = 0; TEL.length < i; i++) {
    tel_name = '[name="form_' + TEL[i] + '"]';
    $(tel_name).blur(function () {
      $(this).val(main($(this).val()));
    });
  }
}