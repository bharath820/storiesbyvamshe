import { useId, useRef, useState } from "react";
import { MAX_IMAGE_SIZE_MB, validateImageFile } from "../../lib/storageService";

export function ImageDropZone({ multiple = false, disabled = false, onFiles, label = "Drop images here or click to browse" }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function acceptFiles(fileList) {
    const files = Array.from(fileList || []);
    const selected = multiple ? files : files.slice(0, 1);
    try {
      selected.forEach(validateImageFile);
      setError("");
      if (selected.length) onFiles(selected);
    } catch (nextError) {
      setError(nextError.message || "Could not use that image.");
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          acceptFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        className={`image-drop-zone${dragging ? " is-dragging" : ""}`}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) acceptFiles(event.dataTransfer.files);
        }}
        aria-describedby={`${inputId}-help`}
      >
        <span className="image-drop-zone__icon" aria-hidden="true">+</span>
        <strong>{label}</strong>
        <small id={`${inputId}-help`}>Images only, maximum {MAX_IMAGE_SIZE_MB}MB each</small>
      </button>
      {error && <p className="error-text image-drop-zone__error">{error}</p>}
    </div>
  );
}

