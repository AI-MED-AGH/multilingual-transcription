import "./css/TranscriptDisplay.css"


export function TranscriptDisplay({header, transcript}) {
  return (
    <div className="transcript-display">
      <h2>{ header }</h2>
      <pre>
        {transcript}
      </pre>
    </div>
  )
}