import React, { useState } from "react";

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!regex.test(email)) return "Invalid email format";
  return null;
};

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Send data to backend
      fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccess(true);
            setForm({ name: "", email: "", company: "", message: "" });
          } else {
            setSuccess(false);
            alert(data.message || "Failed to submit lead");
          }
        })
        .catch(() => {
          setSuccess(false);
          alert("Network error: Could not submit lead");
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name*</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </div>
      <div>
        <label>Email*</label>
        <input name="email" value={form.email} onChange={handleChange} />
        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
      </div>
      <div>
        <label>Company</label>
        <input name="company" value={form.company} onChange={handleChange} />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} />
      </div>
      <button type="submit">Submit</button>
      {success && <div style={{ color: "green" }}>Lead submitted successfully!</div>}
    </form>
  );
}
