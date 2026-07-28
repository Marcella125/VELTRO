import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: ReactNode;
  className?: string;
};

type PrimaryButtonButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type PrimaryButtonAnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type PrimaryButtonProps = PrimaryButtonButtonProps | PrimaryButtonAnchorProps;

const baseClassName =
  "type-button inline-flex h-12 items-center justify-center bg-[var(--brand-red)] px-6 text-center font-medium text-[var(--foreground)] transition-[background-color,transform,box-shadow] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[var(--brand-red-dark)] hover:shadow-[0_14px_28px_rgba(177,18,30,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function PrimaryButton(props: PrimaryButtonProps) {
  if ("href" in props && props.href) {
    const { children, className, href, ...anchorProps } =
      props as PrimaryButtonAnchorProps;
    return (
      <a className={cn(baseClassName, className)} href={href} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { children, className, ...buttonProps } = props as PrimaryButtonButtonProps;
  return (
    <button className={cn(baseClassName, className)} {...buttonProps}>
      {children}
    </button>
  );
}
