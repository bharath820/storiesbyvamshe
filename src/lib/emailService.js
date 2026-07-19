import emailjs from "@emailjs/browser";
import { httpsCallable } from "firebase/functions";
import { firebaseFunctions, isFirebaseConfigured } from "./firebaseClient";

function getConfig() {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    receiverEmail: import.meta.env.VITE_CONTACT_RECEIVER_EMAIL
  };
}

export async function sendContactEmail(values) {
  const config = getConfig();
  const hasCallableContactForm = isFirebaseConfigured && firebaseFunctions;

  if (hasCallableContactForm) {
    const sendContactInquiry = httpsCallable(firebaseFunctions, "sendContactInquiry");
    const result = await sendContactInquiry({
      name: values.name,
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      message: values.message
    });
    return result.data;
  }

  const hasEmailJsConfig = config.serviceId && config.templateId && config.publicKey;

  if (hasEmailJsConfig) {
    return emailjs.send(
      config.serviceId,
      config.templateId,
      {
        from_name: values.name,
        from_email: values.email,
        phone: values.phone,
        subject: values.subject,
        event_type: values.eventType || values.subject,
        event_date: values.eventDate || "",
        venue: values.venue || "",
        message: values.message
      },
      { publicKey: config.publicKey }
    );
  }

  const subject = encodeURIComponent(values.subject || `New Photography Inquiry from ${values.name}`);
  const body = encodeURIComponent(
    [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Subject: ${values.subject || "Not shared"}`,
      "",
      values.message
    ].join("\n")
  );
  const to = config.receiverEmail || values.email;
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  return { status: "mail-client-opened" };
}

