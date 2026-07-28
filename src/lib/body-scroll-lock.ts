let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined" || lockCount === 0) return;

  lockCount -= 1;

  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
}
