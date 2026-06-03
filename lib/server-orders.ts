import { auth } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { Address } from "@/sanity.types";

export interface OrderProduct {
  _id: string;
  name: string;
  description?: any;
  price: number;
  salePrice?: number;
  discount?: number;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    _type: "image";
    _key: string;
  }>;
  category?: {
    _id: string;
    name: string;
  };
}

export interface OrderItem {
  _key: string;
  quantity: number;
  product: OrderProduct;
}

export interface ServerOrder {
  _id: string;
  _type: string;
  orderNumber: string;
  customerName: string;
  email: string;
  clerkUserId: string;
  currency: string;
  amountDiscount: number;
  totalPrice: number;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  address: Address;
  orderDate: string;
  products: OrderItem[];
}

export async function getOrderById(
  orderId: string
): Promise<ServerOrder | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized - Please sign in");
    }

    // Fetch order from Sanity with populated product references
    const query = `*[_id == $orderId][0]{
      _id,
      _type,
      orderNumber,
      customerName,
      email,
      clerkUserId,
      currency,
      amountDiscount,
      totalPrice,
      subtotal,
      taxAmount,
      shippingCost,
      status,
      paymentStatus,
      paymentMethod,
      address,
      orderDate,
      "products": products[]{
        _key,
        quantity,
        "product": product->{
          _id,
          name,
          description,
          price,
          salePrice,
          discount,
          images,
          category->{
            _id,
            name
          }
        }
      }
    }`;

    const order = await backendClient.fetch(query, { orderId });

    if (!order) {
      return null;
    }

    // Verify the order belongs to the authenticated user
    if (order.clerkUserId !== userId) {
      throw new Error("Access denied");
    }

    return order;
  } catch (error: any) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

// Alias for getOrderById - used in checkout page
export async function getOrderWithProducts(
  orderId: string
): Promise<ServerOrder | null> {
  return getOrderById(orderId);
}
