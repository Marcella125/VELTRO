"use client";

/* eslint-disable react-hooks/purity -- date defaults are captured only when opening admin forms */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, ArrowLeft, BadgeCheck, BarChart3, Bell, CalendarCheck, CalendarDays, Car, CarFront,
  Check, ChevronDown, ChevronRight,
  Clock3, Eye, EyeOff, FileText, Globe2, ImagePlus, LayoutDashboard, LogOut,
  Menu, MoreHorizontal, MoreVertical, Pencil, Plus, Search, Settings, ShieldCheck, SlidersHorizontal,
  Trash2, Upload, UserRoundCheck, UsersRound, WalletCards, Wrench, X,
} from "lucide-react";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import type { AdminCar, AdminSnapshot, CarStatus, Owner, Reservation } from "@/lib/admin-types";
import { carStatuses } from "@/lib/admin-types";

type Props = { snapshot: AdminSnapshot; route: string[]; userEmail: string };
type Modal = null | { type: "confirm"; title: string; message: string; confirm: string; danger?: boolean; action: () => Promise<unknown> } | { type: "reservation"; car?: AdminCar } | { type: "owner" };

const navigation = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "cars", label: "Fleet Management", href: "/admin/cars", icon: CarFront },
  { id: "reservations", label: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
  { id: "clients", label: "Clients", href: "/admin/clients", icon: UsersRound },
  { id: "maintenance", label: "Maintenance", href: "/admin/maintenance", icon: Wrench },
  { id: "payments", label: "Payments", href: "/admin/payments", icon: WalletCards },
  { id: "website", label: "Website Manager", href: "/admin/website", icon: Globe2 },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings },
];

const statusStyle: Record<string, string> = {
  Available: "border-emerald-400/20 bg-emerald-400/8 text-emerald-300",
  Reserved: "border-amber-400/20 bg-amber-400/8 text-amber-200",
  Rented: "border-blue-400/20 bg-blue-400/8 text-blue-200",
  Unavailable: "border-slate-200 bg-slate-100 text-slate-600",
  Maintenance: "border-orange-400/20 bg-orange-400/8 text-orange-200",
  "Coming Soon": "border-violet-400/20 bg-violet-400/8 text-violet-200",
  Pending: "border-amber-400/20 bg-amber-400/8 text-amber-200",
  Confirmed: "border-emerald-400/20 bg-emerald-400/8 text-emerald-200",
  Cancelled: "border-red-400/20 bg-red-400/8 text-red-200",
  Completed: "border-sky-400/20 bg-sky-400/8 text-sky-200",
  Expired: "border-slate-200 bg-slate-100 text-slate-600",
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.12em] ${statusStyle[status] ?? statusStyle.Unavailable}`}><i className="size-1.5 rounded-full bg-current" />{status}</span>;
}

function money(value: number, currency = "AED") { return new Intl.NumberFormat("en-AE", { style: "currency", currency, maximumFractionDigits: 0 }).format(value); }
function date(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)); }

export function AdminShell({ snapshot, route, userEmail }: Props) {
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const section = route[0] ?? "dashboard";
  const carDetail = section === "cars" && route[1] && route[1] !== "new" ? snapshot.cars.find((car) => car.id === route[1]) : undefined;

  async function mutate(url: string, method: string, body?: unknown, success = "Changes saved") {
    setBusy(true);
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) throw new Error(data.error ?? "Something went wrong");
    setToast(success);
    setTimeout(() => setToast(""), 3200);
    router.refresh();
    return data;
  }

  function confirm(config: Exclude<Modal, null | { type: "reservation" } | { type: "owner" }>) { setModal(config); }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const title = route[1] === "new" ? "Add New Car" : carDetail ? carDetail.display_name : navigation.find((item) => item.id === section)?.label ?? "Dashboard";
  const subtitle = section === "dashboard" ? "A clear view of your fleet and today’s operations." : section === "cars" ? "Manage rental inventory, availability, rates, and publishing." : section === "reservations" ? "Active holds, deposits, and reservation status." : "Rental business preferences and security.";

  const dashboard = section === "dashboard";
  const operationalSections = ["clients", "maintenance", "payments", "website", "reports"];
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "2-digit", month: "short", year: "numeric" }).format(new Date());

  return (
    <main className="admin-cms-light min-h-dvh bg-[#f4f6f8] text-[#101114] xl:h-dvh xl:overflow-hidden">
      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[228px] flex-col overflow-hidden border-r border-white/6 bg-[#0b0d10] text-white transition-transform xl:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <Image src="/images/veltro-admin-sidebar.png" alt="" fill priority className="pointer-events-none translate-y-[135px] scale-[1.02] object-cover object-center" sizes="228px" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,.08)_0%,rgba(5,7,10,.08)_68%,rgba(5,7,10,.68)_88%,#07090c_100%)]" />
        <div className="relative z-10 flex h-[72px] shrink-0 items-center justify-between px-7">
          <Image src="/icons/veltro_logo.svg" alt="Veltro" width={156} height={40} className="h-auto w-[154px]" priority />
          <button onClick={() => setMobileNav(false)} className="lg:hidden" aria-label="Close navigation"><X size={18} /></button>
        </div>
        <nav className="admin-sidebar-nav relative z-10 flex-1 space-y-0.5 px-3">
          {navigation.map((item) => {
            const Icon = item.icon; const active = section === item.id;
            return <Link key={item.id} href={item.href} onClick={() => setMobileNav(false)} className={`admin-nav-item ${active ? "admin-nav-item-active" : ""} group flex h-[42px] items-center gap-3.5 rounded-[8px] px-4 text-[10.5px] font-normal transition ${active ? "text-white" : "text-white/72 hover:text-white"}`}><Icon size={16} strokeWidth={1.8} className="shrink-0" />{item.label}</Link>;
          })}
        </nav>
        <div className="relative z-10 shrink-0 border-t border-white/10 bg-[#07090c]/76 p-4 backdrop-blur-[2px]">
          <div className="mb-2 flex items-center gap-3 px-2 py-2"><span className="grid size-9 place-items-center rounded-full bg-white text-[11px] font-semibold text-black">VA</span><span className="min-w-0"><strong className="block truncate text-[12px] font-semibold text-white">Veltro Admin</strong><span className="block truncate text-[10px] text-white/45">Administrator</span></span></div>
          <button onClick={logout} className="flex h-10 w-full items-center gap-4 rounded-md px-3 text-[12px] text-white/68 transition hover:bg-white/5 hover:text-white"><LogOut size={18} />Log Out</button>
        </div>
      </aside>

      {mobileNav ? <button aria-label="Close navigation overlay" onClick={() => setMobileNav(false)} className="fixed inset-0 z-40 bg-black/70 xl:hidden" /> : null}

      <div className="xl:h-dvh xl:pl-[228px]">
        <header className="admin-topbar sticky top-0 z-30 flex h-[58px] items-center gap-4 border-b border-[#e3e6ea] bg-white px-4 sm:px-7">
          <button onClick={() => setMobileNav(true)} className="grid size-9 place-items-center rounded-lg border border-black/10 xl:hidden" aria-label="Open navigation"><Menu size={18} /></button>
          <label className="admin-topbar-search flex h-9 w-full max-w-[400px] items-center gap-3 rounded-full border px-4"><Search size={16} className="text-slate-500" /><input className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400" placeholder="Search cars, clients, reservations..." /></label>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative grid size-9 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100" aria-label="Notifications"><Bell size={18} /><i className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--brand-red)] ring-2 ring-[#fbfcfd]" /></button>
            <div className="hidden items-center gap-3 sm:flex"><span className="admin-avatar grid size-9 place-items-center rounded-full text-[10px] font-semibold">VA</span><span className="hidden text-left lg:block"><strong className="block text-[11px] font-semibold leading-4 text-slate-900">Veltro Admin</strong><small className="block text-[9px] text-slate-500">Administrator</small></span></div>
          </div>
        </header>

        <div className={dashboard ? "admin-dashboard mx-auto max-w-[1600px] px-4 py-3 sm:px-7 xl:h-[calc(100dvh-58px)] xl:overflow-hidden" : "mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9"}>
          {route[1] !== "new" && !carDetail ? <div className={dashboard ? "mb-3 flex min-h-[60px] items-center justify-between gap-5" : "mb-7"}><div><h1 className={`${dashboard ? "text-[29px]" : "text-2xl sm:text-3xl"} font-bold leading-tight tracking-[-.045em]`}>{title}</h1><p className={`${dashboard ? "mt-0 text-[12px]" : "mt-1 text-sm"} text-black/50`}>{dashboard ? "Here's an overview of your rental business." : subtitle}</p></div>{dashboard ? <div className="flex items-center gap-7"><span className="hidden items-center gap-2 text-[11px] text-black/60 lg:flex"><CalendarDays size={15} />{today}</span><Link href="/admin/cars/new" className="flex h-[44px] items-center gap-2 rounded-lg bg-[var(--brand-red)] px-5 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(177,18,38,.18)] hover:bg-[#c8172e]"><Plus size={16} />Add New Car</Link></div> : null}</div> : null}
          {section === "dashboard" ? <Dashboard snapshot={snapshot} mutate={mutate} /> : null}
          {section === "cars" && route.length === 1 ? <CarsTable cars={snapshot.cars} mutate={mutate} confirm={confirm} setModal={setModal} /> : null}
          {section === "cars" && route[1] === "new" ? <CarForm owners={snapshot.owners} mutate={mutate} /> : null}
          {carDetail ? <CarDetails car={carDetail} snapshot={snapshot} mutate={mutate} confirm={confirm} setModal={setModal} /> : null}
          {section === "reservations" ? <ReservationsView reservations={snapshot.reservations} cars={snapshot.cars} mutate={mutate} setModal={setModal} /> : null}
          {section === "settings" ? <SettingsView userEmail={userEmail} settings={snapshot.settings} mutate={mutate} /> : null}
          {operationalSections.includes(section) ? <OperationsView section={section} snapshot={snapshot} mutate={mutate} /> : null}
        </div>
      </div>

      {toast ? <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 border border-emerald-300/20 bg-[#111814] px-4 py-3 text-xs text-emerald-100 shadow-2xl"><span className="grid size-6 place-items-center rounded-full bg-emerald-400/15"><Check size={13} /></span>{toast}</div> : null}
      {modal ? <ModalView modal={modal} setModal={setModal} mutate={mutate} cars={snapshot.cars} busy={busy} /> : null}
    </main>
  );
}

function Dashboard({ snapshot, mutate }: { snapshot: AdminSnapshot; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown> }) {
  const clients = new Set(snapshot.reservations.map((reservation) => reservation.email || reservation.phone)).size;
  const rented = snapshot.reservations.filter((reservation) => reservation.status === "Confirmed").length;
  const totalCars = Math.max(snapshot.cars.length, 1);
  const counts = [
    ["Total Cars", snapshot.cars.length, Car, "neutral", 100],
    ["Available", snapshot.cars.filter((car) => car.status === "Available").length, BadgeCheck, "green", Math.round(snapshot.cars.filter((car) => car.status === "Available").length / totalCars * 100)],
    ["Rented", rented, CalendarCheck, "red", Math.round(rented / totalCars * 100)],
    ["In Maintenance", snapshot.cars.filter((car) => car.status === "Maintenance").length, Wrench, "blue", Math.round(snapshot.cars.filter((car) => car.status === "Maintenance").length / totalCars * 100)],
    ["Total Clients", clients, UserRoundCheck, "neutral", snapshot.reservations.length ? Math.round(clients / snapshot.reservations.length * 100) : 0],
  ] as const;
  return <div className="space-y-3 xl:h-[calc(100%-72px)] xl:min-h-0">
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:h-[84px]">
      {counts.map(([label, value, Icon, tone, percentage], index) => <article key={label} className="admin-dashboard-card flex min-w-0 items-center gap-3 rounded-[8px] border border-black/[.035] bg-white px-3 shadow-[0_4px_16px_rgba(28,39,54,.055)]">
        <span className={`grid size-10 shrink-0 place-items-center rounded-[10px] border ${tone === "green" ? "border-emerald-200 bg-[#dcf8ec] text-emerald-700" : tone === "red" ? "border-red-200 bg-[#ffe2e5] text-red-600" : tone === "blue" ? "border-blue-200 bg-[#dcecff] text-blue-700" : "border-slate-300 bg-[#e9edf2] text-slate-800"}`}><Icon size={20} strokeWidth={1.8} /></span>
        <span className="min-w-0"><strong className="block text-[23px] font-bold leading-6 tracking-[-.05em]">{value}</strong><small className="mt-1 block truncate text-[8px] text-black/55">{label}</small></span>
        <MiniTrend tone={tone} index={index} percentage={percentage} />
      </article>)}
    </section>

    <div className="grid gap-3 xl:h-[calc(100%-96px)] xl:min-h-0 xl:grid-cols-[minmax(0,2.15fr)_minmax(330px,1fr)]">
      <div className="grid min-w-0 gap-3 xl:min-h-0 xl:grid-rows-[minmax(0,1fr)_176px]">
        <FleetOverview cars={snapshot.cars} mutate={mutate} />
        <RecentReservations reservations={snapshot.reservations.slice(0, 4)} cars={snapshot.cars} />
      </div>
      <MaintenanceAlerts snapshot={snapshot} />
    </div>
  </div>;
}

function MiniTrend({ tone, index, percentage }: { tone: string; index: number; percentage: number }) {
  const color = tone === "green" ? "#16a66a" : tone === "blue" ? "#7890ad" : tone === "red" ? "#ef2941" : index === 4 ? "#16a66a" : "#ef2941";
  return <span className="ml-auto hidden h-14 w-14 shrink-0 flex-col items-end justify-between py-0.5 min-[1180px]:flex"><small className="text-[7px] font-semibold" style={{ color }}>{percentage}%</small><svg className="h-8 w-14" viewBox="0 0 56 28" aria-hidden="true"><defs><linearGradient id={`trend-${index}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={color} stopOpacity=".2"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs><path d="M1 25 C9 24 10 16 18 17 C27 19 29 8 38 9 C47 8 49 2 55 4 L55 28 L1 28Z" fill={`url(#trend-${index})`}/><path d="M1 25 C9 24 10 16 18 17 C27 19 29 8 38 9 C47 8 49 2 55 4" fill="none" stroke={color} strokeWidth="1.2"/></svg></span>;
}

