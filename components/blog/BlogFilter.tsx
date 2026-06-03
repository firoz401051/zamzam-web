"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BlogFilterProps } from "@/types/components";

const BlogFilter: React.FC<BlogFilterProps> = ({
  blogs,
  selectedCategory,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Extract unique categories from blogs
  const categories = React.useMemo(() => {
    const allCategories = blogs?.flatMap(
      (blog) =>
        blog.blogcategories?.map((cat) => cat.title).filter(Boolean) || []
    );
    return [...new Set(allCategories)];
  }, [blogs]);

  // Filter blogs based on search term and selected category
  useEffect(() => {
    let filteredBlogs = blogs || [];

    // Filter by search term
    if (searchTerm) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected category
    if (selectedCategory) {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.blogcategories?.some((cat) => cat.title === selectedCategory)
      );
    }

    onFilterChange(filteredBlogs);
  }, [blogs, searchTerm, selectedCategory, onFilterChange]);

  const clearFilters = () => {
    setSearchTerm("");
    onFilterChange(blogs || []);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => {
              // This would be handled by parent component
              // setSelectedCategory(selectedCategory === category ? null : category);
            }}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Clear Filters */}
      {(searchTerm || selectedCategory) && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default BlogFilter;
