import React from "react";
import { GoogleLogo, FacebookLogo } from "@phosphor-icons/react";

interface SocialLoginButtonsProps {
  mode?: "login" | "signup";
}

export default function SocialLoginButtons({
  mode = "login",
}: SocialLoginButtonsProps) {
  const actionText =
    mode === "login" ? "Continue with" : "Sign up with";

  const handleGoogleLogin = () => {
    
    // Stage 2:
    // Connect Google OAuth API here.
    console.log("Google authentication selected");
  };

  const handleFacebookLogin = () => {
    // Stage 2:
    // Connect Facebook OAuth API here.
    console.log("Facebook authentication selected");
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
      >
        <GoogleLogo size={20} weight="bold" />
        <span>{actionText} Google</span>
      </button>

      <button
        type="button"
        onClick={handleFacebookLogin}
        className="w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
      >
        <FacebookLogo size={20} weight="fill" />
        <span>{actionText} Facebook</span>
      </button>
    </div>
  );
}