"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, Send } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Veuillez renseigner votre adresse email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
          "Impossible de traiter votre demande pour le moment."
        );
        return;
      }

      // MODE TEST / DÉVELOPPEMENT
      if (data?.developmentToken) {
        window.location.href =
          `/reinitialiser-mot-de-passe?token=${encodeURIComponent(
            data.developmentToken
          )}`;

        return;
      }

      setMessage(
        data?.message ||
        "Si cette adresse email existe, un lien de réinitialisation vous sera envoyé."
      );

      setEmail("");
    } catch (error) {
      console.error("Erreur demande réinitialisation :", error);

      setError(
        "Impossible de contacter le serveur. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-78px)] bg-[#fdfaf7] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-150px)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#eadfd8] bg-white shadow-[0_20px_60px_rgba(75,49,39,0.10)] lg:grid-cols-2">

          {/* Partie visuelle */}
          <div className="relative hidden min-h-[560px] overflow-hidden bg-[#2b211f] lg:flex">
            <img
              src="/image1.png"
              alt="Mini Luxe Parfum"
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#2b211f]/30 via-[#2b211f]/45 to-[#2b211f]/90" />

            <div className="relative z-10 flex flex-col justify-end p-12">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#ead8c0]">
                Mini Luxe Parfum
              </p>

              <h1 className="max-w-md font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight text-white">
                Retrouvez l'accès à votre espace.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#f2e5e1]">
                Entrez l'adresse email associée à votre compte et nous
                vous accompagnerons pour créer un nouveau mot de passe.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="flex items-center justify-center p-7 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">

              <Link
                href="/login"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6f625d] transition-colors hover:text-[#a66a4c]"
              >
                <ArrowLeft size={17} />
                Retour à la connexion
              </Link>

              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2e5e1] text-[#a66a4c]">
                  <Mail size={22} strokeWidth={1.8} />
                </div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#a66a4c]">
                  Accès au compte
                </p>

                <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#2b211f]">
                  Mot de passe oublié ?
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#6f625d]">
                  Renseignez votre adresse email. Si elle correspond à
                  un compte, vous recevrez un lien pour réinitialiser
                  votre mot de passe.
                </p>
              </div>

              {message && (
                <div className="mb-6 flex gap-3 rounded-2xl border border-[#d8e6d9] bg-[#f3f8f3] p-4 text-sm text-[#547a5b]">
                  <CheckCircle2
                    className="mt-0.5 shrink-0"
                    size={19}
                  />

                  <p className="leading-6">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-2xl border border-[#ecd2d2] bg-[#fcf3f3] p-4 text-sm leading-6 text-[#a94b4b]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#5a4740]"
                  >
                    Adresse email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a66a4c]"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="votre@email.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-[#eadfd8] bg-[#fdfaf7] pl-11 pr-4 text-sm text-[#2b211f] outline-none transition-all placeholder:text-[#a99d97] focus:border-[#a66a4c] focus:ring-4 focus:ring-[#a66a4c]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-6 text-sm font-semibold text-white transition-all hover:bg-[#7d4d38] hover:shadow-[0_10px_25px_rgba(125,77,56,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Réinitialiser mon mot de passe
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-[#6f625d]">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#a66a4c] hover:text-[#7d4d38]"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}