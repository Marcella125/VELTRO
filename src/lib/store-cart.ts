export const STORE_CART_KEY = "veltro-store-cart-v1";
export const STORE_CART_EVENT = "veltro-store-cart-change";

export type StoredCartLine = {
  productId: string;
  quantity: number;
  size: string;
};

export function readStoredCart(): StoredCartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORE_CART_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];

    return value.filter((line): line is StoredCartLine => {
      if (!line || typeof line !== "object") return false;
      const candidate = line as Partial<StoredCartLine>;
      return typeof candidate.productId === "string"
        && typeof candidate.size === "string"
        && typeof candidate.quantity === "number"
        && candidate.quantity > 0;
    });
  } catch {
    return [];
  }
}

export function writeStoredCart(lines: StoredCartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent(STORE_CART_EVENT));
}

export function getStoredCartCount() {
  return readStoredCart().reduce((total, line) => total + line.quantity, 0);
}
