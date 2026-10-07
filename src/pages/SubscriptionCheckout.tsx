import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";

interface SelectedSubscription {
  planId: number;
  planName: string;
  billing: "monthly" | "yearly";
  price: number;
}

export default function SubscriptionCheckout() {
  const navigate = useNavigate();

  const [subscription, setSubscription] =
    useState<SelectedSubscription | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSubscription = localStorage.getItem(
      "selectedSubscription"
    );

    if (!savedSubscription) {
      navigate("/subscription");
      return;
    }

    try {
      const parsed: SelectedSubscription =
        JSON.parse(savedSubscription);

      setSubscription(parsed);
    } catch (error) {
      console.error("Invalid subscription data:", error);
      localStorage.removeItem("selectedSubscription");
      navigate("/subscription");
    }
  }, [navigate]);

  const price = useMemo(() => {
    return subscription?.price ?? 0;
  }, [subscription]);

  const billingText =
    subscription?.billing === "monthly"
      ? "Monthly Subscription"
      : "Yearly Subscription";

  const handlePayment = () => {
    if (!subscription) return;

    setLoading(true);

    // Demo payment flow
    setTimeout(() => {
      localStorage.setItem(
        "subscriptionPaymentStatus",
        "success"
      );

      localStorage.setItem(
        "activeSubscription",
        JSON.stringify({
          ...subscription,
          status: "active",
          activatedAt: new Date().toISOString(),
        })
      );

      setLoading(false);

      navigate("/dashboard");
    }, 1500);
  };

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500">
            Loading subscription...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={() => navigate("/subscription")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-semibold"
            >
              <ArrowLeft size={18} />
              Back to Plans
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={18} className="text-green-600" />
              Secure Checkout
            </div>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
            Subscription Checkout
          </p>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Complete Your Subscription
          </h1>

          <p className="text-slate-500 mt-2">
            Review your plan and continue to payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Selected Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Selected Plan
                  </p>

                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {subscription.planName}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {billingText}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">
                    ₹{price.toLocaleString("en-IN")}
                  </div>

                  <div className="text-sm text-slate-500">
                    /{subscription.billing === "monthly"
                      ? "month"
                      : "year"}
                  </div>
                </div>

              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle
                    size={18}
                    className="text-green-600"
                  />
                  Subscription access
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 mt-3">
                  <CheckCircle
                    size={18}
                    className="text-green-600"
                  />
                  Account dashboard access
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 mt-3">
                  <CheckCircle
                    size={18}
                    className="text-green-600"
                  />
                  Subscription management
                </div>

              </div>

            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CreditCard
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-slate-500">
                    Choose your preferred payment method.
                  </p>
                </div>
              </div>

              {/* Demo Payment Option */}
              <label className="block cursor-pointer">
                <div className="border-2 border-blue-600 bg-blue-50 rounded-xl p-4">

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      checked
                      readOnly
                      className="w-4 h-4"
                    />

                    <div>
                      <p className="font-bold text-slate-900">
                        Online Payment
                      </p>

                      <p className="text-sm text-slate-500">
                        UPI, Debit Card, Credit Card and Net Banking
                      </p>
                    </div>

                  </div>

                </div>
              </label>

            </div>

          </div>

          {/* Right Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">

              <h2 className="text-xl font-black text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Plan
                  </span>

                  <span className="font-semibold text-slate-900">
                    {subscription.planName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Billing
                  </span>

                  <span className="font-semibold text-slate-900">
                    {subscription.billing === "monthly"
                      ? "Monthly"
                      : "Yearly"}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between">
                  <span className="font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-black text-slate-900">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-6 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${price.toLocaleString("en-IN")}`}
              </button>

              <div className="mt-5 flex gap-2 text-xs text-slate-500 leading-5">
                <ShieldCheck
                  size={16}
                  className="text-green-600 shrink-0 mt-0.5"
                />

                <p>
                  Your payment information is handled securely.
                  You will receive access after successful payment.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}