import { Link } from "wouter";
import { Building2, BellRing, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function EmptyListingState() {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    toast({ title: "You'll be notified when listings are added!" });
  };

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mb-6">
        <Building2 className="w-9 h-9 text-primary/50" />
      </div>

      <h3 className="text-2xl font-display font-bold text-primary mb-3">
        Listings Coming Soon
      </h3>
      <p className="text-muted-foreground max-w-md mb-2 leading-relaxed">
        We don't have any properties in this category yet, but we're actively sourcing verified listings in Ile-Ife.
      </p>
      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
        If you own a property, list it now and get in front of ready buyers and renters.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/property-owners">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 gap-2 shadow-md">
            List Your Property
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <Button
          variant="outline"
          className="rounded-xl h-12 px-6 gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
          onClick={handleNotify}
          disabled={notified}
        >
          <BellRing className="w-4 h-4" />
          {notified ? "We'll notify you!" : "Notify Me"}
        </Button>
      </div>
    </div>
  );
}
