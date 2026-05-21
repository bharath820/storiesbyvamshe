import { ContactForm } from "../components/forms/ContactForm";

export function ContactPage() {
  return (
    <section className="section">
      <div className="container contact-wrap">
        <div>
          <h1 className="section-title">Contact Studio</h1>
          <p className="section-subtitle">
            Tell us your event details and we will share customized photography and film packages.
          </p>
          <ul className="contact-points">
            <li>Wedding and pre-wedding coverage</li>
            <li>Birthday and corporate storytelling</li>
            <li>Cinematic teaser and event films</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
