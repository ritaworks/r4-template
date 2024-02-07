# r4-template

## 設計思想
メンテナンス性を高める
拡張しやすいように
初めて触る人でもすぐ理解出来るように
案件によって柔軟に切り替えられるように（非レスポンシブ、静的サイト等）
問題が起きる前に問題を想定して作成する
理解していないコードは闇雲に追加せず、理解している（できる）もののみ追加する


## CSS設計
RSCSSを参考
http://rscss.io/
https://github.com/rstacruz/rscss

Sass導入を念頭に置いた構成
http://developers.linecorp.com/blog/?p=1027


## 対応ブラウザ
基本的にはブラウザの最新バージョンをサポート

### PC
IE11、Edge<br/>
Chrome、FireFox、Safari

### SP
- iOS（コーディング時点での最新バージョン）<br/>
Safari
- Android(4.4以上)<br/>
Chrome


## ファイル構造
```
r2-template/
├── index.html
├── data/
│   ├── media/
│   │   └── THEME-NAME/
│   │       ├── page/
│   │       ├── common/
│   │       └── layout/
│   │           ├── footer/
│   │           ├── header/
│   │           └── side/
│   └── themes/
│       └── THEME-NAME/
│           ├── config.php/
│           ├── thumb.jpg/
│           ├── img/
│           ├── js/
│           │   ├── common.js
│           │   └── module/
│           │       └── ****.js
│           └── sass/
│               ├── import.scss
│               ├── _settings.scss
│               ├── module/
│               │   └── ****.scss
│               ├── base/
│               │   ├── _base.scss [no-edit]
│               │   └── _cms.scss [no-edit]
│               ├── core/
│               │   ├── _class.scss [no-edit]
│               │   ├── _core.scss [no-edit]
│               │   ├── _float.scss [no-edit]
│               │   ├── _grid.scss [no-edit]
│               │   ├── _print.scss [no-edit]
│               │   └── mixins/
│               │       ├── _utility.scss [no-edit]
│               │       └── _grid-system.scss [no-edit]
│               └── style/
│                   ├── _common.scss
│                   ├── _editor.scss
│                   └── _style.scss
│                       └── _variable.scss
├── Gemfile
├── Gemfile.lock
├── koala-config.json
├── mac_init
├── mac_root_relative
└── README.md
```
[no-edit] = 原則編集禁止<br>_ファイル名.scss = パーシャルファイル（CSSとしては吐き出されない、SCSSのimportで読み込むファイル。）

## ディレクトリ説明

### 画像格納ディレクトリ
基本的にcssで指定する画像以外の画像は以下に格納する
```html
r2-template/
└── data/
    └── media/
        └── THEME-NAME/
            ├── page/
            │   └──****/ （各ページで使う画像を格納。ファイルはページURLと合わせる）
            ├── common/ （コンテンツ部分の共通で使う画像を格納）
            └── layout/
                ├── footer/ （フッターで使う画像を格納）
                ├── header/ （ヘッターで使う画像を格納）
                └── side/ （カラムで使う画像を格納）
```



### 背景画像格納ディレクトリ
CSSで指定する背景画像に関しては以下のディレクトリに格納する
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── img/
```


### js/jqueryライブラリ格納ディレクトリ
js/jqueryライブラリを使用する際に必要なjsファイルは以下のディレクトリに格納してください。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── js/
```


### js/jqueryを記載するファイル
ライブラリなどではなくjs/jqueryを書きたい時は以下のファイルに書いてください。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── js/
                └── common.js/
```


### import.scssファイルについて
読み込むscssファイルを定義するファイル。 コンパイル時はこのscssファイルのみをコンパイルする。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── import.scss
```


### 初期設定ファイルについて
プレークポイントやデフォルトのフォントサイズなどを設定するファイルです。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── _settings.scss
```


### styleディレクトリについて
基本的に編集していくディレクトリがこのディレクトリになります。

**_common.scss**<br>
見出しや色々な箇所で使い回すクラスはここに記載
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── style/
                    └── _common.scss
```
**_editor.scss**<br>
CMS内のエディタ上に表示させるクラス（テーブル、ボタン）はここに記載。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── style/
                    └── _editor.scss
```
**_style.scss**<br>
基本的に自由に書き込んでいくファイル
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── style/
                    └── _style.scss
```
**_variable.scss**<br>
_style.scssやcommon.scssで使う変数を指定するファイル
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── style/
                    └── _variable.scss
