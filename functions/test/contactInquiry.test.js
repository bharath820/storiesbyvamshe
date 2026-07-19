import assert from "node:assert/strict";
import test from "node:test";
import { ContactInquiryError, createContactInquiryHandler } from "../src/contactInquiry.js";

const validPayload = {
  name: "Vamshe",
  email: "client@example.com",
  subject: "Wedding shoot",
  phone: "+919876543210",
  message: "We want to ask about wedding photography packages."
};

function createHarness({ emailFails = false } = {}) {
  const writes = [];
  const updates = [];
  const emails = [];
  const logs = [];
  const ref = {
    id: "inquiry_123",
    update: async (payload) => updates.push(payload)
  };
  const db = {
    collection: (name) => ({
      add: async (payload) => {
        writes.push({ name, payload });
        return ref;
      }
    })
  };
  const config = {
    gmailUser: "storiesbyvamshe9@gmail.com",
    gmailAppPassword: "gmail-secret",
    contactToEmail: "storiesbyvamshe9@gmail.com"
  };

  const handler = createContactInquiryHandler({
    db,
    timestamp: () => "SERVER_TIME",
    logger: {
      error: (...args) => logs.push(args)
    },
    getConfig: () => config,
    createMailer: () => ({
      sendMail: async (payload) => {
        emails.push(payload);
        if (emailFails) throw new Error("SMTP unavailable");
      }
    })
  });

  return { handler, writes, updates, emails, logs };
}

test("saves a valid inquiry and sends an admin email notification", async () => {
  const harness = createHarness();

  const result = await harness.handler({ data: validPayload });

  assert.deepEqual(result, {
    ok: true,
    inquiryId: "inquiry_123",
    emailStatus: "sent"
  });
  assert.equal(harness.writes[0].name, "contactInquiries");
  assert.equal(harness.writes[0].payload.email, "client@example.com");
  assert.equal(harness.emails[0].to, "storiesbyvamshe9@gmail.com");
  assert.equal(harness.emails[0].replyTo, "client@example.com");
  assert.equal(harness.updates.some((payload) => payload.emailStatus === "sent"), true);
});

test("rejects invalid email before writing to Firestore", async () => {
  const harness = createHarness();

  await assert.rejects(
    () => harness.handler({ data: { ...validPayload, email: "not-an-email" } }),
    (error) => error instanceof ContactInquiryError && error.code === "invalid-argument"
  );
  assert.equal(harness.writes.length, 0);
});

test("rejects malformed callable payloads before writing to Firestore", async () => {
  const harness = createHarness();

  await assert.rejects(
    () => harness.handler({ data: null }),
    (error) => error instanceof ContactInquiryError && error.code === "invalid-argument"
  );
  assert.equal(harness.writes.length, 0);
});

test("rejects invalid phone before writing to Firestore", async () => {
  const harness = createHarness();

  await assert.rejects(
    () => harness.handler({ data: { ...validPayload, phone: "abc" } }),
    (error) => error instanceof ContactInquiryError && error.code === "invalid-argument"
  );
  assert.equal(harness.writes.length, 0);
});

test("accepts inquiries without an optional message", async () => {
  const harness = createHarness();

  const result = await harness.handler({ data: { ...validPayload, message: "   " } });

  assert.equal(result.ok, true);
  assert.equal(harness.writes[0].payload.message, "");
  assert.match(harness.emails[0].text, /Message: $/m);
});

test("returns an error and stores failure status when email delivery fails", async () => {
  const harness = createHarness({ emailFails: true });

  await assert.rejects(
    () => harness.handler({ data: validPayload }),
    (error) => error instanceof ContactInquiryError && error.code === "internal"
  );
  assert.equal(harness.updates.some((payload) => payload.emailStatus === "failed"), true);
  assert.equal(harness.updates.some((payload) => payload.status === "notification_failed"), true);
});
