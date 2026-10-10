import React from "react";

const services = [
  {
    id: "domains",
    title: "Domain Purchases",
    description: "Secure the perfect online identity for your business with intuitive domain management and straightforward renewals.",
    link: "/domains",
    icon: (
      <svg className="w-10 h-10 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    id: "tools",
    title: "Online Tools",
    description: "Leverage advanced tools including robust Storage Sync workflows and Volt Calculator utilities built for developers and end users.",
    link: "/tools/voltcalc",
    icon: (
      <svg className="w-10 h-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: "devops",
    title: "DevOps as a Service",
    description: "Automate your pipelines, monitor infrastructure, and streamline deployment processes with our specialized DevOps support.",
    link: "/",
    icon: (
      <svg className="w-10 h-10 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }
];

export default function ServiceCards() {
  return (
    <section className="py-24 px-6 md:px-12 bg-opacity-50 relative z-10" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-gray mb-4">Core Services</h2>
          <p className="text-lg text-brand-gray/70 max-w-2xl mx-auto">
            Discover a comprehensive suite of digital utilities designed to empower your workflows and scale your platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              id={svc.id}
              className="group relative bg-[#1c2a52] rounded-2xl p-8 border border-white/5 shadow-xl hover:shadow-[0_0_30px_rgba(41,121,242,0.2)] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="mb-6 p-4 rounded-xl bg-brand-navy inline-flex shadow-inner">
                  {svc.icon}
                </div>
                <h3 className="text-2xl font-semibold text-brand-gray mb-4">{svc.title}</h3>
                <p className="text-brand-gray/80 leading-relaxed mb-6">
                  {svc.description}
                </p>
                <a href={svc.link} className="inline-flex items-center text-brand-teal font-medium group-hover:text-brand-blue transition-colors">
                  Learn more
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
