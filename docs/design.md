# toDone 設計書

## 1. プロダクト概要

### 1.1 目的

日常のタスクを日付別に管理するモバイルファーストの Web アプリ。Theme Studio の動作確認対象アプリとして、すべてのスタイルを CSS カスタムプロパティで定義し、外部からのリアルタイムテーマ調整に対応する。

### 1.2 スコープ

| 対象                                 | 対象外                   |
| ------------------------------------ | ------------------------ |
| タスクの CRUD                        | ユーザー認証             |
| カテゴリタグ・優先度                 | バックエンド API / DB    |
| 日付別表示                           | プッシュ通知             |
| ローカルストレージ永続化             | マルチデバイス同期       |
| CSS カスタムプロパティによるテーマ   | ネイティブアプリ         |
| Theme Studio 連携（theme-bridge.js） | オフライン PWA           |
| JSON エクスポート/インポート         | スワイプジェスチャー操作 |

---

## 2. 機能要件（MECE ロジックツリー）

```
toDone
├── A. タスク管理
│   ├── A1. タスク一覧表示
│   ├── A2. タスク追加
│   ├── A3. タスク編集
│   ├── A4. タスク完了/未完了切替
│   └── A5. タスク削除
├── B. 分類・フィルタ
│   ├── B1. カテゴリタグ
│   ├── B2. 優先度
│   └── B3. フィルタ・ソート
├── C. ナビゲーション
│   ├── C1. ボトムナビゲーション
│   └── C2. 画面構成
├── D. データ永続化
│   ├── D1. localStorage による保存
│   ├── D2. データモデル
│   └── D3. データ操作
│       ├── D3a. JSON エクスポート
│       ├── D3b. JSON インポート
│       └── D3c. 全削除
└── E. テーマ連携
    ├── E1. CSS カスタムプロパティ定義
    └── E2. theme-bridge.js 統合
```

---

### A. タスク管理

#### A1. タスク一覧表示

- 選択された日付のタスクを一覧表示する
- 各タスクはチェックボックス、タスク名、カテゴリバッジ、優先度インジケータを表示
- タスク名は 1 行表示。溢れる場合は `text-overflow: ellipsis` で省略
- 完了タスクは取り消し線 + 薄い表示で視覚的に区別
- タスクが 0 件の場合は空状態メッセージを表示

#### A2. タスク追加

- FAB（Floating Action Button）をタップしてモーダルを開く
- 入力フィールド: タスク名（必須、最大 200 文字）、カテゴリ（デフォルト: `other`）、優先度（デフォルト: `medium`）、日付（デフォルト: 選択中の日付）
- バリデーション: タスク名が空の場合はエラー表示・送信不可。200 文字超過時はそれ以上の入力を受け付けない（`maxLength` 属性）

#### A3. タスク編集

- タスク一覧のアイテムをタップして編集モーダルを開く
- モーダルは対象タスクのローカルコピー（ドラフト）を保持する。Save 時にのみ `UPDATE_TASK` を dispatch する。Cancel は全変更を破棄する
- タスク名、カテゴリ、優先度、日付を変更可能
- 日付変更時は元の日付の一覧から消え、新しい日付の一覧に表示される（Save 後に反映）

#### A4. タスク完了/未完了切替

- チェックボックスをタップして状態を切り替え
- 完了時: 取り消し線 + opacity 低下のアニメーション（`prefers-reduced-motion` 時はアニメーション省略）
- 未完了に戻す操作も同じチェックボックスで可能

#### A5. タスク削除

- 編集モーダル内の削除ボタンから実行
- 削除前に確認ダイアログを表示（「このタスクを削除しますか？」+ キャンセル/削除ボタン）
- 削除後は一覧から即座に消える

---

### B. 分類・フィルタ

#### B1. カテゴリタグ

定義済みカテゴリ:

