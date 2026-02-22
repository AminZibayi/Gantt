import { useTranslation } from 'react-i18next';
import { useStore } from './store';
import GanttChart from './components/GanttChart';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import './i18n';

function App() {
  const { t } = useTranslation();
  const { settings } = useStore();

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${settings.direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={settings.direction}>
      {/* Header / Toolbar */}
      <header className="z-10 bg-white shadow-sm border-b border-gray-200">
        <Toolbar />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Overlay or Fixed) */}
        <Sidebar />

        {/* Gantt Area */}
        <main className="flex-1 relative bg-white p-4 overflow-hidden">
          <div className="h-full w-full border border-gray-200 rounded-lg shadow-inner bg-white">
            <GanttChart />
          </div>
        </main>
      </div>

      {/* Footer / Status Bar (Optional) */}
      <footer className="bg-gray-100 border-t border-gray-200 p-2 text-xs text-gray-500 text-center">
        {t("gantt")} - {settings.branding.title || "Untitled Project"}
      </footer>
    </div>
  );
}

export default App;
