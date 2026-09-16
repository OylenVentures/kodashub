import { Loader2, Send } from "lucide-react";
import Link from "next/link";

interface LinkBtnProps {
  label: string;
  path: string;
  styling: string;
}

interface FormBtnProps {
  label: string;
  disabled: boolean;
  styling: string;
}

export function LinkBtn({ label, path, styling }: LinkBtnProps) {
  return (
    <Link href={path} className={styling}>
      {label}
    </Link>
  );
}

export function FormBtn({ label, disabled, styling }: FormBtnProps) {
  return (
    <button type="submit" disabled={disabled} className={styling}>
      {disabled ? (
        <span className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Processing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Send size={16} />
          {label}
        </span>
      )}
    </button>
  );
}
