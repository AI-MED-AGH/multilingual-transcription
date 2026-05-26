import { useState } from 'react';

export function FileUploader({onFileSelect, accept, label}) {
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
      const file = e.dataTransfer.files[0];

      // Clean up the accept string into an array of rules (e.g. ['audio/*', '.txt'])
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileExtension = `.${ file.name.split('.').pop().toLowerCase() }`;

      // Check if the file matches any of the rules in the 'accept' prop
      const isValid = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          // Handles wildcards like 'audio/*' -> matches 'audio/wav', 'audio/mpeg', etc.
          const baseType = type.replace('/*', '');
          return fileType.startsWith(baseType);
        }
        // Handles exact MIME types (e.g. 'audio/wav') or extension lookups (e.g. '.wav', '.txt')
        return type === fileType || type === fileExtension;
      });

      if (isValid) {
        onFileSelect(file);
      } else {
        alert(`Invalid file type. Please upload a file matching: ${ accept }`);
      }
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