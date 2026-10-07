import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubscriptionCard from "./SubscriptionCard";

import {
  subscriptionPlans,
  type SubscriptionPlan,
} from "../data/subscriptionPlans";

export default function SubscriptionSection() {
  const navigate = useNavigate();

  const [billing, setBilling] =
    useState<"monthly" | "yearly">("monthly");

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    const selectedSubscription = {
      planId: plan.id,
      planName: plan.name,
      billing,
      price:
        billing === "monthly"
          ? plan.monthlyPrice
          : plan.yearlyPrice,
    };

    localStorage.setItem(
      "selectedSubscription",
      JSON.stringify(selectedSubscription)
    );

    navigate("/login");

    if (selectedSubscription) {
  navigate("/subscription-checkout");
}
  };

  return (
    <section className="subscription-section">
      <div className="subscription-container">

        {/* Heading */}
        <div className="subscription-header">
          <h2>Choose Your Subscription Plan</h2>

          <p>
            Select the plan that best fits your business needs.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <button
            type="button"
            className={billing === "monthly" ? "active" : ""}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>

          <button
            type="button"
            className={billing === "yearly" ? "active" : ""}
            onClick={() => setBilling("yearly")}
          >
            Yearly
          </button>
        </div>

        {/* Subscription Cards */}
        <div className="subscription-grid">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              billing={billing}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

      </div>
    </section>
  );
}