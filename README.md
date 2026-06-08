# toDone

日常のタスクを日付別に管理するモバイルファーストのWebアプリ。
すべてのスタイルをCSSカスタムプロパティで定義しており、[Theme Studio](../theme-studio/)からリアルタイムにテーマを調整できる。

## 機能

- タスクのCRUD（追加・編集・完了切替・削除）
- カテゴリタグ（仕事・買い物・勉強・健康・家事・その他）
- 優先度（高・中・低）による並び替え
- カテゴリフィルタ・完了フィルタ・ソート
- 月間カレンダービュー
- localStorageによるデータ永続化
- JSONエクスポート/インポート
- Theme Studio連携（theme-bridge.js）

## 技術スタック

| レイヤー             | 技術                                |
| -------------------- | ----------------------------------- |
| フレームワーク       | React19 + TypeScript5.7             |
| ビルド               | Vite6                               |
| 状態管理             | useReducer + Context                |
| スタイリング         | CSS Modules + CSSカスタムプロパティ |
| ユニットテスト       | Vitest + Testing Library            |
| E2Eテスト            | Playwright                          |
| Lint/Format          | ESLint9 (flat config) + Prettier    |
| シークレットスキャン | gitleaks                            |
| CI                   | GitHub Actions                      |

## セットアップ

```bash
npm install
npm run dev
```

開発サーバーが`http://localhost:6001`で起動する。

## コマンド一覧

| コマンド                | 説明                                   |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | 開発サーバー起動（ポート6001）         |
| `npm run build`         | 型チェック + 本番ビルド                |
| `npm run preview`       | ビルド成果物のプレビュー（ポート4173） |
| `npm run lint`          | ESLint実行                             |
| `npm run format`        | Prettierでフォーマット                 |
| `npm run format:check`  | フォーマットチェック（CIで使用）       |
| `npm run typecheck`     | TypeScript型チェック                   |
| `npm run test`          | ユニットテスト実行                     |
| `npm run test:watch`    | テストのウォッチモード                 |
| `npm run test:coverage` | カバレッジ付きテスト                   |
| `npm run e2e`           | Playwright E2Eテスト                   |
| `npm run e2e:ui`        | Playwright UIモード                    |

## ディレクトリ構成

```
todone/
├── .github/workflows/   CI設定
├── docs/                設計書
├── e2e/                 E2Eテスト
├── public/              静的ファイル（theme-bridge.js）
├── src/
│   ├── components/      UIコンポーネント
│   │   ├── daily/       デイリー画面
│   │   ├── calendar/    カレンダー画面
│   │   ├── settings/    設定画面
│   │   ├── task/        タスク関連（一覧・アイテム・モーダル）
│   │   └── ui/          共通UI部品
│   ├── context/         TaskContext（状態管理）
│   ├── hooks/           カスタムフック
│   ├── lib/             ロジック（reducer・storage・日付ユーティリティ）
│   ├── styles/          CSSトークン・グローバルスタイル
│   └── types/           型定義
└── 設定ファイル群
```

## 品質ゲート

CIでは以下をすべて通過させる。

1. Prettierフォーマットチェック
2. ESLint
3. TypeScript型チェック（strictモード）
4. Vitestユニットテスト（66テスト）
5. 本番ビルド
6. Playwright E2Eテスト（14テスト）
7. gitleaksシークレットスキャン

## Theme Studio連携

`public/theme-bridge.js`がTheme Studioとの通信を担う。
Studio側からpostMessageでCSSカスタムプロパティを受信し、`:root`に適用する。

接続先のStudioオリジンは環境変数`VITE_THEME_STUDIO_ORIGIN`で設定する（デフォルト: `http://localhost:7777`）。

## ライセンス

MIT
