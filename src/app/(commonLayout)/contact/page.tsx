import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Perfume Concierge & Atelier | FIFTH SENSE PERFUMES",
  description:
    "Get in touch with our master perfumers, book a bespoke olfactory profiling session, or visit our flagship atelier in Gulshan, Dhaka.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-widest text-zinc-400">
          <Sparkles className="size-3 text-amber-400" />
          <span>Haute Parfumerie Concierge &amp; Atelier</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-zinc-950 dark:text-white">
          AT YOUR SERVICE.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Whether you need bespoke fragrance layering advice, personalized scent profiling,
          or a private studio smelling appointment, our master perfumers are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info & Showrooms (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-6">
            <h3 className="font-heading font-bold text-lg text-zinc-950 dark:text-white uppercase tracking-wide">
              Flagship Olfactory Atelier
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Gulshan 2 Avenue Atelier
                  </p>
                  <p className="text-zinc-500">
                    Road 71, Gulshan-2, Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Visiting Hours
                  </p>
                  <p className="text-zinc-500">
                    Sunday – Saturday: 10:00 AM – 9:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="size-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Direct Line / WhatsApp
                  </p>
                  <p className="text-zinc-500 font-mono">+880 1700-000000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="size-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Concierge Inquiries
                  </p>
                  <p className="text-zinc-500 font-mono">
                    concierge@fifthsense.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Discovery Set &amp; Sample Strip Service</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Live in Dhaka? Request a discovery set of sample vials to explore
              our Extraits against your personal skin chemistry before committing.
            </p>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-heading font-bold text-zinc-950 dark:text-white">
              Send a Message
            </h2>
            <p className="text-xs text-zinc-500">
              Our fragrance consultants reply within 2 working hours.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Tanvir Ahmed"
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">
                  Phone Number
                </label>
                <Input
                  placeholder="+880 1..."
                  className="rounded-xl h-10 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">
                Inquiry Topic
              </label>
              <Input
                placeholder="e.g. Scent profile advice for Obsidian Noire / Bespoke order"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">
                Message
              </label>
              <Textarea
                rows={4}
                placeholder="Tell us what fragrance profile or notes you are seeking..."
                className="rounded-xl text-xs"
              />
            </div>

            <Button
              type="button"
              className="w-full h-11 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold tracking-wider uppercase font-mono"
            >
              Dispatch Inquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
