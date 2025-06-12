import { useMutation, useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import type { NostrEvent } from '@nostrify/nostrify';

// NIP-86 RPC Method types
export type Nip86Method = 
  | 'relay_info'
  | 'relay_list'
  | 'relay_set'
  | 'relay_unset'
  | 'user_info'
  | 'user_list'
  | 'user_set'
  | 'user_unset'
  | 'event_count'
  | 'event_delete'
  | 'storage_quota'
  | 'billing_info'
  | 'billing_pay'
  | 'admin_list'
  | 'admin_set'
  | 'admin_unset'
  | 'ban_user'
  | 'unban_user'
  | 'list_banned_users'
  | 'whitelist_user'
  | 'unwhitelist_user'
  | 'list_whitelisted_users';

export interface Nip86RpcRequest {
  method: Nip86Method;
  params?: Record<string, any>;
  relay_url?: string;
}

export interface Nip86RpcResponse {
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface Nip86RpcCall {
  id: string;
  request: Nip86RpcRequest;
  response?: Nip86RpcResponse;
  timestamp: number;
  status: 'pending' | 'success' | 'error';
}

/**
 * Hook for making NIP-86 RPC calls to relay operators
 */
export function useNip86Rpc() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { mutate: publishEvent } = useNostrPublish();

  // Make an RPC call
  const makeRpcCall = useMutation({
    mutationFn: async ({ method, params = {}, relay_url }: Nip86RpcRequest): Promise<Nip86RpcResponse> => {
      if (!user) {
        throw new Error('User must be logged in to make RPC calls');
      }

      const callId = crypto.randomUUID();
      
      // Create NIP-86 RPC request event (kind 24133)
      const rpcEvent: Partial<NostrEvent> = {
        kind: 24133,
        content: JSON.stringify({
          method,
          params,
          id: callId,
        }),
        tags: relay_url ? [['relay', relay_url]] : [],
      };

      // Publish the RPC request
      publishEvent(rpcEvent);

      // Listen for response (kind 24134)
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('RPC call timeout'));
        }, 30000); // 30 second timeout

        const subscription = nostr.query([
          {
            kinds: [24134],
            '#p': [user.pubkey],
            '#e': [], // Will be populated with the request event ID
            since: Math.floor(Date.now() / 1000),
          }
        ]);

        subscription.then(events => {
          clearTimeout(timeout);
          
          const responseEvent = events.find(event => {
            try {
              const content = JSON.parse(event.content);
              return content.id === callId;
            } catch {
              return false;
            }
          });

          if (responseEvent) {
            try {
              const response = JSON.parse(responseEvent.content);
              resolve(response);
            } catch (error) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error('No response received'));
          }
        }).catch(reject);
      });
    },
  });

  // Get relay info
  const getRelayInfo = useMutation({
    mutationFn: async (relay_url: string) => {
      return makeRpcCall.mutateAsync({
        method: 'relay_info',
        relay_url,
      });
    },
  });

  // Get user relay list
  const getUserRelayList = useMutation({
    mutationFn: async (pubkey?: string) => {
      return makeRpcCall.mutateAsync({
        method: 'relay_list',
        params: pubkey ? { pubkey } : {},
      });
    },
  });

  // Set user relay
  const setUserRelay = useMutation({
    mutationFn: async ({ relay_url, read = true, write = true }: { 
      relay_url: string; 
      read?: boolean; 
      write?: boolean; 
    }) => {
      return makeRpcCall.mutateAsync({
        method: 'relay_set',
        params: { relay_url, read, write },
      });
    },
  });

  // Unset user relay
  const unsetUserRelay = useMutation({
    mutationFn: async (relay_url: string) => {
      return makeRpcCall.mutateAsync({
        method: 'relay_unset',
        params: { relay_url },
      });
    },
  });

  // Get user info
  const getUserInfo = useMutation({
    mutationFn: async (pubkey?: string) => {
      return makeRpcCall.mutateAsync({
        method: 'user_info',
        params: pubkey ? { pubkey } : {},
      });
    },
  });

  // List users
  const listUsers = useMutation({
    mutationFn: async ({ limit = 100, offset = 0 }: { limit?: number; offset?: number } = {}) => {
      return makeRpcCall.mutateAsync({
        method: 'user_list',
        params: { limit, offset },
      });
    },
  });

  // Set user info
  const setUserInfo = useMutation({
    mutationFn: async (userInfo: Record<string, any>) => {
      return makeRpcCall.mutateAsync({
        method: 'user_set',
        params: userInfo,
      });
    },
  });

  // Unset user
  const unsetUser = useMutation({
    mutationFn: async (pubkey: string) => {
      return makeRpcCall.mutateAsync({
        method: 'user_unset',
        params: { pubkey },
      });
    },
  });

  // Get event count
  const getEventCount = useMutation({
    mutationFn: async (filters?: Record<string, any>) => {
      return makeRpcCall.mutateAsync({
        method: 'event_count',
        params: filters || {},
      });
    },
  });

  // Delete events
  const deleteEvents = useMutation({
    mutationFn: async (filters: Record<string, any>) => {
      return makeRpcCall.mutateAsync({
        method: 'event_delete',
        params: filters,
      });
    },
  });

  // Get storage quota
  const getStorageQuota = useMutation({
    mutationFn: async (pubkey?: string) => {
      return makeRpcCall.mutateAsync({
        method: 'storage_quota',
        params: pubkey ? { pubkey } : {},
      });
    },
  });

  // Get billing info
  const getBillingInfo = useMutation({
    mutationFn: async () => {
      return makeRpcCall.mutateAsync({
        method: 'billing_info',
      });
    },
  });

  // Make payment
  const makePayment = useMutation({
    mutationFn: async (paymentData: Record<string, any>) => {
      return makeRpcCall.mutateAsync({
        method: 'billing_pay',
        params: paymentData,
      });
    },
  });

  // Admin methods
  const listAdmins = useMutation({
    mutationFn: async () => {
      return makeRpcCall.mutateAsync({
        method: 'admin_list',
      });
    },
  });

  const setAdmin = useMutation({
    mutationFn: async (pubkey: string) => {
      return makeRpcCall.mutateAsync({
        method: 'admin_set',
        params: { pubkey },
      });
    },
  });

  const unsetAdmin = useMutation({
    mutationFn: async (pubkey: string) => {
      return makeRpcCall.mutateAsync({
        method: 'admin_unset',
        params: { pubkey },
      });
    },
  });

  // Ban/unban users
  const banUser = useMutation({
    mutationFn: async ({ pubkey, reason }: { pubkey: string; reason?: string }) => {
      return makeRpcCall.mutateAsync({
        method: 'ban_user',
        params: { pubkey, reason },
      });
    },
  });

  const unbanUser = useMutation({
    mutationFn: async (pubkey: string) => {
      return makeRpcCall.mutateAsync({
        method: 'unban_user',
        params: { pubkey },
      });
    },
  });

  const listBannedUsers = useMutation({
    mutationFn: async () => {
      return makeRpcCall.mutateAsync({
        method: 'list_banned_users',
      });
    },
  });

  // Whitelist methods
  const whitelistUser = useMutation({
    mutationFn: async (pubkey: string) => {
      return makeRpcCall.mutateAsync({
        method: 'whitelist_user',
        params: { pubkey },
      });
    },
  });

  const unwhitelistUser = useMutation({
    mutationFn: async (pubkey: string) => {
      return makeRpcCall.mutateAsync({
        method: 'unwhitelist_user',
        params: { pubkey },
      });
    },
  });

  const listWhitelistedUsers = useMutation({
    mutationFn: async () => {
      return makeRpcCall.mutateAsync({
        method: 'list_whitelisted_users',
      });
    },
  });

  return {
    // Core RPC
    makeRpcCall: makeRpcCall.mutateAsync,
    isLoading: makeRpcCall.isPending,
    
    // Relay methods
    getRelayInfo: getRelayInfo.mutateAsync,
    getUserRelayList: getUserRelayList.mutateAsync,
    setUserRelay: setUserRelay.mutateAsync,
    unsetUserRelay: unsetUserRelay.mutateAsync,
    
    // User methods
    getUserInfo: getUserInfo.mutateAsync,
    listUsers: listUsers.mutateAsync,
    setUserInfo: setUserInfo.mutateAsync,
    unsetUser: unsetUser.mutateAsync,
    
    // Event methods
    getEventCount: getEventCount.mutateAsync,
    deleteEvents: deleteEvents.mutateAsync,
    
    // Billing methods
    getStorageQuota: getStorageQuota.mutateAsync,
    getBillingInfo: getBillingInfo.mutateAsync,
    makePayment: makePayment.mutateAsync,
    
    // Admin methods
    listAdmins: listAdmins.mutateAsync,
    setAdmin: setAdmin.mutateAsync,
    unsetAdmin: unsetAdmin.mutateAsync,
    
    // Moderation methods
    banUser: banUser.mutateAsync,
    unbanUser: unbanUser.mutateAsync,
    listBannedUsers: listBannedUsers.mutateAsync,
    whitelistUser: whitelistUser.mutateAsync,
    unwhitelistUser: unwhitelistUser.mutateAsync,
    listWhitelistedUsers: listWhitelistedUsers.mutateAsync,
    
    // Loading states
    isRelayInfoLoading: getRelayInfo.isPending,
    isUserRelayListLoading: getUserRelayList.isPending,
    isSettingUserRelay: setUserRelay.isPending,
    isUnsettingUserRelay: unsetUserRelay.isPending,
    isUserInfoLoading: getUserInfo.isPending,
    isListingUsers: listUsers.isPending,
    isSettingUserInfo: setUserInfo.isPending,
    isUnsettingUser: unsetUser.isPending,
    isEventCountLoading: getEventCount.isPending,
    isDeletingEvents: deleteEvents.isPending,
    isStorageQuotaLoading: getStorageQuota.isPending,
    isBillingInfoLoading: getBillingInfo.isPending,
    isPaymentLoading: makePayment.isPending,
    isAdminListLoading: listAdmins.isPending,
    isSettingAdmin: setAdmin.isPending,
    isUnsettingAdmin: unsetAdmin.isPending,
    isBanningUser: banUser.isPending,
    isUnbanningUser: unbanUser.isPending,
    isBannedListLoading: listBannedUsers.isPending,
    isWhitelistingUser: whitelistUser.isPending,
    isUnwhitelistingUser: unwhitelistUser.isPending,
    isWhitelistLoading: listWhitelistedUsers.isPending,
  };
}