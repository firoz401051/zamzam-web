"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-2 h-10 hover:bg-gray-100 border hover:border-zamzam-primary rounded-lg transition-colors duration-200 md:hidden group hoverEffect"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-600 group-hover:text-zamzam-primary transition-colors duration-200" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 group-hover:text-zamzam-primary transition-colors duration-200" />
        )}
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default MobileMenu;
