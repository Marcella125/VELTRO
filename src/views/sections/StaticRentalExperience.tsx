"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  ChevronDown,
  Clock3,
  Gauge,
  Gem,
  FileText,
  Headphones,
  Instagram,
  KeyRound,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { blogEntries } from "@/data/blogs";

const navigation = [
  ["fleet", "Fleet"],
  ["experience", "Experience"],
  ["mission", "About"],
  ["blogs", "Journal"],
  ["faq", "FAQ"],
  ["contact", "Contact"],
] as const;

const fleet = [
  {
    number: "01",
    brand: "Lamborghini",
    name: "EVO Spyder",
    image: assetPath("/lambo fleet.png"),
    engine: "V10",
    power: "640 HP",
    seats: "2 Seats",
    price: "$1,600",
  },
  {
    number: "02",
    brand: "Porsche",
    name: "911 Carrera 4S",
    image: assetPath("/porshe fleet.png"),
    engine: "3.0L TT",
    power: "443 HP",
    seats: "4 Seats",
    price: "$1,850",
  },
  {
    number: "03",
    brand: "Ferrari",
    name: "296 GTB",
    image: assetPath("/ferrari fleet.png"),
    engine: "V6 Hybrid",
    power: "819 HP",
    seats: "2 Seats",
    price: "$1,200",
  },
] as const;

const whatsappNumber = "96170335113";

