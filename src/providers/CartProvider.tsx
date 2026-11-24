"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import toast from "react-hot-toast";
import dummyCartJson from "@/data/dummyCart.json";
import { ICartItemDetails } from "@/types/cart.types";
import { IProduct } from "@/types/product.types";
import {
  AddProductOptions,
  buildCartItemFromProduct,
} from "@/components/modules/storefront/cart/cartUtils";
import { applyCoupon as applyCouponApi } from "@/services/marketing.services";
import { DiscountType } from "@/types/marketing.types";

const CART_ITEMS_STORAGE_KEY = "fifthsense_cart_items_v2";
const CART_COUPON_STORAGE_KEY = "fifthsense_cart_coupon_v2";

export interface CartCouponRule {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  discountPercent?: number;
}

interface StoredCartState {
  items: ICartItemDetails[];
  couponCode: string | null;
}

const AVAILABLE_COUPONS: CartCouponRule[] = dummyCartJson.availableCoupons;
const INITIAL_CART_ITEMS: ICartItemDetails[] = [];

const SERVER_SNAPSHOT: StoredCartState = {
  items: [],
  couponCode: null,
};

let cachedRawItems: string | null | undefined;
let cachedRawCoupon: string | null | undefined;
let cachedSnapshot: StoredCartState = SERVER_SNAPSHOT;
const storeListeners = new Set<() => void>();

function emitStoreChange() {
  storeListeners.forEach((listener) => listener());
}

function subscribeToCartStore(listener: () => void) {
  storeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === CART_ITEMS_STORAGE_KEY ||
      event.key === CART_COUPON_STORAGE_KEY
    ) {
      cachedRawItems = undefined;
      cachedRawCoupon = undefined;
      listener();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    storeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function readCartSnapshot(): StoredCartState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }

  let rawItems = window.localStorage.getItem(CART_ITEMS_STORAGE_KEY);
  if (rawItems === null) {
    rawItems = JSON.stringify(INITIAL_CART_ITEMS);
    window.localStorage.setItem(CART_ITEMS_STORAGE_KEY, rawItems);
  }
  const rawCoupon = window.localStorage.getItem(CART_COUPON_STORAGE_KEY);

  if (rawItems === cachedRawItems && rawCoupon === cachedRawCoupon) {
    return cachedSnapshot;
  }

  let parsedItems: ICartItemDetails[] = INITIAL_CART_ITEMS;
  try {
    const candidate = JSON.parse(rawItems);
    if (Array.isArray(candidate)) {
      parsedItems = candidate;
    }
  } catch {
    parsedItems = INITIAL_CART_ITEMS;
  }

  cachedRawItems = rawItems;
  cachedRawCoupon = rawCoupon;
  cachedSnapshot = {
    items: parsedItems,
    couponCode: rawCoupon || null,
  };
  return cachedSnapshot;
}

function getServerSnapshot(): StoredCartState {
  return SERVER_SNAPSHOT;
}

function writeCartItems(nextItems: ICartItemDetails[], nextCoupon?: string | null) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(nextItems));
  if (nextCoupon !== undefined) {
    if (nextCoupon) {
      window.localStorage.setItem(CART_COUPON_STORAGE_KEY, nextCoupon);
    } else {
      window.localStorage.removeItem(CART_COUPON_STORAGE_KEY);
    }
  }
  cachedRawItems = undefined;
  cachedRawCoupon = undefined;
  emitStoreChange();
}

