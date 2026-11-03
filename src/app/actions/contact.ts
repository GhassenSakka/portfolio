"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations/contact";
import { isRateLimited } from "@/lib/rate-limit";

export interface ContactFormState {
  status: "idle" | "success" | "error" | "rate-limited" | "validation-error";
  message?: string;
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // Honeypot rempli -> probable robot : on simule un succès sans rien enregistrer.
  if (raw.website.trim().length > 0) {
    return { status: "success" };
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "validation-error",
      message: parsed.error.issues[0]?.message,
    };
  }

  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    null;

  if (await isRateLimited(ipAddress)) {
    return { status: "rate-limited" };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return { status: "error" };
  }

  await maybeSendNotificationEmail({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  return { status: "success" };
}

async function maybeSendNotificationEmail(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.CONTACT_NOTIFY_EMAIL) {
    return; // SMTP non configuré : fonctionnement normal, sans notification email.
  }
  try {
    const nodemailer = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_NOTIFY_EMAIL,
      replyTo: data.email,
      subject: `[Portfolio] ${data.subject || `Nouveau message de ${data.name}`}`,
      text: `De : ${data.name} <${data.email}>\n\n${data.message}`,
    });
  } catch (error) {
    // L'échec d'envoi d'email ne doit jamais faire échouer le formulaire.
    console.error("SMTP notification failed:", error);
  }
}