function DashboardPanel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`admin-dashboard-card min-h-0 overflow-hidden rounded-[9px] border border-black/[.05] bg-white shadow-[0_5px_20px_rgba(28,39,54,.045)] ${className}`}><div className="flex h-10 shrink-0 items-center justify-between px-4"><h3 className="text-[13px] font-bold tracking-[-.025em]">{title}</h3>{action}</div>{children}</section>;
}

function FleetOverview({ cars, mutate }: { cars: AdminCar[]; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown> }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const filters = ["All", "Available", "Reserved", "Maintenance"];
  const normalizedQuery = query.trim().toLowerCase();
  const visible = cars.filter((car) => {
    const matchesFilter = filter === "All" || car.status === filter;
    const searchable = `${car.display_name} ${car.brand} ${car.model} ${car.plate_number}`.toLowerCase();
    return matchesFilter && searchable.includes(normalizedQuery);
  }).slice(0, 6);

  return <DashboardPanel
    title="Fleet Overview"
    className="flex flex-col pt-2"
    action={<div className="flex items-center gap-2">
      <label className="hidden h-8 w-40 items-center gap-2 rounded-lg border border-black/[.05] bg-[#f3f5f7] px-3 lg:flex">
        <Search size={13} className="shrink-0 text-black/45"/>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[9px] outline-none" placeholder="Search cars..."/>
      </label>
      <Link href="/admin/cars/new" className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--brand-red)] px-3.5 text-[9px] font-semibold text-white shadow-[0_5px_12px_rgba(177,18,38,.14)] transition hover:bg-[#c8172e]"><Plus size={12}/>Add New Car</Link>
    </div>}
  >
    <div className="no-scrollbar flex min-h-10 shrink-0 items-center gap-2 overflow-x-auto px-4">
      {filters.map((item) => {
        const count = item === "All" ? cars.length : cars.filter((car) => car.status === item).length;
        return <button key={item} onClick={() => setFilter(item)} className={`h-6 shrink-0 rounded-md border px-3 text-[8px] font-medium transition ${filter === item ? "border-black bg-black text-white shadow-sm" : "border-black/[.04] bg-[#f4f5f6] text-black/55 hover:border-black/10 hover:text-black"}`}>{item} <span className="ml-0.5 opacity-70">({count})</span></button>;
      })}
    </div>
    <div className="min-h-0 flex-1 overflow-auto border-t border-black/[.045]">
      <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-[#f7f8f9] text-[7px] uppercase tracking-[.06em] text-black/45">
          <tr className="h-7">
            <th className="w-[29%] px-4 font-medium">Car</th>
            <th className="w-[10%] px-2 font-medium">Model</th>
            <th className="w-[7%] px-2 font-medium">Year</th>
            <th className="w-[12%] px-2 font-medium">Mileage</th>
            <th className="w-[14%] px-2 font-medium">Rental status</th>
            <th className="w-[12%] px-2 font-medium">Condition</th>
            <th className="w-[8%] px-2 text-center font-medium">Website</th>
            <th className="w-[8%] px-2 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06]">
          {visible.map((car) => {
            const needsService = car.status === "Maintenance";
            const condition = needsService ? "Needs service" : car.mileage > 20000 ? "Good" : "Excellent";
            return <tr key={car.id} className="h-[52px] text-[9px] transition hover:bg-slate-50/80">
              <td className="px-4 py-1.5">
                <Link href={`/admin/cars/${car.id}`} className="flex min-w-0 items-center gap-3">
                  <span className="relative h-10 w-[70px] shrink-0 overflow-hidden rounded-md bg-slate-100 ring-1 ring-black/[.04]"><Image src={car.cover_image} alt="" fill className="object-cover" sizes="70px"/></span>
                  <span className="min-w-0"><strong className="block truncate text-[10px] font-semibold leading-4 text-[#17191c]">{car.display_name}</strong><small className="block truncate text-[7.5px] text-black/38">{car.plate_number}</small></span>
                </Link>
              </td>
              <td className="truncate px-2 font-medium text-black/65">{car.model}</td>
              <td className="px-2 text-black/55">{car.year}</td>
              <td className="px-2 tabular-nums text-black/55">{car.mileage.toLocaleString()} km</td>
              <td className="px-2"><StatusBadge status={car.status}/></td>
              <td className="px-2"><span className={`inline-flex rounded-full px-2.5 py-1 text-[7.5px] font-medium ${needsService ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>{condition}</span></td>
              <td className="px-2 text-center"><button aria-label={`${car.published ? "Hide" : "Publish"} ${car.display_name}`} onClick={() => mutate("/api/admin/cars", "PATCH", { id: car.id, published: car.published ? 0 : 1 }, car.published ? "Car hidden from website" : "Car published")} className={`relative h-[18px] w-8 rounded-full transition-colors ${car.published ? "bg-[var(--brand-red)]" : "bg-slate-300"}`}><i className={`absolute top-[3px] size-3 rounded-full bg-white shadow-sm transition-[left] ${car.published ? "left-[17px]" : "left-[3px]"}`}/></button></td>
              <td className="px-2"><div className="flex justify-center gap-1.5"><Link href={`/admin/cars/${car.id}`} aria-label={`Edit ${car.display_name}`} className="grid size-7 place-items-center rounded-full border border-black/[.04] bg-[#f2f4f6] text-black/55 transition hover:bg-black hover:text-white"><Pencil size={11}/></Link><button aria-label={`More actions for ${car.display_name}`} className="grid size-7 place-items-center rounded-full border border-black/[.04] bg-[#f2f4f6] text-black/55 transition hover:bg-black hover:text-white"><MoreVertical size={12}/></button></div></td>
            </tr>;
          })}
        </tbody>
      </table>
      {!visible.length ? <Empty compact title="No cars found" text="Try another filter or search term."/> : null}
    </div>
  </DashboardPanel>;
}

function MaintenanceAlerts({ snapshot }: { snapshot: AdminSnapshot }) {
  const items = [...snapshot.cars]
    .filter((car) => car.status !== "Coming Soon")
    .sort((first, second) => Number(second.status === "Maintenance") - Number(first.status === "Maintenance") || second.mileage - first.mileage)
    .slice(0, 6);
  return <DashboardPanel title="Maintenance Alerts" action={<Link href="/admin/maintenance" className="text-[9px] text-black/55 transition hover:text-black">View All</Link>} className="xl:h-full"><div className="divide-y divide-black/[.06] px-4">{items.length ? items.map((car) => {
    const urgent = car.status === "Maintenance";
    const dueSoon = !urgent && car.mileage >= 20000;
    const serviceLabel = urgent ? "Vehicle in maintenance" : dueSoon ? "Routine service due" : "Service inspection";
    const timingLabel = urgent ? "Attention" : dueSoon ? "Due soon" : car.mileage >= 10000 ? "In 1 week" : "In 2 weeks";
    const tone = urgent ? "red" : dueSoon ? "amber" : "blue";
    return <Link href={`/admin/cars/${car.id}`} key={car.id} className="group flex min-h-[66px] items-center gap-3 py-2.5"><span className={`grid size-9 shrink-0 place-items-center rounded-[9px] ${tone === "red" ? "bg-red-50 text-red-500" : tone === "amber" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"}`}><Wrench size={15} strokeWidth={1.9}/></span><span className="relative h-10 w-16 shrink-0 overflow-hidden rounded-[6px] bg-[#f2f3f4]"><Image src={car.cover_image} alt="" fill className="object-cover" sizes="64px"/></span><span className="min-w-0 flex-1 leading-[1.4]"><strong className="block truncate text-[9px] font-semibold">{car.display_name}</strong><small className="block truncate text-[7.5px] text-black/48">{serviceLabel}</small><small className="block truncate text-[7.5px] text-black/38">{car.mileage.toLocaleString()} km</small></span><span className={`shrink-0 rounded-full px-2.5 py-1 text-[7.5px] font-medium ${tone === "red" ? "bg-red-50 text-red-600" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-600"}`}>{timingLabel}</span><ChevronRight size={13} className="shrink-0 text-black/35 transition group-hover:translate-x-0.5 group-hover:text-black/65"/></Link>;
  }) : <Empty compact title="No maintenance alerts" text="Maintenance records will appear here."/>}</div></DashboardPanel>;
}

function RecentReservations({ reservations, cars }: { reservations: Reservation[]; cars: AdminCar[] }) {
  return <DashboardPanel title="Recent Reservations" action={<Link href="/admin/reservations" className="text-[9px] text-black/55">View All</Link>}><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-[#f6f7f9] text-[7px] uppercase text-black/42"><tr><th className="px-4 py-1.5 font-medium">Date</th><th className="font-medium">Client</th><th className="font-medium">Car</th><th className="font-medium">Pickup</th><th className="font-medium">Return</th><th className="font-medium">Status</th><th className="font-medium">Payment</th><th/></tr></thead><tbody className="divide-y divide-black/[.06]">{reservations.map((item) => <tr key={item.id} className="h-[30px] text-[8px]"><td className="px-4">{date(item.reservation_date)}</td><td>{item.customer_name}</td><td className="max-w-36 truncate">{cars.find((car) => car.id === item.car_id)?.display_name ?? item.car_name}</td><td className="text-black/45">10:00 AM</td><td className="text-black/45">10:00 AM</td><td><StatusBadge status={item.status}/></td><td><span className={`rounded-full px-2 py-1 ${item.payment_status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{item.payment_status}</span></td><td><MoreVertical size={12}/></td></tr>)}</tbody></table></div></DashboardPanel>;
}

function OperationsView({ section, snapshot, mutate }: { section: string; snapshot: AdminSnapshot; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown> }) {
  if (section === "clients") return <Panel title="Clients"><div className="divide-y divide-black/8">{Array.from(new Map(snapshot.reservations.map((item) => [item.email || item.phone, item])).values()).map((item) => <div key={item.id} className="flex items-center gap-4 py-4"><span className="grid size-10 place-items-center rounded-full bg-black text-xs text-white">{item.customer_name.split(" ").map((part) => part[0]).join("").slice(0,2)}</span><span><strong className="block text-sm">{item.customer_name}</strong><small className="text-black/45">{item.email || item.phone}</small></span></div>)}</div></Panel>;
  if (section === "maintenance") return <MaintenanceAlerts snapshot={snapshot}/>;
  if (section === "payments") return <Panel title="Payments & Deposits"><ReservationRows reservations={snapshot.reservations}/></Panel>;
  if (section === "website") return <Panel title="Website Inventory"><div className="divide-y divide-black/8">{snapshot.cars.map((car) => <div key={car.id} className="flex items-center gap-4 py-3"><span className="relative h-12 w-20 overflow-hidden"><Image src={car.cover_image} alt="" fill className="object-cover" sizes="80px"/></span><strong className="flex-1 text-sm">{car.display_name}</strong><button onClick={() => mutate("/api/admin/cars", "PATCH", { id: car.id, published: car.published ? 0 : 1 }, car.published ? "Car hidden" : "Car published")} className={`rounded-full px-3 py-1 text-[9px] ${car.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{car.published ? "Published" : "Hidden"}</button></div>)}</div></Panel>;
  return <div className="grid gap-5 sm:grid-cols-3"><Panel title="Fleet"><strong className="text-3xl">{snapshot.cars.length}</strong><p className="text-xs text-black/45">Vehicles managed</p></Panel><Panel title="Reservations"><strong className="text-3xl">{snapshot.reservations.length}</strong><p className="text-xs text-black/45">Reservation records</p></Panel><Panel title="Published"><strong className="text-3xl">{snapshot.cars.filter((car) => car.published).length}</strong><p className="text-xs text-black/45">Vehicles on website</p></Panel></div>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyDashboard({ snapshot }: { snapshot: AdminSnapshot }) {
  const counts = [
    ["Total Cars", snapshot.cars.length, CarFront, "All inventory"],
    ["Available Cars", snapshot.cars.filter((car) => car.status === "Available").length, Check, "Ready for clients"],
    ["Reserved Cars", snapshot.cars.filter((car) => car.status === "Reserved").length, Clock3, "Active reservations"],
    ["In Maintenance", snapshot.cars.filter((car) => car.status === "Maintenance").length, Wrench, "Service attention"],
  ] as const;
  const attention = snapshot.cars.filter((car) => ["Maintenance", "Unavailable"].includes(car.status) || !car.published);
  return <div className="space-y-6">
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{counts.map(([label, value, Icon, note], index) => <article key={label} className="group border border-white/9 bg-[#0e1011] p-5 transition hover:border-white/16"><div className="flex items-start justify-between"><span className={`grid size-10 place-items-center border ${index === 1 ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-300" : index === 2 ? "border-amber-400/20 bg-amber-400/8 text-amber-200" : index === 3 ? "border-sky-400/20 bg-sky-400/8 text-sky-200" : "border-white/10 bg-white/4 text-white/55"}`}><Icon size={18} /></span><span className="text-[9px] uppercase tracking-[.16em] text-white/24">0{index + 1}</span></div><strong className="mt-5 block text-3xl font-semibold tracking-[-.045em]">{value}</strong><span className="mt-1 block text-xs font-medium text-white/70">{label}</span><span className="mt-2 block text-[10px] text-white/28">{note}</span></article>)}</section>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.8fr]">
      <Panel title="Recently Added Cars" action={<Link href="/admin/cars" className="text-[9px] uppercase tracking-[.15em] text-white/40 hover:text-white">View all</Link>}>
        <div className="divide-y divide-white/7">{snapshot.cars.slice(0, 4).map((car) => <Link href={`/admin/cars/${car.id}`} key={car.id} className="flex items-center gap-4 py-4 first:pt-1 last:pb-1"><div className="relative size-14 overflow-hidden bg-white/5"><Image src={car.cover_image} alt="" fill className="object-cover" sizes="56px" /></div><span className="min-w-0 flex-1"><strong className="block truncate text-sm font-semibold">{car.display_name}</strong><span className="mt-1 block text-[10px] text-white/35">{car.year} · {car.mileage.toLocaleString()} km · Added {date(car.created_at)}</span></span><StatusBadge status={car.status} /></Link>)}</div>
      </Panel>
      <Panel title="Requires Attention"><div className="space-y-3">{attention.length ? attention.slice(0, 4).map((car) => <Link href={`/admin/cars/${car.id}`} key={car.id} className="flex items-center gap-3 border border-white/7 bg-white/[.02] p-3"><span className="grid size-9 place-items-center bg-orange-400/8 text-orange-200"><AlertTriangle size={16} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs">{car.display_name}</strong><span className="text-[10px] text-white/32">{car.status === "Maintenance" ? "Vehicle in maintenance" : !car.published ? "Hidden from website" : car.status}</span></span><ChevronRight size={13} className="text-white/25" /></Link>) : <Empty compact title="Everything looks good" text="No vehicles need attention." />}</div></Panel>
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.8fr]">
      <Panel title="Recent Reservations"><ReservationRows reservations={snapshot.reservations.slice(0, 4)} /></Panel>
      <Panel title="Recent Activity"><div className="space-y-4">{snapshot.history.slice(0, 5).map((item) => <div key={item.id} className="flex gap-3"><i className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--brand-red)] shadow-[0_0_8px_rgba(177,18,38,.6)]" /><span><strong className="block text-xs font-medium">{item.action}</strong><span className="mt-0.5 block text-[10px] leading-4 text-white/32">{item.details} · {date(item.created_at)}</span></span></div>)}</div></Panel>
    </div>
  </div>;
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="border border-white/9 bg-[#0e1011] p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-semibold tracking-[-.01em]">{title}</h3>{action}</div>{children}</section>;
}

function Empty({ title, text, compact = false }: { title: string; text: string; compact?: boolean }) {
  return <div className={`grid place-items-center text-center ${compact ? "py-6" : "py-14"}`}><span className="grid size-10 place-items-center rounded-full border border-white/8 bg-white/3 text-white/25"><FileText size={17} /></span><strong className="mt-3 text-xs">{title}</strong><p className="mt-1 text-[10px] text-white/30">{text}</p></div>;
}

function CarsTable({ cars, mutate, confirm, setModal }: { cars: AdminCar[]; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown>; confirm: (modal: Extract<Modal, { type: "confirm" }>) => void; setModal: (modal: Modal) => void }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const filters = ["All", ...carStatuses, "Hidden"];
  const visible = useMemo(() => cars.filter((car) => {
    const matchesFilter = filter === "All" || (filter === "Hidden" ? !car.published : car.status === filter);
    const haystack = `${car.display_name} ${car.brand} ${car.model} ${car.owner_name} ${car.owner_phone} ${car.plate_number} ${car.vin}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [cars, filter, query]);

  function setStatus(car: AdminCar, status: CarStatus) {
    confirm({ type: "confirm", title: `Mark as ${status}?`, message: `${car.display_name} will be updated across the admin and public inventory.`, confirm: `Mark ${status}`, action: () => mutate("/api/admin/cars", "PATCH", { id: car.id, status }, `Car marked ${status.toLowerCase()}`) });
  }

  return <section>
    <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/8">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`relative shrink-0 px-3 pb-3 text-[9px] font-semibold uppercase tracking-[.12em] ${filter === item ? "text-white after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-[var(--brand-red)]" : "text-white/32 hover:text-white/65"}`}>{item}<span className="ml-1.5 text-white/20">{item === "All" ? cars.length : item === "Hidden" ? cars.filter((car) => !car.published).length : cars.filter((car) => car.status === item).length}</span></button>)}</div>
      <label className="flex h-11 min-w-72 items-center gap-3 border border-white/10 bg-[#0e1011] px-4"><Search size={15} className="text-white/28" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search car, owner, VIN or plate" className="w-full bg-transparent text-xs outline-none placeholder:text-white/24" /><SlidersHorizontal size={14} className="text-white/25" /></label>
    </div>
    <div className="overflow-visible border border-white/9 bg-[#0e1011]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-270 border-collapse text-left">
          <thead><tr className="border-b border-white/8 bg-white/[.018] text-[9px] uppercase tracking-[.14em] text-white/30"><th className="px-5 py-4 font-medium">Vehicle</th><th className="px-4 py-4 font-medium">Owner</th><th className="px-4 py-4 font-medium">Mileage</th><th className="px-4 py-4 font-medium">Sale price</th><th className="px-4 py-4 font-medium">Status</th><th className="px-4 py-4 font-medium">Visibility</th><th className="px-4 py-4 font-medium">Added</th><th className="px-4 py-4" /></tr></thead>
          <tbody className="divide-y divide-white/7">{visible.map((car) => <tr key={car.id} className="group hover:bg-white/[.018]">
            <td className="px-5 py-3"><Link href={`/admin/cars/${car.id}`} className="flex items-center gap-3"><div className="relative h-12 w-18 shrink-0 overflow-hidden bg-white/5"><Image src={car.cover_image} alt="" fill className="object-cover transition group-hover:scale-105" sizes="72px" /></div><span><strong className="block text-xs font-semibold">{car.display_name}</strong><span className="mt-1 block text-[10px] text-white/30">{car.year} · {car.plate_number}</span></span></Link></td>
            <td className="px-4 py-3"><span className="block text-xs text-white/72">{car.owner_name}</span><span className="mt-1 block text-[10px] text-white/28">{car.ownership_type}</span></td>
            <td className="px-4 py-3 text-xs text-white/52">{car.mileage.toLocaleString()} km</td><td className="px-4 py-3 text-xs font-semibold">{money(car.minimum_price, car.currency)}</td><td className="px-4 py-3"><StatusBadge status={car.status} /></td>
            <td className="px-4 py-3"><span className={`inline-flex items-center gap-2 text-[10px] ${car.published ? "text-white/60" : "text-white/28"}`}>{car.published ? <Eye size={13} /> : <EyeOff size={13} />}{car.published ? "Published" : "Hidden"}</span></td><td className="px-4 py-3 text-[10px] text-white/35">{date(car.created_at)}</td>
            <td className="relative px-4 py-3"><button onClick={() => setMenu(menu === car.id ? null : car.id)} className="grid size-9 place-items-center border border-transparent text-white/38 hover:border-white/10 hover:bg-white/5 hover:text-white"><MoreHorizontal size={17} /></button>{menu === car.id ? <div className="absolute right-11 top-3 z-20 w-48 border border-white/12 bg-[#17191b] p-1.5 text-[10px] shadow-2xl"><Link href={`/admin/cars/${car.id}`} className="block px-3 py-2.5 hover:bg-white/5">View details</Link><button onClick={() => setStatus(car, "Available")} className="block w-full px-3 py-2.5 text-left hover:bg-white/5">Mark available</button><button onClick={() => setModal({ type: "reservation", car })} className="block w-full px-3 py-2.5 text-left hover:bg-white/5">Reserve car</button><button onClick={() => mutate("/api/admin/cars", "PATCH", { id: car.id, published: car.published ? 0 : 1 }, car.published ? "Car hidden from website" : "Car published")} className="block w-full px-3 py-2.5 text-left hover:bg-white/5">{car.published ? "Hide from website" : "Publish to website"}</button><button onClick={() => confirm({ type: "confirm", title: "Archive this car?", message: "The car will leave active rental inventory while its activity history is retained.", confirm: "Archive car", danger: true, action: () => mutate("/api/admin/cars", "DELETE", { id: car.id }, "Car archived") })} className="block w-full px-3 py-2.5 text-left text-red-300 hover:bg-red-400/8">Delete</button></div> : null}</td>
          </tr>)}</tbody>
        </table>
      </div>
      {!visible.length ? <Empty title="No vehicles found" text="Try a different status or search term." /> : null}
    </div>
  </section>;
}

function Field({ label, name, type = "text", placeholder, required, defaultValue, children, className = "" }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string | number; children?: ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-2 block text-[9px] font-semibold uppercase tracking-[.14em] text-white/38">{label}{required ? <b className="ml-1 text-[var(--brand-red)]">*</b> : null}</span>{children ?? <input name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder} className="h-11 w-full border border-white/10 bg-white/[.025] px-3 text-xs outline-none transition placeholder:text-white/18 focus:border-white/28" />}</label>;
}

function SelectField({ label, name, options, required, defaultValue }: { label: string; name: string; options: readonly string[]; required?: boolean; defaultValue?: string }) {
  return <Field label={label} name={name} required={required}><span className="relative block"><select name={name} required={required} defaultValue={defaultValue} className="h-11 w-full appearance-none border border-white/10 bg-[#111315] px-3 text-xs outline-none focus:border-white/28">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-3.5 text-white/30" /></span></Field>;
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return <section className="border border-white/9 bg-[#0e1011]"><div className="flex gap-4 border-b border-white/8 px-5 py-5 sm:px-6"><span className="text-[10px] font-semibold text-[var(--brand-red)]">{number}</span><span><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-[10px] text-white/30">{description}</p></span></div><div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">{children}</div></section>;
}

function CarForm({ owners, mutate }: { owners: Owner[]; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown> }) {
  const router = useRouter();
  const [ownerMode, setOwnerMode] = useState<"existing" | "new">("existing");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [media, setMedia] = useState<string[]>(["/images/cars.png"]);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files);
    const previews = selected.map((file) => URL.createObjectURL(file));
    setMedia((current) => [...current.filter((item) => item !== "/images/cars.png"), ...previews]);
    const payload = new FormData(); selected.forEach((file) => payload.append("files", file));
    const response = await fetch("/api/admin/media", { method: "POST", body: payload });
    const result = await response.json() as { urls?: string[]; error?: string };
    if (!response.ok || !result.urls) { setError(result.error ?? "Image upload failed"); return; }
    setMedia((current) => current.map((item) => { const index = previews.indexOf(item); return index >= 0 ? result.urls![index] : item; }));
    previews.forEach(URL.revokeObjectURL);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    const input = Object.fromEntries(form.entries()) as Record<string, unknown>;
    try {
      if (ownerMode === "new") {
        const owner = await mutate("/api/admin/owners", "POST", { full_name: input.owner_full_name, phone: input.owner_phone, secondary_phone: input.secondary_phone, email: input.owner_email, address: input.owner_address, reference_number: input.reference_number, notes: input.owner_notes }, "Owner created") as { id: string };
        input.owner_id = owner.id;
      }
      input.published = form.has("published") ? 1 : 0; input.featured = form.has("featured") ? 1 : 0; input.new_arrival = form.has("new_arrival") ? 1 : 0;
      input.cover_image = media.find((item) => !item.startsWith("blob:")) ?? "/images/cars.png";
      input.gallery_images = media.filter((item) => !item.startsWith("blob:"));
      const result = await mutate("/api/admin/cars", "POST", input, "New vehicle added") as { id: string };
      router.push(`/admin/cars/${result.id}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save vehicle"); setSaving(false); }
  }

  return <form onSubmit={submit} className="space-y-5">
    <div className="flex items-start justify-between gap-4"><div><Link href="/admin/cars" className="mb-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[.16em] text-white/35 hover:text-white"><ArrowLeft size={13} />Back to inventory</Link><h2 className="text-2xl font-semibold tracking-[-.035em] sm:text-3xl">Add New Car</h2><p className="mt-1 text-sm text-white/35">Create a complete inventory record and control its public visibility.</p></div><button disabled={saving} className="hidden h-11 items-center gap-2 bg-[var(--brand-red)] px-5 text-[10px] font-semibold uppercase tracking-[.13em] sm:flex"><Check size={15} />{saving ? "Saving…" : "Save vehicle"}</button></div>
    {error ? <p className="border-l-2 border-red-500 bg-red-500/8 px-4 py-3 text-xs text-red-200">{error}</p> : null}
    <FormSection number="01" title="Vehicle Information" description="Identity, specifications, and presentation details.">
      <Field label="Car display name" name="display_name" required placeholder="e.g. Ferrari 296 GTB" /><Field label="Brand" name="brand" required placeholder="Ferrari" /><Field label="Model" name="model" required placeholder="296" /><Field label="Trim" name="trim" placeholder="GTB" /><Field label="Year" name="year" type="number" required defaultValue={2026} /><Field label="VIN / chassis number" name="vin" required placeholder="17-character VIN" /><Field label="Plate number" name="plate_number" required placeholder="D 12345" /><Field label="Mileage (km)" name="mileage" type="number" required defaultValue={0} /><SelectField label="Body type" name="body_type" options={["Coupe", "Convertible", "SUV", "Sedan", "Gran Coupe", "Roadster"]} /><SelectField label="Transmission" name="transmission" options={["Automatic", "DCT", "PDK", "Manual"]} /><SelectField label="Fuel type" name="fuel_type" options={["Petrol", "Hybrid", "Electric", "Diesel"]} /><Field label="Engine" name="engine" placeholder="V8 Biturbo" /><Field label="Horsepower" name="horsepower" type="number" placeholder="650" /><Field label="Exterior color" name="exterior_color" /><Field label="Interior color" name="interior_color" /><Field label="Description" name="description" className="sm:col-span-2 lg:col-span-3"><textarea name="description" rows={4} placeholder="Public vehicle description…" className="w-full border border-white/10 bg-white/[.025] px-3 py-3 text-xs leading-5 outline-none placeholder:text-white/18 focus:border-white/28" /></Field>
    </FormSection>
    <FormSection number="02" title="Owner Information" description="Connect this car to an existing owner or create a new record.">
      <div className="sm:col-span-2 lg:col-span-3"><div className="inline-flex border border-white/10 bg-black/20 p-1"><button type="button" onClick={() => setOwnerMode("existing")} className={`px-4 py-2 text-[9px] font-semibold uppercase tracking-[.13em] ${ownerMode === "existing" ? "bg-white/9 text-white" : "text-white/35"}`}>Existing owner</button><button type="button" onClick={() => setOwnerMode("new")} className={`px-4 py-2 text-[9px] font-semibold uppercase tracking-[.13em] ${ownerMode === "new" ? "bg-white/9 text-white" : "text-white/35"}`}>Create new</button></div></div>
      {ownerMode === "existing" ? <Field label="Select owner" name="owner_id" required className="sm:col-span-2"><span className="relative block"><select name="owner_id" required className="h-11 w-full appearance-none border border-white/10 bg-[#111315] px-3 text-xs outline-none">{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.full_name} · {owner.phone}</option>)}</select><ChevronDown size={13} className="absolute right-3 top-3.5 text-white/30" /></span></Field> : <><Field label="Owner full name" name="owner_full_name" required /><Field label="Phone number" name="owner_phone" required /><Field label="Secondary phone" name="secondary_phone" /><Field label="Email" name="owner_email" type="email" /><Field label="Address" name="owner_address" /><Field label="ID / reference number" name="reference_number" /><Field label="Owner notes" name="owner_notes" className="sm:col-span-2 lg:col-span-3" /></>}
      <SelectField label="Ownership type" name="ownership_type" options={["Veltro Owned", "Consignment", "Customer Vehicle", "Other"]} /><Field label="Date vehicle received" name="date_received" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
    </FormSection>
    <FormSection number="03" title="Financial Information" description="Confidential dealership data. Never exposed publicly.">
      <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2 border border-amber-300/10 bg-amber-300/[.035] px-3 py-2 text-[10px] text-amber-100/55"><ShieldCheck size={14} />Admin only · excluded from public inventory responses</div>
      <Field label="Vehicle acquisition cost" name="owner_price" type="number" /><Field label="Daily rental rate" name="listed_price" type="number" required /><Field label="Vehicle sale price" name="minimum_price" type="number" required /><SelectField label="Currency" name="currency" options={["AED", "USD", "EUR"]} defaultValue="AED" /><Field label="Weekly discount percentage" name="commission_percentage" type="number" /><Field label="Insurance cost" name="commission_amount" type="number" /><Field label="Maintenance expenses" name="internal_expenses" type="number" /><Field label="Internal notes" name="financial_notes" className="sm:col-span-2" />
    </FormSection>
    <FormSection number="04" title="Status & Website" description="Availability and public-site placement.">
      <SelectField label="Vehicle status" name="status" options={carStatuses} defaultValue="Available" /><Field label="Display order" name="display_order" type="number" defaultValue={snapshotOrder(owners)} />
      <div className="sm:col-span-2 lg:col-span-3 grid gap-3 sm:grid-cols-3">{[["published", "Published", "Visible on public inventory"], ["featured", "Featured Vehicle", "Eligible for featured sections"], ["new_arrival", "New Arrival", "Show new-arrival treatment"]].map(([name, label, help]) => <label key={name} className="flex cursor-pointer items-center gap-3 border border-white/9 bg-white/[.02] p-4"><input type="checkbox" name={name} defaultChecked={name === "published"} className="size-4 accent-[var(--brand-red)]" /><span><strong className="block text-xs">{label}</strong><span className="mt-1 block text-[9px] text-white/28">{help}</span></span></label>)}</div>
    </FormSection>
    <FormSection number="05" title="Media" description="Choose a cover image, arrange the gallery, and add optional video.">
      <div className="sm:col-span-2 lg:col-span-3"><label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-white/16 bg-white/[.018] px-5 py-9 text-center transition hover:border-white/30 hover:bg-white/[.03]"><Upload size={22} className="text-white/38" /><strong className="mt-3 text-xs">Drop vehicle images or browse</strong><span className="mt-1 text-[10px] text-white/28">JPG, PNG or WebP · Uploads preview before saving</span><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => addFiles(event.target.files)} /></label></div>
      <Field label="Or use image URL" name="image_url" className="sm:col-span-2"><span className="flex gap-2"><input id="car-image-url" placeholder="/images/vehicle.jpg" className="h-11 min-w-0 flex-1 border border-white/10 bg-white/[.025] px-3 text-xs outline-none" /><button type="button" onClick={() => { const input = document.getElementById("car-image-url") as HTMLInputElement; if (input.value) { setMedia((current) => [...current.filter((item) => item !== "/images/cars.png"), input.value]); input.value = ""; } }} className="border border-white/12 px-4 text-[9px] uppercase tracking-[.12em]">Add</button></span></Field><Field label="Video URL" name="video_url" placeholder="YouTube or Vimeo URL" />
      <div className="sm:col-span-2 lg:col-span-3"><p className="mb-3 text-[9px] uppercase tracking-[.14em] text-white/35">Gallery · first image is the cover</p><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">{media.map((item, index) => <div key={`${item}-${index}`} className="group relative aspect-4/3 overflow-hidden border border-white/10 bg-black"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(item).slice(1, -1)})` }} /><span className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[8px] uppercase tracking-[.1em]">{index === 0 ? "Cover" : index + 1}</span><div className="absolute inset-x-2 bottom-2 flex justify-end gap-1 opacity-0 transition group-hover:opacity-100"><button type="button" disabled={index === 0} onClick={() => setMedia((items) => items.map((value, i) => i === index - 1 ? item : i === index ? items[index - 1] : value))} className="grid size-7 place-items-center bg-black/75 text-xs disabled:opacity-30">←</button><button type="button" onClick={() => setMedia((items) => items.filter((_, i) => i !== index))} className="grid size-7 place-items-center bg-red-700/90"><Trash2 size={12} /></button></div></div>)}</div></div>
    </FormSection>
    <div className="flex items-center justify-end gap-3 border-t border-white/8 pt-5"><Link href="/admin/cars" className="px-5 py-3 text-[10px] uppercase tracking-[.13em] text-white/42">Cancel</Link><button disabled={saving} className="flex h-11 items-center gap-2 bg-[var(--brand-red)] px-6 text-[10px] font-semibold uppercase tracking-[.13em]"><Check size={15} />{saving ? "Saving…" : "Save vehicle"}</button></div>
  </form>;
}

function snapshotOrder(owners: Owner[]) { return Math.max(owners.reduce((sum, owner) => sum + Number(owner.vehicle_count), 0) + 1, 1); }

function CarDetails({ car, snapshot, mutate, confirm, setModal }: { car: AdminCar; snapshot: AdminSnapshot; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown>; confirm: (modal: Extract<Modal, { type: "confirm" }>) => void; setModal: (modal: Modal) => void }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Owner", "Reservation", "Media", "History"];
  const owner = snapshot.owners.find((item) => item.id === car.owner_id);
  const reservations = snapshot.reservations.filter((item) => item.car_id === car.id);
  const history = snapshot.history.filter((item) => item.car_id === car.id);
  const details = [["Brand", car.brand], ["Model", car.model], ["Trim", car.trim], ["Year", car.year], ["VIN / chassis", car.vin], ["Plate number", car.plate_number], ["Mileage", `${car.mileage.toLocaleString()} km`], ["Body type", car.body_type], ["Transmission", car.transmission], ["Fuel type", car.fuel_type], ["Engine", car.engine], ["Horsepower", `${car.horsepower} HP`], ["Exterior", car.exterior_color], ["Interior", car.interior_color]];
  return <div className="space-y-5">
    <Link href="/admin/cars" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[.16em] text-white/35 hover:text-white"><ArrowLeft size={13} />Back to inventory</Link>
    <section className="relative overflow-hidden border border-white/9 bg-[#0e1011]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(177,18,38,.15),transparent_34%)]" /><div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[15rem_1fr_auto]"><div className="relative h-44 overflow-hidden bg-black"><Image src={car.cover_image} alt={car.display_name} fill className="object-cover" sizes="240px" /></div><div className="self-center"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={car.status} /><span className="text-[9px] uppercase tracking-[.13em] text-white/30">{car.published ? "Published" : "Hidden"}</span>{car.featured ? <span className="text-[9px] uppercase tracking-[.13em] text-[var(--brand-red)]">Featured</span> : null}</div><h2 className="mt-4 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{car.display_name}</h2><p className="mt-2 text-xs text-white/38">{car.year} · {car.plate_number} · {car.mileage.toLocaleString()} km</p><strong className="mt-4 block text-xl">{money(car.minimum_price, car.currency)}</strong><span className="mt-1 block text-[9px] uppercase tracking-[.12em] text-white/30">Rental from {money(car.listed_price, car.currency)} / day</span></div><div className="flex flex-wrap content-start gap-2 lg:w-54 lg:justify-end"><button onClick={() => setModal({ type: "reservation", car })} className="h-10 bg-[var(--brand-red)] px-3 text-[9px] font-semibold uppercase tracking-[.12em]">Reserve rental</button><button onClick={() => mutate("/api/admin/cars", "PATCH", { id: car.id, published: car.published ? 0 : 1 }, car.published ? "Car hidden" : "Car published")} className="h-10 border border-white/12 px-3 text-[9px] uppercase tracking-[.12em]">{car.published ? "Hide" : "Publish"}</button><button onClick={() => confirm({ type: "confirm", title: "Archive this car?", message: "This removes the car from active showroom inventory without erasing its history.", confirm: "Archive car", danger: true, action: () => mutate("/api/admin/cars", "DELETE", { id: car.id }, "Car archived") })} className="grid size-10 place-items-center border border-red-400/15 text-red-300"><Trash2 size={14} /></button></div></div></section>
    <div className="no-scrollbar flex overflow-x-auto border-b border-white/8">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`relative shrink-0 px-5 pb-3 text-[9px] font-semibold uppercase tracking-[.14em] ${tab === item ? "text-white after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-[var(--brand-red)]" : "text-white/30"}`}>{item}</button>)}</div>
    {tab === "Overview" ? <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><Panel title="Vehicle Details"><div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{details.map(([label, value]) => <div key={String(label)} className="border-b border-white/6 pb-3"><span className="block text-[9px] uppercase tracking-[.13em] text-white/28">{label}</span><strong className="mt-1 block text-xs font-medium text-white/78">{value || "—"}</strong></div>)}</div><div className="mt-5"><span className="text-[9px] uppercase tracking-[.13em] text-white/28">Description</span><p className="mt-2 text-xs leading-6 text-white/52">{car.description || "No description provided."}</p></div></Panel><Panel title="Showroom Financials"><div className="mb-4 flex items-center gap-2 bg-amber-300/[.04] px-3 py-2 text-[9px] text-amber-100/45"><ShieldCheck size={13} />Admin only</div>{[["Acquisition cost", money(car.owner_price, car.currency)], ["Vehicle sale price", money(car.minimum_price, car.currency)], ["Daily rental rate", money(car.listed_price, car.currency)], ["Weekly discount", `${car.commission_percentage}%`], ["Insurance cost", money(car.commission_amount, car.currency)], ["Maintenance expenses", money(car.internal_expenses, car.currency)]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-white/7 py-3 text-xs"><span className="text-white/35">{label}</span><strong>{value}</strong></div>)}</Panel></div> : null}
    {tab === "Owner" ? <Panel title="Owner Record">{owner ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[["Full name", owner.full_name], ["Phone", owner.phone], ["Secondary phone", owner.secondary_phone], ["Email", owner.email], ["Address", owner.address], ["ID / reference", owner.reference_number], ["Ownership type", car.ownership_type], ["Vehicle received", date(car.date_received)]].map(([label, value]) => <div key={label}><span className="text-[9px] uppercase tracking-[.13em] text-white/28">{label}</span><strong className="mt-1 block text-xs font-medium">{value || "—"}</strong></div>)}</div> : <Empty title="Owner not found" text="This vehicle is not linked to an owner record." />}</Panel> : null}
    {tab === "Reservation" ? <Panel title="Reservation History" action={<button onClick={() => setModal({ type: "reservation", car })} className="text-[9px] uppercase tracking-[.14em] text-[var(--brand-red)]">+ New reservation</button>}>{reservations.length ? <ReservationRows reservations={reservations} /> : <Empty title="No reservations" text="This vehicle has no reservation records." />}</Panel> : null}
    {tab === "Media" ? <Panel title="Vehicle Media"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="relative aspect-video overflow-hidden border border-white/10"><Image src={car.cover_image} alt={car.display_name} fill className="object-cover" /><span className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[8px] uppercase">Cover</span></div><button className="grid aspect-video place-items-center border border-dashed border-white/14 text-white/35 hover:border-white/30"><span className="text-center"><ImagePlus size={20} className="mx-auto" /><span className="mt-2 block text-[9px] uppercase tracking-[.12em]">Add images</span></span></button></div>{car.video_url ? <a href={car.video_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs text-[var(--brand-red)]">Open vehicle video ↗</a> : null}</Panel> : null}
    {tab === "History" ? <Panel title="Activity History"><div className="space-y-5">{history.map((item) => <div key={item.id} className="grid grid-cols-[1rem_1fr_auto] gap-3"><span className="mt-1.5 size-2 rounded-full border-2 border-[var(--brand-red)]" /><span><strong className="block text-xs">{item.action}</strong><span className="mt-1 block text-[10px] text-white/35">{item.details} · {item.created_by}</span></span><span className="text-[9px] text-white/25">{date(item.created_at)}</span></div>)}</div></Panel> : null}
  </div>;
}

function ReservationRows({ reservations }: { reservations: Reservation[] }) {
  return reservations.length ? <div className="divide-y divide-white/7">{reservations.map((reservation) => <div key={reservation.id} className="grid gap-3 py-4 first:pt-1 last:pb-1 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center"><span><strong className="block text-xs">{reservation.car_name}</strong><span className="mt-1 block text-[10px] text-white/32">{reservation.customer_name} · {reservation.phone}</span></span><span className="text-[10px] text-white/35">Expires {date(reservation.expiry_date)}<b className="mt-1 block font-medium text-white/65">{money(reservation.deposit_amount, reservation.currency)} deposit</b></span><StatusBadge status={reservation.status} /></div>)}</div> : <Empty title="No reservations" text="There are no reservation records yet." compact />;
}

function ReservationsView({ reservations, cars, mutate, setModal }: { reservations: Reservation[]; cars: AdminCar[]; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown>; setModal: (modal: Modal) => void }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Confirmed", "Cancelled", "Completed", "Expired"];
  const visible = filter === "All" ? reservations : reservations.filter((item) => item.status === filter);
  return <section className="border border-white/9 bg-[#0e1011]"><div className="flex flex-col gap-3 border-b border-white/8 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="no-scrollbar flex overflow-x-auto">{statuses.map((item) => <button key={item} onClick={() => setFilter(item)} className={`px-3 py-2 text-[9px] font-semibold uppercase tracking-[.12em] ${filter === item ? "text-white" : "text-white/30"}`}>{item}</button>)}</div><button onClick={() => setModal({ type: "reservation" })} disabled={!cars.some((car) => car.status === "Available")} className="flex h-10 items-center justify-center gap-2 bg-[var(--brand-red)] px-4 text-[9px] font-semibold uppercase tracking-[.12em] disabled:opacity-40"><Plus size={13} />New reservation</button></div><div className="overflow-x-auto"><table className="w-full min-w-225 text-left"><thead><tr className="border-b border-white/8 text-[9px] uppercase tracking-[.13em] text-white/28"><th className="px-5 py-4">Car / Customer</th><th className="px-4 py-4">Reservation</th><th className="px-4 py-4">Deposit</th><th className="px-4 py-4">Expiry</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Actions</th></tr></thead><tbody className="divide-y divide-white/7">{visible.map((reservation) => <tr key={reservation.id}><td className="px-5 py-4"><strong className="block text-xs">{reservation.car_name}</strong><span className="mt-1 block text-[10px] text-white/32">{reservation.customer_name} · {reservation.phone}</span></td><td className="px-4 py-4 text-[10px] text-white/45">{date(reservation.reservation_date)}</td><td className="px-4 py-4"><strong className="block text-xs">{money(reservation.deposit_amount, reservation.currency)}</strong><span className="text-[9px] text-white/30">{reservation.payment_status}</span></td><td className="px-4 py-4 text-[10px] text-white/45">{date(reservation.expiry_date)}</td><td className="px-4 py-4"><StatusBadge status={reservation.status} /></td><td className="px-4 py-4"><div className="flex gap-2">{reservation.status === "Pending" ? <button onClick={() => mutate("/api/admin/reservations", "PATCH", { id: reservation.id, status: "Confirmed" }, "Reservation confirmed")} className="border border-emerald-400/20 px-2.5 py-1.5 text-[8px] uppercase text-emerald-200">Confirm</button> : null}{["Pending", "Confirmed"].includes(reservation.status) ? <button onClick={() => mutate("/api/admin/reservations", "PATCH", { id: reservation.id, status: "Cancelled", returnAvailable: true }, "Reservation cancelled; car available")} className="border border-red-400/15 px-2.5 py-1.5 text-[8px] uppercase text-red-200">Cancel</button> : null}</div></td></tr>)}</tbody></table></div>{!visible.length ? <Empty title="No matching reservations" text="Try another reservation status." /> : null}</section>;
}

function SettingsView({ userEmail, settings, mutate }: { userEmail: string; settings: Record<string, string>; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown> }) {
  const [saving, setSaving] = useState(false);
  return <div className="grid gap-5 xl:grid-cols-[1fr_.7fr]"><Panel title="Rental Business Settings"><form onSubmit={async (event) => { event.preventDefault(); setSaving(true); await mutate("/api/admin/settings", "PATCH", Object.fromEntries(new FormData(event.currentTarget).entries()), "Settings saved"); setSaving(false); }} className="grid gap-4 sm:grid-cols-2"><Field label="Business name" name="dealership_name" defaultValue={settings.dealership_name} /><Field label="Default currency" name="currency" defaultValue={settings.currency} /><Field label="Contact email" name="contact_email" type="email" defaultValue={settings.contact_email} /><Field label="Phone" name="phone" defaultValue={settings.phone} /><div className="sm:col-span-2"><button disabled={saving} className="h-10 bg-[var(--brand-red)] px-5 text-[9px] font-semibold uppercase tracking-[.13em] disabled:opacity-50">{saving ? "Saving…" : "Save settings"}</button></div></form></Panel><div className="space-y-5"><Panel title="Security"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-emerald-400/8 text-emerald-300"><ShieldCheck size={18} /></span><span><strong className="block text-xs">Protected admin session</strong><span className="text-[9px] text-white/30">Signed in as {userEmail}</span></span></div><p className="mt-4 border-t border-white/7 pt-4 text-[10px] leading-5 text-white/35">Admin routes and all write operations are verified server-side. Confidential fields are excluded from the public inventory query.</p></Panel><Panel title="Data"><div className="space-y-3 text-xs"><div className="flex justify-between"><span className="text-white/35">Database</span><strong>SQLite relational store</strong></div><div className="flex justify-between"><span className="text-white/35">Activity log</span><strong>Enabled</strong></div><div className="flex justify-between"><span className="text-white/35">Public field isolation</span><strong className="text-emerald-300">Active</strong></div></div></Panel></div></div>;
}

function ModalView({ modal, setModal, mutate, cars, busy }: { modal: Exclude<Modal, null>; setModal: (modal: Modal) => void; mutate: (url: string, method: string, body?: unknown, success?: string) => Promise<unknown>; cars: AdminCar[]; busy: boolean }) {
  async function submit(event: FormEvent<HTMLFormElement>, kind: "reservation" | "owner") {
    event.preventDefault();
    const form = new FormData(event.currentTarget); const input = Object.fromEntries(form.entries());
    try {
      if (kind === "reservation") await mutate("/api/admin/reservations", "POST", input, "Reservation created");
      if (kind === "owner") await mutate("/api/admin/owners", "POST", input, "Owner created");
      setModal(null);
    } catch (error) { window.alert(error instanceof Error ? error.message : "Request failed"); }
  }
  const availableCars = cars.filter((car) => car.status === "Available" || (modal.type === "reservation" && modal.car?.id === car.id));
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/78 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><button className="absolute inset-0" onClick={() => !busy && setModal(null)} aria-label="Close dialog" /><section className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto border border-white/12 bg-[#101214] p-5 shadow-[0_30px_100px_rgba(0,0,0,.75)] sm:p-7"><button onClick={() => setModal(null)} className="absolute right-4 top-4 grid size-9 place-items-center border border-white/10 text-white/40 hover:text-white"><X size={16} /></button>
    {modal.type === "confirm" ? <div><span className={`grid size-11 place-items-center ${modal.danger ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-200"}`}>{modal.danger ? <Trash2 size={19} /> : <AlertTriangle size={19} />}</span><h2 className="mt-5 text-xl font-semibold tracking-[-.03em]">{modal.title}</h2><p className="mt-2 max-w-md text-xs leading-6 text-white/42">{modal.message}</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setModal(null)} className="h-10 px-4 text-[9px] uppercase tracking-[.13em] text-white/40">Cancel</button><button disabled={busy} onClick={async () => { try { await modal.action(); setModal(null); } catch (error) { window.alert(error instanceof Error ? error.message : "Request failed"); } }} className={`h-10 px-5 text-[9px] font-semibold uppercase tracking-[.13em] ${modal.danger ? "bg-red-700" : "bg-[var(--brand-red)]"}`}>{busy ? "Working…" : modal.confirm}</button></div></div> : null}
    {modal.type === "reservation" ? <form onSubmit={(event) => submit(event, "reservation")}><ModalHeading eyebrow="New reservation" title="Reserve a Vehicle" text="An active reservation blocks conflicting holds for the same car." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Vehicle" name="car_id" required className="sm:col-span-2"><span className="relative block"><select name="car_id" defaultValue={modal.car?.id} className="h-11 w-full appearance-none border border-white/10 bg-[#111315] px-3 text-xs">{availableCars.map((car) => <option key={car.id} value={car.id}>{car.display_name}</option>)}</select><ChevronDown size={13} className="absolute right-3 top-3.5 text-white/30" /></span></Field><Field label="Customer full name" name="customer_name" required /><Field label="Phone" name="phone" required /><Field label="Email" name="email" type="email" /><Field label="Reservation date" name="reservation_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /><Field label="Deposit amount" name="deposit_amount" type="number" defaultValue={0} /><SelectField label="Currency" name="currency" options={["AED", "USD", "EUR"]} /><SelectField label="Payment status" name="payment_status" options={["Unpaid", "Paid", "Partial", "Refunded"]} /><Field label="Reservation expiry" name="expiry_date" type="date" required defaultValue={new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)} /><SelectField label="Reservation status" name="status" options={["Pending", "Confirmed"]} defaultValue="Pending" /><Field label="Notes" name="notes" className="sm:col-span-2" /></div><ModalActions busy={busy} submit="Create reservation" onCancel={() => setModal(null)} /></form> : null}
    {modal.type === "owner" ? <form onSubmit={(event) => submit(event, "owner")}><ModalHeading eyebrow="Owner records" title="Add New Owner" text="Create one owner record and associate multiple vehicles without duplication." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Full name" name="full_name" required /><Field label="Phone" name="phone" required /><Field label="Secondary phone" name="secondary_phone" /><Field label="Email" name="email" type="email" /><Field label="Address" name="address" /><Field label="ID / reference" name="reference_number" /><Field label="Notes" name="notes" className="sm:col-span-2" /></div><ModalActions busy={busy} submit="Create owner" onCancel={() => setModal(null)} /></form> : null}
  </section></div>;
}

function ModalHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="pr-10"><p className="text-[9px] font-semibold uppercase tracking-[.18em] text-[var(--brand-red)]">{eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em]">{title}</h2><p className="mt-2 text-xs leading-5 text-white/38">{text}</p></div>; }
function ModalActions({ busy, submit, onCancel }: { busy: boolean; submit: string; onCancel: () => void }) { return <div className="mt-7 flex justify-end gap-3 border-t border-white/8 pt-5"><button type="button" onClick={onCancel} className="h-10 px-4 text-[9px] uppercase tracking-[.13em] text-white/38">Cancel</button><button disabled={busy} className="h-10 bg-[var(--brand-red)] px-5 text-[9px] font-semibold uppercase tracking-[.13em] disabled:opacity-50">{busy ? "Saving…" : submit}</button></div>; }
