"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { ActionLink } from "@/components/ui/action-link";
import { PrimaryButton } from "@/components/ui/primary-button";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";
import { blogEntries } from "@/data/blogs";

export function BlogDetailView() {
  const router = useRouter();
  const homeHref = "/";
  const params = useParams<{ slug?: string }>();
  const [isDockOpen, setIsDockOpen] = useState(true);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleDockSelect = (id: string) => {
    if (id === "home") return navigateTo(homeHref);
    if (id === "fleet") return navigateTo("/fleet");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  const blog = useMemo(
    () => blogEntries.find((entry) => entry.id === params?.slug),
    [params?.slug]
  );

  const handleViewCar = () => {
    navigateTo("/fleet");
  };

  return (
    <main className="platinum-blog-scroll relative min-h-screen max-h-screen overflow-y-auto text-white">
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Veltro blog background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_60%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_70%,rgba(0,0,0,0.8),transparent_60%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.75)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-350 flex-col px-6 pb-12 pt-5 sm:px-10 sm:pt-6">
        <div className="sticky top-0 z-40 -mx-6 px-6 pb-3 sm:-mx-10 sm:px-10">
          <InternalPageHeader
            title="Blogs"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        {!blog ? (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
            <h2 className="text-2xl font-semibold text-white">Blog not found</h2>
            <p className="max-w-lg text-sm text-white/70">
              The story you are looking for is unavailable. Browse the latest entries instead.
            </p>
            <ActionLink
              type="button"
              onClick={() => navigateTo("/blogs")}
              className="mt-3"
            >
              Back to Blogs
            </ActionLink>
          </div>
        ) : (
          <>
            {/* Mobile layout */}
            <section className="relative mt-4 sm:hidden">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_26px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="relative h-64 w-full">
                  <Image
                    src={blog.heroImage}
                    alt={blog.title}
                    fill
                    priority
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.65)_100%)]" />
                </div>

                <div className="px-5 py-5">
                  <h1 className="text-[20px] font-semibold tracking-[0.04em] text-white/95">
                    {blog.title}
                  </h1>
                  <p className="mt-3 text-[13px] leading-6 text-white/75">
                    {blog.summary}
                  </p>
                  <div className="mt-4 space-y-4 text-[13px] leading-6 text-white/70">
                    {blog.body.map((paragraph, index) => (
                      <p key={`${blog.id}-mobile-body-${index}`}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <PrimaryButton
                      type="button"
                      onClick={handleViewCar}
                      className="w-full"
                    >
                      View Car
                    </PrimaryButton>
                    <ActionLink
                      type="button"
                      onClick={() => navigateTo("/blogs")}
                      className="w-fit"
                    >
                      Back to Blogs
                    </ActionLink>
                  </div>
                </div>
              </div>
            </section>

            {/* Desktop layout */}
            <section className="relative mt-4 hidden sm:block lg:mt-10">

              {/* Content */}
              <div className="order-1 lg:order-0">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-end lg:gap-10">
                  {/* Square hero (since images are squared) */}
                  <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:h-[520px]">
                    <div className="relative h-full w-full">
                      <Image
                        src={blog.heroImage}
                        alt={blog.title}
                        fill
                        priority
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.10)_45%,rgba(0,0,0,0.55)_100%)]" />
                      <div className="absolute inset-0 mix-blend-soft-light opacity-30">
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${assetPath("/images/noise.png")})` }}
                        />
                      </div>

                    {/* Title plate removed per request */}
                    </div>
                  </div>

                  {/* Text + CTA */}
                  <div className="no-scrollbar rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 lg:h-[520px] lg:overflow-y-auto">
                    <p className="text-[15px] leading-8 text-white/75">
                      {blog.summary}
                    </p>

                    <div className="mt-6 space-y-4 text-[15px] leading-8 text-white/70">
                      {blog.body.map((paragraph, index) => (
                        <p key={`${blog.id}-body-${index}`}>{paragraph}</p>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <PrimaryButton
                      type="button"
                      onClick={handleViewCar}
                      className="flex-1"
                    >
                        View Car
                      </PrimaryButton>

                      <ActionLink
                        type="button"
                        onClick={() => navigateTo("/blogs")}
                        className="flex-1 justify-center"
                      >
                        Back to Blogs
                      </ActionLink>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </>
        )}
      </div>
      <PageFooterNote />
    </main>
  );
}
