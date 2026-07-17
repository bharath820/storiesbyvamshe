import { ContactForm } from "../components/forms/ContactForm";

export function ContactPage() {
  return (
    <section className="contact-page">
      <div className="container">
        <header className="contact-intro">
          <p className="contact-eyebrow">Begin your story</p>
          <h1>Let’s create something<br />beautiful together.</h1>
          <p>Share a few details about your celebration, and we’ll thoughtfully curate a photography and film experience around you.</p>
        </header>

        <div className="contact-wrap">
          <aside className="contact-story" aria-label="Studio contact information">
            <img src="/assets/home/cta-wedding.jpg" alt="A couple photographed by Stories by Vamshe" />
            <div className="contact-story__shade" />
            <div className="contact-story__content">
              <p className="contact-story__kicker">Stories by Vamshe</p>
              <h2>Your moments deserve to be remembered.</h2>
              <p className="contact-story__copy">From the quiet glances to the grand celebrations, we preserve every feeling with honesty and artistry.</p>

              <div className="contact-details">
                <a href="tel:+919030501106" className="contact-detail">
                  <span className="contact-detail__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z" /></svg>
                  </span>
                  <span><small>Call us</small><strong>+91 90305 01106</strong></span>
                </a>
                <a href="mailto:storiesbyvamshe9@gmail.com" className="contact-detail">
                  <span className="contact-detail__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" /></svg>
                  </span>
                  <span><small>Email us</small><strong>storiesbyvamshe9@gmail.com</strong></span>
                </a>
                <div className="contact-detail">
                  <span className="contact-detail__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <span><small>Based in</small><strong>Hyderabad, Telangana</strong></span>
                </div>
              </div>
            </div>
          </aside>

          <div className="contact-form-card">
            <div className="contact-form-card__heading">
              <div>
                <p>Tell us about your event</p>
                <h2>Request availability</h2>
              </div>
              <span className="contact-form-card__step">01</span>
            </div>
            <ContactForm />
          </div>
        </div>

        <div className="contact-assurance" aria-label="What happens after submitting">
          <span>Personal consultation</span>
          <span>Tailored packages</span>
          <span>Response within 24 hours</span>
        </div>
      </div>
    </section>
  );
}
