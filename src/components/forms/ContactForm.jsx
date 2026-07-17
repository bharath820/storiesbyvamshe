import { useState } from "react";
import { sendContactEmail } from "../../lib/emailService";
import { isValidEmail, isValidPhone } from "../../utils/validators";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  venue: "",
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
      <div className="contact-form__grid">
        <label className="field">
          <span>Full name <em>*</em></span>
          <input
            className="input"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="How should we address you?"
          />
          {errors.name && <small className="error-text">{errors.name}</small>}
        </label>
        <label className="field">
          <span>Phone number <em>*</em></span>
          <input
            type="tel"
            className="input"
            name="phone"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <small className="error-text">{errors.phone}</small>}
        </label>
      </div>

      <div className="contact-form__grid">
        <label className="field">
          <span>Email address <em>*</em></span>
          <input
            type="email"
            className="input"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="name@email.com"
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </label>
        <label className="field">
          <span>Type of event <em>*</em></span>
          <select
            className="select"
            value={values.eventType}
            onChange={(e) => updateField("eventType", e.target.value)}
          >
            <option value="">Choose your celebration</option>
            <option>Wedding</option>
            <option>Pre-Wedding</option>
            <option>Birthday</option>
            <option>Corporate Event</option>
            <option>Other</option>
          </select>
          {errors.eventType && <small className="error-text">{errors.eventType}</small>}
        </label>
      </div>

      <div className="contact-form__grid">
        <label className="field">
          <span>Event date</span>
          <input
            type="date"
            className="input"
            name="eventDate"
            value={values.eventDate}
            onChange={(e) => updateField("eventDate", e.target.value)}
          />
        </label>
        <label className="field">
          <span>Venue / city</span>
          <input
            className="input"
            name="venue"
            autoComplete="address-level2"
            value={values.venue}
            onChange={(e) => updateField("venue", e.target.value)}
            placeholder="Where is it happening?"
          />
        </label>
      </div>

      <label className="field">
        <span>Tell us your vision <em>*</em></span>
        <textarea
          rows={5}
          className="textarea"
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="What are you celebrating? Share the mood, guest count, or anything meaningful to you..."
        />
        {errors.message && <small className="error-text">{errors.message}</small>}
      </label>

      {errors.form && <p className="form-notice form-notice--error" role="alert">{errors.form}</p>}
      {done && <p className="form-notice form-notice--success" role="status">Thank you! Your story is now in our inbox. We’ll be in touch shortly.</p>}

      <div className="contact-form__footer">
        <p><span aria-hidden="true">✦</span> Your details remain private and are only used to respond to your inquiry.</p>
        <button type="submit" className="contact-submit" disabled={loading}>
          <span>{loading ? "Sending..." : "Send my inquiry"}</span>
          {!loading && <span aria-hidden="true">↗</span>}
        </button>
      </div>
    </form>
  );
}

