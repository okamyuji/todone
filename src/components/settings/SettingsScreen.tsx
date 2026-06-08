import { useState, useRef } from 'react';
import { useTaskContext } from '../../hooks/useTaskContext';
import { exportTasksToJSON, importTasksFromJSON } from '../../lib/storage';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import styles from './SettingsScreen.module.css';

export function SettingsScreen() {
  const { tasks, dispatch } = useTaskContext();
  const [importStatus, setImportStatus] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportTasksToJSON(tasks);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowImportConfirm(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportConfirm = async () => {
    if (!pendingFile) return;
    setShowImportConfirm(false);
    try {
      const imported = await importTasksFromJSON(pendingFile);
      dispatch({ type: 'LOAD_TASKS', payload: imported });
      setImportStatus(`${imported.length}件のタスクをインポートしました`);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'インポートに失敗しました';
      setImportStatus(msg);
    }
    setPendingFile(null);
  };

  const handleClearAll = () => {
    dispatch({ type: 'LOAD_TASKS', payload: [] });
    setShowClearConfirm(false);
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h2 className={styles.title}>設定</h2>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>テーマ</h3>
        <p className={styles.description}>
          Theme Studio 接続中のテーマがリアルタイムで反映されます
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>データ管理</h3>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={handleExport}
            type="button"
          >
            エクスポート（JSON）
          </button>

          <label className={styles.actionBtn}>
            インポート
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className={styles.fileInput}
              onChange={handleFileSelect}
            />
          </label>

          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={() => setShowClearConfirm(true)}
            type="button"
          >
            全データ削除
          </button>
        </div>
        {importStatus && (
          <p className={styles.status} role="alert">
            {importStatus}
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>情報</h3>
        <p className={styles.description}>toDone v1.0.0</p>
        <p className={styles.description}>タスク数: {tasks.length}件</p>
      </section>

      <ConfirmDialog
        open={showClearConfirm}
        title="全データ削除"
        message="すべてのタスクを削除します。この操作は取り消せません。続行しますか？"
        confirmLabel="削除"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
        destructive
      />

      <ConfirmDialog
        open={showImportConfirm}
        title="インポート"
        message="現在のデータはインポートデータで置換されます。続行しますか？"
        confirmLabel="インポート"
        onConfirm={handleImportConfirm}
        onCancel={() => {
          setShowImportConfirm(false);
          setPendingFile(null);
        }}
      />
    </div>
  );
}
