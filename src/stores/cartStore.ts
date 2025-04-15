import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CartItem = {
  id: string;
  productId: string;
  farmId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
};

type CartStore = {
  items: CartItem[];
  farmId: string | null; // Only allow items from one farm at a time
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      farmId: null,
      
      addItem: (item) => {
        const { items, farmId } = get();
        
        // If cart has items from a different farm, don't add
        if (farmId && item.farmId !== farmId) {
          throw new Error('Cannot add items from different farms to cart');
        }
        
        // Check if item already exists
        const existingItem = items.find((i) => i.productId === item.productId);
        
        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, id: Date.now().toString() }],
            farmId: farmId || item.farmId,
          });
        }
      },
      
      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.productId !== productId);
        
        set({
          items: newItems,
          farmId: newItems.length > 0 ? get().farmId : null,
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeItem(productId);
          return;
        }
        
        set({
          items: items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [], farmId: null });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'harvestlink-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);