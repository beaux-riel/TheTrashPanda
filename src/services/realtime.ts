import { supabase } from '../config/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Subscribe to order status changes
export const subscribeToOrderUpdates = (orderId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Subscribe to new messages
export const subscribeToMessages = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Subscribe to product inventory changes
export const subscribeToProductUpdates = (productIds: string[], callback: (payload: any) => void) => {
  return supabase
    .channel('product-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `id=in.(${productIds.join(',')})`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Unsubscribe from a channel
export const unsubscribe = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};