| カテゴリ | カラー                   | アイコン  |
| -------- | ------------------------ | --------- |
| 仕事     | `--color-primary`        | briefcase |
| 買い物   | `--color-secondary`      | cart      |
| 勉強     | `--color-success`        | book      |
| 健康     | `--color-warning`        | heart     |
| 家事     | `--color-error`          | home      |
| その他   | `--color-text-secondary` | tag       |

カテゴリはタスク追加・編集時にドロップダウンで選択。1 タスクに 1 カテゴリ。未選択時のデフォルトは `other`（その他）。

#### B2. 優先度

| レベル | 表示             | ソート順    |
| ------ | ---------------- | ----------- |
| 高     | 赤丸インジケータ | 1（最上位） |
| 中     | 黄丸インジケータ | 2           |
| 低     | 灰丸インジケータ | 3           |

#### B3. フィルタ・ソート

- カテゴリフィルタ: 特定カテゴリのみ表示（複数選択可、トグルチップ）
- 完了/未完了フィルタ: すべて / 未完了のみ / 完了のみ（ドロップダウンで選択）
- ソート: 優先度順（デフォルト）、作成日順、名前順

フィルタ状態は画面上部のチップで表示し、タップで解除。

**フィルタ状態のライフサイクル**: フィルタ状態は `TaskContext` 内で管理し、セッション中は画面遷移（タブ切り替え）しても保持される。ブラウザリロード時はデフォルト（全カテゴリ表示、すべて、優先度順）にリセットされる。

---

### C. ナビゲーション

#### C1. ボトムナビゲーション

| タブ       | アイコン     | 画面                       |
| ---------- | ------------ | -------------------------- |
| デイリー   | calendar-day | 日付別タスク一覧（メイン） |
| カレンダー | calendar     | 月間カレンダービュー       |
| 設定       | gear         | 設定画面                   |

アクティブタブは `--color-primary` で強調。非アクティブは `--color-text-secondary`。

#### C2. 画面構成

**デイリー画面（メイン）**:

- ヘッダー: 日付表示（「6月19日（金）」形式）+ 前日/翌日ナビ
- フィルタチップバー
- タスク一覧
- FAB（タスク追加）

**カレンダー画面**:

- 月間カレンダーグリッド
- タスクがある日付にドットインジケータ
- 日付タップでデイリー画面へ遷移

**設定画面**:

- テーマ: Theme Studio 接続ステータス表示
- データ: エクスポート（JSON）/ インポート / 全削除

---

### D. データ永続化

#### D1. localStorage による保存

- キー: `todone-tasks`（タスク一覧）、`todone-settings`（設定）
- タスクの追加・編集・削除・完了切替のたびに自動保存
- アプリ起動時に localStorage から状態を復元
- 永続化は reducer の dispatch ラッパー内で同期的に実行する（`useEffect` ではなく dispatch 後に即時書き込み）

#### D2. データモデル

```typescript
type TaskId = string;

type Category =
  | 'work'
  | 'shopping'
  | 'study'
  | 'health'
  | 'housework'
  | 'other';

type Priority = 'high' | 'medium' | 'low';

type Task = {
  id: TaskId;
  title: string; // 最大 200 文字
  category: Category; // デフォルト: 'other'
  priority: Priority; // デフォルト: 'medium'
  date: string; // ISO 8601 日付 (YYYY-MM-DD)
  completed: boolean;
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
};

type TaskStore = {
  tasks: Task[];
  version: 1; // スキーマバージョン（リテラル型）
};
```

ID 生成: `crypto.randomUUID()`

**スキーママイグレーション**: localStorage からの読み込み時に `version` フィールドを検証する。

```typescript
function migrateTaskStore(raw: unknown): TaskStore {
  // 1. JSON パース成功 + tasks 配列が存在するか確認
  // 2. version が未定義（v0）の場合: version: 1 を付与
  // 3. 未知の version（現在より大きい）の場合: 警告ログ + そのまま読み込み試行
  // 4. 各 Task の必須フィールド欠損チェック → デフォルト値で補完
}
```

