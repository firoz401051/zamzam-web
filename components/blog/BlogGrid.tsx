"use client";

import { useState } from "react";
import AnimatedBlogCard from "./AnimatedBlogCard";

// Use any type for now to handle the query result
interface BlogGridProps {
  initialBlogs: any[];
  categories: string[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ initialBlogs }) => {
  const [blogs] = useState(initialBlogs);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {blogs?.map((blog, index) => (
        <AnimatedBlogCard key={blog._id} blog={blog} index={index} />
      ))}
    </div>
  );
};

export default BlogGrid;
