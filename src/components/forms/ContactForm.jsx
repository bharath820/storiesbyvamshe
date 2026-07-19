import { useState } from "react";
import { sendContactEmail } from "../../lib/emailService";
import { isValidEmail, isValidPhone } from "../../utils/validators";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  phone: "",
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
    if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email.";
    if (!values.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!isValidPhone(values.phone)) nextErrors.phone = "Enter a valid phone number.";
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
      <label className="field">
        <span className="visually-hidden">Name <em>*</em></span>
        <input
          className="input"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Name"
        />
        {errors.name && <small className="error-text">{errors.name}</small>}
      </label>

      <label className="field">
        <span className="visually-hidden">Email address <em>*</em></span>
        <input
          type="email"
          className="input"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Email"
        />
        {errors.email && <small className="error-text">{errors.email}</small>}
      </label>

      <label className="field">
        <span className="visually-hidden">Subject <em>*</em></span>
        <input
          className="input"
          name="subject"
          value={values.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          placeholder="Subject"
        />
        {errors.subject && <small className="error-text">{errors.subject}</small>}
      </label>

      <label className="field">
        <span className="visually-hidden">Phone number <em>*</em></span>
        <input
          type="tel"
          className="input"
          name="phone"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Phone"
        />
        {errors.phone && <small className="error-text">{errors.phone}</small>}
      </label>

      <label className="field">
        <span className="visually-hidden">Message optional</span>
        <textarea
          rows={4}
          className="textarea"
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Message (optional)"
        />
        {errors.message && <small className="error-text">{errors.message}</small>}
      </label>

      {errors.form && <p className="form-notice form-notice--error" role="alert">{errors.form}</p>}
      {done && <p className="form-notice form-notice--success" role="status">Thank you! We will be in touch shortly.</p>}

      <button type="submit" className="contact-submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
