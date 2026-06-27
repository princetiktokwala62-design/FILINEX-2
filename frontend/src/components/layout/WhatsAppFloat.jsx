import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import WhatsAppWizard from "@/components/WhatsAppWizard";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <button
        data-testid="whatsapp-float"
        onClick={() => {
          setOpen(true);
          if (window.posthog) window.posthog.capture("whatsapp_click");
        }}
        className={`fixed z-40 bottom-6 right-6 inline-flex items-center gap-3 rounded-full glass-strong pl-4 pr-5 py-3 text-sm font-medium hover:scale-[1.03] transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        aria-label="Chat on WhatsApp"
      >
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-emeraldx/15">
          <span className="absolute inset-0 rounded-full bg-emeraldx/30 animate-ping" />
          <MessageCircle className="relative h-4 w-4 text-emeraldx" />
        </span>
        <span className="hidden sm:inline">Chat with us</span>
      </button>

      <WhatsAppWizard open={open} onClose={() => setOpen(false)} />
    </>
  );
}
