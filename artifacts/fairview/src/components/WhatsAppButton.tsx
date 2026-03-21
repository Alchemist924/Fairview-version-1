import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "accent";
  className?: string;
}

export function WhatsAppButton({ 
  message, 
  label = "Contact on WhatsApp", 
  variant = "default",
  className = "" 
}: WhatsAppButtonProps) {
  
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349164069005?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const getVariantClasses = () => {
    if (variant === "accent") {
      return "bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-[#25D366]/20 border-none";
    }
    return "";
  };

  return (
    <Button 
      onClick={handleClick} 
      variant={variant === "accent" ? "default" : variant} 
      className={`${getVariantClasses()} ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
