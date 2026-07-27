import Link from "next/link";

type PrimaryButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
};

export function PrimaryButton({
  href = "/book-a-trip",
  children,
  variant = "light",
  className = "",
}: PrimaryButtonProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href={href}
      className={`group relative inline-flex h-[42px] items-center pr-10 ${className}`}
    >
      <span
        className={`font-cal inline-flex h-full items-center rounded-full px-6 text-[16px] leading-[1.4] transition-colors ${
          isDark
            ? "bg-lt-teal text-white"
            : "bg-white text-lt-ink"
        }`}
      >
        {children}
      </span>
      <span
        className={`absolute right-0 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-rotate-45 ${
          isDark ? "bg-lt-teal text-white" : "bg-white text-lt-ink"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 12L12 2M12 2H4M12 2V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
