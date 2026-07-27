type SectionTagProps = {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function SectionTag({
  children,
  tone = "dark",
  className = "",
}: SectionTagProps) {
  const isLight = tone === "light";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`flex size-6 items-center justify-center opacity-65 ${
          isLight ? "text-lt-soft" : "text-lt-muted"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`font-cal text-[16px] leading-[1.4] ${
          isLight ? "text-[#f0f0f0]" : "text-lt-muted"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
