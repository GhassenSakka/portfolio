"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { login, logout, changePassword, requireAdminSession } from "@/lib/auth";

export interface LoginFormState {
  status: "idle" | "error";
  message?: string;
}

const loginSchema = z.object({
  email: z.string().trim().email("Email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const result = await login(parsed.data.email, parsed.data.password);
  if (!result.success) {
    return { status: "error", message: result.error };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}

export interface ChangePasswordState {
  status: "idle" | "success" | "error";
  message?: string;
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis."),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "Confirmation requise."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "La confirmation ne correspond pas au nouveau mot de passe.",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await requireAdminSession();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const result = await changePassword(
    session.sub,
    parsed.data.currentPassword,
    parsed.data.newPassword
  );

  if (!result.success) {
    return { status: "error", message: result.error };
  }

  return { status: "success", message: "Mot de passe mis à jour avec succès." };
}
