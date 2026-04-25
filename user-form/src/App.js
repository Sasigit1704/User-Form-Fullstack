import React, { useState, useRef } from "react";
import "./App.css";
import InputField from "./components/InputField";
import RadioGroup from "./components/RadioGroup";
import FileUpload from "./components/FileUpload";
import { validateForm } from "./utils/validateForm";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    gender: "",
    profile: null
  });

  const [errors, setErrors] = useState({});
  const [tempFileName, setTempFileName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let newErrors = { ...errors };

    // PHONE
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    // EMAIL
    if (name === "email") {
      const lower = value.toLowerCase();
      setFormData({ ...formData, email: lower });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex ensures email follows valid format
      if (!emailRegex.test(lower)) newErrors.email = "Invalid email";
      else delete newErrors.email;

      setErrors(newErrors);
      return;
    }

    // FILE
    if (name === "profile") {
      const file = files[0];
      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png"
      ];

      if (!allowedTypes.includes(file.type)) {
        newErrors.profile = "Invalid file type";
        setErrors(newErrors);
        setTempFileName(file.name);
        setFormData({ ...formData, profile: file });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        newErrors.profile = "Max size 2MB";
        setErrors(newErrors);
        setFormData({ ...formData, profile: file });
        return;
      }

      delete newErrors.profile;
      setErrors(newErrors);
      setFormData({ ...formData, profile: file });
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "name" && !value.trim())
      newErrors.name = "Name is required";
    else if (name === "name") delete newErrors.name;

    if (name === "phone" && value.length !== 10)
      newErrors.phone = "Phone must be 10 digits";
    else if (name === "phone") delete newErrors.phone;

    if (name === "gender" && !value)
      newErrors.gender = "Select gender";
    else if (name === "gender") delete newErrors.gender;

    setErrors(newErrors);
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, profile: null });
    fileRef.current.value = "";
    let newErrors = { ...errors };
    delete newErrors.profile;
    setTempFileName("");
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess("");

    let newErrors = validateForm(formData, errors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage("Fix errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const res = await fetch("http://localhost:5195/api/user", {
        method: "POST",
        body: data
      });

      const text = await res.text();

      if (!res.ok) {
        setMessage(text);
        setLoading(false);
        return;
      }

      setSuccess("Form submitted successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        countryCode: "+91",
        gender: "",
        profile: null
      });

      fileRef.current.value = "";
      setErrors({});
    } catch {
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>User Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
        <label>Name:</label>
        <InputField
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter your Name"
          onChange={handleChange}
          error={errors.name}
        />
        </div>
        <div className="row">
        <label>Email:</label>
        <InputField
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your Email"
          onChange={handleChange}
          error={errors.email}
        /></div>

        <div className="phone-group">
         <div className="field">
          <label>Country Code:</label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
          >
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>
          </div>
          <div className="field">
          <label>Phone:</label>
          <InputField
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleChange}
            error={errors.phone}
          />
          </div>
        </div>
        <label>Gender:</label>
        <RadioGroup
          value={formData.gender}
          onChange={handleChange}
          error={errors.gender}
        />
        <div className="row">
        <label>Profile:</label>
        <FileUpload
          onChange={handleChange}
          error={errors.profile}
          fileRef={fileRef}
          file={formData.profile}
          tempFileName={tempFileName}
          onRemove={handleRemoveFile}
        /></div>

        <button type="submit" disabled={loading}>
          {loading && <div className="loader"></div>}Submit
        </button>
      </form>

      {message && <p className="error">{message}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default App;