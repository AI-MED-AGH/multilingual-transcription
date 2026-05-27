import "./css/MetricsDisplay.css";

const METRIC_LABELS = {
  wer: "WER (Word Error Rate)",
  mer: "MER (Match Error Rate)",
  wder: "WDER (Diarization Error)",
};

export function MetricsDisplay({ metrics }) {
  if (!metrics) {
    return null;
  }

  return (
    <section className="metrics-display">
      <h2>Metrics</h2>
      <div className="metrics-grid">
        {Object.entries(METRIC_LABELS).map(([key, label]) => (
          <div key={key} className="metric-card">
            <span className="metric-label">{label}</span>
            <span className="metric-value">
              {metrics[key] < 0 ? "N/A" : `${(metrics[key] * 100).toFixed(2)}%`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
