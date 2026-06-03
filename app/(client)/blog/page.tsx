import Container from "@/components/Container";
import Title from "@/components/Title";
import { getAllBlogs } from "@/sanity/queries";
import { BookOpen, Newspaper, TrendingUp, Star } from "lucide-react";
import React from "react";
import BlogGrid from "@/components/blog/BlogGrid";

const BlogPage = async () => {
  const blogs = await getAllBlogs(12);

  // Extract unique categories (simplified approach)
  const categories = [
    "Technology",
    "Fashion",
    "Lifestyle",
    "Business",
    "Health",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zamzam-background to-zamzam-surface">
      <Container className="py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zamzam-primary-light rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-zamzam-primary" />
            <span className="text-sm font-medium text-zamzam-primary">
              Knowledge Hub
            </span>
            <Newspaper className="w-4 h-4 text-zamzam-primary" />
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-zamzam-text-dark mb-4">
            zamzam <span className="text-zamzam-primary">Blog</span>
          </h1>

          <p className="text-zamzam-text-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest trends, insights, and stories from the
            world of e-commerce, fashion, technology, and lifestyle.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-zamzam-white rounded-2xl p-6 border border-zamzam-surface shadow-sm text-center group hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-zamzam-primary-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Newspaper className="w-6 h-6 text-zamzam-primary" />
            </div>
            <div className="text-2xl font-bold text-zamzam-text-dark mb-1">
              {blogs?.length || 0}+
            </div>
            <p className="text-zamzam-text-medium font-medium">
              Articles Published
            </p>
          </div>

          <div className="bg-zamzam-white rounded-2xl p-6 border border-zamzam-surface shadow-sm text-center group hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-zamzam-text-dark mb-1">
              10K+
            </div>
            <p className="text-zamzam-text-medium font-medium">
              Monthly Readers
            </p>
          </div>

          <div className="bg-zamzam-white rounded-2xl p-6 border border-zamzam-surface shadow-sm text-center group hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-zamzam-text-dark mb-1">
              4.8
            </div>
            <p className="text-zamzam-text-medium font-medium">
              Average Rating
            </p>
          </div>
        </div>

        {/* Blog Grid with Search and Filter */}
        <div className="bg-zamzam-white rounded-2xl p-6 lg:p-8 border border-zamzam-surface shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-5 h-5 text-zamzam-primary" />
            <Title className="text-xl lg:text-2xl font-bold text-zamzam-text-dark mb-0">
              Latest Articles
            </Title>
          </div>

          <BlogGrid initialBlogs={blogs || []} categories={categories} />
        </div>

        {/* Newsletter Signup Section */}
        <div className="mt-16 bg-gradient-to-r from-zamzam-primary to-zamzam-primary-hover rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="mb-6 opacity-90 max-w-md mx-auto">
            Subscribe to our newsletter and never miss the latest articles,
            tips, and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-zamzam-text-dark border-0 focus:ring-2 focus:ring-white/20 outline-none"
            />
            <button className="px-6 py-3 bg-white text-zamzam-primary font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
