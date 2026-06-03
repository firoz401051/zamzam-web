"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface AddressFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  default: boolean;
}

interface AddressFormProps {
  initialData?: Address | null;
  onSuccess: (address: Address) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    default: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zip: initialData.zip || "",
        email: initialData.email || "",
        default: initialData.default || false,
      });
    } else {
        // Reset or set defaults for new address
        setFormData({
            name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            email: user?.emailAddresses?.[0]?.emailAddress || "",
            default: false,
        })
    }
  }, [initialData, user]);

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("Please sign in to manage addresses");
      return;
    }

    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      !formData.email
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const addressData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        email: formData.email,
        default: formData.default,
      };

      let response;
      if (initialData?._id) {
        // Update existing address
        response = await fetch("/api/user/addresses", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...addressData, id: initialData._id }),
        });
      } else {
        // Create new address
        response = await fetch("/api/user/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        });
      }

      const result = await response.json();

      if (result.success) {
        toast.success(
          result.message ||
            (initialData
              ? "Address updated successfully!"
              : "Address added successfully!")
        );
        onSuccess(result.address);
      } else {
        toast.error(result.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            Street Address *
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Enter street address"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-sm font-medium">
              City *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-sm font-medium">
              State *
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="State"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="zip" className="text-sm font-medium">
            ZIP Code *
          </Label>
          <Input
            id="zip"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            placeholder="ZIP Code"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="default"
            checked={formData.default}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, default: checked as boolean })
            }
          />
          <Label htmlFor="default" className="text-sm cursor-pointer">
            Set as default address
          </Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-zamzam-primary hover:bg-zamzam-primary-hover"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : initialData ? (
            "Update Address"
          ) : (
            "Add Address"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddressForm;
