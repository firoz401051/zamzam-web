"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddCardSheet from "@/components/AddCardSheet";
import { useUser } from "@clerk/nextjs";

const getCardIcon = (type: string) => {
  const baseClasses = "w-8 h-8";

  switch (type.toLowerCase()) {
    case "visa":
      return (
        <div
          className={`${baseClasses} bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold`}
        >
          VISA
        </div>
      );
    case "mastercard":
      return (
        <div
          className={`${baseClasses} bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold`}
        >
          MC
        </div>
      );
    case "amex":
      return (
        <div
          className={`${baseClasses} bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold`}
        >
          AMEX
        </div>
      );
    default:
      return <CreditCard className={`${baseClasses} text-gray-400`} />;
  }
};

interface PaymentMethod {
  _id: string;
  cardType: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
  nickname?: string;
}

export default function PaymentsPage() {
  const { user } = useUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentMethods = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/payment-methods?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [user?.id]);

  const handleCardAdded = async () => {
    console.log("Card added successfully, refreshing payment methods list...");
    await fetchPaymentMethods(); // Refresh the list
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPaymentMethods(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-zamzam-text-dark">
          Payment Methods
        </h2>
        <p className="text-zamzam-text-muted mt-1">
          Manage your saved payment methods and preferences
        </p>
      </div>

      {/* Saved Cards */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Saved Cards
          </CardTitle>
          <Button
            className="bg-zamzam-primary hover:bg-zamzam-primary/90"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Card
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zamzam-primary mx-auto"></div>
              <p className="text-zamzam-text-muted mt-2">
                Loading payment methods...
              </p>
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((card) => (
                <div
                  key={card._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-zamzam-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getCardIcon(card.cardType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          •••• •••• •••• {card.last4}
                        </span>
                        {card.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                        {card.nickname && (
                          <Badge variant="outline" className="text-xs">
                            {card.nickname}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zamzam-text-muted">
                        {card.holderName} • Expires {card.expiryMonth}/
                        {card.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCard(card._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-zamzam-text-dark mb-2">
                No saved cards
              </h3>
              <p className="text-zamzam-text-muted mb-4">
                Add a payment method to make checkout faster
              </p>
              <Button
                className="bg-zamzam-primary hover:bg-zamzam-primary/90"
                onClick={() => setIsSheetOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Security */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Payment Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-zamzam-text-dark">
                  SSL Encryption
                </h4>
                <p className="text-sm text-zamzam-text-muted">
                  All payment information is encrypted and secure
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-zamzam-text-dark">
                  PCI Compliance
                </h4>
                <p className="text-sm text-zamzam-text-muted">
                  We follow industry standards for payment processing
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-zamzam-text-dark">
                  Fraud Protection
                </h4>
                <p className="text-sm text-zamzam-text-muted">
                  Advanced fraud detection keeps your transactions safe
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Preferences */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle>Payment Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-zamzam-text-dark">
                  Auto-save payment methods
                </h4>
                <p className="text-sm text-zamzam-text-muted">
                  Automatically save new payment methods for future use
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-zamzam-text-dark">
                  Payment notifications
                </h4>
                <p className="text-sm text-zamzam-text-muted">
                  Get notified about payment confirmations and issues
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-zamzam-text-dark">
                  Express checkout
                </h4>
                <p className="text-sm text-zamzam-text-muted">
                  Use saved payment method for faster checkout
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-zamzam-primary focus:ring-zamzam-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Card Sheet */}
      <AddCardSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCardAdded={handleCardAdded}
      />
    </div>
  );
}
