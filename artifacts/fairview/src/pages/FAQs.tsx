import { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FAQ = { q: string; a: ReactNode };

export default function FAQs() {
  const propertyOwnerQs: FAQ[] = [
    {
      q: "How can I add my property on Fairview?",
      a: <>Simply click "Add your property" on the property owners page and fill in your details. Our team will arrange a physical inspection at your convenience, capture your property and record it.<br /><br />You'll then send a clear photo of your ownership documents – once verified, your property goes live.</>
    },
    {
      q: "Do you charge for marketing my property?",
      a: "No, we do not charge upfront for marketing. The only fee is a 5% finder's fee on Land and Property sales. No charges apply to property owners for rentals."
    },
    {
      q: "Is the 5% finder's fee added to the property price?",
      a: <>For rentals (Apartments and Shops); the 5% finder's fee is added on top of the rental price.<br />For Land and Property sales; the 5% finder's fee is paid after a successful sale and deducted from the final amount.</>
    },
    {
      q: "What documents are required for verification?",
      a: <>A state C of O (Certificate of Occupancy) is preferred, but a Deed of Sale or Local Government document is also acceptable.<br /><br />A clear photo taken from your phone is enough – we'll handle the verification process.<br />Your documents are secure – automatically deleted after verification.</>
    },
    {
      q: "Can I update my property after it's live?",
      a: "Yes, you can request updates to pricing, availability or details by contacting your customer care Agent. Changes are usually reflected shortly."
    },
  ];

  const buyerRenterQs: FAQ[] = [
    {
      q: "How can I find property?",
      a: <>Use the search feature to filter properties by price, location or keywords.<br />Once you find a property you like, click "Physical Inspection" or "Virtual Inspection" to book a viewing.</>
    },
    {
      q: "How much does Inspection cost?",
      a: <>Virtual Inspection; #1000 per property.<br />Physical Inspection; #1000 for multiple properties as long as you can also cover for transport.<br />This keeps inspections affordable and flexible.</>
    },
    {
      q: "What is a Virtual Inspection?",
      a: <>A Virtual Inspection is an alternative to a physical visit, ideal if you're out of town or prefer to complete the whole process remotely.<br /><br />A customer care representative goes on-site and gives you a live video tour of the property, showing the surroundings and key details while answering your questions in real time.</>
    },
    {
      q: "What happens after inspection?",
      a: <>Once you've inspected and chosen a property, you can proceed to secure it by making payment.<br />You'll receive your receipt and any necessary documents to complete the process.</>
    },
    {
      q: "Can I get help finding a specific property?",
      a: "Yes, if you can't find what you're looking for, tap the WhatsApp icon below to speak with a customer care representative."
    },
    {
      q: "Are the properties verified?",
      a: <>Yes. Every property goes through a verification process including physical inspection and ownership confirmation.<br />This ensures you're dealing with legitimate listings.</>
    },
    {
      q: "Why can't I find a property I saw earlier?",
      a: <>If a property is no longer visible, it means it has already been rented or sold.<br />We regularly update listings to reflect current availability.</>
    },
    {
      q: "Is the 5% finder's fee added to the property price?",
      a: <>Rentals (Apartments and Shops); Yes, the 5% finder's fee is added to the price.<br />Sales (Land and Properties); The 5% finder's fee is deducted after the transaction is completed.<br />This ensures transparent and fair pricing.</>
    },
    {
      q: "Can I request a property outside Ile-Ife?",
      a: "Currently, Fairview operates within Ile-Ife, but expansion to other locations is in the works."
    },
  ];

  const generalQs: FAQ[] = [
    {
      q: "Is Fairview a Real Estate Agency?",
      a: <>Fairview is a property display platform designed to simplify how people find, buy, rent and market properties.<br />We connect property seekers with verified property spaces and help property owners reach their audience.</>
    },
    {
      q: "What is the comments section that's below some properties for?",
      a: <>The comments section allows you to ask questions specific to a property.<br />A customer care representative will respond and others with similar questions can also benefit from the answers.</>
    },
    {
      q: "Why aren't my comments showing?",
      a: (
        <>
          To reduce spams and fake listings, some restrictions are in place.
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Links are not allowed.</li>
            <li>Repeated or duplicate messages may be filtered.</li>
            <li>Rapid posting is limited.</li>
          </ul>
          <span className="block mt-2">Try posting without links and wait a few seconds before posting another comment.</span>
        </>
      )
    },
    {
      q: "Do buyers or renters receive a receipt after a transaction?",
      a: <>Yes, after completing a transaction, you will receive a receipt and any necessary documentation.<br />For property purchases, this includes ownership related documents where applicable.</>
    },
    {
      q: "How do I contact support?",
      a: (
        <>
          You can reach us through any of the following:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Tap the chat button on your screen.</li>
            <li>Email: fairviewrealtyhub@gmail.com</li>
            <li>Visit our office: No 50 Raymond Adedoyin way, beside Nitel, Parakin, Ile-Ife, Osun.</li>
            <li>09164069005</li>
          </ul>
        </>
      )
    },
  ];

  return (
    <Layout>
      <section className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">? Frequently Asked Questions</h1>
          <p className="text-lg text-primary-foreground/80">
            Welcome to Fairview's FAQ section. Here are answers to the most common questions from property seekers and property owners.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        <div>
          <h2 className="text-2xl font-display font-bold text-accent mb-6 border-b pb-2">🏠 From Property Owners</h2>
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
          <h2 className="text-2xl font-display font-bold text-accent mb-6 border-b pb-2">🔑 From Property Seekers</h2>
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
          <h2 className="text-2xl font-display font-bold text-accent mb-6 border-b pb-2">❔ General Questions</h2>
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
