'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FolderOpen, 
  Tag, 
  TrendingUp,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentCategory?: {
    _id: string;
    name: string;
  };
  status: 'active' | 'inactive';
  productCount: number;
  _createdAt: string;
  _updatedAt: string;
}

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalProducts: number;
}

export default function AdminCategoriesClient() {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/categories/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
        fetchStats();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCategories} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCategories}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inactiveCategories} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCategories > 0 ? Math.round(stats.totalProducts / stats.totalCategories) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              onSubmit={(data) => {
                // Handle category creation
                console.log('Creating category:', data);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <FolderOpen className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  {category.parentCategory && (
                    <p className="text-sm text-gray-500">
                      Parent: {category.parentCategory.name}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {category.productCount} products
                  </div>
                  {getStatusBadge(category.status)}
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-400">
                    Created {new Date(category._createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first category to get started.'}
          </p>
        </div>
      )}

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              initialData={editingCategory}
              onSubmit={(data) => {
                // Handle category update
                console.log('Updating category:', data);
                setEditingCategory(null);
              }}
              onCancel={() => setEditingCategory(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Category Form Component
function CategoryForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: { 
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Partial<Category>;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    parentCategory: initialData?.parentCategory?._id || '',
    status: initialData?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="parentCategory">Parent Category</Label>
          <select
            id="parentCategory"
            value={formData.parentCategory}
            onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No parent (Top level)</option>
            {/* Parent categories will be populated from API */}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
}