マイグレーション失敗時は空のタスク一覧で起動し、エラーメッセージを表示する。

#### D3. データ操作

##### D3a. JSON エクスポート

- 設定画面から「エクスポート」ボタンで `TaskStore` 全体を JSON ファイルとしてダウンロード
- ファイル名: `todone-backup-YYYY-MM-DD.json`
- `Blob` + `URL.createObjectURL` + `<a download>` パターンで実装

##### D3b. JSON インポート

- 設定画面から「インポート」ボタンでファイル選択
- バリデーション: JSON パース → スキーマ検証（`tasks` 配列、各タスクの必須フィールド） → マイグレーション適用
- インポート成功時: 既存データを置換し、確認メッセージを表示
- インポート前に確認ダイアログ: 「現在のデータはインポートデータで置換されます。続行しますか？」

##### D3c. 全削除

- 設定画面から「全データ削除」ボタン
- 確認ダイアログ: 「すべてのタスクを削除します。この操作は取り消せません。続行しますか？」
- 確認後: localStorage をクリアし、空のタスク一覧で再初期化

---

### E. テーマ連携

#### E1. CSS カスタムプロパティ定義

Theme Studio の設計書（Section B1-B4）で定義された全トークンを `:root` に定義する。アプリ内のすべてのスタイルはこれらの変数を参照する。

```css
:root {
  /* Colors */
  --color-primary: #4f46e5;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4338ca;
  --color-secondary: #ec4899;
  --color-surface: #ffffff;
  --color-background: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-accent: #4f46e5;
  --color-border: #e5e7eb;
  --color-error: #ef4444;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-focus-ring: rgba(79, 70, 229, 0.5);
  --color-overlay: rgba(0, 0, 0, 0.5);

  /* Typography */
  --font-family-base: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Shapes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

#### E2. theme-bridge.js 統合

`index.html` で Theme Studio のブリッジスクリプトを読み込む。Studio のオリジンはビルド時環境変数で設定可能:

```html
<script
  src="/theme-bridge.js"
  data-studio-origin="%VITE_THEME_STUDIO_ORIGIN%"
></script>
```

環境変数 `VITE_THEME_STUDIO_ORIGIN` のデフォルト値は `http://localhost:7777`（`.env` ファイルで定義）。

ブリッジスクリプトの責務:

1. Studio からの `postMessage` を受信し `:root` の CSS 変数を上書き
2. 接続時に現在のトークン値を Studio へ返送
3. `event.origin` の検証: `data-studio-origin` と照合。`'null'`、`undefined`、空文字列はすべて拒否

---

## 3. 非機能要件

| 区分             | 要件                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| パフォーマンス   | FCP < 1.5s、TTI < 2s                                                         |
| ブラウザ対応     | Chrome, Firefox, Safari 最新 2 バージョン                                    |
| アクセシビリティ | キーボードナビ、ARIA ラベル、`prefers-reduced-motion` 対応                   |
| レスポンシブ     | 320px-428px のモバイルビューポートに最適化、デスクトップは中央寄せ max-width |
| テスト           | Vitest ユニット/統合テスト（カバレッジ ~80%）、Playwright E2E                |
| 品質ゲート       | ESLint + Prettier + TypeScript strict + Vitest + Playwright + gitleaks       |
| CI               | GitHub Actions で lint → type-check → test → build → e2e → gitleaks          |

---

## 4. 画面設計

### 4.1 デイリー画面

```
┌──────────────────────────┐
│ ●●●            9:41      │
├──────────────────────────┤
│  6月19日（金）    ◀  ▶   │
│  今日 · 6件完了/7件       │
├──────────────────────────┤
│  [仕事] [買い物] [全て▼]  │
├──────────────────────────┤
│                          │
│  ○ ブログ更新         ●赤│
│    · 仕事                │
│                          │
│  ○ ジムで筋トレ       ●黄│
│    · 健康                │
│                          │
│  ✓ 買い出し（スーパー）●灰│
│    · 買い物   ──取消線── │
│                          │
│  ○ 資料作成（提案書）  ●赤│
│    · 仕事                │
│                          │
│                    [＋]   │
├──────────────────────────┤
│  📅デイリー  📆カレンダー  ⚙設定│
└──────────────────────────┘
```

