import React from "react";
import Container from "./Container";
import Title from "./Title";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import dayjs from "dayjs";
import { Calendar, ArrowRight, BookOpen, Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs(4);

  return (
    <Container className="py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zamzam-primary-light rounded-full mb-4">
          <BookOpen className="w-4 h-4 text-zamzam-primary" />
          <span className="text-sm font-medium text-zamzam-primary">
            Our Blog
          </span>
          <Newspaper className="w-4 h-4 text-zamzam-primary" />
        </div>
        <Title className="text-2xl lg:text-3xl font-bold text-zamzam-text-dark mb-3">
          Latest Blog & News
        </Title>
        <p className="text-zamzam-text-medium max-w-2xl mx-auto">
          Stay updated with our latest news, updates, and articles about trends and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {blogs?.map((blog: any) => (
          <div
            key={blog?._id}
            className="group rounded-xl overflow-hidden border border-zamzam-primary/10 hover:border-zamzam-primary hover:shadow-lg hoverEffect bg-white flex flex-col h-full"
          >
            {blog?.mainImage && (
              <div className="relative overflow-hidden aspect-4/3">
                <Link href={`/blog/${blog?.slug?.current}`}>
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="text-xs flex items-center gap-4 mb-3">
                <div className="flex items-center relative z-10">
                  {blog?.blogcategories?.slice(0, 1).map((item: any, index: number) => (
                    <span
                      key={index}
                      className="font-medium text-zamzam-primary bg-zamzam-primary/10 px-2.5 py-1 rounded-full"
                    >
                      {item?.title}
                    </span>
                  ))}
                </div>
                <p className="flex items-center gap-1.5 text-zamzam-text-medium/80">
                  <Calendar size={14} />
                  {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                </p>
              </div>
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="text-lg font-bold text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors line-clamp-2 mb-3"
              >
                {blog?.title}
              </Link>
              <div className="mt-auto pt-3 border-t border-dashed border-zamzam-gray/20">
                <Link 
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-sm font-semibold text-zamzam-text-medium group-hover:text-zamzam-primary flex items-center gap-1 transition-colors"
                >
                  Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

       <div className="mt-10 flex justify-center">
        <Link href="/blog">
          <Button variant="outline" className="gap-2 text-zamzam-primary border-zamzam-primary hover:bg-zamzam-primary hover:text-white transition-all duration-300">
            See all Blogs <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default LatestBlog;
