import { useState, useRef } from 'react';

export function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Creates a webm/mp4 audio blob (browser default)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // We create a "File" object from the Blob so it acts just like an uploaded file
        const audioFile = new File([audioBlob], "browser-recording.webm", { type: 'audio/webm' });

        onRecordingComplete(audioFile);
        audioChunksRef.current = []; // Reset chunks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access the microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks to turn off the microphone light in the browser
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <button
      type="button"
      className={`record-btn ${isRecording ? "recording" : ""}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? "⏹ Stop Recording" : "⏺ Record Audio"}
    </button>
  );
}