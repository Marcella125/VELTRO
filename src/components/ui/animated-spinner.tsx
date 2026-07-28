"use client";

interface AnimatedSpinnerProps {
  size?: string;
  className?: string;
}

export function AnimatedSpinner({
  size = "8rem",
  className = "",
}: AnimatedSpinnerProps) {
  return (
    <>
      <style jsx>{`
        @property --deg {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: true;
        }

        @property --p {
          syntax: "<percentage>";
          initial-value: 0%;
          inherits: true;
        }

        @property --line-width {
          syntax: "<length>";
          initial-value: 0.85rem;
          inherits: true;
        }

        .animated-spinner {
          --size: ${size};
          --color: #ffffff;
          --color-2: var(--accent);
          --color-3: #7a0d11;

          width: var(--size);
          aspect-ratio: 1;
          border-radius: 50%;

          background: conic-gradient(
            from var(--deg),
            var(--color),
            var(--color-2),
            var(--color-3),
            transparent var(--p)
          );

          mask: radial-gradient(
            circle,
            transparent calc(var(--size) / 2 - var(--line-width)),
            black calc(var(--size) / 2 - var(--line-width))
          );

          filter: drop-shadow(0 0 0.65rem rgba(177, 18, 38, 0.55))
            drop-shadow(0 0 1.5rem rgba(177, 18, 38, 0.25));

          animation: rotate 1.25s cubic-bezier(0.65, 0, 0.35, 1) infinite,
            line-width 3.6s ease-in-out infinite;

          will-change: transform, filter;
        }

        @keyframes rotate {
          from {
            --p: 18%;
          }

          45% {
            --p: 48%;
          }

          70% {
            --p: 28%;
          }

          90% {
            --p: 12%;
          }

          to {
            --p: 18%;
            --deg: -360deg;
          }
        }

        @keyframes line-width {
          from,
          20%,
          70%,
          to {
            --line-width: 0.85rem;
          }

          50% {
            --line-width: 0.15rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-spinner {
            animation: rotate 3s linear infinite, none;
          }
        }
      `}</style>

      <div
        className={`animated-spinner ${className}`}
        role="status"
        aria-label="Loading"
      />
    </>
  );
}
