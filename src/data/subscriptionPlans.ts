export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Starter",
    description: "Perfect for small travel businesses getting started.",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: [
      "Basic booking management",
      "Customer management",
      "Basic dashboard",
      "Email support",
      "Basic reports",
    ],
  },

  {
    id: 2,
    name: "Professional",
    description: "Best for growing travel agencies and businesses.",
    monthlyPrice: 1999,
    yearlyPrice: 19990,
    popular: true,
    features: [
      "Everything in Starter",
      "Advanced booking management",
      "Customer management",
      "Advanced dashboard",
      "Payment integration",
      "Priority support",
      "Advanced reports",
    ],
  },

  {
    id: 3,
    name: "Business",
    description: "Powerful tools for established travel businesses.",
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    features: [
      "Everything in Professional",
      "Multiple team members",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated support",
      "API access",
      "Priority features",
    ],
  },
];