### 4.2 フィルタ適用時

```
┌──────────────────────────┐
│  6月19日（金）    ◀  ▶   │
│  今日 · 2件完了/3件       │
├──────────────────────────┤
│  [仕事✓] [買い物] [未完了▼]│
├──────────────────────────┤
│                          │
│  ○ ブログ更新         ●赤│
│    · 仕事                │
│                          │
│  ○ 資料作成（提案書）  ●赤│
│    · 仕事                │
│                          │
│                    [＋]   │
└──────────────────────────┘
```

カテゴリチップ: 選択中は塗りつぶし + チェック、未選択はアウトライン。完了フィルタ: ドロップダウン（すべて / 未完了のみ / 完了のみ）。

### 4.3 タスク追加/編集モーダル

```
┌──────────────────────────┐
│  タスクを追加             │
├──────────────────────────┤
│  タスク名                 │
│  ┌────────────────────┐  │
│  │                    │  │
│  └────────────────────┘  │
│  0/200                    │
│                          │
│  カテゴリ                 │
│  [その他 ▼]              │
│                          │
│  優先度                   │
│  (○高) (●中) (○低)       │
│                          │
│  日付                     │
│  [2026-06-19]             │
│                          │
│  [キャンセル]    [保存]   │
│                          │
│  [削除] ← 編集時のみ表示  │
└──────────────────────────┘
```

---

## 5. アーキテクチャ

### 5.1 技術スタック

| レイヤー             | 技術                                  | 選定理由                         |
| -------------------- | ------------------------------------- | -------------------------------- |
| フレームワーク       | React 19 + TypeScript 5.x             | 型安全、最新 API                 |
| ビルド               | Vite 6                                | 高速 HMR、ESM ネイティブ         |
| 状態管理             | useReducer + Context                  | 小規模アプリに適切、外部依存なし |
| スタイリング         | CSS Modules + CSS カスタムプロパティ  | スコープ付き CSS、テーマ変数対応 |
| テスト               | Vitest + Testing Library + Playwright | ユニット/統合 + E2E              |
| Lint/Format          | ESLint 9 (flat config) + Prettier     | コード品質                       |
| CI                   | GitHub Actions                        | 品質ゲート                       |
| シークレットスキャン | gitleaks                              | 機密情報の漏洩防止               |
| ポート               | localhost:6001                        | Theme Studio との連携            |

### 5.2 ディレクトリ構成

```
todone/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── design.md
├── e2e/
│   ├── daily.spec.ts
│   ├── task-crud.spec.ts
│   └── navigation.spec.ts
├── public/
│   └── theme-bridge.js
├── src/
│   ├── components/
│   │   ├── daily/
│   │   │   ├── DailyScreen.tsx
│   │   │   ├── DailyScreen.module.css
│   │   │   ├── DailyHeader.tsx
│   │   │   ├── DailyHeader.module.css
│   │   │   ├── FilterBar.tsx
│   │   │   └── FilterBar.module.css
│   │   ├── calendar/
│   │   │   ├── CalendarScreen.tsx
│   │   │   ├── CalendarScreen.module.css
│   │   │   ├── CalendarGrid.tsx
│   │   │   └── CalendarGrid.module.css
│   │   ├── settings/
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── SettingsScreen.module.css
│   │   ├── task/
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskItem.module.css
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskList.module.css
│   │   │   ├── TaskModal.tsx
│   │   │   └── TaskModal.module.css
│   │   ├── ui/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── BottomNav.module.css
│   │   │   ├── FAB.tsx
│   │   │   ├── FAB.module.css
│   │   │   ├── Badge.tsx
│   │   │   ├── PriorityDot.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   └── App.tsx
│   ├── context/
│   │   └── TaskContext.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useTaskFilter.ts
│   ├── lib/
│   │   ├── taskReducer.ts
│   │   ├── taskReducer.test.ts
│   │   ├── storage.ts
│   │   ├── storage.test.ts
│   │   ├── dateUtils.ts
│   │   ├── dateUtils.test.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   ├── types/
│   │   └── task.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

### 5.3 状態管理

```typescript
type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: TaskId; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: TaskId }
  | { type: 'TOGGLE_COMPLETE'; payload: TaskId }
  | { type: 'LOAD_TASKS'; payload: Task[] };

