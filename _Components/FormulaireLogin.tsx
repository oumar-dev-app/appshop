import Link from "next/link";
import React from "react";

const FormulaireLogin = () => {
  return (
    <div className="w-full">
      <form action="" className="flex w-full flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border p-2"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full rounded-lg border p-2"
        />

        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4"
            />

            <label
              htmlFor="remember"
              className="text-sm text-[#5a4740]"
            >
              Se souvenir de moi
            </label>
          </div>

          <Link
            href="/mot-de-passe-oublie"
            className="shrink-0 text-sm font-medium text-[#a66a4c] hover:text-[#7d4d38]"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#a66a4c] p-2 text-white transition hover:bg-[#7d4d38]"
        >
          Connexion
        </button>

        <div className="flex items-center justify-center gap-2 text-sm">
          <p>Vous n'avez pas de compte ?</p>

          <Link
            href="/register"
            className="text-[#a66a4c] underline hover:text-[#7d4d38]"
          >
            Créer un compte
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FormulaireLogin;