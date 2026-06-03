"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Address } from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AddressForm from "./address/AddressForm";

interface CartAddressManagerProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address | null) => void;
}

const CartAddressManager: React.FC<CartAddressManagerProps> = ({
  selectedAddress,
  onAddressSelect,
}) => {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/user/addresses");
      const result = await response.json();

      if (result.success) {
        setAddresses(result.addresses);

        // Auto-select default address or first address
        if (!selectedAddress && result.addresses.length > 0) {
          const defaultAddress = result.addresses.find(
            (addr: Address) => addr.default
          );
          onAddressSelect(defaultAddress || result.addresses[0]);
        }
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
    fetchAddresses();
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

    setLoading(true);
    try {
      const response = await fetch(`/api/user/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Address deleted successfully!");

        // If deleted address was selected, clear selection
        if (selectedAddress?._id === addressId) {
          onAddressSelect(null);
        }

        fetchAddresses();
      } else {
        toast.error(result.error || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (address: Address) => {
    fetchAddresses();
    setShowAddForm(false);
    // Auto select the new/updated address
    onAddressSelect(address);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zamzam-primary/10 rounded-full">
              <MapPin className="w-5 h-5 text-zamzam-primary" />
            </div>
            <CardTitle className="text-xl text-zamzam-text-dark">
              Delivery Address
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-zamzam-primary/30 border-t-zamzam-primary rounded-full animate-spin" />
            <span className="ml-2 text-zamzam-text-medium">
              Loading addresses...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-zamzam-primary/10 rounded-full">
                <MapPin className="w-5 h-5 text-zamzam-primary" />
              </div>
              <CardTitle className="text-xl text-zamzam-text-dark">
                Delivery Address
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center py-8">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No addresses found
            </h3>
            <p className="text-gray-500 mb-6">
              You need to add an address before placing an order.
            </p>
            <Button
              onClick={handleAddAddress}
              className="gap-2 bg-zamzam-primary hover:bg-zamzam-primary-hover text-white px-6 py-3 text-base font-medium"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>

        {/* Add/Edit Address Sidebar - Include in empty state too */}
        <Sheet
          open={showAddForm}
          onOpenChange={(open) => {
            setShowAddForm(open);
          }}
        >
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg overflow-y-auto"
          >
            <SheetHeader className="space-y-3">
              <SheetTitle className="text-xl">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </SheetTitle>
              <SheetDescription>
                {editingAddress
                  ? "Update your delivery address information."
                  : "Add a new delivery address to your account."}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8">
              <AddressForm
                initialData={editingAddress}
                onSuccess={handleFormSuccess}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zamzam-primary/10 rounded-full">
              <MapPin className="w-5 h-5 text-zamzam-primary" />
            </div>
            <CardTitle className="text-xl text-zamzam-text-dark">
              Delivery Address
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAddress?._id || ""}
            onValueChange={(value) => {
              const address = addresses.find((addr) => addr._id === value);
              onAddressSelect(address || null);
            }}
            className="space-y-3"
          >
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                  selectedAddress?._id === address._id
                    ? "border-zamzam-primary bg-zamzam-primary/5"
                    : "border-gray-200 hover:border-zamzam-primary/30"
                }`}
                onClick={() => onAddressSelect(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <RadioGroupItem
                      value={address._id}
                      id={`address-${address._id}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`address-${address._id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zamzam-text-dark">
                            {address.name}
                          </span>
                          {address.default && (
                            <span className="px-2 py-1 bg-zamzam-primary text-white text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zamzam-text-medium leading-relaxed">
                          {address.address}, {address.city}, {address.state}{" "}
                          {address.zip}
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address._id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedAddress?._id === address._id && (
                  <div className="absolute top-3 right-12">
                    <div className="w-5 h-5 bg-zamzam-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>

          <Button
            variant="outline"
            onClick={handleAddAddress}
            className="w-full mt-6 border-2 border-dashed border-zamzam-primary/30 text-zamzam-primary hover:bg-zamzam-primary/10 hover:border-zamzam-primary transition-all duration-300 gap-2 py-6 text-base font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </Button>
        </CardContent>
      </Card>

      {/* Add/Edit Address Sidebar */}
      <Sheet
        open={showAddForm}
        onOpenChange={(open) => {
          setShowAddForm(open);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader className="space-y-3">
            <SheetTitle className="text-xl">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </SheetTitle>
            <SheetDescription>
              {editingAddress
                ? "Update your delivery address information."
                : "Add a new delivery address to your account."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8">
            <AddressForm
              initialData={editingAddress}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartAddressManager;
