import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import type { ManagedRelay } from '@/types/relay';
import { RELAY_MANAGEMENT_KINDS } from '@/types/relay';

/**
 * Hook to manage user's relay list using NIP-86
 */
export function useManagedRelays() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { mutate: publishEvent } = useNostrPublish();
  const queryClient = useQueryClient();
  const [relayStatuses, setRelayStatuses] = useState<Record<string, ManagedRelay['status']>>({});

  // Fetch user's relay list
  const { data: managedRelays = [], isLoading } = useQuery({
    queryKey: ['managed-relays', user?.pubkey],
    queryFn: async () => {
      if (!user?.pubkey) return [];
      
      const events = await nostr.query([
        {
          kinds: [RELAY_MANAGEMENT_KINDS.SET_RELAY_LIST],
          authors: [user.pubkey],
          limit: 1,
        },
      ]);
      
      if (events.length === 0) return [];
      
      const relayList = events[0];
      const relays: ManagedRelay[] = [];
      
      // Parse r tags for relay URLs
      for (const tag of relayList.tags) {
        if (tag[0] === 'r' && tag[1]) {
          const url = tag[1];
          relays.push({
            url,
            status: relayStatuses[url] || 'offline',
            isManaged: true,
          });
        }
      }
      
      return relays;
    },
    enabled: !!user?.pubkey,
  });

  // Check relay status
  const checkRelayStatus = useCallback(async (url: string): Promise<ManagedRelay['status']> => {
    try {
      setRelayStatuses(prev => ({ ...prev, [url]: 'connecting' }));
      
      const ws = new WebSocket(url);
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          ws.close();
          setRelayStatuses(prev => ({ ...prev, [url]: 'error' }));
          resolve('error');
        }, 5000);
        
        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          setRelayStatuses(prev => ({ ...prev, [url]: 'online' }));
          resolve('online');
        };
        
        ws.onerror = () => {
          clearTimeout(timeout);
          setRelayStatuses(prev => ({ ...prev, [url]: 'offline' }));
          resolve('offline');
        };
      });
    } catch {
      setRelayStatuses(prev => ({ ...prev, [url]: 'error' }));
      return 'error';
    }
  }, []);

  // Add relay to managed list
  const addRelay = useMutation({
    mutationFn: async (relayUrl: string) => {
      if (!user) throw new Error('User not logged in');
      
      const currentRelays = managedRelays.map(r => r.url);
      if (currentRelays.includes(relayUrl)) {
        throw new Error('Relay already in list');
      }
      
      const relayTags = [...currentRelays, relayUrl].map(url => ['r', url]);
      
      publishEvent({
        kind: RELAY_MANAGEMENT_KINDS.SET_RELAY_LIST,
        content: '',
        tags: relayTags,
      });
      
      return relayUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-relays'] });
    },
  });

  // Remove relay from managed list
  const removeRelay = useMutation({
    mutationFn: async (relayUrl: string) => {
      if (!user) throw new Error('User not logged in');
      
      const currentRelays = managedRelays.map(r => r.url);
      const filteredRelays = currentRelays.filter(url => url !== relayUrl);
      
      const relayTags = filteredRelays.map(url => ['r', url]);
      
      publishEvent({
        kind: RELAY_MANAGEMENT_KINDS.SET_RELAY_LIST,
        content: '',
        tags: relayTags,
      });
      
      return relayUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-relays'] });
    },
  });

  return {
    managedRelays,
    isLoading,
    addRelay: addRelay.mutate,
    removeRelay: removeRelay.mutate,
    checkRelayStatus,
    relayStatuses,
    isAddingRelay: addRelay.isPending,
    isRemovingRelay: removeRelay.isPending,
  };
}