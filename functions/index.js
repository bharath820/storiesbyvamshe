import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineSecret, defineString } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import { ContactInquiryError, createContactInquiryHandler } from "./src/contactInquiry.js";

initializeApp();

const gmailUser = defineString("GMAIL_USER", { default: "storiesbyvamshe9@gmail.com" });
const contactToEmail = defineString("CONTACT_TO_EMAIL", { default: "storiesbyvamshe9@gmail.com" });

const gmailAppPassword = defineSecret("GMAIL_APP_PASSWORD");

const contactInquiryHandler = createContactInquiryHandler({
  db: getFirestore(),
  timestamp: () => FieldValue.serverTimestamp(),
  logger,
  getConfig: () => ({
    gmailUser: gmailUser.value(),
    gmailAppPassword: gmailAppPassword.value(),
    contactToEmail: contactToEmail.value()
  }),
  createMailer: (config) =>
    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword
      }
    })
});

export const sendContactInquiry = onCall(
  {
    region: "asia-south1",
    memory: "256MiB",
    timeoutSeconds: 30,
    secrets: [gmailAppPassword]
  },
  async (request) => {
    try {
      return await contactInquiryHandler(request);
    } catch (error) {
      if (error instanceof ContactInquiryError) {
        throw new HttpsError(error.code, error.message);
      }

      logger.error("Unhandled contact inquiry failure", {
        message: error?.message,
        stack: error?.stack
      });
      throw new HttpsError("internal", "Could not send inquiry. Please try again.");
    }
  }
);
