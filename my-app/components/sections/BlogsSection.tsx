import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

export function BlogsSection() {
  return (
    <section className="section-pad bg-lt-cream">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag>Blogs</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] text-lt-teal-deep md:text-4xl">
            Cảm hứng và mẹo cho chuyến đi sắp tới của bạn
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <Link
              key={blog.title}
              href="/blogs"
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[607/386] overflow-hidden rounded-3xl">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-lt-muted">
                <span>{blog.author}</span>
                <span>·</span>
                <span>{blog.date}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-lt-ink transition-colors group-hover:text-lt-teal">
                {blog.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-cal text-lt-ink">
            Khám phá những câu chuyện từ những khách hàng sử dụng LocalTrip
          </p>
          <PrimaryButton href="/blogs" variant="dark">
            Xem tất cả
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
