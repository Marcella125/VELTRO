"use client";

import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { assetPath } from "@/lib/asset-path";
import { readStoredCart, writeStoredCart } from "@/lib/store-cart";

export type StoreCategory = "All" | "Accessories" | "Interior" | "Exterior" | "Apparel";

type StoreProduct = {
  id: string;
  name: string;
  category: Exclude<StoreCategory, "All">;
  image: string;
  alternateImage?: string;
  price: number;
  imageSize?: string;
  imagePosition?: string;
  sizes?: readonly string[];
};

type CartItem = {
  product: StoreProduct;
  quantity: number;
  size: string;
};

type StoreStep = "shop" | "cart" | "checkout";
type FormErrors = Partial<Record<"fullName" | "phone" | "deliveryArea", string>>;

const whatsappNumber = "96170335113";
const deliveryFee = 4;

const products: readonly StoreProduct[] = [
  { id: "leather-jacket", name: "Veltro Leather Jacket", category: "Apparel", image: "/images/clothes shop/leather jacket.png", alternateImage: "/images/clothes shop/leather back.png", imageSize: "contain", price: 80, sizes: ["S", "M", "L", "XL"] },
  { id: "racing-jacket", name: "Veltro Racing Jacket", category: "Apparel", image: "/images/clothes shop/racing jacket.png", alternateImage: "/images/clothes shop/racing back.png", imageSize: "contain", price: 85, sizes: ["S", "M", "L", "XL"] },
  { id: "cotton-jacket", name: "Veltro Cotton Jacket", category: "Apparel", image: "/images/clothes shop/cotton front.png", alternateImage: "/images/clothes shop/cotton back.png", imageSize: "contain", price: 60, sizes: ["S", "M", "L", "XL"] },
  { id: "hoodie", name: "Veltro Hoodie", category: "Apparel", image: "/images/clothes shop/hoodie.png", imageSize: "contain", price: 50, sizes: ["S", "M", "L", "XL"] },
  { id: "apex-hoodie", name: "Veltro V2 Hoodie", category: "Apparel", image: "/images/clothes shop/APEX hoodie front.png", alternateImage: "/images/clothes shop/APEX hoodie back.png", imageSize: "contain", price: 55, sizes: ["S", "M", "L", "XL"] },
  { id: "sweatshirt", name: "Veltro Sweatshirt", category: "Apparel", image: "/images/clothes shop/sweatshirt.png", imageSize: "contain", price: 50, sizes: ["S", "M", "L", "XL"] },
  { id: "t-shirt", name: "Veltro T-Shirt", category: "Apparel", image: "/images/clothes shop/T-Shirt.png", alternateImage: "/images/clothes shop/T-Shirt Back.png", imageSize: "contain", price: 40, sizes: ["S", "M", "L", "XL"] },
  { id: "helmet", name: "Veltro Racing Helmet", category: "Accessories", image: "/images/clothes shop/helmet.png", imageSize: "contain", price: 150, sizes: ["One size"] },
  { id: "gloves", name: "Veltro Racing Gloves", category: "Accessories", image: "/images/clothes shop/gloves.png", imageSize: "contain", price: 70, sizes: ["One size"] },
  { id: "cap", name: "Veltro Cap", category: "Accessories", image: "/images/clothes shop/cap.png", imageSize: "62%", price: 10, sizes: ["One size"] },
  { id: "socks", name: "Veltro Socks", category: "Apparel", image: "/images/clothes shop/socks.png", imageSize: "62%", price: 10, sizes: ["S/M", "L/XL"] },
  { id: "beanie", name: "Veltro Beanie", category: "Accessories", image: "/images/clothes shop/bonne.png", imageSize: "62%", price: 10, sizes: ["One size"] },
];

type StoreModalProps = {
  initialCategory: StoreCategory;
  initialStep?: StoreStep;
  onClose: () => void;
};

