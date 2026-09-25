"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock3, Mail, MapPinned, Phone } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";

type ContactFormState = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

const inputClassName =
  "w-full border border-white/10 bg-black/42 px-4 py-3 text-[14px] text-white placeholder:text-white/28 outline-none backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-[var(--transition-normal)] ease-[var(--ease-premium)] focus:border-[var(--brand-red)] focus:bg-black/52 focus:shadow-[0_0_0_1px_rgba(177,18,38,0.22)]";

const contactInfo = [
  {
    title: "Visit Us",
    lines: ["Veltro Showroom", "Beirut, Lebanon"],
    icon: MapPinned,
  },
  {
    title: "Email Us",
    lines: ["info@veltro.com"],
    icon: Mail,
  },
  {
    title: "Call Us",
    lines: ["+961 70 33 5467"],
    icon: Phone,
  },
  {
    title: "Hours",
    lines: ["Mon - Sun: 9 AM - 8 PM"],
    icon: Clock3,
  },
] as const;

export function ContactView({ embedded = false }: { embedded?: boolean }) {
  const Root = embedded ? "div" : "main";
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);

  useEffect(() => {
    if (embedded) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [embedded]);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleDockSelect = (id: string) => {
    if (embedded) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (id === "home") return navigateTo(homeHref);
    if (id === "fleet") return navigateTo("/fleet");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return;
    if (id === "faq") return navigateTo("/faq");
  };

  const updateField = (field: keyof ContactFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { fullName, email, subject, message } = formState;
    if (!fullName || !email || !subject || !message) {
      setStatus("error");
      return;
    }

    setStatus("sent");
    setFormState(initialFormState);
  };

  return (
    <Root className="relative min-h-dvh overflow-hidden bg-black text-white lg:h-dvh">
      <div className={`pointer-events-none ${embedded ? "absolute" : "fixed"} inset-0`}>
        <Image
          src={assetPath("/images/contact.png")}
          alt="Veltro contact background"
          fill
          priority
          className="object-cover object-[50%_calc(50%+0.5cm)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.34)_40%,rgba(0,0,0,0.52)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-350 flex-col px-5 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6 lg:h-dvh">
        <div className={`relative z-30 ${embedded ? "hidden" : ""}`}>
          <InternalPageHeader
            title="Contact"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            surfaceClassName="bg-black sm:bg-transparent"
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>
        {embedded ? <h2 className="relative z-30 flex h-16 shrink-0 items-end pb-2 font-display text-[1.75rem] font-black uppercase leading-none tracking-[-0.04em] text-white sm:h-20 sm:pb-3 sm:text-[2.4rem]">Contact<span className="text-[var(--brand-red)]">.</span></h2> : null}

        <section className="relative z-10 mt-5 flex flex-1 items-start justify-center sm:mt-7 lg:justify-start">
          <div className="w-full max-w-[620px] lg:mr-auto">
            <div className="flex flex-col gap-4">
              <div className="max-w-[18rem]">
                <h2 className="font-display text-[1.5rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[2rem] lg:text-[2.2rem]">
                  WE&apos;D LOVE TO HEAR FROM YOU<span className="text-[var(--brand-red)]">.</span>
                </h2>
                <div className="mt-4 h-px w-8 bg-[var(--brand-red)]" />
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex min-w-0 items-center gap-1.5 sm:min-w-max sm:whitespace-nowrap"
                    >
                      <Icon
                        size={14}
                        className="shrink-0 text-[var(--brand-red)]"
                        strokeWidth={1.7}
                      />
                      <p className="truncate text-[10px] leading-none text-white/72 sm:truncate-none">
                        {item.lines.join(" ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <form onSubmit={handleSubmit} className="flex h-full flex-col">
                <div className="space-y-2">
                  <div>
                    <label className="type-eyebrow mb-1.5 block text-white/34" htmlFor="contact-full-name">
                      Full Name
                    </label>
                    <input
                      id="contact-full-name"
                      type="text"
                      placeholder="Your name"
                      value={formState.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="type-eyebrow mb-1.5 block text-white/34" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Your email"
                      value={formState.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="type-eyebrow mb-1.5 block text-white/34" htmlFor="contact-subject">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formState.subject}
                      onChange={(event) => updateField("subject", event.target.value)}
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className="type-eyebrow mb-1.5 block text-white/34" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      placeholder="Your message"
                      value={formState.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      className={`${inputClassName} min-h-[2.4rem] resize-none`}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-5 py-3 font-display text-[0.56rem] uppercase tracking-[0.18em] text-white transition hover:brightness-110"
                  >
                    <span>Send Message</span>
                  </button>

                  {status !== "idle" ? (
                    <p className="mt-3 text-[0.82rem] leading-5 text-white/54">
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

        <PageFooterNote
          showDesktop={false}
          mobilePlacement="static"
          mobileSurfaceClassName="border-t border-white/8 bg-black"
          mobileClassName="w-full pb-safe sm:hidden"
        />
      </div>

      <PageFooterNote mobileClassName="hidden" />
    </Root>
  );
}
