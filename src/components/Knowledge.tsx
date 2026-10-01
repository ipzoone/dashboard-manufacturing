import { useState } from 'react';
import { Search, BookOpen, FileText } from 'lucide-react';
import { api } from '../api';
import type { RAGResponse } from '../types';
import './Knowledge.css';

function Knowledge() {
  const [query, setQuery] = useState('');
  const [failureMode, setFailureMode] = useState('');
  const [results, setResults] = useState<RAGResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const failureModes = [
    { value: '', label: 'All Failure Modes' },
    { value: 'mechanical_seal_leakage', label: 'Mechanical Seal Leakage' },
    { value: 'bearing_distress', label: 'Bearing Distress' },
    { value: 'motor_bearing_overheating', label: 'Motor Bearing Overheating' },
    { value: 'heat_exchanger_fouling', label: 'Heat Exchanger Fouling' },
    { value: 'coupling_misalignment', label: 'Coupling Misalignment' },
    { value: 'general_reliability', label: 'General Reliability (NASA)' }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await api.queryRAG(query, failureMode || undefined, 5);
      setResults(result);
    } catch (error) {
      console.error('RAG query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="knowledge-page">
      <div className="page-header">
        <h2>Engineering Knowledge Base</h2>
        <p className="page-subtitle">
          Search technical documentation with RAG-powered semantic retrieval
        </p>
      </div>

      {/* Search Interface */}
      <div className="card search-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search engineering knowledge (e.g., 'vibration analysis bearing fault')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>
        
        <div className="search-controls">
          <div className="control-group">
            <label>Filter by Failure Mode</label>
            <select value={failureMode} onChange={e => setFailureMode(e.target.value)}>
              {failureModes.map(fm => (
                <option key={fm.value} value={fm.value}>{fm.label}</option>
              ))}
            </select>
          </div>
          
          <button className="search-btn" onClick={handleSearch} disabled={loading || !query.trim()}>
            <BookOpen size={18} />
            {loading ? 'Searching...' : 'Search Knowledge Base'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {loading && (
        <div className="loading">
          <FileText size={32} />
          <p>Searching knowledge base...</p>
        </div>
      )}

      {results && !loading && (
        <div className="results-section">
          <div className="results-header">
            <h3>Search Results</h3>
            <span className="results-count">
              {results.found ? `${results.count} documents found` : 'No results found'}
            </span>
          </div>

          {results.found ? (
            <div className="knowledge-results">
              {results.results.map((result, idx) => (
                <div key={idx} className="knowledge-card">
                  <div className="knowledge-header">
                    <div className="knowledge-meta">
                      <FileText size={16} />
                      <span className="knowledge-document">{result.document}</span>
                      <span className="knowledge-page">Page {result.page}</span>
                      <span className="knowledge-mode">{result.failure_mode.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="knowledge-score">
                      {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="knowledge-content">
                    {result.text}
                  </div>
                  <div className="knowledge-footer">
                    <span className="knowledge-path">{result.source_path}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <BookOpen size={48} />
              <p>No relevant documents found</p>
              <p className="no-results-hint">Try different keywords or remove the failure mode filter</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Examples */}
      {!results && !loading && (
        <div className="card examples-section">
          <h3 className="section-title">Example Queries</h3>
          <div className="examples-grid">
            {[
              'vibration analysis bearing fault',
              'mechanical seal leakage behavior',
              'heat exchanger fouling pressure drop',
              'coupling misalignment 2X vibration',
              'condition monitoring maintenance strategy'
            ].map((example, idx) => (
              <button
                key={idx}
                className="example-btn"
                onClick={() => setQuery(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Knowledge;
