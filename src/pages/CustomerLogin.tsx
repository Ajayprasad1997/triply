import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  Warning,
  SignIn,
  ArrowLeft,
  UserPlus,
} from "@phosphor-icons/react";

import { TriiplyLogo } from "../components/TriiplyLogo";
import SocialLoginButtons from "../components/SocialLoginButtons";

interface SelectedSubscription {
  planId: number;
  billing: "monthly" | "yearly";
  planName?: string;
  price?: number;
}

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<SelectedSubscription | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Read selected subscription.
   *
   * Example:
   * {
   *   planId: 2,
   *   billing: "monthly"
   * }
   */
  useEffect(() => {
    try {
      const storedSubscription =
        localStorage.getItem("selectedSubscription");

      if (storedSubscription) {
        const parsed = JSON.parse(storedSubscription);

        setSelectedSubscription(parsed);
      }
    } catch (error) {
      console.error(
        "Unable to read selected subscription:",
        error
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    /*
     * Stage 1:
     * Frontend demo only.
     *
     * Stage 2:
     * Replace this with your Node/Express API.
     */

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      /*
       * Demo login.
       *
       * Remove this when backend authentication
       * is connected.
       */

      const demoUser = {
        id: "demo-user",
        name: "Demo Customer",
        email: cleanEmail,
        role: "customer",
      };

      localStorage.setItem(
        "triiplyUser",
        JSON.stringify(demoUser)
      );

      /*
       * If user came here after selecting a subscription,
       * send them to checkout.
       */

      if (selectedSubscription) {
        navigate("/subscription-checkout");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  /*
   * Preserve subscription when going to signup.
   */
  const goToSignup = () => {
    navigate("/signup", {
      state: {
        from: location.pathname,
        subscription: selectedSubscription,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Shapes */}

      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-7 sm:space-y-8 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xl z-10">

        {/* Header */}

        <div className="text-center">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />

            <span>Back to Home</span>
          </Link>

          <div className="flex justify-center mb-5">
            <TriiplyLogo
              className="h-10"
              showTagline={false}
            />
          </div>

          <h2 className="font-heading text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-xs text-slate-500 font-semibold leading-relaxed">
            Login to your Triiply account and continue
            managing your travel business.
          </p>
        </div>

        {/* Selected Subscription */}

        {selectedSubscription && (
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">
                  Selected Plan
                </p>

                <p className="text-sm font-extrabold text-slate-900 mt-1">
                  {selectedSubscription.planName ||
                    "Selected Subscription"}
                </p>
              </div>

              <div className="text-right">

                <p className="text-xs font-bold text-slate-600">
                  {selectedSubscription.billing ===
                  "yearly"
                    ? "Yearly"
                    : "Monthly"}
                </p>

                {selectedSubscription.price && (
                  <p className="text-sm font-extrabold text-blue-600">
                    ₹
                    {selectedSubscription.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                )}

              </div>

            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Your selected plan will be available after
              login.
            </p>

          </div>
        )}

        {/* Login Form */}

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {/* Error */}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2.5">

              <Warning
                size={20}
                weight="fill"
                className="text-rose-500 shrink-0"
              />

              <span>{error}</span>

            </div>
          )}

          {/* Email */}

          <div>

            <label
              htmlFor="customer-email"
              className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Email Address
            </label>

            <div className="relative">

              <Envelope
                size={18}
                className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />

              <input
                id="customer-email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <div className="flex justify-between items-center mb-1.5">

              <label
                htmlFor="customer-password"
                className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide"
              >
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>

            </div>

            <div className="relative">

              <Lock
                size={18}
                className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />

              <input
                id="customer-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••••••"
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeSlash size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Login */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-sky-500/20 disabled:opacity-60"
          >

            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <SignIn
                  size={18}
                  weight="bold"
                />

                <span>Login to Triiply</span>
              </>
            )}

          </button>

        </form>

        {/* Divider */}

        <div className="relative">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

        </div>

        {/* Social Login */}

        <SocialLoginButtons mode="login" />

        {/* Signup */}

        <div className="text-center pt-2">

          <p className="text-xs text-slate-500 font-medium">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={goToSignup}
              className="inline-flex items-center gap-1 text-blue-600 font-extrabold hover:text-blue-700"
            >
              <UserPlus size={15} />

              Create Account
            </button>

          </p>

        </div>

      </div>
    </div>
  );
}