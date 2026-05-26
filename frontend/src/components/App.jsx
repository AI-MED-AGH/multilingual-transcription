import './css/App.css'
import { useState } from "react";
import { SidePanel } from "./SidePanel.jsx";
import { TranscriptView } from "./TranscriptView.jsx";
import { BenchmarkView } from "./BenchmarkView.jsx";
import { View } from "../constants.jsx";


function App() {
  const [activeView, setActiveView] = useState(View.TRANSCRIPT);

  const view = {
    [View.TRANSCRIPT]: <TranscriptView />,
    [View.BENCHMARK]: <BenchmarkView />,
  }[activeView];

  return (
    <div className="app-container">
      <SidePanel activeView={activeView} setActiveView={setActiveView}/>
      <div className="view-container">
        {view}
      </div>
    </div>
  )
}

export default App