```


### moduleディレクトリについて
毎回ではないが、よく使うjsやscssを格納しているファイル（必要に応じて使ってください）
```html
<!--js-->
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── js/
                └── module/
```
```html
<!--scss-->
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── module/
```


### baseディレクトリについて （原則編集禁止ディレクトリ）
_settings.scssで指定したフォント、フォントサイズ、リンク色、cmsのエディタ内のコンテンツ幅などの設定ファイルが格納されているフォルダになります。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── base/
                    └── _base.scss （ベースのフォントサイズなどの設定ファイル）
                    └── _cms.scss （cmsのエディタ内のコンテンツ幅の設定ファイル）
```


### coreディレクトリについて （原則編集禁止ディレクトリ）
使い回し用のクラスやグリッドシステムなどの設定ファイルが格納されているフォルダになります。
```html
r2-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── core/
                    └── _class.scss　（使い回し用のクラスを記載している場所）
                    └── _core.scss （cssのリセットやノーマライズの設定を記載している場所）
                    └── _float.scss （フロートシステムの設定を記載している場所）
                    └── _grid.scss （グリッドシステムの設定を記載している場所）
                    └── _print.scss （プリント時の設定を記載している場所）
```

## コーディングルール
- [命名ルール](https://github.com/natrin/s3-template/wiki/%E5%91%BD%E5%90%8D%E3%83%AB%E3%83%BC%E3%83%AB "命名ルール")
- [書式ルール](https://github.com/ritaworks/s3-template/wiki/%E6%9B%B8%E5%BC%8F%E3%83%AB%E3%83%BC%E3%83%AB "書式ルール")
- [グリッドシステム、floatクラス](https://github.com/natrin/s3-template/wiki/%E3%82%B0%E3%83%AA%E3%83%83%E3%83%89%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%80%81float%E3%82%AF%E3%83%A9%E3%82%B9 "グリッドシステム、floatクラス")
- [テンプレートに組み込まれているクラス](https://github.com/natrin/s3-template/wiki/%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%81%AB%E7%B5%84%E3%81%BF%E8%BE%BC%E3%81%BE%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%82%AF%E3%83%A9%E3%82%B9 "テンプレートに組み込まれているクラス")
- [画像形式・画像の書き出しルール](https://github.com/natrin/s3-template/wiki/%E7%94%BB%E5%83%8F%E5%BD%A2%E5%BC%8F%E3%83%BB%E7%94%BB%E5%83%8F%E3%81%AE%E6%9B%B8%E3%81%8D%E5%87%BA%E3%81%97%E3%83%AB%E3%83%BC%E3%83%AB "画像形式・画像の書き出しルール")
- [マウスオーバー時の処理](https://github.com/natrin/s3-template/wiki/%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E6%99%82%E3%81%AE%E5%87%A6%E7%90%86 "マウスオーバー時の処理")
- [Sass環境を整える](https://github.com/ritaworks/s3-template/wiki/Sass%E7%92%B0%E5%A2%83%E3%82%92%E6%95%B4%E3%81%88%E3%82%8B "Sass環境を整える")
- [Sassの書き方・使い方](https://github.com/ritaworks/s3-template/wiki/Sass%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9%E3%83%BB%E4%BD%BF%E3%81%84%E6%96%B9 "Sassの書き方・使い方")
- [Sass運用ルール](https://github.com/natrin/s3-template/wiki/sass%E9%81%8B%E7%94%A8%E3%83%AB%E3%83%BC%E3%83%AB)
- [CMSを前提としたコーディングの仕方](https://github.com/natrin/s3-template/wiki/CMSを前提としたコーディングの仕方 "CMSを前提としたコーディングの仕方")
- [CMS内エディタ用クラスの記述ルール](https://github.com/natrin/s3-template/wiki/CMS%E5%86%85%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E7%94%A8%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AE%E8%A8%98%E8%BF%B0%E3%83%AB%E3%83%BC%E3%83%AB "CMS内エディタ用クラスの記述ルール")
- [リンク設定](https://github.com/ritaworks/s3-template/wiki/%E3%83%AA%E3%83%B3%E3%82%AF%E8%A8%AD%E5%AE%9A "リンク設定")
