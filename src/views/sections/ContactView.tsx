"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { PrimaryButton } from "@/components/ui/primary-button";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";

type ContactFormState = {
  firstName: string;
  lastName: string;
  enquiry: string;
  email: string;
  message: string;
};

const initialFormState: ContactFormState = {
  firstName: "",
  lastName: "",
  enquiry: "",
  email: "",
  message: "",
};

const fieldClassName =
  "w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-[14px] text-white placeholder:text-white/24 outline-none transition-[border-color,color] duration-[var(--transition-normal)] ease-[var(--ease-premium)] focus:border-[var(--brand-red)] sm:text-[15px]";

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
    <main className="relative h-dvh overflow-hidden text-white">
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Platinum contact background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_60%_30%,rgba(193,18,31,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_70%,rgba(0,0,0,0.8),transparent_60%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.75)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-dvh w-full max-w-350 flex-col overflow-hidden px-6 pb-4 pt-4 sm:px-10 sm:pb-6 sm:pt-6">
        <div className="relative z-30">
          <InternalPageHeader
            title="Contact"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="relative mt-6 flex min-h-0 flex-1 items-start justify-center sm:mt-7 lg:mt-6 lg:pt-4">
          <div className="w-full max-w-[1050px]">
            <div className="mx-auto w-full max-w-[820px]">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 gap-x-9 gap-y-5 sm:grid-cols-2 sm:gap-y-6 lg:gap-x-12">
                  <div className="space-y-1.5">
                    <label className="type-eyebrow block text-white/42" htmlFor="contact-first-name">
                      First Name
                    </label>
                    <input
                      id="contact-first-name"
                      type="text"
                      value={formState.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="type-eyebrow block text-white/42" htmlFor="contact-last-name">
                      Last Name
                    </label>
                    <input
                      id="contact-last-name"
                      type="text"
                      value={formState.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="type-eyebrow block text-white/42" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formState.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="type-eyebrow block text-white/42" htmlFor="contact-enquiry">
                      Enquiry Type
                    </label>
                    <input
                      id="contact-enquiry"
                      type="text"
                      value={formState.enquiry}
                      onChange={(event) => updateField("enquiry", event.target.value)}
                      className={fieldClassName}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="type-eyebrow block text-white/42" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={formState.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      rows={4}
                      placeholder="Preferred dates, vehicle model, destination, or anything else we should know."
                      className={`${fieldClassName} min-h-[7.8rem] resize-none py-3 text-[14px] leading-[1.65] placeholder:text-[12.5px] placeholder:text-white/22 sm:min-h-[8.5rem] sm:placeholder:text-[13px]`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:items-end">
                  <PrimaryButton
                    type="submit"
                    className="w-full sm:w-auto sm:min-w-[13.5rem]"
                  >
                    Send Enquiry
                  </PrimaryButton>

                  {status !== "idle" ? (
                    <p className="type-body text-[0.8rem] leading-5 text-white/58">
                      {status === "sent"
                        ? "Your enquiry has been sent."
                        : "Please complete all fields before sending."}
                    </p>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <PageFooterNote />
    </main>
  );
}
