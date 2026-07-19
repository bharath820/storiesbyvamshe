import { ContactForm } from "../components/forms/ContactForm";

export function ContactPage() {
  return (
    <section className="contact-page contact-page--split" aria-labelledby="contact-title">
      <div className="contact-split">
        <figure className="contact-split__media">
          <img src="/assets/home/wedding-1.jpg" alt="Wedding portrait by Stories by Vamshe" />
        </figure>

        <div className="contact-split__panel">
          <div className="contact-panel__inner">
            <header className="contact-panel__header">
              <p className="contact-eyebrow">Stories by Vamshe</p>
              <h1 id="contact-title">Get in touch</h1>
            </header>

            <div className="contact-panel__details" aria-label="Studio contact information">
              <div className="contact-panel__detail-stack">
                <div className="contact-info-block">
                  <h2>Email</h2>
                  <a href="mailto:storiesbyvamshe9@gmail.com">storiesbyvamshe9@gmail.com</a>
                </div>

                <div className="contact-info-block">
                  <h2>Phone</h2>
                  <a href="tel:+919030501106">+91 90305 01106</a>
                </div>
              </div>

              <div className="contact-info-block contact-info-block--reach">
                <h2>Reach Us</h2>
                <address>
                  Hyderabad,
                  <br />
                  Telangana,
                  <br />
                  India.
                </address>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
