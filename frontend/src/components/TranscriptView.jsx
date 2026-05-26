import { useState, useEffect } from 'react';
import { FileUploader } from './FileUploader.jsx';
import { AudioRecorder } from './AudioRecorder.jsx';
import './css/TranscriptView.css';

export function TranscriptView() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // 1. Generate a playable URL whenever a new audio file is set
  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAudioUrl(url);

      // Cleanup: Revoke the URL when the file changes or component unmounts to prevent memory leaks
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl(null);
    }
  }, [audioFile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!audioFile) return;

    console.log("Submitting file:", audioFile);
    alert(`Submitted ${audioFile.name}!`);
  };

  // 2. Function to reject/clear the current recording
  const handleClear = () => {
    setAudioFile(null);
  };

  const downloadAudio = () => {
    if (!audioUrl || !audioFile) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = audioFile.name || 'recording.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="transcript-container">
      <h1>Transcription</h1>

      <form onSubmit={handleSubmit} className="transcript-form">

        {/* If we HAVE an audio file, show the preview player and actions */}
        {audioFile ? (
          <div className="preview-section">
            <p className="file-status">Ready: {audioFile.name}</p>

            {/* Native browser audio player */}
            <audio controls src={audioUrl} className="audio-player" />

            <div className="action-buttons">
              <button type="button" onClick={handleClear} className="discard-btn">
                Delete recording
              </button>

              <button type="button" onClick={downloadAudio} className="download-btn">
                Download recording
              </button>
            </div>

            {/* Leave the uploader visible so they can drag a new file to override it */}
            <div className="override-divider">— OR DRAG A NEW FILE TO OVERRIDE —</div>
            <div className="file-uploads-container">
              <FileUploader onFileSelect={setAudioFile} />
            </div>
          </div>

        ) : (

          /* If we DO NOT have an audio file, show the initial input options */
          <>
            <AudioRecorder onRecordingComplete={setAudioFile} />
            <div style={{ textAlign: "center", color: "#666" }}>— OR —</div>
            <div className="file-uploads-container">
              <FileUploader onFileSelect={setAudioFile} />
            </div>
          </>

        )}

      </form>
    </div>
  );
}