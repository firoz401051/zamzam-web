import { client } from "../lib/client";

export interface PaymentMethod {
  _id?: string;
  _type: "paymentMethod";
  clerkUserId: string;
  cardType: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
  nickname?: string;
  billingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fetch all payment methods for a user
export async function getUserPaymentMethods(
  userId: string
): Promise<PaymentMethod[]> {
  if (!userId) return [];

  const query = `*[_type == "paymentMethod" && clerkUserId == $userId && isActive == true] | order(isDefault desc, createdAt desc)`;

  try {
    const paymentMethods = await client.fetch(query, { userId });
    return paymentMethods;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
}

// Save a new payment method
export async function createPaymentMethod(
  paymentMethodData: PaymentMethod
): Promise<PaymentMethod | null> {
  try {
    console.log("Creating payment method in Sanity:", {
      userId: paymentMethodData.clerkUserId,
      cardType: paymentMethodData.cardType,
      last4: paymentMethodData.last4,
    });

    // If this is set as default, first unset any existing default
    if (paymentMethodData.isDefault) {
      console.log("Setting as default, unsetting existing defaults...");
      await client
        .patch({
          query: `*[_type == "paymentMethod" && clerkUserId == "${paymentMethodData.clerkUserId}" && isDefault == true]`,
        })
        .set({ isDefault: false, updatedAt: new Date().toISOString() })
        .commit();
    }

    const result = await client.create(paymentMethodData);
    console.log("Payment method created in Sanity with ID:", result._id);
    return result as unknown as PaymentMethod;
  } catch (error) {
    console.error("Error creating payment method:", error);
    return null;
  }
}

// Update a payment method
export async function updatePaymentMethod(
  paymentMethodId: string,
  updates: Partial<PaymentMethod>
): Promise<PaymentMethod | null> {
  try {
    // If setting as default, first unset any existing default for the same user
    if (updates.isDefault) {
      const paymentMethod = (await client.getDocument(
        paymentMethodId
      )) as PaymentMethod;
      if (paymentMethod) {
        await client
          .patch({
            query: `*[_type == "paymentMethod" && clerkUserId == "${paymentMethod.clerkUserId}" && isDefault == true]`,
          })
          .set({ isDefault: false, updatedAt: new Date().toISOString() })
          .commit();
      }
    }

    const result = await client
      .patch(paymentMethodId)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .commit();

    return result as unknown as PaymentMethod;
  } catch (error) {
    console.error("Error updating payment method:", error);
    return null;
  }
}

// Delete a payment method (soft delete by setting isActive to false)
export async function deletePaymentMethod(
  paymentMethodId: string
): Promise<boolean> {
  try {
    await client
      .patch(paymentMethodId)
      .set({ isActive: false, updatedAt: new Date().toISOString() })
      .commit();

    return true;
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return false;
  }
}

// Get a single payment method by ID
export async function getPaymentMethodById(
  paymentMethodId: string
): Promise<PaymentMethod | null> {
  try {
    const paymentMethod = (await client.getDocument(
      paymentMethodId
    )) as PaymentMethod;
    return paymentMethod;
  } catch (error) {
    console.error("Error fetching payment method:", error);
    return null;
  }
}

// Set a payment method as default
export async function setDefaultPaymentMethod(
  paymentMethodId: string,
  userId: string
): Promise<boolean> {
  try {
    // First, unset all existing defaults for the user
    await client
      .patch({
        query: `*[_type == "paymentMethod" && clerkUserId == "${userId}" && isDefault == true]`,
      })
      .set({ isDefault: false, updatedAt: new Date().toISOString() })
      .commit();

    // Then set the new default
    await client
      .patch(paymentMethodId)
      .set({ isDefault: true, updatedAt: new Date().toISOString() })
      .commit();

    return true;
  } catch (error) {
    console.error("Error setting default payment method:", error);
    return false;
  }
}
