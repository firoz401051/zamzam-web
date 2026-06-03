"use client";

import React, { useState } from "react";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";

interface AddCardSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCardAdded: () => void;
}

interface CardFormData {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nickname: string;
  isDefault: boolean;
  billingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface CardFormErrors {
  cardNumber?: string;
  holderName?: string;
  expiryMonth?: string;
  cvv?: string;
  billingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

const AddCardSheet: React.FC<AddCardSheetProps> = ({
  isOpen,
  onClose,
  onCardAdded,
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: "",
    holderName: user?.fullName || "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nickname: "",
    isDefault: false,
    billingAddress: {
      name: user?.fullName || "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
    },
  });

  const [errors, setErrors] = useState<CardFormErrors>({});

  // Card type detection
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5") || cleaned.startsWith("2")) return "mastercard";
    if (cleaned.startsWith("3")) return "amex";
    if (cleaned.startsWith("6")) return "discover";
    return "other";
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ");
    return formatted.trim().substring(0, 19);
  };

  // Format expiry date
  const formatExpiry = (value: string, type: "month" | "year") => {
    const cleaned = value.replace(/\D/g, "");
    if (type === "month") {
      return cleaned.substring(0, 2);
    }
    return cleaned.substring(0, 4);
  };

  const handleInputChange = (
    field: keyof CardFormData,
    value: string | boolean
  ) => {
    if (field === "cardNumber" && typeof value === "string") {
      const formatted = formatCardNumber(value);
      setFormData((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "expiryMonth" && typeof value === "string") {
      const formatted = formatExpiry(value, "month");
      setFormData((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "expiryYear" && typeof value === "string") {
      const formatted = formatExpiry(value, "year");
      setFormData((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "cvv" && typeof value === "string") {
      const cleaned = value.replace(/\D/g, "").substring(0, 4);
      setFormData((prev) => ({ ...prev, [field]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (field === "cardNumber" && errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    } else if (field === "holderName" && errors.holderName) {
      setErrors((prev) => ({ ...prev, holderName: undefined }));
    } else if (field === "expiryMonth" && errors.expiryMonth) {
      setErrors((prev) => ({ ...prev, expiryMonth: undefined }));
    } else if (field === "cvv" && errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleBillingAddressChange = (
    field: keyof CardFormData["billingAddress"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors: CardFormErrors = {};

    const cleanCardNumber = formData.cardNumber.replace(/\D/g, "");
    if (
      !cleanCardNumber ||
      cleanCardNumber.length < 13 ||
      cleanCardNumber.length > 19
    ) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (!formData.holderName.trim()) {
      newErrors.holderName = "Cardholder name is required";
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiryMonth = "Expiry date is required";
    } else {
      const month = parseInt(formData.expiryMonth);
      const year = parseInt(formData.expiryYear);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (month < 1 || month > 12) {
        newErrors.expiryMonth = "Invalid month";
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiryMonth = "Card has expired";
      }
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    const billingErrors: CardFormErrors["billingAddress"] = {};
    if (!formData.billingAddress.address.trim()) {
      billingErrors.address = "Address is required";
    }
    if (!formData.billingAddress.city.trim()) {
      billingErrors.city = "City is required";
    }
    if (!formData.billingAddress.state.trim()) {
      billingErrors.state = "State is required";
    }
    if (!formData.billingAddress.zip.trim()) {
      billingErrors.zip = "ZIP code is required";
    }

    if (Object.keys(billingErrors).length > 0) {
      newErrors.billingAddress = billingErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setLoading(true);
    setSubmitError("");

    try {
      const cleanCardNumber = formData.cardNumber.replace(/\D/g, "");
      const cardType = detectCardType(cleanCardNumber);
      const last4 = cleanCardNumber.slice(-4);

      const paymentMethodData = {
        _type: "paymentMethod",
        clerkUserId: user.id,
        cardType,
        last4,
        expiryMonth: formData.expiryMonth.padStart(2, "0"),
        expiryYear: formData.expiryYear,
        holderName: formData.holderName.trim(),
        isDefault: formData.isDefault,
        nickname: formData.nickname.trim() || undefined,
        billingAddress: formData.billingAddress,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentMethodData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save payment method");
      }

      onCardAdded();
      onClose();

      // Reset form
      setFormData({
        cardNumber: "",
        holderName: user?.fullName || "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        nickname: "",
        isDefault: false,
        billingAddress: {
          name: user?.fullName || "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "US",
        },
      });
    } catch (error) {
      console.error("Error adding payment method:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setSubmitError(`Failed to save payment method: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setSubmitError("");
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl lg:max-w-2xl overflow-y-auto p-0"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <SheetHeader className="px-6 py-5">
            <SheetTitle className="text-xl font-bold text-zamzam-text-dark flex items-center gap-3">
              <div className="p-2 bg-zamzam-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-zamzam-primary" />
              </div>
              <div>
                Add New Payment Method
                <p className="text-xs font-normal text-zamzam-text-medium mt-1">
                  Add a credit or debit card for faster checkout
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-zamzam-primary" />
              <p className="text-zamzam-text-dark font-semibold text-lg">
                Processing...
              </p>
              <p className="text-zamzam-text-muted text-sm">
                Please do not close this window
              </p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-zamzam-text-dark">
                  Card Information
                </h3>
              </div>

              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange("cardNumber", e.target.value)
                  }
                  className={`mt-1.5 ${
                    errors.cardNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="holderName" className="text-sm font-medium">
                  Cardholder Name
                </Label>
                <Input
                  id="holderName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.holderName}
                  onChange={(e) =>
                    handleInputChange("holderName", e.target.value)
                  }
                  className={`mt-1.5 ${
                    errors.holderName ? "border-red-500" : ""
                  }`}
                />
                {errors.holderName && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.holderName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="expiryMonth" className="text-sm font-medium">
                    Month
                  </Label>
                  <Input
                    id="expiryMonth"
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={formData.expiryMonth}
                    onChange={(e) =>
                      handleInputChange("expiryMonth", e.target.value)
                    }
                    className={`mt-1.5 ${
                      errors.expiryMonth ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryYear" className="text-sm font-medium">
                    Year
                  </Label>
                  <Input
                    id="expiryYear"
                    type="text"
                    placeholder="YYYY"
                    maxLength={4}
                    value={formData.expiryYear}
                    onChange={(e) =>
                      handleInputChange("expiryYear", e.target.value)
                    }
                    className={`mt-1.5 ${
                      errors.expiryMonth ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className={`mt-1.5 ${errors.cvv ? "border-red-500" : ""}`}
                  />
                </div>
              </div>
              {errors.expiryMonth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expiryMonth}
                </p>
              )}
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}

              <div>
                <Label htmlFor="nickname" className="text-sm font-medium">
                  Card Nickname{" "}
                  <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Personal Card, Work Card, etc."
                  value={formData.nickname}
                  onChange={(e) =>
                    handleInputChange("nickname", e.target.value)
                  }
                  className="mt-1.5"
                />
                <p className="text-xs text-zamzam-text-muted mt-1.5">
                  Add a nickname to easily identify this card later
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    handleInputChange("isDefault", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary mt-0.5"
                />
                <div>
                  <Label
                    htmlFor="isDefault"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Set as default payment method
                  </Label>
                  <p className="text-xs text-zamzam-text-muted mt-1">
                    Use this card for all future purchases
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <div className="p-1.5 bg-purple-50 rounded-lg">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-zamzam-text-dark">
                  Billing Address
                </h3>
              </div>

              <div>
                <Label htmlFor="billingName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="billingName"
                  type="text"
                  value={formData.billingAddress.name}
                  onChange={(e) =>
                    handleBillingAddressChange("name", e.target.value)
                  }
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="billingAddress" className="text-sm font-medium">
                  Street Address
                </Label>
                <Input
                  id="billingAddress"
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  value={formData.billingAddress.address}
                  onChange={(e) =>
                    handleBillingAddressChange("address", e.target.value)
                  }
                  className={`mt-1.5 ${
                    errors.billingAddress?.address ? "border-red-500" : ""
                  }`}
                />
                {errors.billingAddress?.address && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.billingAddress.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="billingCity" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="billingCity"
                    type="text"
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      handleBillingAddressChange("city", e.target.value)
                    }
                    className={`mt-1.5 ${
                      errors.billingAddress?.city ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.city && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.billingAddress.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingState" className="text-sm font-medium">
                    State
                  </Label>
                  <Input
                    id="billingState"
                    type="text"
                    placeholder="CA"
                    value={formData.billingAddress.state}
                    onChange={(e) =>
                      handleBillingAddressChange("state", e.target.value)
                    }
                    className={`mt-1.5 ${
                      errors.billingAddress?.state ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.state && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.billingAddress.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="billingZip" className="text-sm font-medium">
                    ZIP Code
                  </Label>
                  <Input
                    id="billingZip"
                    type="text"
                    placeholder="12345"
                    value={formData.billingAddress.zip}
                    onChange={(e) =>
                      handleBillingAddressChange("zip", e.target.value)
                    }
                    className={`mt-1.5 ${
                      errors.billingAddress?.zip ? "border-red-500" : ""
                    }`}
                  />
                  {errors.billingAddress?.zip && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.billingAddress.zip}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="billingCountry"
                    className="text-sm font-medium"
                  >
                    Country
                  </Label>
                  <select
                    id="billingCountry"
                    value={formData.billingAddress.country}
                    onChange={(e) =>
                      handleBillingAddressChange("country", e.target.value)
                    }
                    className="w-full h-10 px-3 mt-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zamzam-primary focus:border-transparent bg-white"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg shrink-0">
                  <Lock className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 text-sm mb-1">
                    Your information is secure
                  </h4>
                  <p className="text-xs text-green-800">
                    All payment data is encrypted with bank-level security. We
                    never store your full card number or CVV.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-red-900 text-sm font-semibold">Error</p>
                    <p className="text-red-800 text-sm mt-1">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sticky Action Buttons */}
            <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-6 px-6 border-t border-gray-100">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 bg-zamzam-primary hover:bg-zamzam-primary/90 disabled:opacity-50 font-semibold shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding Card...</span>
                    </div>
                  ) : (
                    "Add Payment Method"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddCardSheet;
