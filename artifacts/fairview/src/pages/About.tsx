import { Layout } from "@/components/layout/Layout";
import { CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="bg-gray-50 pb-20">
        <section className="bg-primary text-white py-24 mb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About Fairview</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
              Redefining real estate in Nigeria through transparency, innovation, and unwavering integrity.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
            <div>
              <h2 className="text-3xl font-display font-bold text-primary mb-6">Platform Purpose</h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Fairview Realty was born out of a simple necessity: the Nigerian real estate market needed a platform that people could truly trust. Too often, buyers and renters face complex, opaque processes, while property owners struggle to find genuine clients.
                </p>
                <p>
                  We act as the reliable bridge. By combining modern digital experiences (like our signature virtual inspections) with rigorous physical verification processes, we ensure that what you see online is exactly what you get in reality.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-display font-bold text-primary mb-6">Why Choose Fairview?</h2>
              <ul className="space-y-4">
                {[
                  "100% Verified Properties - No scams, no fake listings.",
                  "Virtual & Physical Inspections tailored to your schedule.",
                  "Transparent Legal Documentation.",
                  "Dedicated Customer care from inquiry to moving day."
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-primary text-white p-10 lg:p-12">
                <h3 className="text-3xl font-display font-bold mb-8">Contact Us</h3>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Head Office</h4>
                      <p className="text-primary-foreground/80">No 50 Raymond Adedoyin way,<br/>beside Nitel, Parakin,<br/>Ile Ife, Osun.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone</h4>
                      <p className="text-primary-foreground/80">09164069005</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Email</h4>
                      <p className="text-primary-foreground/80">fairviewrealtyhub@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Business Hours</h4>
                      <p className="text-primary-foreground/80">Monday – Saturday: 9:00AM – 6:00PM</p>
                      <p className="text-primary-foreground/80">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 h-[400px] md:h-auto min-h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15836.8521798369!2d4.5583!3d7.4735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10382e8d38cb3dc1%3A0xb36cd25f6e80b2d6!2sParakin%2C%20Ile-Ife!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[20%] contrast-125"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
