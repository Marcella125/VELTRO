"use client";

type PageFooterNoteProps = {
  mobileClassName?: string;
};

export function PageFooterNote({
  mobileClassName,
}: PageFooterNoteProps) {
  return (
    <p
      className={`fixed bottom-[calc(2.2vh-0.2cm)] left-1/2 z-30 -translate-x-1/2 text-center text-[11px] tracking-[0.03em] text-white/55 sm:hidden ${
        mobileClassName ?? ""
      }`}
    >
      Platinum all rights reserved &copy; 2026
    </p>
  );
}
