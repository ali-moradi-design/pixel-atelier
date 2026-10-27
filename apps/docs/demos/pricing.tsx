import { Pricing } from "pixelbits/blocks/pricing";

export default function Demo() {
  return (
    <Pricing
      className="py-4 sm:py-4"
      title="Simple pricing"
      description="Start free, upgrade when your team grows."
      billingToggle
      yearlyLabel="Yearly −20%"
      plans={[
        {
          name: "Solo",
          price: { monthly: "€0", yearly: "€0" },
          description: "For side projects.",
          features: ["All components", "Community support"],
          cta: { label: "Start free", href: "#start" },
        },
        {
          name: "Studio",
          price: { monthly: "€19", yearly: "€15" },
          description: "For freelancers.",
          features: ["Everything in Solo", "Blocks", "Email support"],
          cta: { label: "Choose Studio", href: "#studio" },
          featured: true,
        },
        {
          name: "Team",
          price: { monthly: "€49", yearly: "€39" },
          description: "For small teams.",
          features: ["Everything in Studio", "Priority support", "Design files"],
          cta: { label: "Choose Team", href: "#team" },
        },
      ]}
    />
  );
}
