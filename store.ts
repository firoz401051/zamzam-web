import { Product } from "./sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getFinalPrice } from "@/lib/pricing-utils";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Exchange rate from USD
}

export interface CompareProduct {
  _id: string;
  title?: string;
  name?: string;
  slug?: { current: string };
  price?: number;
  discount?: number;
  discountedPrice?: number;
  images?: any[];
  description?: string;
  stock?: number;
  brand?: any;
  categories?: string[];
  status?: "new" | "hot" | "sale" | "active";
  variant?: "gadget" | "appliances" | "refrigerators" | "others";
  isFeatured?: boolean;
  rating?: number;
  reviews?: number;
  salesCount?: number;
  weight?: string;
  dimensions?: string;
  material?: string;
  warranty?: string;
  features?: string[];
}

// Exchange rate data type
type ExchangeRateResponse = {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
  source: "live" | "fallback";
  lastUpdated: string;
  error?: string;
};

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.85 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.73 },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    rate: 1.25,
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    rate: 1.35,
  },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 110.0 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: 74.0 },
  {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    flag: "🇧🇩",
    rate: 85.0,
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "₨",
    flag: "🇵🇰",
    rate: 155.0,
  },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rate: 6.45 },
];

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getTotalItemCount: () => number;
  getGroupedItems: () => CartItem[];
  // favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  // currency
  selectedCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
  getCurrencyByCode: (code: string) => Currency | undefined;
  updateExchangeRates: () => Promise<void>;
  lastRateUpdate: string | null;
  isUpdatingRates: boolean;
  // compare
  compareList: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      selectedCurrency: currencies[0], // Default to USD
      currencies: currencies,
      lastRateUpdate: null,
      isUpdatingRates: false,
      compareList: [],
      addToCompare: (product) =>
        set((state) => {
          const isAlreadyAdded = state.compareList.some(
            (p) => p._id === product._id
          );
          if (state.compareList.length < 4 && !isAlreadyAdded) {
            return { compareList: [...state.compareList, product] };
          }
          return state;
        }),
      removeFromCompare: (productId) =>
        set((state) => ({
          compareList: state.compareList.filter((p) => p._id !== productId),
        })),
      clearCompare: () => set({ compareList: [] }),
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(
            ({ product }) => product?._id !== productId
          ),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const finalPrice = getFinalPrice(item.product);
          return total + finalPrice * item.quantity;
        }, 0);
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const finalPrice = getFinalPrice(item.product);
          return total + finalPrice * item.quantity;
        }, 0);
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getTotalItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getGroupedItems: () => get().items,
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?._id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
      // Currency methods
      setCurrency: (currency: Currency) => {
        set({ selectedCurrency: currency });
        // Trigger immediate re-render for all components using currency
      },

      convertPrice: (priceInUSD: number): number => {
        const { selectedCurrency } = get();
        return priceInUSD * selectedCurrency.rate;
      },

      formatPrice: (priceInUSD: number): string => {
        const { selectedCurrency, convertPrice } = get();
        const convertedPrice = convertPrice(priceInUSD);

        // Special formatting for different currencies
        switch (selectedCurrency.code) {
          case "JPY":
            // Japanese Yen doesn't use decimals
            return `${selectedCurrency.symbol}${Math.round(
              convertedPrice
            ).toLocaleString()}`;

          case "INR":
          case "BDT":
          case "PKR":
            // South Asian currencies - use Indian numbering system
            return `${selectedCurrency.symbol}${convertedPrice.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }
            )}`;

          case "CNY":
            // Chinese Yuan - 2 decimal places
            return `${selectedCurrency.symbol}${convertedPrice.toLocaleString(
              "zh-CN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`;

          default:
            // Western currencies - standard 2 decimal places
            return `${selectedCurrency.symbol}${convertedPrice.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`;
        }
      },

      getCurrencyByCode: (code: string): Currency | undefined => {
        return currencies.find((currency) => currency.code === code);
      },

      updateExchangeRates: async (): Promise<void> => {
        const { isUpdatingRates } = get();

        // Prevent multiple simultaneous updates
        if (isUpdatingRates) {
          return;
        }

        set({ isUpdatingRates: true });

        try {
          const response = await fetch("/api/currency/exchange-rates");

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: ExchangeRateResponse = await response.json();

          if (data.success && data.rates) {
            // Update the currencies array with new rates
            const updatedCurrencies = currencies.map((currency) => ({
              ...currency,
              rate: data.rates[currency.code] ?? currency.rate,
            }));

            set({
              currencies: updatedCurrencies,
              lastRateUpdate: data.lastUpdated,
              isUpdatingRates: false,
              // Update selected currency if its rate changed
              selectedCurrency: (() => {
                const { selectedCurrency } = get();
                const newRate = data.rates[selectedCurrency.code];
                return newRate
                  ? { ...selectedCurrency, rate: newRate }
                  : selectedCurrency;
              })(),
            });

            if (data.error) {
              console.warn("Rate update warning:", data.error);
            }
          } else {
            throw new Error("Invalid response format from exchange rate API");
          }
        } catch (error) {
          console.error("Failed to update exchange rates:", error);
          set({ isUpdatingRates: false });

          // Provide user feedback based on error type
          if (error instanceof Error) {
            if (error.message.includes("404")) {
              // Don't throw the error - continue with cached rates
            }
          }
        }
      },
    }),
    {
      name: "zamzam-store",
      partialize: (state) => ({
        items: state.items,
        favoriteProduct: state.favoriteProduct,
        selectedCurrency: state.selectedCurrency,
        lastRateUpdate: state.lastRateUpdate,
        currencies: state.currencies,
        compareList: state.compareList,
      }),
    }
  )
);

export default useCartStore;
