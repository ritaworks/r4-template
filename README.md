# r4-template

## 設計思想
メンテナンス性を高める
拡張しやすいように
初めて触る人でもすぐ理解出来るように
案件によって柔軟に切り替えられるように（非レスポンシブ、静的サイト等）
問題が起きる前に問題を想定して作成する
理解していないコードは闇雲に追加せず、理解している（できる）もののみ追加する


## CSS設計
DART SASS
https://sass-lang.com/guide/

RSCSSを参考
http://rscss.io/
https://github.com/rstacruz/rscss

Sass導入を念頭に置いた構成
http://developers.linecorp.com/blog/?p=1027


## 対応ブラウザ
基本的にはブラウザの最新バージョンをサポート

### PC
Edge、Chrome、FireFox、Safari

### SP
- iOS（コーディング時点での最新バージョン）<br/>
Chrome、FireFox、Safari
- Android(4.4以上)<br/>
Chrome


## ファイル構造
```
r4-template/
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
│               ├── base/
│               │   ├── _base.scss [no-edit]
│               │   ├── _cms.scss [no-edit]
│               │   └── _index.scss [no-edit]
│               ├── core/
│               │   ├── _class.scss [no-edit]
│               │   ├── _core.scss [no-edit]
│               │   ├── _float.scss [no-edit]
│               │   ├── _grid.scss [no-edit]
│               │   ├── _index.scss [no-edit]
│               │   └── _print.scss [no-edit]
│               ├── global/
│               │   ├── _index.scss [no-edit]
│               │   ├── mixins/
│               │   │   ├── _accessibility.scss [no-edit]
│               │   │   ├── _grid-system.scss [no-edit]
│               │   │   ├── _index.scss [no-edit]
│               │   │   ├── _table.scss [no-edit]
│               │   │   └── _utility.scss [no-edit]
│               │   └── setting/
│               │       ├── _accessibility.scss [no-edit]
│               │       ├── _index.scss [no-edit]
│               │       ├── _settings.scss
│               │       └── _variable.scss
│               └── style/
│                   ├── _index.scss [no-edit]
│                   ├── _style.scss
│                   ├── common/
│                   │     ├── _animation.scss
│                   │     ├── _button.scss
│                   │     ├── _color.scss
│                   │     ├── _common.scss
│                   │     ├── _form.scss
│                   │     ├── _index.scss
│                   │     ├── _layout.scss
│                   │     ├── _list.scss
│                   │     └── _table.scss
│                   └── plugin/
│                         ├── _calendar.scss
│                         ├── _dpc.scss
│                         └── _index.scss
├── mac_init
├── mac_root_relative
└── README.md
```
[no-edit] = 原則編集禁止<br>_ファイル名.scss = パーシャルファイル（CSSとしては吐き出されない、SCSSのimportで読み込むファイル。）

## ディレクトリ説明

### 画像格納ディレクトリ
基本的にcssで指定する画像以外の画像は以下に格納する
```html
r4-template/
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
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── img/
```


### js/jqueryライブラリ格納ディレクトリ
js/jqueryライブラリを使用する際に必要なjsファイルは以下のディレクトリに格納してください。
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── js/
```


### js/jqueryを記載するファイル
ライブラリなどではなくjs/jqueryを書きたい時は以下のファイルに書いてください。
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── js/
                └── common.js/
```


### import.scssファイルについて
読み込むscssファイルを定義するファイル。 コンパイル時はこのscssファイルのみをコンパイルする。
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── import.scss
```


### 初期設定ファイルについて
プレークポイントやデフォルトのフォントサイズなどを設定するファイルです。
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── global/
                    └── setting/
                        └── _settings.scss
```


### styleディレクトリについて
基本的に編集していくディレクトリがこのディレクトリになります。

**_common.scss**<br>
見出しや色々な箇所で使い回すクラスはここに記載
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── style/
                    └── common/
                        └── _common.scss
```
**_table.scss**<br>
**_button.scss**<br>
CMS内のエディタ上に表示させるクラス（テーブル、ボタン）はここに記載。
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── style/
                    └── common/
                        └── _button.scss
                        └── _table.scss
```
**_style.scss**<br>
基本的に自由に書き込んでいくファイル
```html
r4-template/
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
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── global/
                    └── setting/
                        └── _variable.scss
```


### moduleディレクトリについて
毎回ではないが、よく使うjsやscssを格納しているファイル（必要に応じて使ってください）

