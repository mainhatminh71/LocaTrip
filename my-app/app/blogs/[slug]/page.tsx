import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { BlogPostView } from "@/components/pages/BlogPostView";
import { BLOG_POSTS } from "@/lib/pages-content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return { title: post ? `${post.title} | LocaTrip` : "Blog | LocaTrip" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <MarketingChrome>
      <BlogPostView post={post} />
    </MarketingChrome>
  );
}
