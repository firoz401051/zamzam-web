import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" /> {/* Search */}
          <Skeleton className="h-10 w-40" /> {/* Category Filter */}
          <Skeleton className="h-10 w-32" /> {/* Status Filter */}
        </div>
        <Skeleton className="h-10 w-32" /> {/* Add Product Button */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 py-2 border-b">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}