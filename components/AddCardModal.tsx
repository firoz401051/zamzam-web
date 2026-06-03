"use client";

import React, { useState } from "react";
import { X, CreditCard, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

interface AddCardModalProps {
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

const AddCardModal: React.FC<AddCardModalProps> = ({
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
    return formatted.trim().substring(0, 19); // Max length with spaces
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

    // Clear submit error when user starts typing
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

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors: CardFormErrors = {};

    // Card number validation
    const cleanCardNumber = formData.cardNumber.replace(/\D/g, "");
    if (
      !cleanCardNumber ||
      cleanCardNumber.length < 13 ||
      cleanCardNumber.length > 19
    ) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    // Holder name validation
    if (!formData.holderName.trim()) {
      newErrors.holderName = "Cardholder name is required";
    }

    // Expiry validation
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

    // CVV validation
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    // Billing address validation
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
    setSubmitError(""); // Clear any previous errors

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
        nickname: formData.nickname.trim() || undefined, // Use undefined instead of null for optional fields
        billingAddress: formData.billingAddress,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Submitting payment method data:", paymentMethodData);

      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentMethodData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save payment method");
      }

      const savedCard = await response.json();
      console.log("Payment method saved successfully:", savedCard);

      // Call the callback to refresh the payment methods list
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

  // Clear errors when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSubmitError("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-zamzam-primary" />
              <p className="text-zamzam-text-dark font-medium">
                Processing your request...
              </p>
              <p className="text-zamzam-text-muted text-sm">
                Please do not close this window
              </p>
            </div>
          </div>
        )}
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Add New Payment Method
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-zamzam-text-dark">
                  Card Information
                </h3>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="holderName">Cardholder Name</Label>
                  <Input
                    id="holderName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.holderName}
                    onChange={(e) =>
                      handleInputChange("holderName", e.target.value)
                    }
                    className={errors.holderName ? "border-red-500" : ""}
                  />
                  {errors.holderName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.holderName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Input
                      id="expiryMonth"
                      type="text"
                      placeholder="MM"
                      maxLength={2}
                      value={formData.expiryMonth}
                      onChange={(e) =>
                        handleInputChange("expiryMonth", e.target.value)
                      }
                      className={errors.expiryMonth ? "border-red-500" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Year</Label>
                    <Input
                      id="expiryYear"
                      type="text"
                      placeholder="YYYY"
                      maxLength={4}
                      value={formData.expiryYear}
                      onChange={(e) =>
                        handleInputChange("expiryYear", e.target.value)
                      }
                      className={errors.expiryMonth ? "border-red-500" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {errors.expiryMonth && (
                  <p className="text-red-500 text-sm">{errors.expiryMonth}</p>
                )}
                {errors.cvv && (
                  <p className="text-red-500 text-sm">{errors.cvv}</p>
                )}

                <div>
                  <Label htmlFor="nickname">Card Nickname (Optional)</Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Personal Card, Work Card, etc."
                    value={formData.nickname}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      handleInputChange("isDefault", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
                  />
                  <Label htmlFor="isDefault">
                    Set as default payment method
                  </Label>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-zamzam-text-dark">
                  Billing Address
                </h3>

                <div>
                  <Label htmlFor="billingName">Full Name</Label>
                  <Input
                    id="billingName"
                    type="text"
                    value={formData.billingAddress.name}
                    onChange={(e) =>
                      handleBillingAddressChange("name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="billingAddress">Address</Label>
                  <Input
                    id="billingAddress"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.billingAddress.address}
                    onChange={(e) =>
                      handleBillingAddressChange("address", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                      id="billingCity"
                      type="text"
                      value={formData.billingAddress.city}
                      onChange={(e) =>
                        handleBillingAddressChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingState">State</Label>
                    <Input
                      id="billingState"
                      type="text"
                      value={formData.billingAddress.state}
                      onChange={(e) =>
                        handleBillingAddressChange("state", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingZip">ZIP Code</Label>
                    <Input
                      id="billingZip"
                      type="text"
                      value={formData.billingAddress.zip}
                      onChange={(e) =>
                        handleBillingAddressChange("zip", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingCountry">Country</Label>
                    <select
                      id="billingCountry"
                      value={formData.billingAddress.country}
                      onChange={(e) =>
                        handleBillingAddressChange("country", e.target.value)
                      }
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zamzam-primary focus:border-transparent"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure.</span>
                </div>
              </div>

              {/* Error Display */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5">
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                        !
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-800 text-sm font-medium">Error</p>
                      <p className="text-red-700 text-sm mt-1">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-zamzam-primary hover:bg-zamzam-primary/90 disabled:opacity-50"
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCardModal;
