import { useState } from 'react';
import { FileUploader } from './FileUploader.jsx';
import './css/BenchmarkView.css';

export function BenchmarkView() {
  const [audioFile, setAudioFile] = useState(null);
  const [truthFile, setTruthFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile || !truthFile) {
      alert("Both files are required.");
      return;
    }

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

    alert("Benchmark files submitted successfully!");
  };

  return (
    <div className="benchmark-container">
      <h1>Benchmark Model</h1>
      <p style={{color: '#666'}}>Upload an audio file and its matching text transcript to evaluate accuracy.</p>

      <form onSubmit={handleSubmit} className="benchmark-form">
        <div className="file-uploads-container">
          <div className="upload-section">
            <h3>1. Audio Recording (.mp3, .wav)</h3>
            {audioFile ? (
              <div className="file-ready-card">
                <p>✅ <strong>{audioFile.name}</strong></p>
                <button type="button" className="remove-btn" onClick={() => setAudioFile(null)}>
                  Remove
                </button>
              </div>
            ) : (
              <FileUploader
                onFileSelect={setAudioFile}
                accept=".mp3,audio/mpeg,.wav,audio/wav"
                label="Drop an MP3 or WAV file here, or click to browse"
              />
            )}
          </div>

          <div className="upload-section">
            <h3>2. Ground Truth Transcript (.txt)</h3>
            {truthFile ? (
              <div className="file-ready-card">
                <p>✅ <strong>{truthFile.name}</strong></p>
                <button type="button" className="remove-btn" onClick={() => setTruthFile(null)}>
                  Remove
                </button>
              </div>
            ) : (
              <FileUploader
                onFileSelect={setTruthFile}
                accept=".txt,text/plain"
                label="Drop the Ground Truth .txt file here, or click to browse"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!audioFile || !truthFile}
        >
          Run Benchmark
        </button>
      </form>
    </div>
  );
}