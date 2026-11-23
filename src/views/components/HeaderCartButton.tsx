"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredCartCount, STORE_CART_EVENT, STORE_CART_KEY } from "@/lib/store-cart";

type HeaderCartButtonProps = {
  onClick: () => void;
  className?: string;
};

export function HeaderCartButton({ onClick, className = "" }: HeaderCartButtonProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(getStoredCartCount());
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORE_CART_KEY) refresh();
    };

    refresh();
    window.addEventListener(STORE_CART_EVENT, refresh);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(STORE_CART_EVENT, refresh);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open shopping cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ""}`}
      className={`relative grid size-8 shrink-0 place-items-center text-white transition hover:text-[#d7ff21] sm:size-10 ${className}`}
    >
      <ShoppingBag className="size-[0.95rem] sm:size-5" strokeWidth={1.8} />
      {count > 0 ? (
        <span className="absolute right-0 top-0 grid min-h-3 min-w-3 place-items-center rounded-full bg-[#d7ff21] px-0.5 text-[0.48rem] font-extrabold leading-none text-black sm:min-h-4 sm:min-w-4 sm:px-1 sm:text-[0.58rem]">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
