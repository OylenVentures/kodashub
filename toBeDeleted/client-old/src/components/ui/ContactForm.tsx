"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  message: yup.string().required("Please provide details for your inquiry").min(10, "Message is too short"),
});

type FormData = yup.InferType<typeof schema>;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulating API Fetch request
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Log data to mock real fetch request processing
      console.log("Form Submitted:", data);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-[#0e162d]" id="contact">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-brand-gray mb-6">Let's Connect</h2>
          <p className="text-xl text-brand-gray/80 mb-8">
            Tell us about your next big project or what online tools your business needs to scale.
          </p>
          <div className="space-y-4 text-brand-gray/80">
            <p className="flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              hello@kodashub.com
            </p>
            <p className="flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              +1 (800) 123-4567
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#172347] p-8 rounded-2xl shadow-xl border border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg text-sm">
                Thanks! We will get back to you shortly.
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-gray/80 mb-2">Full Name</label>
              <input
                id="name"
                {...register("name")}
                className={`w-full bg-[#121D3B] border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-3 text-brand-gray focus:outline-none focus:border-brand-teal transition-colors`}
                placeholder="Jane Doe"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray/80 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full bg-[#121D3B] border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-3 text-brand-gray focus:outline-none focus:border-brand-teal transition-colors`}
                placeholder="jane@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-gray/80 mb-2">Project Request</label>
              <textarea
                id="message"
                {...register("message")}
                rows={4}
                className={`w-full bg-[#121D3B] border ${errors.message ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-3 text-brand-gray focus:outline-none focus:border-brand-teal transition-colors resize-none`}
                placeholder="Hi, I need help scaling our..."
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-teal text-white font-bold py-4 rounded-lg flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
