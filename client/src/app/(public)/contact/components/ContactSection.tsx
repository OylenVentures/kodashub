"use client";
import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { contact } from "@/api/notification";
import { FormBtn } from "@/components/ui/Button";

const socialLinks = [
  {
    icon: <FaTwitter className="w-6 h-6 hover:text-cyan transition-colors" />,
    path: "https://x.com/kodashub",
  },
  {
    icon: <FaFacebook className="w-6 h-6 hover:text-cyan transition-colors" />,
    path: "https://www.facebook.com/profile.php?id=61567162132703",
  },
  {
    icon: <FaLinkedin className="w-6 h-6 hover:text-cyan transition-colors" />,
    path: "#",
  },
];

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(4, "Name must be at least 4 characters"),
  inquiry: yup
    .string()
    .required("Inquiry is required")
    .min(4, "Inquiry must be at least 4 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  subject: yup
    .string()
    .required("Subject is required")
    .min(5, "Subject must be at least 5 characters"),
  message: yup
    .string()
    .required("Message is required")
    .min(50, "Message must be at least 50 characters"),
});

type FormData = yup.InferType<typeof schema>;

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const response = await contact(data);
    if (response.success === false) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    reset();
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Channels & System SLA */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Direct Communication
              </span>
              <h2 className="text-3xl font-bold text-navy mt-3 sm:text-4xl">
                Get in Touch with Our Team
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Have questions about our hosting plans, domain registration, or
                need custom SLA support? Our technical operations team is
                available 24/7.
              </p>
            </div>

            {/* Direct Channels Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-bg border border-slate-200/80 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-blue shadow-sm border border-slate-200 shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">
                    Email Engineering Support
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For ticket updates and technical inquiries
                  </p>
                  <Link
                    href="mailto:support@kodashub.com"
                    className="text-xs font-semibold text-blue hover:underline mt-1 inline-block"
                    target="_blank"
                  >
                    support@oylengroup.com.ng
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bg border border-slate-200/80 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-cyan shadow-sm border border-slate-200 shrink-0">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">Live Chat</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant triage for active customers
                  </p>
                  <Link
                    href="https://wa.me/2348188066398?text=Hi%20KH%20Team,%20I%20need%20assistance%20with%20my%20website..."
                    className="text-xs font-semibold text-blue hover:underline mt-1 inline-block"
                    target="_blank"
                  >
                    Chat with Support →
                  </Link>
                </div>
                {/* <div>
                  <h4 className="text-sm font-bold text-navy">
                    Live Chat & Ticket Portal
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant triage for active hosting customers
                  </p>
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-blue hover:underline mt-1 inline-block"
                  >
                    Open Client Portal →
                  </Link>
                </div> */}
              </div>

              <div className="p-5 rounded-2xl bg-bg border border-slate-200/80 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-blue shadow-sm border border-slate-200 shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">
                    Response Time SLA
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    • Critical Outages:{" "}
                    <span className="font-semibold text-emerald-600">
                      &lt; 15 Minutes
                    </span>
                    <br />• General Inquiries:{" "}
                    <span className="font-semibold text-slate-700">
                      &lt; 2 Hours
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-cyan transition-colors"
                >
                  {link.icon}
                </Link>
              ))}
            </div>

            {/* Emergency Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3">
              <ShieldAlert
                size={20}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <div>
                <span className="font-bold">Experiencing a server outage?</span>{" "}
                If your website is down or DNS is failing, please use the{" "}
                <a
                  href="/services#request-form"
                  className="underline font-bold hover:text-amber-900"
                >
                  Technical Service Form
                </a>{" "}
                to bypass sales queues.
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-navy p-6 md:p-8 text-white">
                <h3 className="text-2xl font-bold">Send Us a Message</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Fill out the form below and we’ll route your inquiry to the
                  right specialist.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 md:p-12 text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-navy">
                    Message Received
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto text-sm">
                    Thank you for reaching out. A representative will get back
                    to you shortly at the email address provided.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="cursor-pointer px-6 py-2.5 text-sm font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-6 md:p-8 space-y-6"
                >
                  {/* Inquiry Type Selection Options */}
                  <div>
                    <label
                      htmlFor="inquiry"
                      className="block text-xs font-semibold text-slate-700 mb-2"
                    >
                      Inquiry Category *
                    </label>
                    <select
                      id="inquiry"
                      disabled={isSubmitting}
                      {...register("inquiry")}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Query</option>
                      <option value="hosting">Hosting / VPS Sales</option>
                      <option value="domain">Domain Registration</option>
                      <option value="partnership">Partnerships</option>
                      <option value="billing">Billing & Invoices</option>
                    </select>
                    {errors.inquiry && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.inquiry.message}
                      </p>
                    )}
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      placeholder="e.g. Inquiry about Managed VPS Hosting & Custom SLA"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <FormBtn
                    label="Send Message"
                    disabled={isSubmitting}
                    styling="cursor-pointer w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm bg-linear-to-r from-blue to-cyan hover:opacity-95 shadow-md shadow-cyan-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
