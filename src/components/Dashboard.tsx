import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { api } from '../api';
import type { AnalysisResult } from '../types';
import './Dashboard.css';

function Dashboard() {
  const [equipmentData, setEquipmentData] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const equipment = await api.getEquipmentList();
        const analyses = await Promise.all(
          equipment.map(eq => api.analyzeEquipment(eq, 'failure'))
        );
        setEquipmentData(analyses);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const criticalCount = equipmentData.filter(e => e.status === 'CRITICAL').length;
  const totalIncidents = equipmentData.reduce((sum, e) => sum + e.historical_incidents.length, 0);
  const totalDowntime = equipmentData.reduce(
    (sum, e) => sum + (e.performance_summary['Total Downtime (hours)'] || 0), 0
  );
  const avgAvailability = equipmentData.reduce(
    (sum, e) => sum + (e.performance_summary['Availability (%)'] || 0), 0
  ) / equipmentData.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Unified Equipment Intelligence Dashboard</h2>
        <p className="dashboard-subtitle">Real-time equipment monitoring and predictive analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Equipment</span>
            <TrendingUp size={20} className="kpi-icon" />
          </div>
          <div className="kpi-value">{equipmentData.length}</div>
        </div>

        <div className="kpi-card critical">
          <div className="kpi-header">
            <span className="kpi-label">Critical Status</span>
            <AlertTriangle size={20} className="kpi-icon" />
          </div>
          <div className="kpi-value">{criticalCount}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Incidents</span>
            <AlertTriangle size={20} className="kpi-icon" />
          </div>
          <div className="kpi-value">{totalIncidents}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Avg Availability</span>
            <Clock size={20} className="kpi-icon" />
          </div>
          <div className="kpi-value">{avgAvailability.toFixed(2)}%</div>
        </div>
      </div>

      {/* Equipment Health Grid */}
      <div className="card">
        <h3 className="card-header">Equipment Health Status</h3>
        <div className="equipment-grid">
          {equipmentData.map(equipment => (
            <div key={equipment.equipment} className="equipment-card">
              <div className="equipment-card-header">
                <span className="equipment-name">{equipment.equipment}</span>
                <span className={`status-badge status-${equipment.status.toLowerCase()}`}>
                  {equipment.status}
                </span>
              </div>
              
              <div className="equipment-details">
                <div className="detail-row">
                  <span className="detail-label">Failure Mode:</span>
                  <span className="detail-value">{equipment.probable_root_cause}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Anomalies:</span>
                  <span className="detail-value anomaly-count">
                    {equipment.anomaly_count}/{equipment.signals.length} signals
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Last Reading:</span>
                  <span className="detail-value">{equipment.selected_date}</span>
                </div>

                {equipment.historical_incidents.length > 0 && (
                  <div className="incident-info">
                    <AlertTriangle size={14} />
                    {equipment.historical_incidents[0].ar_no}
                    <span className="loss-amount">
                      ${equipment.historical_incidents[0].actual_loss_k_usd}K
                    </span>
                  </div>
                )}
              </div>

              {/* Signal Preview */}
              <div className="signals-preview">
                {equipment.signals.filter(s => s.abnormal).slice(0, 2).map((signal, idx) => (
                  <div key={idx} className="signal-mini">
                    <span className="signal-name">{signal.parameter}</span>
                    <span className="signal-value">
                      {signal.value.toFixed(2)} 
                      <span className="signal-threshold">/ {signal.threshold}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
