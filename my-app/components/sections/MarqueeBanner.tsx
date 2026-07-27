export function MarqueeBanner() {
  const items = [
    "LOCATRIP",
    "ĐÀ LẠT",
    "KHÁM PHÁ",
    "LỊCH TRÌNH",
    "BẢN SẮC",
  ];

  return (
    <section className="overflow-hidden bg-lt-teal-deep py-6 text-white">
      <div className="marquee-track gap-10">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="font-display flex items-center gap-10 text-[32px] font-bold uppercase tracking-wide md:text-[48px] lg:text-[54px]"
          >
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center gap-10">
                <span>{item}</span>
                <span className="text-white/35">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
