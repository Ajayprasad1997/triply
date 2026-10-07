import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  Warning,
  User,
  Phone,
  UserPlus,
  ArrowLeft,
  CheckCircle,
} from "@phosphor-icons/react";

import { TriiplyLogo } from "../components/TriiplyLogo";
import SocialLoginButtons from "../components/SocialLoginButtons";

interface SelectedSubscription {
  planId: number;
  billing: "monthly" | "yearly";
  planName?: string;
  price?: number;
}

export default function CustomerSignup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<SelectedSubscription | null>(null);

  /*
   * Recover selected subscription.
   *
   * First check localStorage.
   * Then check navigation state.
   */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          "selectedSubscription"
        );

      if (stored) {
        setSelectedSubscription(
          JSON.parse(stored)
        );

        return;
      }

      if (location.state?.subscription) {
        setSelectedSubscription(
          location.state.subscription
        );
      }
    } catch (error) {
      console.error(
        "Unable to load subscription:",
        error
      );
    }
  }, [location.state]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (
      !cleanName ||
      !cleanEmail ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Password and confirm password do not match."
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        "Please accept the Terms & Privacy Policy."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * Stage 1 frontend demo.
       *
       * Stage 2:
       * Send this information to Node/Express API.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      const demoUser = {
        id: "demo-user",
        name: cleanName,
        email: cleanEmail,
        phone,
        role: "customer",
      };

      localStorage.setItem(
        "triiplyUser",
        JSON.stringify(demoUser)
      );

      /*
       * Keep selected subscription.
       */

      if (selectedSubscription) {
        localStorage.setItem(
          "selectedSubscription",
          JSON.stringify(
            selectedSubscription
          )
        );

        navigate("/checkout");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background */}

      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xl z-10">

        {/* Header */}

        <div className="text-center mb-7">

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
            Create Account
          </h2>

          <p className="mt-2 text-xs text-slate-500 font-semibold leading-relaxed">
            Create your Triiply account and start
            growing your travel business.
          </p>

        </div>

        {/* Subscription */}

        {selectedSubscription && (
          <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100 p-4">

            <div className="flex justify-between items-center">

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

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
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

          {/* Name */}

          <div>

            <label
              htmlFor="name"
              className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Full Name
            </label>

            <div className="relative">

              <User
                size={18}
                className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />

              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your full name"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />

            </div>

          </div>

          {/* Email */}

          <div>

            <label
              htmlFor="signup-email"
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
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />

            </div>

          </div>

          {/* Phone */}

          <div>

            <label
              htmlFor="phone"
              className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Phone Number
            </label>

            <div className="relative">

              <Phone
                size={18}
                className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />

              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="+91 9876543210"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label
              htmlFor="signup-password"
              className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />

              <input
                id="signup-password"
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
                placeholder="Minimum 8 characters"
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeSlash size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label
              htmlFor="confirm-password"
              className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Confirm Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              />

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Repeat your password"
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showConfirmPassword ? (
                  <EyeSlash size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Terms */}

          <label className="flex items-start gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) =>
                setAgreeTerms(e.target.checked)
              }
              className="mt-0.5 w-4 h-4 accent-blue-600"
            />

            <span className="text-xs text-slate-500 leading-relaxed">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-blue-600 font-bold hover:text-blue-700"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-600 font-bold hover:text-blue-700"
              >
                Privacy Policy
              </Link>
              .
            </span>

          </label>

          {/* Create Account */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-sky-500/20 disabled:opacity-60"
          >

            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus
                  size={18}
                  weight="bold"
                />

                <span>Create Triiply Account</span>
              </>
            )}

          </button>

        </form>

        {/* Divider */}

        <div className="relative my-6">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Or sign up with
            </span>
          </div>

        </div>

        {/* Social */}

        <SocialLoginButtons mode="signup" />

        {/* Login */}

        <div className="text-center mt-6">

          <p className="text-xs text-slate-500 font-medium">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-extrabold hover:text-blue-700"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}