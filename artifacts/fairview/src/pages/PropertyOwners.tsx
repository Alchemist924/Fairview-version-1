import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import addPropertyImg from "@assets/1772203784575_1774101672403.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

const TOTAL_STEPS = 6;

const DOCUMENT_OPTIONS = [
  "Certificate of Occupancy (C of O)",
  "Governor's Consent",
  "Deed of Assignment",
  "Survey Plan",
  "Approved Building Plan",
  "Receipt / Purchase Documents",
  "I'm not sure",
  "None of these apply to me",
];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-medium text-accent">
          {Math.round((step / TOTAL_STEPS) * 100)}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-200 text-base ${
        selected
          ? "border-accent bg-accent/5 text-accent"
          : "border-gray-200 bg-white text-gray-700 hover:border-accent/40 hover:bg-gray-50"
      }`}
    >
      <span className="flex items-center justify-between">
        {label}
        {selected && <CheckCircle className="w-5 h-5 text-accent shrink-0" />}
      </span>
    </button>
  );
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

function ListPropertyFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [goal, setGoal] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleDoc = (doc: string) => {
    setDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const canProceed = () => {
    if (step === 1) return !!goal;
    if (step === 2) return !!propertyType;
    if (step === 3) return location.trim().length > 0;
    if (step === 4) return price.trim().length > 0;
    if (step === 5) return true;
    if (step === 6) return name.trim().length > 0 && phone.trim().length > 0;
    return true;
  };

  const handleWhatsApp = () => {
    const text =
      `Hello, I want to list a property\n` +
      `My goal: ${goal}\n` +
      `Type: ${propertyType}\n` +
      `Location: ${location}\n` +
      `Price: ${price}\n` +
      `Documents: ${documents.length > 0 ? documents.join(", ") : "Not specified"}\n` +
      `Contact Info: ${name}, ${phone}`;
    window.open(`https://wa.me/2349164069005?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  return (
    <div className="px-1 py-2">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-primary">List your property</h2>
        <p className="text-sm text-gray-500 mt-1">Reach serious buyers and the right tenants</p>
        <p className="text-xs text-gray-400 mt-2">Serious properties only — incomplete submissions may not be approved</p>
      </div>

      <ProgressBar step={step} />

      <div className="overflow-hidden min-h-[280px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">What would you like to do?</h3>
                <OptionButton
                  label="Sell Property"
                  selected={goal === "Sell Property"}
                  onClick={() => setGoal("Sell Property")}
                />
                <OptionButton
                  label="Rent out / Lease Property"
                  selected={goal === "Rent out / Lease Property"}
                  onClick={() => setGoal("Rent out / Lease Property")}
                />
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">What kind of property is it?</h3>
                <p className="text-sm text-gray-400 mb-4">Choose whatever option best describes your property</p>
                <div className="grid grid-cols-2 gap-3">
                  {["House", "Land", "Commercial Space", "Apartment"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPropertyType(t)}
                      className={`px-4 py-4 rounded-2xl border-2 font-medium text-sm transition-all duration-200 text-center ${
                        propertyType === t
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-gray-200 bg-white text-gray-700 hover:border-accent/40 hover:bg-gray-50"
                      }`}
                    >
                      {t}
                      {propertyType === t && (
                        <CheckCircle className="w-4 h-4 text-accent mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">Where is your property located?</h3>
                <Input
                  placeholder="e.g Parakin"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-accent px-5"
                  autoFocus
                />
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">What's your expected sale or rent price?</h3>
                <Input
                  placeholder="e.g ₦1M – ₦1.5M or ₦300k per year"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-accent px-5"
                  autoFocus
                />
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Do you have any property documents?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  This helps us verify and present your property better. You can skip this if you're not sure.
                </p>
                <div className="flex flex-wrap gap-2">
                  {DOCUMENT_OPTIONS.map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => toggleDoc(doc)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                        documents.includes(doc)
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-gray-200 bg-white text-gray-600 hover:border-accent/40"
                      }`}
                    >
                      {doc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">How should we reach you?</h3>
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-accent px-5"
                  autoFocus
                />
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-accent px-5"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => step > 1 ? go(step - 1) : onClose()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? "Back" : "Cancel"}
        </button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => go(step + 1)}
            disabled={!canProceed()}
            className="rounded-xl px-7 h-11 text-sm font-semibold bg-primary hover:bg-primary/90 disabled:opacity-40"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleWhatsApp}
            disabled={!canProceed()}
            className="rounded-xl px-7 h-11 text-sm font-semibold bg-[#25D366] hover:bg-[#1ebe5d] text-white disabled:opacity-40"
          >
            Continue on WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PropertyOwners() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Layout>
      {/* Intro */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Have a property in Ife? Get serious tenants or buyers faster</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
            List your property and get it seen by the right audience locally and abroad. <br className="hidden md:block" />
            No stress, no chasing agents.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <img
              src={addPropertyImg}
              alt="Steps to add property"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <div>
            <h2 className="text-3xl font-display font-bold mb-8 text-primary">How it works</h2>
            <div className="space-y-6 mb-10">
              {[
                { title: "Submit your property details", desc: "Fill in your property information quickly and choose how you'd like us to proceed." },
                { title: "We help you capture it", desc: "If needed, our team can assist with photos and presentation to make your property more attractive to buyers/renters." },
                { title: "Get verified and promoted", desc: "We review your submission, verify details, and promote your property to serious buyers and tenants." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                  <div className="bg-accent/10 px-3 py-2 rounded-full mt-1 shrink-0">
                    <span className="font-display font-bold text-accent text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{step.title}</p>
                    <p className="text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-xl shadow-primary/20"
            >
              List Your Property Now
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              We accept a limited number of new listings weekly to ensure quality service.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-display font-bold text-primary mb-4">Why Property Owners choose Fairview</h3>
          <p className="text-gray-600 mb-8 text-lg">We help property owners get results faster:</p>
          <div className="space-y-4 text-left max-w-xl mx-auto">
            {[
              "Your property is promoted to targeted audiences in Nigeria and abroad",
              "No hidden fees — you stay in control",
              "Reach serious buyers and tenants, not just inquiries",
              "Fast listing and simple process",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-accent font-bold text-lg shrink-0">→</span>
                <p className="text-gray-700 font-medium">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-8">
          <ListPropertyFlow onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
