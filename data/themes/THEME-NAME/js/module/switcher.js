/**
 * サイト全体のテーマ（配色）を切り替える機能を初期化します。
 *
 * - 機能：
 *   1. ページ読み込み時に、localStorageに保存されたテーマを適用します。
 *   2. [data-set-theme]属性を持つボタンのクリックを監視します。
 *   3. ボタンがクリックされたら、<body>のdata-theme属性を更新します。
 *   4. 選択されたテーマをlocalStorageに保存し、次回訪問時にも維持されるようにします。
 */
const initializeThemeSwitcher = () => {
	const themeButtons = document.querySelectorAll('[data-set-theme]');
	const body = document.body;
	const storageKey = 'site-theme';
	const defaultTheme = 'light';

	/**
	 * 指定されたテーマ名のボタンに 'active' クラスを付与し、他からは削除します。
	 * @param {string} themeName - アクティブにするテーマ名
	 */
	const setActiveButton = (themeName) => {
		themeButtons.forEach(btn => {
			if (btn.dataset.setTheme === themeName) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	};

	// 1. ページ読み込み時に保存されたテーマを適用
	const savedTheme = localStorage.getItem(storageKey) || defaultTheme;
	body.dataset.theme = savedTheme;
	setActiveButton(savedTheme);

	// 2. 各ボタンにクリックイベントを設定
	themeButtons.forEach(button => {
		button.addEventListener('click', (event) => {
			const themeName = event.currentTarget.dataset.setTheme;
			if (themeName) {
				// 3. bodyのdata-theme属性を更新
				body.dataset.theme = themeName;

				// 4. 選択したテーマをlocalStorageに保存
				localStorage.setItem(storageKey, themeName);

				// 5. アクティブなボタンの表示を更新
				setActiveButton(themeName);
			}
		});
	});
};

/**
 * サイト全体の文字サイズを切り替える機能を初期化します。
 */
const initializeFontSizeSwitcher = () => {
	const sizeButtons = document.querySelectorAll('[data-set-font-size]');
	const body = document.body;
	const storageKey = 'site-font-size';
	const defaultSize = 'medium';

	/**
	 * 指定されたサイズ名のボタンに 'active' クラスを付与し、他からは削除します。
	 * @param {string} sizeName - アクティブにするサイズ名
	 */
	const setActiveButton = (sizeName) => {
		sizeButtons.forEach(btn => {
			if (btn.dataset.setFontSize === sizeName) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	};

	// 1. ページ読み込み時に保存されたサイズを適用
	const savedSize = localStorage.getItem(storageKey) || defaultSize;
	body.dataset.fontSize = savedSize;
	setActiveButton(savedSize);

	// 2. 各ボタンにクリックイベントを設定
	sizeButtons.forEach(button => {
		button.addEventListener('click', (event) => {
			const sizeName = event.currentTarget.dataset.setFontSize;
			if (sizeName) {
				body.dataset.fontSize = sizeName;
				localStorage.setItem(storageKey, sizeName);
				setActiveButton(sizeName);
			}
		});
	});
};

// DOMの読み込みが完了したら、テーマ切り替え機能を実行
document.addEventListener('DOMContentLoaded', () => {
	initializeThemeSwitcher();
	initializeFontSizeSwitcher();
});