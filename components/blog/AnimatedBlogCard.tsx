"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { urlFor } from "@/sanity/image";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBlogCardProps } from "@/types/components";

const AnimatedBlogCard = ({ blog, index }: AnimatedBlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Card className="h-full overflow-hidden border-zamzam-surface hover:border-zamzam-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 bg-zamzam-white group-hover:transform group-hover:-translate-y-1">
        {/* Clickable Blog Image */}
        {blog?.mainImage && (
          <Link href={`/blog/${blog.slug?.current}`} className="block">
            <div className="relative overflow-hidden aspect-4/3 cursor-pointer">
              <Image
                src={urlFor(blog.mainImage).url()}
                alt={blog.title || "Blog image"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category Badge Overlay */}
              {blog.blogcategories && blog.blogcategories.length > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-zamzam-primary/90 text-white hover:bg-zamzam-primary">
                    {blog.blogcategories[0]?.title || "Category"}
                  </Badge>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-zamzam-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        )}

        <CardContent className="p-6 flex flex-col h-full">
          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-zamzam-text-muted mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{dayjs(blog.publishedAt).format("MMM D, YYYY")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Clickable Title */}
          <Link href={`/blog/${blog.slug?.current}`}>
            <h3 className="font-bold text-lg text-zamzam-text-dark mb-3 line-clamp-2 hover:text-zamzam-primary transition-colors duration-300 cursor-pointer">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt - if available */}
          <p className="text-zamzam-text-medium text-sm leading-relaxed mb-4 line-clamp-3 grow">
            {blog.excerpt ||
              "Discover the latest insights and trends in our comprehensive article. Learn valuable tips and strategies to enhance your experience."}
          </p>

          {/* Read More Link */}
          <Link
            href={`/blog/${blog.slug?.current}`}
            className="inline-flex items-center gap-2 text-zamzam-primary hover:text-zamzam-primary-hover font-medium text-sm transition-colors duration-300 group/link mt-auto"
          >
            Read Full Article
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedBlogCard;
