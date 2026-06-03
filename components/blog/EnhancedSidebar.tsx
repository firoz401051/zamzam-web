"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/image";
import { BookOpen, TrendingUp, ArrowRight, Calendar, Tag } from "lucide-react";
import dayjs from "dayjs";

interface EnhancedSidebarProps {
  categories: any[];
  latestBlogs: any[];
  currentSlug: string;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  categories,
  latestBlogs,
}) => {
  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-zamzam-surface shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-zamzam-text-dark">
              <Tag className="w-5 h-5 text-zamzam-primary" />
              <span className="text-lg">Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories?.map(({ blogcategories }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zamzam-surface transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-zamzam-primary rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-zamzam-text-medium group-hover:text-zamzam-primary transition-colors text-sm font-medium">
                    {blogcategories[0]?.title}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  1
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Latest Blogs Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-zamzam-surface shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-zamzam-text-dark">
              <TrendingUp className="w-5 h-5 text-zamzam-primary" />
              <span className="text-lg">Latest Articles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestBlogs?.map((blog, index: number) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="block group"
                >
                  <div className="flex gap-3 p-3 rounded-xl hover:bg-zamzam-surface transition-all duration-300">
                    {/* Blog Image */}
                    {blog?.mainImage && (
                      <div className="relative flex-shrink-0">
                        <Image
                          src={urlFor(blog.mainImage).url()}
                          alt={blog.title || "Blog image"}
                          width={80}
                          height={80}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-transparent group-hover:border-zamzam-primary/20 transition-colors duration-300"
                        />
                        <div className="absolute inset-0 bg-zamzam-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </div>
                    )}

                    {/* Blog Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-zamzam-text-dark group-hover:text-zamzam-primary transition-colors duration-300 line-clamp-2 mb-1">
                        {blog.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-zamzam-text-muted">
                        <Calendar className="w-3 h-3" />
                        <span>{dayjs(blog.publishedAt).format("MMM D")}</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zamzam-text-light group-hover:text-zamzam-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Reading Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-zamzam-primary/5 to-zamzam-primary-light border-zamzam-primary/20">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-zamzam-primary mx-auto mb-4" />
            <h3 className="font-bold text-zamzam-text-dark mb-2">
              Keep Reading
            </h3>
            <p className="text-sm text-zamzam-text-medium mb-4">
              Explore more articles to stay updated with the latest trends and
              insights.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zamzam-primary text-white rounded-lg hover:bg-zamzam-primary-hover transition-colors duration-300 text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              View All Articles
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedSidebar;
