const ADMIN_EMAIL = "storiesbyvamshe9@gmail.com";

const FIELD_LIMITS = {
  name: 120,
  email: 254,
  subject: 160,
  phone: 32,
  message: 2000
};

export class ContactInquiryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ContactInquiryError";
    this.code = code;
  }
}

function asTrimmedString(value, maxLength) {
  return String(value || "")
    .split("\0")
    .join("")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

function isValidPhone(value) {
  return /^[0-9+\-\s()]{8,18}$/.test(value || "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function compactError(error) {
  return {
    message: error?.message || "Unknown error",
    code: error?.code || null
  };
}

function normalizeInquiry(data = {}) {
  const source = data && typeof data === "object" ? data : {};
  const inquiry = {
    name: asTrimmedString(source.name, FIELD_LIMITS.name),
    email: asTrimmedString(source.email, FIELD_LIMITS.email).toLowerCase(),
    subject: asTrimmedString(source.subject, FIELD_LIMITS.subject),
    phone: asTrimmedString(source.phone, FIELD_LIMITS.phone),
    message: asTrimmedString(source.message, FIELD_LIMITS.message)
  };

  if (!inquiry.name) throw new ContactInquiryError("invalid-argument", "Name is required.");
  if (!isValidEmail(inquiry.email)) throw new ContactInquiryError("invalid-argument", "Enter a valid email.");
  if (!inquiry.subject) throw new ContactInquiryError("invalid-argument", "Subject is required.");
  if (!isValidPhone(inquiry.phone)) throw new ContactInquiryError("invalid-argument", "Enter a valid phone number.");
  if (inquiry.message.length < 10) {
    throw new ContactInquiryError("invalid-argument", "Please provide at least 10 characters.");
  }

  return inquiry;
}

function assertEmailConfig(config) {
  if (!config.gmailUser || !config.gmailAppPassword || !config.contactToEmail) {
    throw new ContactInquiryError("failed-precondition", "Contact email is not configured.");
  }
}

function formatEmail(inquiry, config) {
  const subject = `New Photography Inquiry: ${inquiry.subject}`;
  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Subject", inquiry.subject],
    ["Message", inquiry.message]
  ];

  return {
    from: `"Stories by Vamshe Website" <${config.gmailUser}>`,
    to: config.contactToEmail,
    replyTo: inquiry.email,
    subject,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `<h2>New Contact Inquiry</h2>${rows
      .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`)
      .join("")}`
  };
}

async function updateStatus(ref, payload, logger) {
  try {
    await ref.update(payload);
  } catch (error) {
    logger?.error?.("Could not update contact inquiry status", {
      inquiryId: ref.id,
      message: error?.message
    });
  }
}

export function createContactInquiryHandler({
  db,
  timestamp,
  logger = console,
  getConfig,
  createMailer
}) {
  return async function sendContactInquiry(request = {}) {
    const inquiry = normalizeInquiry(request.data);
    const config = {
      gmailUser: ADMIN_EMAIL,
      contactToEmail: ADMIN_EMAIL,
      ...getConfig()
    };
    const now = timestamp();
    const ref = await db.collection("contactInquiries").add({
      ...inquiry,
      source: "contact-form",
      emailStatus: "pending",
      createdAt: now,
      updatedAt: now
    });

    try {
      assertEmailConfig(config);
      await createMailer(config).sendMail(formatEmail(inquiry, config));
      await updateStatus(
        ref,
        {
          emailStatus: "sent",
          emailSentAt: timestamp(),
          updatedAt: timestamp()
        },
        logger
      );
    } catch (error) {
      await updateStatus(
        ref,
        {
          status: "notification_failed",
          emailStatus: "failed",
          emailError: compactError(error),
          updatedAt: timestamp()
        },
        logger
      );
      logger?.error?.("Contact inquiry email failed", {
        inquiryId: ref.id,
        message: error?.message
      });
      throw new ContactInquiryError("internal", "Could not send inquiry. Please try again.");
    }

    return {
      ok: true,
      inquiryId: ref.id,
      emailStatus: "sent"
    };
  };
}
