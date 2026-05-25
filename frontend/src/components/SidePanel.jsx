import "./css/SidePanel.css"

export function SidePanel({activeView, setActiveView}) {

  return <div className="side-panel">
    <h2>ACTIONS</h2>
    <div className="actions-list">
      <button
        type="button"
        className={ activeView === "Transcript" ? "active" : "" }
        onClick={ () => setActiveView("Transcript") }
      >
        Transcript
      </button>

      <button
        type="button"
        className={ activeView === "Benchmark" ? "active" : "" }
        onClick={ () => setActiveView("Benchmark") }
      >
        Benchmark
      </button>
    </div>
  </div>;
}