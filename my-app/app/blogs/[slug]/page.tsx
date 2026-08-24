import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { BlogPostView } from "@/components/pages/BlogPostView";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS } from "@/lib/pages-content";
import { blogPostingJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return buildPageMetadata({
      title: "Blog",
      description: "Bài viết LocaTrip",
      path: "/blogs/",
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}/`,
    image: post.image,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <MarketingChrome>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/blogs/${post.slug}/`,
          image: post.image,
          author: post.author,
        })}
      />
      <BlogPostView post={post} />
    </MarketingChrome>
  );
}
