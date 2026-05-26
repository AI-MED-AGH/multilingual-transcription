import "./css/SidePanel.css"
import { View } from "../constants.jsx";

export function SidePanel({activeView, setActiveView}) {

  return <div className="side-panel">
    <h2>ACTIONS</h2>
    <div className="actions-list">
      <button
        type="button"
        className={ activeView === View.TRANSCRIPT ? "active" : "" }
        onClick={ () => setActiveView(View.TRANSCRIPT) }
      >
        Transcript
      </button>

      <button
        type="button"
        className={ activeView === View.BENCHMARK ? "active" : "" }
        onClick={ () => setActiveView(View.BENCHMARK) }
      >
        Benchmark
      </button>
    </div>
  </div>;
}