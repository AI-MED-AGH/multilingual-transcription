import { useState } from 'react';

// Added 'accept' and 'label' props with default fallbacks
export function FileUploader({
                               onFileSelect,
                               accept = "audio/*",
                               label = "Drop a recording file here, or click to browse",
                             }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="upload-section">
      <label
        className={ `drop-zone ${ isDragging ? "dragging" : "" }` }
        onDragOver={ handleDragOver }
        onDragLeave={ handleDragLeave }
        onDrop={ handleDrop }
      >
        <p>{ label }</p>
        <input
          type="file"
          accept={ accept }
          onChange={ handleChange }
        />
      </label>
    </div>
  );
}