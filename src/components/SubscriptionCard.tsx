import { Check } from "lucide-react";
import type { SubscriptionPlan } from "../data/subscriptionPlans";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  billing: "monthly" | "yearly";
  onSelect: (plan: SubscriptionPlan) => void;
}

export default function SubscriptionCard({
  plan,
  billing,
  onSelect,
}: SubscriptionCardProps) {
  const price =
    billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <div
      className={`subscription-card ${
        plan.popular ? "subscription-card-popular" : ""
      }`}
    >
      {plan.popular && (
        <div className="popular-badge">
          Most Popular
        </div>
      )}

      <div className="subscription-card-content">
        <h3>{plan.name}</h3>

        <p className="subscription-description">
          {plan.description}
        </p>

        <div className="subscription-price">
          <span className="currency">₹</span>
          <span className="price">
            {price.toLocaleString("en-IN")}
          </span>
          <span className="period">
            /{billing === "monthly" ? "month" : "year"}
          </span>
        </div>

        <div className="subscription-features">
          {plan.features.map((feature, index) => (
            <div className="subscription-feature" key={index}>
              <span className="feature-icon">
                <Check size={16} />
              </span>

              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="subscription-button"
          onClick={() => onSelect(plan)}
        >
          Choose {plan.name}
        </button>
      </div>
    </div>
  );
}