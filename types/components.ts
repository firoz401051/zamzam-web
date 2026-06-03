// Extended types for components that include additional query fields
import {
  Brand,
  Category,
  Product,
  Blog,
  Order,
  SanityImageHotspot,
  SanityImageCrop,
} from "@/sanity.types";

// Sanity Image Type
export interface SanityImage {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  media?: unknown;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type: "image";
}

// Extended Category type with additional query fields
export interface ExtendedCategory extends Category {
  color?: string;
  productCount?: number;
  shortDescription?: string;
  bannerImage?: SanityImage;
  metaTitle?: string;
  metaDescription?: string;
  icon?: string;
  sortOrder?: number;
}

// Extended Brand type with additional query fields
export interface ExtendedBrand extends Brand {
  productCount?: number;
}

// Extended Product type with additional query fields
export interface ExtendedProduct extends Omit<Product, "categories" | "brand"> {
  brand?: string; // Transformed from reference to string in queries
  brandSlug?: string;
  categories?: string[]; // Transformed from references to strings in queries
}

// Extended Blog type with additional query fields
export interface ExtendedBlog extends Omit<Blog, "author" | "blogcategories"> {
  author?: {
    name?: string;
    slug?: {
      current?: string;
    };
    image?: SanityImage;
  };
  blogcategories?: Array<{
    title?: string;
    slug?: {
      current?: string;
    };
  }>;
  excerpt?: string; // Short excerpt for blog preview
  description?: string; // Blog description
}

// Order Product Item
export interface OrderProductItem {
  product?: {
    _id: string;
    name?: string;
    slug?: {
      current: string;
    };
    images?: SanityImage[];
    price?: number;
  };
  quantity?: number;
  _key: string;
}

// Extended Order type
export interface ExtendedOrder extends Omit<Order, "products"> {
  products?: OrderProductItem[];
}

// Image Gallery Item
export interface ImageGalleryItem {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  media?: unknown;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type: "image";
  _key: string;
  alt?: string;
}

// Recent Activity Item for Dashboard
export interface RecentActivityItem {
  _id: string;
  type: "order" | "product_view" | "cart_add" | "wishlist_add";
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    amount?: number;
  };
}

// Grid component props types
export interface CategoryGridProps {
  categories: ExtendedCategory[];
}

export interface BrandsGridProps {
  brands: Brand[];
}

export interface ProductGridProps {
  products: Product[];
  className?: string;
}

export interface BlogGridProps {
  initialBlogs: ExtendedBlog[];
}

export interface ProductTabsProps {
  products?: ExtendedProduct[];
}

// Component specific props
export interface AnimatedBlogCardProps {
  blog: ExtendedBlog;
  index: number;
}

export interface BlogFilterProps {
  blogs: ExtendedBlog[];
  selectedCategory: string | null;
  onFilterChange: (filteredBlogs: ExtendedBlog[]) => void;
}

export interface EnhancedSidebarProps {
  categories: Array<{
    _id: string;
    title?: string;
    slug?: {
      current?: string;
    };
    _count?: number;
  }>;
  latestBlogs: ExtendedBlog[];
}

export interface ProductImageGalleryProps {
  images: ImageGalleryItem[];
  productName: string;
}

export interface PurchasePanelProps {
  product: ExtendedProduct;
}

export interface DashboardRecentActivityProps {
  recentOrders: ExtendedOrder[];
}

export interface OrderDetailsDialogProps {
  order: ExtendedOrder | null;
  isOpen: boolean;
  onClose: () => void;
}
