"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import { useEffect, useState } from "react";

type ImageCrossfadeProps = {
  images: readonly string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Soft crossfade between images inside one card (Framer-like). */
export function ImageCrossfade({
  images,
  alt,
  intervalMs = 3800,
  className = "",
  sizes = "100vw",
  priority = false,
}: ImageCrossfadeProps) {
  const list = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [list.length, intervalMs]);

  if (list.length === 0) {
    return <div className={`bg-neutral-200 ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {list.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          fill
          sizes={sizes}
          quality={LT_IMAGE_QUALITY}
          priority={priority && i === 0}
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
