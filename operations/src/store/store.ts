import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface UserState {
  hasActiveSubscription: boolean;
  cartItems: CartItem[];
  cartCount: number;
  setSubscription: (status: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<UserState>((set) => ({
  hasActiveSubscription: false,
  cartItems: [],
  get cartCount() {
    return this.cartItems?.length || 0;
  },
  setSubscription: (status) => set({ hasActiveSubscription: status }),
  addToCart: (item) => set((state) => ({ 
    cartItems: [...state.cartItems, item],
    cartCount: state.cartItems.length + 1
  })),
  removeFromCart: (id) => set((state) => {
    const newItems = state.cartItems.filter(item => item.id !== id);
    return { cartItems: newItems, cartCount: newItems.length };
  }),
  clearCart: () => set({ cartItems: [], cartCount: 0 }),
}));