interface CartContextValue {
  items: ICartItemDetails[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  estimatedTotal: number;
  totalQuantity: number;
  totalItems: number;
  activeCoupon: CartCouponRule | null;
  freeShippingThreshold: number;
  complimentaryTesterNote: string;
  addProductToCart: (
    product: IProduct,
    options?: AddProductOptions & { openCart?: boolean; silentToast?: boolean }
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  restoreSampleCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToCartStore,
    readCartSnapshot,
    getServerSnapshot
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const subtotal = useMemo(
    () => snapshot.items.reduce((sum, item) => sum + item.itemTotal, 0),
    [snapshot.items]
  );

  const totalQuantity = useMemo(
    () => snapshot.items.reduce((sum, item) => sum + item.quantity, 0),
    [snapshot.items]
  );

  const activeCoupon = useMemo(() => {
    if (!snapshot.couponCode) return null;
    const rule = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === snapshot.couponCode?.toUpperCase()
    );
    if (!rule || totalQuantity < rule.minQuantity) return null;
    return rule;
  }, [snapshot.couponCode, totalQuantity]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon || subtotal <= 0) return 0;
    return Math.round(subtotal * (activeCoupon.discountPercent / 100));
  }, [activeCoupon, subtotal]);

  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingFee =
    snapshot.items.length === 0 ||
    netSubtotal >= dummyCartJson.freeShippingThreshold
      ? 0
      : dummyCartJson.defaultShippingFee;

  const estimatedTotal = netSubtotal + shippingFee;

  const addProductToCart = useCallback(
    (
      product: IProduct,
      options?: AddProductOptions & { openCart?: boolean; silentToast?: boolean }
    ) => {
      const current = readCartSnapshot();
      const newItem = buildCartItemFromProduct(product, options);
      const existingIdx = current.items.findIndex(
        (item) => item.variantId === newItem.variantId
      );

      let nextItems: ICartItemDetails[];
      if (existingIdx >= 0) {
        nextItems = current.items.map((item, idx) => {
          if (idx !== existingIdx) return item;
          const clampedQty = Math.min(
            item.quantity + newItem.quantity,
            item.stockAvailable
          );
          return {
            ...item,
            quantity: clampedQty,
            itemTotal: item.unitPrice * clampedQty,
          };
        });
      } else {
        nextItems = [...current.items, newItem];
      }

      writeCartItems(nextItems);

      if (!options?.silentToast) {
        toast.success(
          <div className="text-xs font-normal">
            <p className="font-medium text-white">Added to Fragrance Bag</p>
            <p className="text-zinc-400">
              {newItem.productName} &bull; {newItem.size}
            </p>
          </div>,
          {
            duration: 2800,
            style: {
              background: "#09090b",
              color: "#ffffff",
              border: "1px solid #27272a",
            },
          }
        );
      }

      if (options?.openCart !== false) {
        setDrawerOpen(true);
      }
    },
    []
  );

  const updateQuantity = useCallback((itemId: string, nextQuantity: number) => {
    const current = readCartSnapshot();
    const nextItems =
      nextQuantity <= 0
        ? current.items.filter((item) => item.id !== itemId)
        : current.items.map((item) => {
            if (item.id !== itemId) return item;
            const clamped = Math.max(
              1,
              Math.min(nextQuantity, item.stockAvailable)
            );
            return {
              ...item,
              quantity: clamped,
              itemTotal: item.unitPrice * clamped,
            };
          });

    const nextQtyTotal = nextItems.reduce((sum, i) => sum + i.quantity, 0);
    const activeRule = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === current.couponCode?.toUpperCase()
    );
    const nextCoupon =
      activeRule && nextQtyTotal < activeRule.minQuantity
        ? null
        : current.couponCode;

    writeCartItems(nextItems, nextCoupon);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    const current = readCartSnapshot();
    const nextItems = current.items.filter((item) => item.id !== itemId);
    const nextQtyTotal = nextItems.reduce((sum, i) => sum + i.quantity, 0);
    const activeRule = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === current.couponCode?.toUpperCase()
    );
    const nextCoupon =
      activeRule && nextQtyTotal < activeRule.minQuantity
        ? null
        : current.couponCode;

    writeCartItems(nextItems, nextCoupon);
  }, []);

  const clearCart = useCallback(() => {
    writeCartItems([], null);
  }, []);

  const restoreSampleCart = useCallback(() => {
    writeCartItems(INITIAL_CART_ITEMS, null);
  }, []);

  const applyCoupon = useCallback((rawCode: string) => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) {
      return { ok: false, message: "Please enter a privilege code." };
    }

    const rule = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === normalized
    );
    if (!rule) {
      return {
        ok: false,
        message: "Invalid code. Try BUY2 (20% off 2+ items) or FIFTH10.",
      };
    }

    const current = readCartSnapshot();
    const qtyTotal = current.items.reduce((sum, i) => sum + i.quantity, 0);
    if (qtyTotal < rule.minQuantity) {
      return {
        ok: false,
        message: `Add at least ${rule.minQuantity} fragrances to unlock ${rule.code} (${rule.discountPercent}% off).`,
      };
    }

    writeCartItems(current.items, rule.code);
    return {
      ok: true,
      message: `${rule.code} applied — ${rule.discountPercent}% privilege unlocked.`,
    };
  }, []);

  const removeCoupon = useCallback(() => {
    const current = readCartSnapshot();
    writeCartItems(current.items, null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: snapshot.items,
      isDrawerOpen,
      setDrawerOpen,
      openDrawer,
      closeDrawer,
      subtotal,
      discountAmount,
      shippingFee,
      estimatedTotal,
      totalQuantity,
      totalItems: snapshot.items.length,
      activeCoupon,
      freeShippingThreshold: dummyCartJson.freeShippingThreshold,
      complimentaryTesterNote: dummyCartJson.complimentaryTesterNote,
      addProductToCart,
      updateQuantity,
      removeItem,
      clearCart,
      restoreSampleCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      snapshot.items,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      subtotal,
      discountAmount,
      shippingFee,
      estimatedTotal,
      totalQuantity,
      activeCoupon,
      addProductToCart,
      updateQuantity,
      removeItem,
      clearCart,
      restoreSampleCart,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