function getWhatsAppBookingUrl(brand: string, name: string) {
  const message = `Hi, I'm interested in booking the ${brand} ${name}. Please share availability.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const faqs = [
  ["How do I make a reservation?", "Choose your vehicle and contact our concierge. We confirm availability, dates, delivery, and final booking details with you directly."],
  ["What documents do I need to rent a car?", "A valid driving licence and identity document are required. Additional requirements depend on residency and vehicle category."],
  ["Is there a mileage limit?", "Every rental includes a clearly stated mileage allowance. Extra mileage is quoted transparently before your booking is confirmed."],
  ["Can I cancel or modify my reservation?", "Yes. Changes are handled according to timing, vehicle availability, and the terms confirmed with your reservation."],
  ["Do you offer chauffeur services?", "Professional chauffeur service can be arranged for selected vehicles and experiences, subject to availability."],
  ["What happens in case of an accident?", "Contact Veltro immediately. Our team will guide you through documentation, assistance, and recovery arrangements."],
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-red)] sm:text-[0.68rem]">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-3 max-w-4xl font-display text-[clamp(2rem,4vw,4.25rem)] font-black uppercase leading-[0.92] tracking-[-0.055em] text-white">{children}<span className="text-[var(--brand-red)]">.</span></h2>;
}

export function StaticRentalExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState("");

  const navigate = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("Thank you. Our concierge will contact you shortly.");
    event.currentTarget.reset();
  };

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-black/88 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 w-full max-w-350 items-center px-5 sm:h-[4.5rem] sm:px-10">
          <button type="button" onClick={() => navigate("home")} aria-label="Veltro home">
            <Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} className="h-10 w-auto sm:h-12" priority unoptimized />
          </button>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 xl:flex">
            {navigation.map(([id, label]) => (
              <button key={id} type="button" onClick={() => navigate(id)} className="text-[0.61rem] font-medium uppercase tracking-[0.14em] text-white/62 transition hover:text-white">{label}</button>
            ))}
          </nav>

          <button type="button" onClick={() => navigate("contact")} className="ml-auto hidden h-9 items-center gap-2 bg-[var(--brand-red)] px-5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] transition hover:brightness-110 xl:flex">
            Book a car <ArrowRight size={13} />
          </button>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="ml-auto grid size-10 place-items-center xl:hidden" aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen ? (
          <nav className="border-t border-white/8 bg-black px-5 py-4 xl:hidden">
            {navigation.map(([id, label]) => (
              <button key={id} type="button" onClick={() => navigate(id)} className="flex w-full items-center justify-between border-b border-white/8 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/75">
                {label}<ArrowRight size={14} className="text-[var(--brand-red)]" />
              </button>
            ))}
          </nav>
        ) : null}
      </header>

      <section id="home" className="relative flex min-h-dvh scroll-mt-16 flex-col overflow-hidden pt-16 sm:scroll-mt-[4.5rem] sm:pt-[4.5rem]">
        <Image src={assetPath("/Home bg.png")} alt="Black Lamborghini supercar" fill priority quality={100} className="object-cover object-[60%_center] sm:object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.94)_0%,rgba(0,0,0,.79)_31%,rgba(0,0,0,.12)_60%,rgba(0,0,0,.24)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.2)_0%,transparent_58%,rgba(0,0,0,.9)_100%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-350 flex-1 flex-col px-5 pb-2 pt-[clamp(3.25rem,8vh,6.5rem)] sm:px-10 sm:pb-4">
          <div className="max-w-[34rem]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.4em] text-white/72">Luxury car rental</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,4.35vw,4.25rem)] font-black uppercase leading-[0.94] tracking-[-0.055em] text-white">
              Drive the<br />extraordinary<span className="text-[var(--brand-red)]">.</span>
            </h1>
            <p className="mt-5 max-w-[27rem] text-[0.88rem] leading-[1.42] text-white/68 sm:text-[0.96rem]">
              Iconic cars. Unforgettable experiences.<br className="hidden sm:block" /> Rent the world&apos;s most extraordinary vehicles<br className="hidden sm:block" /> and turn every journey into a story.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate("fleet")} className="inline-flex h-11 min-w-[13.2rem] items-center justify-center gap-3 bg-[var(--brand-red)] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.17em] shadow-[0_0_24px_rgba(177,18,38,.18)]">Explore the fleet <ArrowRight size={13} /></button>
              <button type="button" onClick={() => navigate("experience")} className="inline-flex h-11 min-w-[11.2rem] items-center justify-center border border-white/25 bg-black/35 px-5 text-[0.62rem] font-semibold uppercase tracking-[0.17em]">How it works</button>
            </div>

            <div className="mt-7 grid max-w-[29rem] grid-cols-3 gap-4">
              {[[Gem, "Premium", "Fleet"], [ShieldCheck, "Fully insured", "& trusted"], [Star, "5-star", "Experience"]].map(([Icon, first, second]) => {
                const FeatureIcon = Icon as typeof Gem;
                return (
                  <div key={first as string} className="flex items-center gap-2.5">
                    <FeatureIcon size={25} strokeWidth={1.7} className="shrink-0 text-[var(--brand-red)]" />
                    <span className="text-[0.58rem] leading-4 text-white/68">{first as string}<br />{second as string}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-10">
            <div className="relative grid overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(110deg,rgba(22,23,25,.98),rgba(12,13,15,.96))] shadow-[0_24px_80px_rgba(0,0,0,.5),inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(210,18,42,.85),transparent)]" />
              {[
                [CarFront, "Curated fleet", "Performance cars chosen", "for memorable drives"],
                [MapPin, "Lebanon only", "Explore the country", "on your terms"],
                [Headphones, "Personal service", "Speak directly with", "our local team"],
                [MessageCircle, "Book on WhatsApp", "Request dates and", "confirm availability"],
              ].map(([Icon, title, firstLine, secondLine], index) => {
                const StatIcon = Icon as typeof CarFront;
                return (
                  <div key={title as string} className={`group flex min-h-[6rem] items-center gap-4 px-5 py-3 transition-colors duration-300 hover:bg-white/[.035] sm:px-6 ${index === 0 ? "border-b border-white/8 sm:border-r lg:border-b-0" : ""} ${index === 1 ? "border-b border-white/8 lg:border-b-0 lg:border-r" : ""} ${index === 2 ? "border-b border-white/8 sm:border-b-0 sm:border-r" : ""}`}>
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/12 bg-black/20 text-[var(--brand-red)] shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition duration-300 group-hover:border-[var(--brand-red)]/50 group-hover:bg-[var(--brand-red)]/10">
                      <StatIcon size={23} strokeWidth={1.65} />
                    </span>
                    <div>
                      <h3 className="font-display text-[0.66rem] font-semibold uppercase leading-none tracking-[0.26em] text-white sm:text-[0.7rem]">{title as string}</h3>
                      <p className="mt-2 text-[0.58rem] leading-[1.6] tracking-[0.15em] text-white/50">{firstLine as string}<br />{secondLine as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="relative flex min-h-dvh scroll-mt-16 items-center overflow-x-hidden border-t border-white/8 bg-black py-16 sm:scroll-mt-[4.5rem] md:h-dvh md:min-h-0 md:overflow-hidden md:py-[4.75rem]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_36%,rgba(255,255,255,.055),transparent_48%)]" />
        <div className="relative z-10 mx-auto w-full max-w-350 px-5 sm:px-10">
          <div className="text-center">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-red)]">Our fleet</p>
            <h2 className="mt-1.5 font-display text-[clamp(1.4rem,2vw,1.9rem)] font-semibold uppercase tracking-[0.015em] text-white">Iconic cars. Unforgettable journeys.</h2>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-white/46 sm:gap-x-8">
            {['All cars','Lamborghini','Porsche','Ferrari','BMW','Mercedes','Others'].map((brand, index) => index === 0 ? <Link href="/fleet/all" key={brand} className="rounded-md border border-[var(--brand-red)] px-3 py-1.5 text-[var(--brand-red)]">{brand}</Link> : <button type="button" key={brand} className="py-1.5 transition hover:text-white">{brand}</button>)}
          </div>
          <div className="mx-auto mt-5 grid max-w-[68rem] gap-4 md:grid-cols-3">
            {fleet.map((car) => (
              <article key={car.name} className="group overflow-hidden border border-white/12 bg-[linear-gradient(180deg,#080808_0%,#050505_100%)] transition duration-300 hover:-translate-y-1 hover:border-white/25">
                <div className="px-4 pt-4">
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/52"><span className="text-[var(--brand-red)]">{car.number}</span> / {car.brand}</p>
                  <h3 className="mt-1.5 font-display text-[1.38rem] font-black uppercase leading-none tracking-[-0.045em] text-white lg:text-[1.55rem]">{car.name}</h3>
                </div>
                <div className="relative mt-2.5 h-[14rem] overflow-hidden md:h-[13.25rem] lg:h-[14.25rem]"><Image src={car.image} alt={car.name} fill className="object-cover object-center transition duration-500 group-hover:scale-[1.025]" /></div>
                <div className="grid grid-cols-3 border-y border-white/8 px-3.5 py-2.5 text-[0.5rem] text-white/56">
                  <span className="flex items-center gap-1.5 whitespace-nowrap"><Gauge size={12}/>{car.engine}</span>
                  <span className="flex items-center justify-center gap-1.5 whitespace-nowrap"><Gauge size={12}/>{car.power}</span>
                  <span className="flex items-center justify-end gap-1.5 whitespace-nowrap"><Users size={12}/>{car.seats}</span>
                </div>
                <div className="px-4 py-3"><strong className="text-[1.25rem] font-semibold">{car.price}</strong><span className="ml-2.5 text-[0.47rem] uppercase tracking-[0.14em] text-white/42">Rent per day</span></div>
                <a href={getWhatsAppBookingUrl(car.brand, car.name)} target="_blank" rel="noreferrer" className="mx-3.5 mb-3.5 flex h-9 w-[calc(100%-1.75rem)] items-center justify-center gap-2 bg-[var(--brand-red)] text-[0.54rem] font-semibold uppercase tracking-[0.16em] transition hover:brightness-110">Book on WhatsApp <Image src={assetPath("/icons/whatsapp.svg")} alt="" width={14} height={14} className="h-3.5 w-3.5" /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="flex min-h-dvh scroll-mt-16 items-center border-t border-black/8 bg-[#f4f3ef] py-20 text-[#111214] sm:scroll-mt-[4.5rem] md:h-dvh md:min-h-0 md:overflow-hidden">
        <div className="mx-auto w-full max-w-[72rem] px-5 sm:px-10">
          <div className="text-center">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-red)]">How it works</p>
            <h2 className="mt-3 font-display text-[clamp(1.4rem,2vw,1.9rem)] font-semibold uppercase tracking-[0.015em] text-[#111214]">A seamless rental experience.</h2>
          </div>

          <div className="mt-14 grid gap-12 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-7 lg:gap-10">
            {[
              [CalendarDays, "Choose your car", "Browse our curated fleet and select the perfect vehicle for your journey."],
              [FileText, "Book with ease", "Pick your dates, location and extras. Our team will confirm your reservation."],
              [KeyRound, "Pick up & drive", "Receive your vehicle and experience the extraordinary on the open road."],
            ].map(([Icon, title, copy], index) => {
              const StepIcon = Icon as typeof CalendarDays;
              return (
                <div key={title as string} className="contents">
                  <article className="grid grid-cols-[3.6rem_1fr] gap-x-5">
                    <span className="grid size-14 place-items-center rounded-full border-2 border-[var(--brand-red)] font-display text-sm font-semibold text-[var(--brand-red)]">0{index + 1}</span>
                    <div>
                      <StepIcon size={35} strokeWidth={1.65} className="text-black/75" />
                      <h3 className="mt-6 font-display text-[1.05rem] font-bold uppercase tracking-[0.025em] text-[#111214] sm:text-[1.18rem]">{title as string}</h3>
                      <p className="mt-2 max-w-[15rem] text-[0.78rem] leading-5.5 text-black/52 sm:text-[0.82rem]">{copy as string}</p>
                    </div>
                  </article>
                  {index < 2 ? <ArrowRight size={28} strokeWidth={1.6} className="mx-auto hidden text-[var(--brand-red)] md:block" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="mission" className="relative flex min-h-dvh scroll-mt-16 items-center overflow-hidden py-24 sm:scroll-mt-[4.5rem]">
        <Image src={assetPath("/images/Mission bg.png")} alt="Lamborghini at night" fill className="object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.9)_30%,rgba(0,0,0,.25)_70%,rgba(0,0,0,.5)_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-350 px-5 sm:px-10">
          <div className="max-w-xl"><Eyebrow>Our mission</Eyebrow><SectionTitle>Driven by passion. Defined by excellence</SectionTitle><div className="mt-6 h-px w-16 bg-[var(--brand-red)]"/><p className="mt-7 max-w-md text-sm leading-7 text-white/65 sm:text-base">We don&apos;t simply provide exceptional cars. We create experiences built around them. Every detail is shaped to feel effortless, elevated, and memorable.</p><button type="button" onClick={() => navigate("contact")} className="mt-8 inline-flex h-11 items-center gap-2 bg-[var(--brand-red)] px-6 text-[0.6rem] font-semibold uppercase tracking-[0.15em]">Learn about Veltro <ArrowRight size={13}/></button></div>
        </div>
      </section>

      <section id="blogs" className="flex min-h-dvh scroll-mt-16 items-center border-t border-black/8 bg-[#f4f3ef] py-24 text-[#111214] sm:scroll-mt-[4.5rem]">
        <div className="mx-auto w-full max-w-350 px-5 sm:px-10">
          <Eyebrow>From our journal</Eyebrow><h2 className="mt-3 max-w-4xl font-display text-[clamp(2rem,4vw,4.25rem)] font-black uppercase leading-[0.92] tracking-[-0.055em] text-[#111214]">Stories that fuel the journey<span className="text-[var(--brand-red)]">.</span></h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {blogEntries.map((entry) => <article key={entry.id} className="border border-black/20 bg-[#111214] text-white shadow-[0_18px_45px_rgba(0,0,0,.18)]"><div className="relative h-52 overflow-hidden"><Image src={entry.heroImage} alt={entry.title} fill className="object-cover transition duration-500 hover:scale-105"/></div><div className="p-5"><p className="text-[0.56rem] uppercase tracking-[0.15em] text-[var(--brand-red)]">{entry.category}</p><h3 className="mt-3 text-xl font-semibold leading-tight">{entry.title}</h3><p className="mt-3 line-clamp-3 text-xs leading-5 text-white/55">{entry.summary}</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[0.52rem] uppercase tracking-[0.13em] text-white/42"><span>{entry.publishedAt} · {entry.readTime}</span><ArrowRight size={13} className="text-[var(--brand-red)]"/></div></div></article>)}
          </div>
        </div>
      </section>

      <section id="faq" className="relative flex min-h-dvh scroll-mt-16 items-center overflow-hidden py-24 sm:scroll-mt-[4.5rem]">
        <Image src={assetPath("/images/FAQ.png")} alt="Supercar by the city skyline" fill className="object-cover object-[72%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.97)_40%,rgba(0,0,0,.58)_58%,rgba(0,0,0,.16)_78%,rgba(0,0,0,.5)_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-350 px-5 sm:px-10">
          <div className="max-w-[35rem]">
            <Eyebrow>FAQ&apos;S</Eyebrow>
            <h2 className="mt-3 max-w-[32rem] font-display text-[clamp(2rem,3.4vw,3.2rem)] font-black uppercase leading-[0.94] tracking-[-0.05em] text-white">Everything you need<br className="hidden sm:block" /> to know<span className="text-[var(--brand-red)]">.</span></h2>
            <div className="mt-7">
              {faqs.map(([question,answer],index)=>{
                const open=openFaq===index;
                return <article key={question} className="border-b border-white/12"><button type="button" onClick={()=>setOpenFaq(open?null:index)} className="flex w-full items-center gap-3 py-3.5 text-left"><span className="text-[0.65rem] font-semibold text-[var(--brand-red)]">{String(index+1).padStart(2,"0")}</span><span className="flex-1 text-[0.78rem] text-white/78 sm:text-[0.86rem]">{question}</span><ChevronDown size={14} className={`shrink-0 transition ${open?"rotate-180 text-[var(--brand-red)]":"text-white/45"}`}/></button>{open?<p className="max-w-[31rem] pb-4 pl-8 pr-6 text-[0.72rem] leading-5.5 text-white/48 sm:text-[0.78rem]">{answer}</p>:null}</article>
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative flex min-h-dvh scroll-mt-16 flex-col overflow-hidden bg-[#f4f3ef] text-[#111214] sm:scroll-mt-[4.5rem]">
        <div className="relative z-10 mx-auto flex w-full max-w-350 flex-1 items-center px-5 py-24 sm:px-10">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div><Eyebrow>Get in touch</Eyebrow><h2 className="mt-3 max-w-xl font-display text-[clamp(2.5rem,5vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#111214]">We&apos;d love to hear from you<span className="text-[var(--brand-red)]">.</span></h2><p className="mt-6 max-w-md text-sm leading-6 text-black/58">Have a question, special request, or ready to book? Our team is here to help.</p><div className="mt-10 grid gap-5 sm:grid-cols-3">{[[MapPin,"Veltro Showroom","Beirut, Lebanon"],[Phone,"+961 70 33 5467","Mon–Sun · 9AM–8PM"],[Mail,"info@veltro.com","Reply within 24h"]].map(([Icon,title,detail])=>{const InfoIcon=Icon as typeof MapPin;return <div key={title as string} className="flex gap-3"><InfoIcon size={18} className="shrink-0 text-[var(--brand-red)]"/><div><p className="text-xs font-semibold text-black/82">{title as string}</p><p className="mt-1 text-[0.62rem] text-black/45">{detail as string}</p></div></div>})}</div></div>
            <form onSubmit={submitContact} className="rounded-2xl border border-black/20 bg-[#111214] p-5 shadow-[0_24px_70px_rgba(0,0,0,.2)] sm:p-7"><div className="grid gap-4">{[["Full name","Your name","text"],["Email","Your email","email"],["Subject","How can we help?","text"]].map(([label,placeholder,type])=><label key={label} className="text-[0.55rem] uppercase tracking-[0.14em] text-white/58">{label}<input required type={type} placeholder={placeholder} className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-[#070809] px-3 text-sm normal-case tracking-normal text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-red)]"/></label>)}<label className="text-[0.55rem] uppercase tracking-[0.14em] text-white/58">Message<textarea required rows={4} placeholder="Your message" className="mt-2 w-full resize-none rounded-lg border border-white/12 bg-[#070809] p-3 text-sm normal-case tracking-normal text-white placeholder:text-white/30 outline-none focus:border-[var(--brand-red)]"/></label><button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--brand-red)] text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white">Send message <ArrowRight size={13}/></button>{formStatus?<p className="text-xs text-white/58">{formStatus}</p>:null}</div></form>
          </div>
        </div>
        <footer className="relative z-10 border-t border-white/10 bg-black/90"><div className="mx-auto flex w-full max-w-350 flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:px-10"><Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} className="h-9 w-auto self-start" unoptimized/><nav className="flex flex-wrap gap-5 sm:ml-auto">{navigation.map(([id,label])=><button key={id} type="button" onClick={()=>navigate(id)} className="text-[0.52rem] uppercase tracking-[0.13em] text-white/45">{label}</button>)}</nav><div className="flex gap-3 text-white/55"><Instagram size={14}/><Clock3 size={14}/></div></div><div className="mx-auto flex max-w-350 justify-between border-t border-white/8 px-5 py-4 text-[0.5rem] text-white/30 sm:px-10"><span>© 2026 Veltro. All rights reserved.</span><span>Privacy Policy · Terms of Service</span></div></footer>
      </section>
    </main>
  );
}
