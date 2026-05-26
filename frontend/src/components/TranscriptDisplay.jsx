import "./css/TranscriptDisplay.css"


export function TranscriptDisplay({transcript}) {
  return (
    <pre className="transcript-display">
      {transcript}
    </pre>
  )
}