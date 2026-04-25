import React from "react";

const FileUpload = ({ onChange, error, fileRef, file, tempFileName, onRemove }) => {
  return (
    <div className="field">
      <input
        type="file"
        name="profile"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={onChange}
        ref={fileRef}
      />

      {/* Show file name + remove */}
      {(file || tempFileName) && (
        <div className="file-info">
          <span>{file ? file.name : tempFileName}</span>
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUpload;