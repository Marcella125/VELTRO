import { blogEntries } from "@/data/blogs";
import { BlogDetailView } from "@/views/sections/BlogDetailView";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogEntries.map((entry) => ({ slug: entry.id }));
}

export default function BlogDetailPage() {
  return <BlogDetailView />;
}
