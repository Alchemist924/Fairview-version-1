import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQs() {
  const propertyOwnerQs = [
    { q: "How long does it take to get a tenant/buyer?", a: "Depending on the location and condition of the property, we typically close deals within 2 to 4 weeks using our extensive database of verified clients." },
    { q: "What is Fairview's commission rate?", a: "Our standard agency commission is 10% on lease transactions and 5% on property sales, payable only upon successful completion of the transaction." },
    { q: "Do you handle property management?", a: "Yes, we offer comprehensive facility management services including maintenance, rent collection, and tenant relations for a separate flat fee." }
  ];

  const buyerRenterQs = [
    { q: "Are the properties on Fairview verified?", a: "Absolutely. Every property listed undergoes a rigorous physical inspection and document verification process by our legal team." },
    { q: "How do virtual inspections work?", a: "Click the 'Virtual Inspection' button on any property card. Our agent will call you via WhatsApp video at a scheduled time and walk you through every room." },
    { q: "Are there hidden charges?", a: "No hidden charges. For rentals, standard statutory fees like Agency (10%), Legal (10%), and Caution Deposit apply, which are always stated upfront." }
  ];

  const generalQs = [
    { q: "Where are your offices located?", a: "Our primary office is located beside Phiam Pharmacy, Parakin, Ile-Ife, Osun State, but we have operational agents in Lagos and Abuja." },
    { q: "How do I create an account?", a: "Click on 'Sign In' at the top right of the website. You only need a username and password to create an account so you can leave comments on listings." },
  ];

  return (
    <Layout>
      <section className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-primary-foreground/80">
            Everything you need to know about buying, renting, or listing properties with Fairview.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        <div>
          <h2 className="text-2xl font-display font-bold text-accent mb-6 border-b pb-2">For Property Owners</h2>
          <Accordion type="single" collapsible className="w-full">
            {propertyOwnerQs.map((item, i) => (
              <AccordionItem value={`po-${i}`} key={i} className="bg-white px-4 mb-4 rounded-xl border">
                <AccordionTrigger className="font-bold text-left hover:no-underline hover:text-accent">{item.q}</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-accent mb-6 border-b pb-2">For Buyers & Renters</h2>
          <Accordion type="single" collapsible className="w-full">
            {buyerRenterQs.map((item, i) => (
              <AccordionItem value={`br-${i}`} key={i} className="bg-white px-4 mb-4 rounded-xl border">
                <AccordionTrigger className="font-bold text-left hover:no-underline hover:text-accent">{item.q}</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-accent mb-6 border-b pb-2">General Inquiries</h2>
          <Accordion type="single" collapsible className="w-full">
            {generalQs.map((item, i) => (
              <AccordionItem value={`g-${i}`} key={i} className="bg-white px-4 mb-4 rounded-xl border">
                <AccordionTrigger className="font-bold text-left hover:no-underline hover:text-accent">{item.q}</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
