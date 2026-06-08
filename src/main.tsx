import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TaskProvider } from './context/TaskContext';
import { App } from './components/App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </StrictMode>,
);
