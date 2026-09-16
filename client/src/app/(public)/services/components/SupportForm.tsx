"use client";
import { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { requestService } from "@/api/notification";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormBtn } from "@/components/ui/Button";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(4, "Name must be at least 4 characters"),
  service: yup
    .string()
    .required("Service is required")
    .min(4, "Service must be at least 4 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  domain: yup
    .string()
    .required("Domain is required")
    .min(4, "Domain must be at least 4 characters"),
  provider: yup.string(),
  description: yup
    .string()
    .required("Please provide details for your request")
    .min(100, "Description must be at least 100 characters"),
  priority: yup
    .string()
    .required("Priority is required")
    .min(4, "Priority must be at least 4 characters"),
});

type FormData = yup.InferType<typeof schema>;

export const SupportForm = () => {
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
    const response = await requestService(data);
    if (response.success === false) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    reset();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl font-bold text-navy">
          Technical Request Submitted
        </h3>
        <p className="text-slate-600 max-w-md mx-auto text-sm">
          Our engineering team has received your request. We will contact you
          via email shortly.
        </p>

        <button
          onClick={() => setSubmitted(false)}
          className="cursor-pointer px-6 py-2.5 text-sm font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div
      id="request-form"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden"
    >
      <div className="bg-navy p-6 md:p-8 text-white relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              Request Technical Intervention
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Provide details about your website, hosting, or server error to
              get started.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-cyan text-xs font-mono border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Engineers Online
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
        {/* Step 1: Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              placeholder="Philip Oyelegbin"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              placeholder="you@domain.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Server & Domain Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Affected Domain / URL *
            </label>
            <input
              type="text"
              placeholder="example.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent font-mono transition-all"
              {...register("domain")}
            />
            {errors.domain && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.domain.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hosting Provider / Control Panel (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. cPanel, DirectAdmin, Namecheap, AWS"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              {...register("provider")}
            />
            {errors.provider && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.provider.message}
              </p>
            )}
          </div>
        </div>

        {/* Step 3: Issue Description & Priority */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Detailed Issue Description *
          </label>
          <textarea
            rows={4}
            placeholder="Describe the error message, behavior, or error codes (e.g. 500 Internal Server Error, ERR_TOO_MANY_REDIRECTS, DNS_PROBE_FINISHED_NXDOMAIN)..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-rose-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Step 4: Issue & Priority Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label
              htmlFor="service"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Issue Category *
            </label>
            <select
              id="service"
              {...register("service")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            >
              <option value="">Select an issue category</option>
              <option value="dns_domain">DNS & Domains</option>
              <option value="ssl_cert">SSL / HTTPS</option>
              <option value="cpanel_directadmin">cPanel / DirectAdmin</option>
              <option value="wordpress_repair">Wordpress Repair</option>
              <option value="email_issues">Email / SPF / DKIM</option>
              <option value="web_development">Web App Development</option>
              <option value="vps_server">VPS & Linux Server</option>
            </select>
            {errors.service && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.service.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Urgency Level *
            </label>
            <select
              id="priority"
              {...register("priority")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            >
              <option value="">Select an urgency level</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical Outage</option>
            </select>
            {errors.priority && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        {/* Security / Privacy Guarantee */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3 text-xs text-slate-600">
          <ShieldCheck size={20} className="text-blue shrink-0" />
          <span>
            Your data is strictly confidential. Confidential details like server
            credentials should only be provided after ticket creation via the
            channel provided by our engineers.
          </span>
        </div>

        {/* Submit Button */}
        <FormBtn
          label="Submit Request"
          disabled={isSubmitting}
          styling="cursor-pointer w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm bg-linear-to-r from-blue to-cyan hover:opacity-95 shadow-md shadow-cyan-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>
    </div>
  );
};