function taskReducer(state: Task[], action: TaskAction): Task[];
```

`TaskContext` は `dispatch` と `state` をアプリ全体に提供する。

**localStorage 永続化**: `useEffect` ではなく、dispatch ラッパー関数内で state 更新後に同期的に `localStorage.setItem` を実行する。これにより `useEffect` の write-after-render による中間状態永続化のリスクを回避する。

```typescript
function useTaskStore() {
  const [tasks, dispatch] = useReducer(taskReducer, [], loadTasks);

  const dispatchAndPersist = useCallback(
    (action: TaskAction) => {
      const newState = taskReducer(tasks, action); // ← 先に計算
      dispatch(action);
      saveTasks(newState); // ← 同期的に永続化
    },
    [tasks],
  );

  return { tasks, dispatch: dispatchAndPersist };
}
```

### 5.4 品質ゲート

**ローカル（pre-commit 相当）**:

```bash
prettier --check .
eslint .
tsc --noEmit
vitest run --coverage
playwright test
gitleaks detect --source .
```

**CI（GitHub Actions）**:

```yaml
jobs:
  quality:
    steps:
      - prettier --check .
      - eslint .
      - tsc --noEmit
      - vitest run --coverage
      - vite build
      - npx vite preview --port 4173 & # ビルド成果物を静的サーブ
      - npx wait-on http://localhost:4173
      - playwright test # baseURL: http://localhost:4173
      - gitleaks detect
```

`playwright.config.ts` の `webServer` で `vite preview --port 4173` を起動し、`baseURL` を `http://localhost:4173` に設定する。全ステップが成功しないとパイプラインは失敗する。

### 5.5 エラーハンドリング

| 状況                         | 検出                          | 表示                                                     | 回復                     |
| ---------------------------- | ----------------------------- | -------------------------------------------------------- | ------------------------ |
| localStorage 容量超過        | `QuotaExceededError` catch    | 「保存容量不足。データをエクスポートしてください」       | JSON エクスポート促進    |
| localStorage 破損            | JSON.parse 失敗               | 「データの読み込みに失敗。初期状態で開始します」         | 空のタスク一覧で起動     |
| スキーママイグレーション失敗 | migrateTaskStore 内の検証失敗 | 「データの形式が不正です。初期状態で開始します」         | 空のタスク一覧で起動     |
| タスク名空白で保存           | フォームバリデーション        | 入力欄下にエラーメッセージ                               | フォーカスを入力欄に戻す |
| タスク名 200 文字超過        | `maxLength` 属性              | 入力を受け付けない                                       | 文字数カウンター表示     |
| インポート JSON パース失敗   | JSON.parse 失敗               | 「ファイルの形式が正しくありません」                     | ファイル再選択           |
| インポートスキーマ不一致     | 必須フィールド検証            | 「互換性のないデータ形式です」                           | ファイル再選択           |
| 全削除操作                   | 確認ダイアログ                | 「すべてのタスクを削除します。この操作は取り消せません」 | 確認/キャンセル選択      |
| theme-bridge.js 未読み込み   | 機能への影響なし              | なし（グレースフルデグレード）                           | アプリは通常動作を継続   |
