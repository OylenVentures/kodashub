import { FormBtn } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useTicketAction, useTicketStore } from "@/store/ticket.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  message: yup.string().required("Message is required"),
});

type FormData = yup.InferType<typeof schema>;

interface TicketDetailsProps {
  activeTicket: any;
  setActiveTicket: React.Dispatch<React.SetStateAction<any>>;
}

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TicketDetails({
  activeTicket,
  setActiveTicket,
}: TicketDetailsProps) {
  const { replies, isLoading, error } = useTicketStore();
  const { replyTicket, viewTicket, setReplies } = useTicketAction;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleSendReply = async (data: FormData) => {
    if (!activeTicket) return;

    const response = await replyTicket(activeTicket.id, data);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.message as unknown as string);
    reset();
    setActiveTicket(null);
  };

  useEffect(() => {
    (async function () {
      if (!activeTicket) return;
      const response = await viewTicket(activeTicket.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        setReplies(response.replies as unknown as []);
      }
    })();
  }, [activeTicket, viewTicket, setReplies]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-blue font-bold">
              {activeTicket.id}
            </span>
            <h3 className="text-base font-extrabold text-navy">
              {activeTicket.subject}
            </h3>
          </div>
          <button
            onClick={() => setActiveTicket(null)}
            className="cursor-pointer p-2 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-sm text-center text-red-500">{error}</p>
          ) : (
            replies.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${!msg.isStaffReply ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-700">
                    {`${msg.author.firstName} ${msg.author.lastName || "Agent"}`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed ${
                    !msg.isStaffReply
                      ? "bg-blue text-white rounded-tr-none shadow-md"
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Form */}
        <form
          onSubmit={handleSubmit(handleSendReply)}
          className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
        >
          <div className="flex-1 flex flex-col">
            <input
              type="text"
              {...register("message")}
              placeholder="Type your reply to support..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>
          <FormBtn
            label="Send"
            disabled={isSubmitting}
            styling="cursor-pointer px-4 py-2.5 rounded-xl bg-blue text-white text-xs font-semibold shadow-md hover:bg-blue/90 transition-all flex items-center gap-1.5"
          />
        </form>
      </div>
    </div>
  );
}
