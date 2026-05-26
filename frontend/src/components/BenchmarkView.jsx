import { useEffect, useState } from 'react';
import { FileUploader } from './FileUploader.jsx';
import './css/BenchmarkView.css';
import { ProcessingState } from "../constants.jsx";
import { TranscriptDisplay } from "./TranscriptDisplay.jsx";

export function BenchmarkView() {
  const [audioFile, setAudioFile] = useState(null);
  const [truthFile, setTruthFile] = useState(null);

  const [processingState, setProcessingState] = useState(ProcessingState.FILE_DROP);
  const [transcript, setTranscript] = useState("");
  const [groundTruth, setGroundTruth] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile || !truthFile) {
      alert("Both files are required.");
      return;
    }

    setProcessingState(ProcessingState.LOADING)

    console.log("Submitting Benchmark Data:");
    console.log("Audio:", audioFile.name);
    console.log("Truth:", truthFile.name);

    // --- Placeholder Backend Communication ---
    // const formData = new FormData();
    // formData.append("audio_file", audioFile);
    // formData.append("ground_truth", truthFile);
    //
    // try {
    //   const response = await fetch('http://your-backend-api/benchmark', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   const result = await response.json();
    //   console.log("Success:", result);
    // } catch (error) {
    //   console.error("Error submitting benchmark:", error);
    // }

    setTimeout(() => {
      setTranscript("Fake\nmodel\noutput")
      setProcessingState(ProcessingState.DONE);
    }, 2000)
  };

  useEffect(() => {
    if (!truthFile) {
      return
    }

    if (truthFile.type !== 'text/plain') {
      alert("Ground truth file must be a .txt type!")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTruthFile(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const textContent = e.target.result;
      console.log("File content:", textContent);
      setGroundTruth(textContent);
    };

    reader.onerror = (e) => {
      console.error("Error reading truth file:", e.target.error);
    };

    reader.readAsText(truthFile);
  }, [truthFile]);

  return (
    <div>
      <h1>Benchmark Model</h1>
      <p style={ {color: '#666'} }>Upload an audio file and its matching text transcript to evaluate accuracy.</p>

      <form onSubmit={ handleSubmit } className="benchmark-form">
        <div className="file-uploads-container">
          <div className="upload-section">
            <h3>1. Audio Recording (.mp3, .wav)</h3>
            { audioFile ? (
              <div className="file-ready-card">
                <p>✅ <strong>{ audioFile.name }</strong></p>
                <button type="button" className="remove-btn" onClick={ () => setAudioFile(null) }>
                  Remove
                </button>
              </div>
            ) : (
              <FileUploader
                onFileSelect={ setAudioFile }
                accept="audio/*"
                label="Drop an MP3 or WAV file here, or click to browse"
              />
            ) }
          </div>

          <div className="upload-section">
            <h3>2. Ground Truth Transcript (.txt)</h3>
            { truthFile ? (
              <div className="file-ready-card">
                <p>✅ <strong>{ truthFile.name }</strong></p>
                <button type="button" className="remove-btn" onClick={ () => setTruthFile(null) }>
                  Remove
                </button>
              </div>
            ) : (
              <FileUploader
                onFileSelect={ setTruthFile }
                accept=".txt,text/plain"
                label="Drop the Ground Truth .txt file here, or click to browse"
              />
            ) }
          </div>
        </div>

        {processingState === ProcessingState.LOADING
          ? (
            <div className="loading-button-placeholder">
              Please wait...
            </div>
          ) : (
            <button
              type="submit"
              className="submit-btn"
              disabled={!audioFile}
            >
              Run benchmark
            </button>
          )
        }
      </form>

      {processingState === ProcessingState.DONE && (
        <div className="transcript-container">
            <TranscriptDisplay header="Model output:" transcript={transcript} />
            <TranscriptDisplay header="Ground truth:" transcript={groundTruth} />
        </div>
      )}
    </div>
  );
}