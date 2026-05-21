import { useState } from "react";
import { sendContactEmail } from "../../lib/emailService";
import { isValidEmail, isValidPhone } from "../../utils/validators";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  message: ""
};

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function updateField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!isValidPhone(values.phone)) nextErrors.phone = "Enter a valid phone number.";
    if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email.";
    if (!values.eventType.trim()) nextErrors.eventType = "Event type is required.";
    if (!values.message.trim() || values.message.trim().length < 20) {
      nextErrors.message = "Please provide at least 20 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setDone(false);
    if (!validate()) return;
    setLoading(true);
    try {
      await sendContactEmail(values);
      setDone(true);
      setValues(initialValues);
      setErrors({});
    } catch (err) {
      setErrors({ form: err.message || "Could not send inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="grid-2">
        <label className="field">
          <span>Name</span>
          <input
            className="input"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your full name"
          />
          {errors.name && <small className="error-text">{errors.name}</small>}
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            className="input"
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="Phone number"
          />
          {errors.phone && <small className="error-text">{errors.phone}</small>}
        </label>
      </div>

      <div className="grid-2">
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="name@email.com"
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </label>
        <label className="field">
          <span>Event Type</span>
          <select
            className="select"
            value={values.eventType}
            onChange={(e) => updateField("eventType", e.target.value)}
          >
            <option value="">Select event</option>
            <option>Wedding</option>
            <option>Pre-Wedding</option>
            <option>Birthday</option>
            <option>Corporate Event</option>
            <option>Other</option>
          </select>
          {errors.eventType && <small className="error-text">{errors.eventType}</small>}
        </label>
      </div>

      <label className="field">
        <span>Event Date</span>
        <input
          type="date"
          className="input"
          value={values.eventDate}
          onChange={(e) => updateField("eventDate", e.target.value)}
        />
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          rows={6}
          className="textarea"
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="Tell us about your event, venue, and expectations..."
        />
        {errors.message && <small className="error-text">{errors.message}</small>}
      </label>

      {errors.form && <p className="error-text">{errors.form}</p>}
      {done && <p className="ok-text">Inquiry sent successfully. Our team will contact you shortly.</p>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}

