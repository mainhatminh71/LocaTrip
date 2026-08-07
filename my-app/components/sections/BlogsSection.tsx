import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import { blogs } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

/** Ported from Framer blogs section. */
export function BlogsSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <SectionTag>Blogs</SectionTag>
            <h2 className="mt-4 max-w-[22ch] font-display text-[28px] font-bold tracking-[-0.02em] text-[var(--lt-near-black)] md:text-[36px]">
              Cảm hứng và mẹo cho chuyến đi sắp tới của bạn
            </h2>
          </div>
          <Link
            href="/blogs"
            className="shrink-0 text-sm text-[var(--lt-near-black)] underline-offset-4 hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <Link
              key={blog.title}
              href="/blogs"
              className="group overflow-hidden rounded-[20px] border border-[#efefef] bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 50vw"
                    quality={LT_IMAGE_QUALITY}
                  />
              </div>
              <div className="p-5">
                <p className="text-xs text-[#888]">
                  {blog.author} · {blog.date}
                </p>
                <h3 className="mt-2 font-display text-[20px] font-semibold text-[var(--lt-near-black)]">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
