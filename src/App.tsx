import { useState, useEffect } from 'react';
import { Activity, Database, FileText, Gauge, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Equipment from './components/Equipment';
import Knowledge from './components/Knowledge';
import { api } from './api';
import './App.css';

type View = 'dashboard' | 'equipment' | 'knowledge';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ragStatus, setRagStatus] = useState<{ chunks: number; status: string } | null>(null);

  useEffect(() => {
    api.getRAGHealth().then(setRagStatus).catch(() => setRagStatus(null));
  }, []);

  const navItems = [
    { id: 'dashboard' as View, icon: Gauge, label: 'Dashboard' },
    { id: 'equipment' as View, icon: Activity, label: 'Equipment Analysis' },
    { id: 'knowledge' as View, icon: Database, label: 'Engineering Knowledge' },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="header-title">
            <FileText size={24} />
            INTELLIGENT MANUFACTURING
          </h1>
        </div>
        <div className="header-right">
          {ragStatus && (
            <div className="rag-status">
              <div className="status-indicator" />
              RAG: {ragStatus.chunks.toLocaleString()} chunks
            </div>
          )}
          <div className="system-status">
            <div className="status-indicator active" />
            System Online
          </div>
        </div>
      </header>

      <div className="app-content">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${view === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {view === 'dashboard' && <Dashboard />}
          {view === 'equipment' && <Equipment />}
          {view === 'knowledge' && <Knowledge />}
        </main>
      </div>
    </div>
  );
}

export default App;
