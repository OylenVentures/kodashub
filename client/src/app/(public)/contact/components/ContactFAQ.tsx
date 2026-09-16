import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question:
      "What is the fastest way to get an emergency fix for a broken site?",
    answer:
      "For immediate site restoration, DNS fixes, or SSL errors, please submit a request on our Technical Services page rather than sending a general contact form. Technical requests are routed directly to on-call engineers.",
  },
  {
    question: "Do you offer custom SLA agreements for enterprise hosting?",
    answer:
      "Yes. We provide tailored Service Level Agreements for VPS, dedicated servers, and domain registration requiring guaranteed uptime, 15-minute response windows, and dedicated account management.",
  },
  {
    question: "Do you offer custom web application development?",
    answer:
      "Yes. We build custom web applications tailored to your business needs, including dashboards, portals, booking systems, e-commerce platforms, APIs, and other business-specific solutions. Our development process covers planning, development, testing, and deployment.",
  },
  // {
  //   question: "Can KodasHub help with website migrations from other hosts?",
  //   answer:
  //     "Absolutely. All our Managed Shared Hosting and VPS plans include free website migration with zero downtime. Simply contact sales or request a migration after signing up.",
  // },
  {
    question: "How does billing work for one-time troubleshooting services?",
    answer:
      "One-time technical fixes are billed on a fixed-price basis after an initial assessment. If we are unable to resolve your declared issue, you are protected by our No Fix, No Charge policy.",
  },
];

export const ContactFAQ = () => {
  return (
    <section className="py-16 bg-bg border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-navy mt-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-base font-bold text-navy flex items-start gap-2">
                <HelpCircle size={18} className="text-blue shrink-0 mt-1" />
                {faq.question}
              </h3>
              <p className="text-slate-600 text-xs mt-3 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
