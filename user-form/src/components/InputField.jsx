import React from "react";

const InputField = ({ type, name, value, placeholder, onChange, error }) => {
  return (
    <div className="field">
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InputField;