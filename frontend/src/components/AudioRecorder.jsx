import { useState, useRef } from 'react';
import MicRecorder from 'mic-recorder-to-mp3-fixed';

export function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(new MicRecorder({ bitRate: 128, numberOfChannels: 1 }));

  const startRecording = async () => {
    try {
      // The library handles getUserMedia permissions automatically
      await recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting MP3 recording:", error);
      alert("Could not access the microphone.");
    }
  };

  const stopRecording = async () => {
    try {
      // stop() returns a promise that resolves to [buffer, blob]
      const [buffer, blob] = await recorderRef.current.stop().getMp3();

      // Create a standard File object from the MP3 blob
      const audioFile = new File(buffer, "browser-recording.mp3", {
        type: blob.type,
        lastModified: Date.now()
      });

      onRecordingComplete(audioFile);
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping MP3 recording:", error);
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