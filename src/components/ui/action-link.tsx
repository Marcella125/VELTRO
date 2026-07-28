import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: ReactNode;
  className?: string;
};

type ActionLinkButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ActionLinkAnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ActionLinkProps = ActionLinkButtonProps | ActionLinkAnchorProps;

const baseClassName =
  "type-button group inline-flex items-center gap-2 text-sm font-medium text-white/74 transition-[color,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function ActionLink(props: ActionLinkProps) {
  if ("href" in props && props.href) {
    const { children, className, href, ...anchorProps } = props as ActionLinkAnchorProps;
    return (
      <a className={cn(baseClassName, className)} href={href} {...anchorProps}>
        <span>{children}</span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 text-[var(--brand-red)] transition-transform duration-[var(--transition-normal)] ease-[var(--ease-premium)] group-hover:translate-x-[5px]"
          strokeWidth={1.8}
        />
      </a>
    );
  }

  const { children, className, ...buttonProps } = props as ActionLinkButtonProps;
  return (
    <button className={cn(baseClassName, className)} {...buttonProps}>
      <span>{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 text-[var(--brand-red)] transition-transform duration-[var(--transition-normal)] ease-[var(--ease-premium)] group-hover:translate-x-[5px]"
        strokeWidth={1.8}
      />
    </button>
  );
}
