import Container from "@/components/Container";
import { urlFor } from "@/sanity/image";
import {
  getBlogCategories,
  getOthersBlog,
  getSingleBlog,
} from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ReadingProgress from "@/components/blog/ReadingProgress";
import SocialShare from "@/components/blog/SocialShare";
import AnimatedBlogContent from "@/components/blog/AnimatedBlogContent";
import EnhancedSidebar from "@/components/blog/EnhancedSidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

const SingleBlogPage = async ({ params }: Props) => {
  const { slug } = await params;
  const blog: any = await getSingleBlog(slug);

  if (!blog) {
    return notFound();
  }

  // Fetch additional data for sidebar
  const blogs = await getOthersBlog(slug, 5);
  const blogCategories = await getBlogCategories();

  // Calculate reading time (rough estimate)
  const readingTime = Math.ceil((blog?.body?.length || 0) / 200) || 5;

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <Container className="py-8">
          {/* Back to Blog Link */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="group">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-gray-600 hover:text-zamzam-primary"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatedBlogContent>
                <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
                  {/* Hero Image */}
                  {blog?.mainImage && (
                    <div className="relative h-64 md:h-96 overflow-hidden">
                      <Image
                        src={urlFor(blog.mainImage).url()}
                        alt={blog.title || "Blog image"}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/20" />

                      {/* Categories Overlay */}
                      <div className="absolute top-6 left-6 flex gap-2">
                        {blog?.blogcategories
                          ?.slice(0, 2)
                          .map((category: any, index: number) => (
                            <Badge
                              key={index}
                              className="bg-zamzam-primary text-white border-0 hover:bg-zamzam-darkPrimary"
                            >
                              {category?.title}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  <CardContent className="p-8 md:p-12">
                    {/* Article Header */}
                    <header className="mb-8">
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zamzam-text-dark mb-6 leading-tight">
                        {blog?.title}
                      </h1>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-zamzam-text-medium mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zamzam-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-zamzam-primary" />
                          </div>
                          <span className="font-medium">
                            {blog?.author?.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zamzam-primary" />
                          <span>
                            {dayjs(
                              blog?.publishedAt || blog?._createdAt
                            ).format("MMMM DD, YYYY")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-zamzam-primary" />
                          <span>{readingTime} min read</span>
                        </div>
                      </div>
                    </header>

                    {/* Article Body */}
                    <article className="prose prose-lg max-w-none">
                      {blog?.body && (
                        <PortableText
                          value={blog.body}
                          components={{
                            types: {
                              image: ({ value }: any) => (
                                <div className="my-8 rounded-xl overflow-hidden shadow-md">
                                  <Image
                                    src={urlFor(value).url()}
                                    alt="Blog content image"
                                    width={800}
                                    height={400}
                                    className="w-full max-h-[500px] object-cover "
                                  />
                                </div>
                              ),
                              twoImages: ({ value }: any) => (
                                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {value.image1 && (
                                    <div className="rounded-xl overflow-hidden shadow-md">
                                      <Image
                                        src={urlFor(value.image1).url()}
                                        alt={value.image1.alt || "First image"}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  {value.image2 && (
                                    <div className="rounded-xl overflow-hidden shadow-md">
                                      <Image
                                        src={urlFor(value.image2).url()}
                                        alt={value.image2.alt || "Second image"}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              ),
                            },
                            block: {
                              h1: ({ children }: any) => (
                                <h1 className="text-3xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-zamzam-primary/20 pb-3">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }: any) => (
                                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-5">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }: any) => (
                                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                                  {children}
                                </h3>
                              ),
                              normal: ({ children }: any) => (
                                <p className="text-gray-700 leading-relaxed text-lg mb-6 font-light">
                                  {children}
                                </p>
                              ),
                              blockquote: ({ children }: any) => (
                                <blockquote className="border-l-4 border-zamzam-primary bg-gray-50 p-6 my-8 rounded-r-lg italic text-gray-700">
                                  {children}
                                </blockquote>
                              ),
                            },
                            list: {
                              bullet: ({ children }: any) => (
                                <ul className="space-y-2 my-6 text-gray-700">
                                  {children}
                                </ul>
                              ),
                              number: ({ children }: any) => (
                                <ol className="space-y-2 my-6 text-gray-700 list-decimal list-inside">
                                  {children}
                                </ol>
                              ),
                            },
                            listItem: {
                              bullet: ({ children }: any) => (
                                <li className="flex items-start gap-3">
                                  <span className="w-2 h-2 bg-zamzam-primary rounded-full mt-3 shrink-0" />
                                  <span>{children}</span>
                                </li>
                              ),
                            },
                            marks: {
                              link: ({ children, value }: any) => (
                                <a
                                  href={value.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-zamzam-primary hover:text-zamzam-darkPrimary font-medium underline decoration-2 underline-offset-2 transition-colors"
                                >
                                  {children}
                                </a>
                              ),
                              strong: ({ children }: any) => (
                                <strong className="font-bold text-gray-900">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }: any) => (
                                <em className="italic text-gray-800">
                                  {children}
                                </em>
                              ),
                              code: ({ children }: any) => (
                                <code className="bg-gray-100 text-zamzam-primary px-2 py-1 rounded text-sm font-mono">
                                  {children}
                                </code>
                              ),
                            },
                          }}
                        />
                      )}
                    </article>

                    {/* Article Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-zamzam-primary" />
                          <span className="text-sm text-gray-600">Tags:</span>
                          <div className="flex gap-2">
                            {blog?.blogcategories?.map(
                              (category: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs hover:bg-zamzam-primary hover:text-white transition-colors cursor-pointer"
                                >
                                  {category?.title}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </footer>
                  </CardContent>
                </Card>
              </AnimatedBlogContent>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="sticky top-24">
                <SocialShare
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${slug}`}
                  title={blog?.title || ""}
                />
                <div className="mt-8">
                  <EnhancedSidebar
                    categories={blogCategories || []}
                    latestBlogs={blogs || []}
                    currentSlug={slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default SingleBlogPage;
