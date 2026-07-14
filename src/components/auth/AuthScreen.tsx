"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Phone,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { BrandCrown } from "@/components/brand/Logo";
import { useLang, useT } from "@/lib/use-lang";
import type { TranslationKey } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

type Mode = "login" | "register";

export function AuthScreen() {
  const t = useT();
  const lang = useLang();
  const setCustomer = useApp((s) => s.setCustomer);

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (mode === "register" && name.trim().length < 2) {
      toast.error(lang === "ar" ? "الاسم قصير جداً" : "Name is too short");
      return;
    }
    if (password.length < 6) {
      toast.error(
        lang === "ar"
          ? "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"
          : "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? { name, phone, password }
          : { phone, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.customer) {
        const msg =
          data?.message ||
          (lang === "ar" ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong");
        toast.error(msg);
        return;
      }

      setCustomer({
        id: data.customer.id,
        name: data.customer.name,
        phone: data.customer.phone,
        token: data.token,
      });

      toast.success(
        mode === "register" ? t("authRegisterSuccess") : t("authLoginSuccess")
      );
    } catch {
      toast.error(
        lang === "ar" ? "تعذّر الاتصال بالخادم" : "Could not reach server"
      );
    } finally {
      setLoading(false);
    }
  }

  const tt = (k: TranslationKey) => t(k);

  return (
    <div className="relative min-h-screen overflow-hidden bg-prestige-radial">
      {/* ambient crimson glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#DC143C]/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 translate-x-1/3 translate-y-1/3 rounded-full bg-[#DC143C]/10 blur-[90px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-10">
        {/* Logo + heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <BrandCrown size={64} />
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
            <span className="crown-shine">PRESTIGE</span> GARAGE
          </h1>
          <p className="mt-1.5 text-xs text-white/55">{tt("authWelcome")}</p>
          <p className="mt-0.5 text-[11px] text-white/35">{tt("authSubtitle")}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-7 w-full rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6"
        >
          {/* Mode toggle */}
          <div className="relative mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-white/6 bg-black/20 p-1">
            <AnimatePresence>
              <motion.div
                key={mode}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-l from-[#a00f2c] to-[#ff1f4a] shadow-[0_0_18px_rgba(220,20,60,0.45)]"
                style={{ [lang === "ar" ? "right" : "left"]: 4 } as React.CSSProperties}
              />
            </AnimatePresence>
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`relative z-10 rounded-xl py-2.5 text-[13px] font-bold transition ${
                  mode === m ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {m === "login" ? tt("authLoginTab") : tt("authRegisterTab")}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "register" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Field
                    icon={<User size={16} />}
                    label={tt("authName")}
                    placeholder={tt("authNamePlaceholder")}
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              icon={<Phone size={16} />}
              label={tt("authPhone")}
              placeholder={tt("authPhonePlaceholder")}
              value={phone}
              onChange={setPhone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
            />

            <div>
              <Field
                icon={<Lock size={16} />}
                label={tt("authPassword")}
                placeholder={tt("authPasswordPlaceholder")}
                value={password}
                onChange={setPassword}
                type={showPass ? "text" : "password"}
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                dir="ltr"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white/70 transition"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
              {mode === "register" && (
                <p className="mt-1.5 px-1 text-[10px] text-white/35">
                  {tt("authMinPassword")}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#a00f2c] to-[#ff1f4a] text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(220,20,60,0.7)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === "register" ? tt("authRegisterBtn") : tt("authLoginBtn")}
                  <ArrowRight size={16} className={lang === "ar" ? "rotate-180" : ""} />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-4 text-center text-[12px] text-white/50">
            {mode === "login" ? tt("authNoAccount") : tt("authHaveAccount")}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold text-[#ff4d6d] hover:text-[#ff6d8a] transition"
            >
              {mode === "login" ? tt("authRegisterTab") : tt("authLoginTab")}
            </button>
          </div>
        </motion.div>

        {/* Trust line */}
        <div className="mt-6 flex items-center gap-1.5 text-[10px] text-white/30">
          <ShieldCheck size={12} className="text-[#ff4d6d]/70" />
          {tt("authSecure")}
        </div>
      </div>
    </div>
  );
}

/* ---------- small controlled field ---------- */
interface FieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  dir?: "rtl" | "ltr";
  trailing?: React.ReactNode;
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  dir,
  trailing,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[11px] font-semibold text-white/55">
        {label}
      </span>
      <div className="group flex h-12 items-center gap-2.5 rounded-2xl border border-white/8 bg-black/25 px-3.5 transition focus-within:border-[#DC143C]/60 focus-within:bg-black/35 focus-within:shadow-[0_0_0_3px_rgba(220,20,60,0.12)]">
        <span className="text-white/40 transition group-focus-within:text-[#ff4d6d]">
          {icon}
        </span>
        <input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}
