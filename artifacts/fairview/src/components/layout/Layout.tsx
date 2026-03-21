import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MessageCircle } from "lucide-react";

function WhatsAppWidget() {
  const handleClick = () => {
    const message = encodeURIComponent("Hello Fairview! I'd like to make an enquiry.");
    window.open(`https://wa.me/2349164069005?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      <span className="hidden group-hover:flex items-center bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-100 whitespace-nowrap transition-all duration-200">
        Chat with us
      </span>

      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 hover:bg-[#128C7E] transition-colors duration-200">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 text-white fill-white relative z-10" />
      </span>
    </button>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
