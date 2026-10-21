import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center text-blue">
      <Loader2 className="animate-spin" size={15} />
    </div>
  );
}