function ProductArtwork({ product, compact = false, image = product.image }: { product: StoreProduct; compact?: boolean; image?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 bg-no-repeat transition duration-500 ${compact ? "" : "group-hover:scale-[1.04]"}`}
      style={{
        backgroundImage: `url("${assetPath(image)}")`,
        backgroundPosition: product.imagePosition ?? "center",
        backgroundSize: product.imageSize ?? "contain",
      }}
    />
  );
}

export function StoreModal({ initialCategory, initialStep = "shop", onClose }: StoreModalProps) {
  const visibleProducts = initialCategory === "All"
    ? products
    : products.filter((product) => product.category === initialCategory);
  const [step, setStep] = useState<StoreStep>(initialStep);
  const [cart, setCart] = useState<CartItem[]>(() => readStoredCart().flatMap((line) => {
    const product = products.find((candidate) => candidate.id === line.productId);
    if (!product) return [];
    return [{
      product,
      size: line.size,
      quantity: Math.max(1, Math.min(10, Math.round(line.quantity))),
    }];
  }));
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [alternateViews, setAlternateViews] = useState<Record<string, boolean>>({});
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const panelRef = useRef<HTMLDivElement>(null);

  useOverlayBehavior(true, onClose);

  useEffect(() => {
    writeStoredCart(cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      size: item.size,
    })));
  }, [cart]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const cartTotal = cart.length ? cartSubtotal + deliveryFee : 0;

  const goToStep = (nextStep: StoreStep) => {
    setStep(nextStep);
    window.requestAnimationFrame(() => panelRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const addToCart = (product: StoreProduct) => {
    const size = selectedSizes[product.id] ?? product.sizes?.[0] ?? "";
    setCart((current) => {
      const existingIndex = current.findIndex((item) => item.product.id === product.id && item.size === size);
      if (existingIndex === -1) return [...current, { product, quantity: 1, size }];
      return current.map((item, index) => index === existingIndex
        ? { ...item, quantity: Math.min(10, item.quantity + 1) }
        : item);
    });
  };

  const updateQuantity = (index: number, change: number) => {
    setCart((current) => current
      .map((item, itemIndex) => itemIndex === index
        ? { ...item, quantity: Math.max(0, Math.min(10, item.quantity + change)) }
        : item)
      .filter((item) => item.quantity > 0));
  };

  const removeFromCart = (index: number) => {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Enter a valid phone number.";
    if (deliveryArea.trim().length < 2) nextErrors.deliveryArea = "Enter your delivery area.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length || !validate()) return;

    const orderLines = cart.flatMap((item, index) => [
      `${index + 1}. ${item.product.name} — $${item.product.price}`,
      `   Quantity: ${item.quantity}${item.size ? ` | Size: ${item.size}` : ""} | Subtotal: $${item.product.price * item.quantity}`,
    ]);
    const message = [
      "NEW VELTRO STORE ORDER",
      "",
      `Customer: ${fullName.trim()}`,
      `Phone: ${phone.trim()}`,
      `Delivery area: ${deliveryArea.trim()}`,
      "",
      "ITEMS",
      ...orderLines,
      "",
      `Total quantity: ${cartCount}`,
      `Subtotal: $${cartSubtotal}`,
      `Delivery fee: $${deliveryFee}`,
      `Order total: $${cartTotal}`,
      "",
      "Notes:",
      notes.trim() || "None",
      "",
      "Please confirm availability, price, and delivery details.",
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const inputClassName = "mt-2 h-11 w-full rounded-lg border border-white/12 bg-white/[0.045] px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d7ff21]/70";
  const errorClassName = "mt-1.5 block text-xs normal-case tracking-normal text-red-300";

  return (
    <div onMouseDown={handleBackdropClick} className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 flex items-stretch justify-center bg-black sm:top-[4.75rem]" role="dialog" aria-modal="true" aria-label="Veltro store">
      <div ref={panelRef} className="store-ui no-scrollbar relative max-h-full w-full overflow-y-auto bg-black">
        {step === "shop" ? (
          <section aria-label="Store items" className="mx-auto w-full max-w-[92rem] p-5 sm:p-7 lg:p-9">
            <div className="sticky top-3 z-20 mb-5 flex justify-end pointer-events-none">
              <button type="button" onClick={() => goToStep("cart")} className="pointer-events-auto flex h-11 items-center gap-2 rounded-full border border-[#d7ff21]/55 bg-[#090A0B]/92 px-4 text-sm font-bold uppercase tracking-[0.1em] text-[#d7ff21] shadow-[0_14px_38px_rgba(0,0,0,.55),0_0_28px_rgba(215,255,33,.1),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#d7ff21] hover:text-black">
                <ShoppingBag size={16} /> Cart <span className="grid min-w-5 place-items-center rounded-full bg-[#d7ff21] px-1.5 py-0.5 text-xs text-black">{cartCount}</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const size = selectedSizes[product.id] ?? product.sizes?.[0] ?? "";
                const inCart = cart.filter((item) => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <article key={product.id} className="group overflow-hidden bg-transparent text-white transition duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#FEFDFE]">
                      <ProductArtwork product={product} image={alternateViews[product.id] && product.alternateImage ? product.alternateImage : product.image} />
                      {inCart ? <span className="absolute right-3 top-3 grid min-w-7 place-items-center rounded-full bg-[#d7ff21] px-2 py-1 text-xs font-extrabold text-black">{inCart}</span> : null}
                      {product.alternateImage ? (
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 rounded-full border border-black/10 bg-black/75 p-1 shadow-lg backdrop-blur-md" aria-label={`${product.name} image view`}>
                          {[false, true].map((showBack) => {
                            const selected = Boolean(alternateViews[product.id]) === showBack;
                            return <button key={showBack ? "back" : "front"} type="button" onClick={() => setAlternateViews((current) => ({ ...current, [product.id]: showBack }))} aria-pressed={selected} className={`rounded-full px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] transition ${selected ? "bg-[#d7ff21] text-black" : "text-white/65 hover:text-white"}`}>{showBack ? "Back" : "Front"}</button>;
                          })}
                        </div>
                      ) : null}
                    </div>
                    <div className="py-4 sm:py-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold uppercase leading-tight tracking-[-0.025em] text-white">{product.name}</h3>
                        <p className="shrink-0 text-lg font-extrabold leading-none text-white">${product.price}</p>
                      </div>
                      {product.sizes ? (
                        <div className="mt-4">
                          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/45">{product.sizes.length === 1 ? "Size" : "Select size"}</p>
                          <div className={`mt-2 grid gap-2 ${product.sizes.length === 2 ? "grid-cols-2" : "grid-cols-4"}`} role="radiogroup" aria-label={`${product.name} size`}>
                            {product.sizes.map((option) => {
                              const selected = size === option;
                              return <button key={option} type="button" role="radio" aria-checked={selected} onClick={() => setSelectedSizes((current) => ({ ...current, [product.id]: option }))} className={`h-9 rounded-lg border text-xs font-bold transition ${selected ? "border-[#d7ff21] bg-[#d7ff21] text-black" : "border-white/15 bg-white/[0.035] text-white/60 hover:border-white/35 hover:text-white"}`}>{option}</button>;
                            })}
                          </div>
                        </div>
                      ) : null}
                      <button type="button" onClick={() => addToCart(product)} className="mt-4 h-10 w-full rounded-lg bg-[#d7ff21] text-sm font-extrabold uppercase tracking-[0.12em] text-black shadow-[0_8px_22px_rgba(160,195,0,.22)] transition hover:-translate-y-0.5 hover:bg-white">Add to cart</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {step === "cart" ? (
          <section aria-labelledby="cart-title" className="mx-auto min-h-[32rem] max-w-4xl p-5 sm:p-8 lg:p-10">
            <button type="button" onClick={() => goToStep("shop")} className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:text-[#d7ff21]">Back to shop</button>
            <div className="mt-5 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff21]">Your selection</p><h2 id="cart-title" className="mt-2 text-3xl font-extrabold uppercase tracking-[-0.05em] text-white">Shopping cart</h2></div>
              <div className="text-right"><span className="block text-sm text-white/45">{cartCount} {cartCount === 1 ? "item" : "items"}</span><strong className="mt-1 block text-lg text-[#d7ff21]">${cartTotal}</strong></div>
            </div>

            {cart.length ? (
              <div className="mt-5 space-y-3">
                {cart.map((item, index) => (
                  <article key={`${item.product.id}-${item.size}`} className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025))] p-3 shadow-[0_14px_35px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.06)] sm:grid-cols-[6.5rem_1fr_auto] sm:items-center sm:p-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-white/[0.035]"><ProductArtwork product={item.product} compact /></div>
                    <div className="min-w-0"><h3 className="truncate text-base font-extrabold uppercase text-white">{item.product.name}</h3><p className="mt-1 text-sm font-semibold text-[#d7ff21]">${item.product.price * item.quantity}</p>{item.size ? <p className="mt-1 text-sm text-white/45">Size: {item.size}</p> : null}<button type="button" onClick={() => removeFromCart(index)} className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-white/40 transition hover:text-red-300"><Trash2 size={13} /> Remove</button></div>
                    <div className="col-span-2 flex h-10 items-center justify-between rounded-lg border border-white/12 bg-white/[0.035] px-1 sm:col-span-1 sm:w-32">
                      <button type="button" onClick={() => updateQuantity(index, -1)} aria-label={`Decrease ${item.product.name} quantity`} className="grid size-8 place-items-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"><Minus size={14} /></button>
                      <strong className="text-sm text-white">{item.quantity}</strong>
                      <button type="button" onClick={() => updateQuantity(index, 1)} aria-label={`Increase ${item.product.name} quantity`} className="grid size-8 place-items-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"><Plus size={14} /></button>
                    </div>
                  </article>
                ))}
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm">
                  <div className="flex items-center justify-between text-white/55"><span>Subtotal</span><span>${cartSubtotal}</span></div>
                  <div className="mt-2 flex items-center justify-between text-white/55"><span>Delivery fee</span><span>${deliveryFee}</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3"><strong className="uppercase tracking-[0.08em] text-white">Total</strong><strong className="text-lg text-[#d7ff21]">${cartTotal}</strong></div>
                </div>
                <button type="button" onClick={() => goToStep("checkout")} className="mt-6 h-12 w-full rounded-lg bg-[#d7ff21] text-sm font-extrabold uppercase tracking-[0.12em] text-black transition hover:bg-white">Order now</button>
              </div>
            ) : (
              <div className="grid min-h-64 place-items-center text-center"><div><ShoppingBag size={28} className="mx-auto text-white/25" /><p className="mt-3 text-base text-white/55">Your cart is empty.</p><button type="button" onClick={() => goToStep("shop")} className="mt-4 h-10 rounded-lg border border-white/15 px-5 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:border-[#d7ff21] hover:text-[#d7ff21]">Browse items</button></div></div>
            )}
          </section>
        ) : null}

        {step === "checkout" ? (
          <section aria-labelledby="checkout-title" className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
            <button type="button" onClick={() => goToStep("cart")} className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:text-[#d7ff21]">Back to cart</button>
            <div className="mt-5 grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:gap-10">
              <aside>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff21]">Order summary</p>
                <h2 id="checkout-title" className="mt-2 text-3xl font-extrabold uppercase tracking-[-0.05em] text-white">Your order</h2>
                <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025))] px-4 shadow-[0_18px_45px_rgba(0,0,0,.32),inset_0_1px_0_rgba(255,255,255,.06)]">
                  {cart.map((item) => <div key={`${item.product.id}-${item.size}`} className="flex items-start justify-between gap-4 py-4 text-sm"><div><strong className="text-white">{item.product.name}</strong>{item.size ? <span className="mt-1 block text-white/40">Size: {item.size}</span> : null}<span className="mt-1 block text-white/40">${item.product.price} × {item.quantity}</span></div><strong className="shrink-0 text-[#d7ff21]">${item.product.price * item.quantity}</strong></div>)}
                  <div className="flex items-center justify-between py-3 text-sm text-white/55"><span>Subtotal</span><span>${cartSubtotal}</span></div>
                  <div className="flex items-center justify-between py-3 text-sm text-white/55"><span>Delivery fee</span><span>${deliveryFee}</span></div>
                  <div className="flex items-center justify-between py-4 text-base"><strong className="uppercase tracking-[0.08em] text-white">Total</strong><strong className="text-xl text-[#d7ff21]">${cartTotal}</strong></div>
                </div>
                <p className="mt-3 text-sm text-white/40">Delivery details are confirmed by our team on WhatsApp.</p>
              </aside>

              <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.07),rgba(0,0,0,.18))] p-5 shadow-[0_22px_55px_rgba(0,0,0,.38),inset_0_1px_0_rgba(255,255,255,.06)] sm:p-6">
                <div className="flex items-center gap-3 rounded-xl border border-[#d7ff21]/20 bg-[#d7ff21]/[0.055] p-3 text-sm text-white/65"><Check size={16} className="shrink-0 text-[#d7ff21]" /> Complete your details to send this order on WhatsApp.</div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Full name *<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" className={inputClassName} aria-invalid={Boolean(errors.fullName)} />{errors.fullName ? <span className={errorClassName}>{errors.fullName}</span> : null}</label>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Phone number *<input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" className={inputClassName} aria-invalid={Boolean(errors.phone)} />{errors.phone ? <span className={errorClassName}>{errors.phone}</span> : null}</label>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/55 sm:col-span-2">Delivery area *<input value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value)} autoComplete="address-level2" placeholder="City or area" className={inputClassName} aria-invalid={Boolean(errors.deliveryArea)} />{errors.deliveryArea ? <span className={errorClassName}>{errors.deliveryArea}</span> : null}</label>
                  <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/55 sm:col-span-2">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Delivery timing or special request" className="mt-2 w-full resize-none rounded-lg border border-white/12 bg-white/[0.045] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-[#d7ff21]/70" /></label>
                </div>
                <button type="submit" className="mt-5 h-12 w-full rounded-lg bg-[#d7ff21] text-sm font-extrabold uppercase tracking-[0.1em] text-black transition hover:bg-white">Order now</button>
              </form>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
