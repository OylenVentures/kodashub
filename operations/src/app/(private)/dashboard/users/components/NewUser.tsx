import { FormBtn } from "@/components/ui/Button";
import { useUserAction } from "@/store/user.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  role: yup.string().required("Role is required"),
});

type FormData = yup.InferType<typeof schema>;

interface NewUserProps {
  setIsCreateOpen: (isOpen: boolean) => void;
}

export default function NewUser({ setIsCreateOpen }: NewUserProps) {
  const { createUser } = useUserAction;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleCreateUser = async (data: FormData) => {
    const response = await createUser(data);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("User created successfully");
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
          Create New User
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Fill in the details below to create a new user account. All fields
          marked with * are required.
        </p>

        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                First name *
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstName")}
                placeholder="e.g. John"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Last name *
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName")}
                placeholder="e.g. Doe"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Email address *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="e.g. john.doe@example.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Role *
              </label>
              <select
                id="role"
                {...register("role")}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option value="">[Select a role]</option>
                <option value="support_agent">Support Agent</option>
                <option value="developer">Developer</option>
                <option value="devops_engineer">DevOps Engineer</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
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
              label="Create User"
              disabled={isSubmitting}
              styling="cursor-pointer px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue hover:bg-blue/90 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
