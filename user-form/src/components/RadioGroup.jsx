import React from "react";

const RadioGroup = ({ value, onChange, error }) => {
  return (
    <div className="field">
      <div className="radio-group">
        {["male", "female", "other"].map((g) => (
          <label key={g}>
            <input
              type="radio"
              name="gender"
              value={g}
              checked={value === g}
              onChange={onChange}
            />
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </label>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RadioGroup;