import { Link } from "wouter";
import { Building2, BellRing, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackMetaEvent } from "@/lib/meta-pixel";

const WHATSAPP_NUMBER = "2349164069005";

function deriveNoun(title: string): string {
  const beforeFor = title.split(" for ")[0].trim();
  if (!beforeFor || beforeFor === title) return title;
  return beforeFor;
}

interface EmptyListingStateProps {
  categoryTitle: string;
}

export function EmptyListingState({ categoryTitle }: EmptyListingStateProps) {
  const noun = deriveNoun(categoryTitle);

  const heading = `No ${noun} Available Yet`;

  const whatsappMessage = encodeURIComponent(
    `Hello Fairview, I'm interested in properties in the ${categoryTitle} category. Please notify me when verified listings become available.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mb-6">
        <Building2 className="w-9 h-9 text-primary/50" />
      </div>

      <h3 className="text-2xl font-display font-bold text-primary mb-3">
        {heading}
      </h3>

      <p className="text-muted-foreground max-w-md mb-2 leading-relaxed">
        We don't have any verified listings in this category yet, but we're actively sourcing verified listings across Ile-Ife.
      </p>
      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
        Own a property in this category? List it with Fairview and connect with serious buyers and tenants.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/property-owners">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 gap-2 shadow-md">
            List Your Property
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackMetaEvent("Contact", {
              content_name: `Notify Me - ${categoryTitle}`
            });
          }}
        >
          <Button
            variant="outline"
            className="rounded-xl h-12 px-6 gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <BellRing className="w-4 h-4" />
            Notify Me
          </Button>
        </a>
      </div>
    </div>
  );
}
