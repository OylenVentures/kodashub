import { FormBtn } from "@/components/ui/Button";
import { useTicketAction } from "@/store/ticket.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
  department: yup.string().required("Department is required"),
  priority: yup.string().required("Priority is required"),
});

type FormData = yup.InferType<typeof schema>;

interface NewTicketProps {
  setIsCreateOpen: (isOpen: boolean) => void;
}

export default function NewTicket({ setIsCreateOpen }: NewTicketProps) {
  const { createTicket } = useTicketAction;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleCreateTicket = async (data: FormData) => {
    const response = await createTicket(data);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.message as unknown as string);
    reset();
    setIsCreateOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsCreateOpen(false)}
          className="cursor-pointer absolute top-6 right-6 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-extrabold text-navy mb-1">
          Open Support Ticket
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Provide technical details for our cloud & infrastructure engineers.
        </p>

        <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              {...register("subject")}
              placeholder="e.g. Nginx reverse proxy configuration error"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="department"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Department *
              </label>
              <select
                id="department"
                {...register("department")}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option value="technical_support">Technical Support</option>
                <option value="development">Development</option>
                <option value="devops">DevOps</option>
                <option value="billing">Billing</option>
              </select>
              {errors.department && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Priority Level *
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {errors.priority && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Message *
            </label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              placeholder="Describe the issue, error codes, or environment details..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <FormBtn
              label="Submit Ticket"
              disabled={isSubmitting}
              styling="cursor-pointer px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue hover:bg-blue/90 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
