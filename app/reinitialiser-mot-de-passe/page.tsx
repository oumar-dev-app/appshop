"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, CheckCircle2 } from "lucide-react";

function ReinitialiserMotDePasseForm() {
    const searchParams = useSearchParams();

    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!token) {
            setError("Le lien de réinitialisation est invalide.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Le mot de passe doit contenir au moins 6 caractères."
            );
            return;
        }

        if (password !== confirmation) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data?.message ||
                        "Impossible de réinitialiser le mot de passe."
                );
                return;
            }

            setSuccess(true);
            setMessage(
                data?.message ||
                    "Votre mot de passe a été réinitialisé avec succès."
            );

            setPassword("");
            setConfirmation("");
        } catch (err) {
            console.error(err);

            setError(
                "Impossible de contacter le serveur. Veuillez réessayer."
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md">
                <div className="rounded-3xl border border-[#eadfd8] bg-white p-8 text-center shadow-[0_20px_60px_rgba(75,49,39,0.08)]">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f2e5e1]">
                        <CheckCircle2
                            size={32}
                            className="text-[#a66a4c]"
                        />
                    </div>

                    <h1 className="mb-3 text-2xl font-semibold">
                        Mot de passe réinitialisé
                    </h1>

                    <p className="mb-6 text-sm leading-6 text-[#6f625d]">
                        {message}
                    </p>

                    <Link
                        href="/"
                        className="ml-button-primary w-full"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-3xl border border-[#eadfd8] bg-white p-8 shadow-[0_20px_60px_rgba(75,49,39,0.08)]">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2e5e1]">
                        <LockKeyhole
                            size={25}
                            className="text-[#a66a4c]"
                        />
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Nouveau mot de passe
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#6f625d]">
                        Choisissez un nouveau mot de passe pour
                        sécuriser votre compte.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-[#ead0ca] bg-[#fdf3f1] px-4 py-3 text-sm text-[#a94b4b]">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-[#5a4740]"
                        >
                            Nouveau mot de passe
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Minimum 6 caractères"
                                className="w-full rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (value) => !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7d77] hover:text-[#a66a4c]"
                                aria-label={
                                    showPassword
                                        ? "Masquer le mot de passe"
                                        : "Afficher le mot de passe"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmation"
                            className="mb-2 block text-sm font-medium text-[#5a4740]"
                        >
                            Confirmer le mot de passe
                        </label>

                        <div className="relative">
                            <input
                                id="confirmation"
                                type={
                                    showConfirmation
                                        ? "text"
                                        : "password"
                                }
                                value={confirmation}
                                onChange={(e) =>
                                    setConfirmation(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirmez votre mot de passe"
                                className="w-full rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmation(
                                        (value) => !value
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7d77] hover:text-[#a66a4c]"
                                aria-label={
                                    showConfirmation
                                        ? "Masquer le mot de passe"
                                        : "Afficher le mot de passe"
                                }
                            >
                                {showConfirmation ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Réinitialisation..."
                            : "Réinitialiser le mot de passe"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm font-medium text-[#a66a4c] transition hover:text-[#7d4d38] hover:underline"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ReinitialiserMotDePassePage() {
    return (
        <main className="min-h-screen bg-[#fdfaf7] px-4 py-12">
            <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
                <Suspense
                    fallback={
                        <div className="w-full max-w-md">
                            <div className="rounded-3xl border border-[#eadfd8] bg-white p-8 text-center shadow-[0_20px_60px_rgba(75,49,39,0.08)]">
                                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#eadfd8] border-t-[#a66a4c]" />
                                <p className="text-sm text-[#6f625d]">
                                    Chargement...
                                </p>
                            </div>
                        </div>
                    }
                >
                    <ReinitialiserMotDePasseForm />
                </Suspense>
            </div>
        </main>
    );
}