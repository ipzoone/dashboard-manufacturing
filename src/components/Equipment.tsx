import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, AlertCircle, FileText, Brain } from 'lucide-react';
import { api } from '../api';
import type { FullAnalysisResponse } from '../types';
import './Equipment.css';

function Equipment() {
  const [selectedEquipment, setSelectedEquipment] = useState('BL-5702');
  const [mode, setMode] = useState<'current' | 'failure'>('failure');
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const equipment = ['PU-2101B', 'KO-3201', 'PM-4405B', 'HE-3301', 'BL-5702'];

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.analyzeWithLLM(selectedEquipment, mode);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-page">
      <div className="page-header">
        <h2>Equipment Analysis</h2>
        <p className="page-subtitle">
          AI-powered equipment diagnostics with RAG-enhanced engineering insights
        </p>
      </div>

      {/* Analysis Controls */}
      <div className="card analysis-controls">
        <div className="control-group">
          <label>Equipment</label>
          <select value={selectedEquipment} onChange={e => setSelectedEquipment(e.target.value)}>
            {equipment.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Analysis Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value as 'current' | 'failure')}>
            <option value="failure">Failure Condition</option>
            <option value="current">Current State</option>
          </select>
        </div>

        <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
          <Search size={18} />
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {error && (
        <div className="error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <Brain size={32} />
          <p>Analyzing equipment...</p>
          <p className="loading-subtitle">Running analyzer → RAG retrieval → LLM explanation</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-results">
          {/* Equipment Status */}
          <div className="card result-section">
            <h3 className="section-title">Equipment Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">Equipment</span>
                <span className="status-value equipment-tag">{analysis.analysis.equipment}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Health Status</span>
                <span className={`status-badge status-${analysis.analysis.status.toLowerCase()}`}>
                  {analysis.analysis.status}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Analysis Date</span>
                <span className="status-value">{analysis.analysis.selected_date}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Anomalies Detected</span>
                <span className="status-value anomaly-value">
                  {analysis.analysis.anomaly_count} / {analysis.analysis.signals.length}
                </span>
              </div>
            </div>
          </div>

          {/* Root Cause */}
          <div className="card result-section">
            <h3 className="section-title">Probable Root Cause</h3>
            <div className="root-cause-box">
              <AlertCircle size={20} />
              <p>{analysis.analysis.probable_root_cause}</p>
            </div>
          </div>

          {/* Signals */}
          <div className="card result-section">
            <h3 className="section-title">Signal Analysis</h3>
            <div className="signals-table">
              {analysis.analysis.signals.map((signal, idx) => (
                <div key={idx} className={`signal-row ${signal.abnormal ? 'abnormal' : ''}`}>
                  <div className="signal-header">
                    <span className="signal-param">{signal.parameter}</span>
                    {signal.abnormal && <AlertCircle size={16} className="signal-alert" />}
                  </div>
                  <div className="signal-metrics">
                    <div className="metric">
                      <span className="metric-label">Value</span>
                      <span className="metric-value">{signal.value.toFixed(3)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Threshold</span>
                      <span className="metric-value">{signal.threshold}</span>
                    </div>
                    {signal.trend && (
                      <>
                        <div className="metric">
                          <span className="metric-label">Change</span>
                          <span className={`metric-value ${signal.trend.change_pct > 0 ? 'trend-up' : 'trend-down'}`}>
                            {signal.trend.change_pct > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(signal.trend.change_pct).toFixed(1)}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="signal-explanation">{signal.explanation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RAG Results */}
          {analysis.rag.used && analysis.rag.results.length > 0 && (
            <div className="card result-section">
              <h3 className="section-title">
                <FileText size={20} />
                Engineering Knowledge References
              </h3>
              <div className="rag-count">
                Retrieved {analysis.rag.count} relevant document{analysis.rag.count !== 1 ? 's' : ''}
              </div>
              <div className="rag-results">
                {analysis.rag.results.map((result, idx) => (
                  <div key={idx} className="rag-card">
                    <div className="rag-header">
                      <div className="rag-meta">
                        <span className="rag-document">{result.document}</span>
                        <span className="rag-page">Page {result.page}</span>
                      </div>
                      <span className="rag-score">
                        Relevance: {(result.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="rag-content">{result.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Incidents */}
          {analysis.analysis.historical_incidents.length > 0 && (
            <div className="card result-section">
              <h3 className="section-title">Historical Incidents</h3>
              <div className="incidents-list">
                {analysis.analysis.historical_incidents.map((incident, idx) => (
                  <div key={idx} className="incident-card">
                    <div className="incident-header">
                      <span className="incident-ar">{incident.ar_no}</span>
                      <span className="incident-date">{incident.date}</span>
                    </div>
                    <div className="incident-title">{incident.title}</div>
                    <div className="incident-stats">
                      <div className="incident-stat">
                        <span className="stat-label">Downtime</span>
                        <span className="stat-value">{incident.downtime_hours}h</span>
                      </div>
                      <div className="incident-stat">
                        <span className="stat-label">Loss</span>
                        <span className="stat-value">${incident.actual_loss_k_usd}K</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM Explanation */}
          {analysis.llm.enabled && analysis.llm.result && (
            <div className="card result-section llm-section">
              <h3 className="section-title">
                <Brain size={20} />
                AI Analysis & Recommendations
              </h3>
              <div className="llm-content">
                {typeof analysis.llm.result === 'object' ? (
                  <pre className="llm-json">{JSON.stringify(analysis.llm.result, null, 2)}</pre>
                ) : (
                  <p>{analysis.llm.result}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Equipment;
