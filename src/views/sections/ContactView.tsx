"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { PrimaryButton } from "@/components/ui/primary-button";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";

type ContactFormState = {
  firstName: string;
  lastName: string;
  enquiry: string;
  email: string;
  message: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
};

const initialFormState: ContactFormState = {
  firstName: "",
  lastName: "",
  enquiry: "",
  email: "",
  message: "",
};

const contactHighlights = [
  {
    label: "Concierge",
    value: "+961 70 335 113",
  },
  {
    label: "Email",
    value: "info@platinumeditionofficial.com",
  },
  {
    label: "Availability",
    value: "Daily responses for booking and delivery requests",
  },
];

const fieldClassName =
  "w-full border border-white/10 bg-black/24 px-4 text-[13px] text-white/82 placeholder:text-white/34 outline-none transition-[border-color,background-color,box-shadow] duration-[var(--transition-normal)] ease-[var(--ease-premium)] focus:border-white/18 focus:bg-black/32 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:text-sm";

export function ContactView() {
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const { overlay, runTransition } = usePageTransition();

  const navigateTo = (href: string) => {
    setIsDockOpen(false);
    runTransition(() => router.push(href));
  };

  const handleDockSelect = (id: string) => {
    if (id === "home") return navigateTo(homeHref);
    if (id === "fleet") return navigateTo("/fleet");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return setIsDockOpen(false);
    if (id === "faq") return navigateTo("/faq");
  };

  const updateField = (field: keyof ContactFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { firstName, lastName, enquiry, email, message } = formState;
    if (!firstName || !lastName || !enquiry || !email || !message) {
      setStatus("error");
      return;
    }

    setStatus("sent");
    setFormState(initialFormState);
  };

  return (
    <motion.main
      className="relative h-dvh overflow-hidden text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none fixed inset-0">
        <Image
          src="/images/bgcar.png"
          alt="Platinum contact background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_60%_30%,rgba(193,18,31,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_70%,rgba(0,0,0,0.8),transparent_60%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.75)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-dvh w-full max-w-350 flex-col overflow-hidden px-6 pb-6 pt-6 sm:px-10">
        <div className="relative z-30">
          <InternalPageHeader
            title="Contact"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="relative mt-5 flex min-h-0 flex-1 items-center lg:mt-6">
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.98fr)] lg:items-center lg:gap-10 xl:gap-14">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="max-w-[34rem]">
                <h1 className="type-section-title max-w-[12ch] text-[clamp(2.8rem,5vw,3.9rem)] leading-[0.95] text-white">
                  Request Your Next Drive
                </h1>

                <p className="type-body mt-5 max-w-[32rem] text-[clamp(1rem,1.32vw,1.14rem)] leading-[1.62] text-white/74">
                  Share your preferred vehicle, rental dates, and delivery details.
                  The Platinum team will respond with availability, pricing, and a
                  tailored handover plan.
                </p>

                <div className="mt-9 h-px w-full max-w-[30rem] bg-white/12" />

                <div className="mt-8 space-y-5">
                  {contactHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[minmax(92px,112px)_minmax(0,1fr)] gap-4 border-b border-white/8 pb-4"
                    >
                      <span className="type-eyebrow text-white/34">
                        {item.label}
                      </span>
                      <span className="type-body text-white/84">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08,
              }}
            >
              <div className="pointer-events-none absolute inset-x-[12%] top-[8%] h-[42%] bg-[radial-gradient(ellipse_at_center,rgba(177,18,38,0.24)_0%,transparent_72%)] blur-[28px]" />

              <form
                onSubmit={handleSubmit}
                className="relative border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.86)_0%,rgba(20,9,11,0.92)_100%)] px-4 py-4 shadow-[0_26px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-5 sm:py-5 lg:px-5 lg:py-5"
              >
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5">
                  <div>
                    <p className="type-eyebrow text-white/38">Contact Form</p>
                    <h2 className="type-card-title mt-1 text-white text-[1.14rem] sm:text-[1.16rem]">
                      Booking & General Enquiries
                    </h2>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {status === "sent" ? (
                      <motion.p
                        key="sent"
                        className="type-eyebrow max-w-[10.5rem] text-right text-[var(--brand-red)]"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        Message received
                      </motion.p>
                    ) : status === "error" ? (
                      <motion.p
                        key="error"
                        className="type-eyebrow max-w-[10.5rem] text-right text-[#d96c74]"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        Complete all required fields
                      </motion.p>
                    ) : (
                      <motion.p
                        key="idle"
                        className="type-eyebrow max-w-[10.5rem] text-right text-white/32"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        Response times vary by enquiry
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  <div className="space-y-0.5">
                    <label className="type-eyebrow block text-white/34" htmlFor="contact-first-name">
                      First name
                    </label>
                    <input
                      id="contact-first-name"
                      type="text"
                      value={formState.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      className={`${fieldClassName} h-9`}
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="type-eyebrow block text-white/34" htmlFor="contact-last-name">
                      Last name
                    </label>
                    <input
                      id="contact-last-name"
                      type="text"
                      value={formState.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      className={`${fieldClassName} h-9`}
                    />
                  </div>

                  <div className="space-y-0.5 sm:col-span-2">
                    <label className="type-eyebrow block text-white/34" htmlFor="contact-enquiry">
                      Enquiry
                    </label>
                    <input
                      id="contact-enquiry"
                      type="text"
                      value={formState.enquiry}
                      onChange={(event) => updateField("enquiry", event.target.value)}
                      className={`${fieldClassName} h-9`}
                    />
                  </div>

                  <div className="space-y-0.5 sm:col-span-2">
                    <label className="type-eyebrow block text-white/34" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formState.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className={`${fieldClassName} h-9`}
                    />
                  </div>

                  <div className="space-y-0.5 sm:col-span-2">
                    <label className="type-eyebrow block text-white/34" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={formState.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      rows={3}
                      className={`${fieldClassName} min-h-[5rem] resize-none py-1.5`}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="type-body max-w-[18rem] text-[0.78rem] leading-4 text-white/52">
                    Include preferred dates, vehicle model, and destination details for
                    a faster response.
                  </p>

                  <PrimaryButton
                    type="submit"
                    className="min-w-[9.5rem] rounded-none px-5 sm:w-auto"
                  >
                    Send Enquiry
                  </PrimaryButton>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        <p className="shrink-0 pb-[calc(0.5rem-0.3cm)] pt-4 text-center text-[11px] tracking-[0.03em] text-white/55">
          Platinum all rights reserved &copy; 2026
        </p>
      </div>
    </motion.main>
  );
}