**js/module/**<br>
再利用可能なJavaScriptモジュールを格納。必要に応じてcommon.jsからインポートして使用。
```html
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── js/
                └── module/
                    ├── dragscroll.js （ドラッグスクロール機能）
                    ├── form.js （フォーム関連の機能）
                    ├── jquery.accordion.js （アコーディオン機能）
                    ├── jquery.latestClass.js （最新クラス付与機能）
                    ├── switcher.js （アクセシビリティ用スイッチャー機能）
                    ├── tab.js （タブ機能）
                    └── form/ （フォーム関連のサブモジュール）
```


### baseディレクトリについて （原則編集禁止ディレクトリ）
_settings.scssで指定したフォント、フォントサイズ、リンク色、cmsのエディタ内のコンテンツ幅などの設定ファイルが格納されているフォルダになります。
```html
r4-template/
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
r4-template/
└── data/
    └── themes/
        └── THEME-NAME/
            └── sass/
                └── core/
                    └── _class.scss　（使い回し用のクラスを記載している場所）
                    └── _core.scss （CSSリセット・ノーマライズ、アクセシビリティ有効時のCSSカスタムプロパティ定義）
                    └── _grid.scss （グリッドシステムの設定を記載している場所）
                    └── _print.scss （プリント時の設定を記載している場所）
```

### globalディレクトリについて（アクセシビリティ関連）

**global/setting/_accessibility.scss**<br>
ダーク・ブルー・イエローの各テーマ用SCSS変数と `rem()` 関数を定義します。

**global/mixins/_accessibility.scss**<br>
`$accessibility-functions: true` の場合のみ有効になる、テーマ別スタイル上書き用のmixinを定義します。
- `accessibility-box()` … `data-theme` 属性に応じてボックスのcolor/border/backgroundを上書き
- `accessibility-color()` … 文字色を上書き
- `accessibility-background()` … 背景色を上書き

**global/mixins/_table.scss**<br>
`table-subclass()` / `nodrop-table()` mixin を定義します（`_table.scss` から参照）。


### アクセシビリティ機能（色変更・フォントサイズ変更）

`_settings.scss` の `$accessibility-functions: true` に設定すると、`_core.scss` の `:root` にCSSカスタムプロパティが出力され、`data-theme` 属性でテーマを切り替えられるようになります。

**CSSカスタムプロパティ一覧（`_core.scss` / `:root` 定義）**

| カスタムプロパティ | light（デフォルト） | テーマ別に変化 |
|---|---|---|
| `--primary` | `$primary` | |
| `--primary-rgb` | `$primary-rgb` | |
| `--secondary` | `$secondary` | |
| `--text` | `$color-text` | |
| `--border` | `$color-border` | |
| `--link` | `$color-link` | |
| `--bg` | `$color-white`（背景） | dark/blue/yellowで変化 |
| `--bg-gray` | `$color-gray` | |
| `--bg-gray-lighter` | `$color-gray-lighter` | |
| `--bg-red` | `$color-red` | 固定 |
| `--bg-red-rgb` | `$color-red-rgb` | 固定 |
| `--white` | `$color-white` | 固定 |
| `--red` | `$color-red` | |
| `--file-pdf` | `$color-pdf` | 固定 |
| `--file-doc` | `$color-doc` | 固定 |
| `--file-xls` | `$color-xls` | 固定 |

**mac_init での自動置換（色変更機能を有効にした場合）**

`style/` ・ `base/` 配下の `.scss` ファイルに対して、以下のSCSS変数をCSSカスタムプロパティへ一括置換します。`$color-white` はwhite固定（`--white`）として扱い、テーマ背景色（`--bg`）には置換しません。

| 置換前（SCSS変数） | 置換後（CSS var） |
|---|---|
| `$color-gray-lighter` | `var(--bg-gray-lighter)` |
| `$color-gray` | `var(--bg-gray)` |
| `$color-text` | `var(--text)` |
| `$color-border` | `var(--border)` |
| `$color-link` | `var(--link)` |
| `$color-white` | `var(--white)` |
| `$color-red` | `var(--red)` |
| `$color-pdf` | `var(--file-pdf)` |
| `$color-doc` | `var(--file-doc)` |
| `$color-xls` | `var(--file-xls)` |
| `$primary` | `var(--primary)` |
| `$secondary` | `var(--secondary)` |

**mac_init でのフォントサイズ変更（フォントサイズ変更機能を有効にした場合）**

`style/` ・ `base/` 配下の `.scss` ファイルに対して、`font-size` プロパティのリテラルpx値を `rem()` 関数へ一括置換します。`rem()` 関数は `global/setting/_accessibility.scss` に定義済みです（base=16px）。

```
font-size: 16px  →  font-size: rem(16)
```

`font:` ショートハンド（アイコンフォント指定など）・SCSS変数参照（`$base-font-size` 等）は対象外です。

また、`global/mixins/_utility.scss` 内の `fontsize` ミックスインも合わせて置換します。

```
font-size: #{$i}px !important  →  font-size: rem($i) !important
```


### mac_initについて
プロジェクト初期設定を行うシェルスクリプト。ターミナルで実行すると対話形式で以下の処理を行います。

1. 案件名・テーマ名・日付を入力し、`.php` / `.html` / `.css` / `.scss` 内の `THEME-NAME` を一括置換
2. `data/media/THEME-NAME` と `data/themes/THEME-NAME` ディレクトリを入力したテーマ名にリネーム
3. **色変更機能を有効にするか選択**（`y` の場合：`$accessibility-functions: true` に変更 ＋ SCSS変数をCSS `var()` へ一括置換）
4. **フォントサイズ変更機能を有効にするか選択**（`y` の場合：`font-size: Xpx` を `font-size: rem(X)` へ一括置換 ＋ `_utility.scss` の `fontsize` ミックスインも同様に置換）
