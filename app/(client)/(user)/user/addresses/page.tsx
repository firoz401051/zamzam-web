"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Address } from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import AddressForm from "@/components/address/AddressForm";

const DashboardAddressesPage = () => {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/user/addresses");
      const result = await response.json();

      if (result.success) {
        setAddresses(result.addresses);
      } else {
        toast.error(result.error || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    }
  }, [user?.id]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    const toastId = toast.loading("Deleting address...");
    try {
      const response = await fetch(`/api/user/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Address deleted successfully", { id: toastId });
        fetchAddresses();
      } else {
        toast.error(result.error || "Failed to delete address", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address", { id: toastId });
    }
  };

  const handleFormSuccess = (address: Address) => {
    fetchAddresses();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zamzam-text-dark">
              Addresses
            </h2>
            <p className="text-zamzam-text-muted">
              Manage your delivery addresses
            </p>
          </div>
          <Button onClick={handleAddAddress} className="gap-2 bg-zamzam-primary hover:bg-zamzam-primary-hover">
            <Plus className="w-4 h-4" />
            Add New Address
          </Button>
        </div>
      </div>

      {/* Addresses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-zamzam-primary" />
            Saved Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-zamzam-primary/30 border-t-zamzam-primary rounded-full animate-spin mb-4" />
              <p className="text-gray-500">Loading your addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No addresses yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add your delivery addresses to make checkout faster and easier.
              </p>
              <Button onClick={handleAddAddress} className="gap-2 bg-zamzam-primary hover:bg-zamzam-primary-hover">
                <Plus className="w-4 h-4" />
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="relative p-6 border rounded-lg hover:shadow-md transition-shadow group bg-white"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-gray-900">
                        {address.name}
                      </span>
                      {address.default && (
                        <span className="px-2 py-1 bg-zamzam-primary/10 text-zamzam-primary text-xs font-medium rounded-full border border-zamzam-primary/20">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-gray-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 shrink-0 text-gray-400" />
                      <span>
                        {address.address}
                        <br />
                        {address.city}, {address.state} {address.zip}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Address Sheet */}
      <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-3 mb-6">
            <SheetTitle className="text-xl">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </SheetTitle>
            <SheetDescription>
              {editingAddress
                ? "Update your delivery address information."
                : "Add a new delivery address to your account."}
            </SheetDescription>
          </SheetHeader>

          <AddressForm
            initialData={editingAddress}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardAddressesPage;
