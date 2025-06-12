import { useQuery } from '@tanstack/react-query';
import type { RelayInformation } from '@/types/relay';

/**
 * Hook to fetch NIP-11 relay information document
 */
export function useRelayInfo(relayUrl: string) {
  return useQuery({
    queryKey: ['relay-info', relayUrl],
    queryFn: async () => {
      if (!relayUrl) throw new Error('Relay URL is required');
      
      // Convert ws:// or wss:// to http:// or https://
      const httpUrl = relayUrl
        .replace('ws://', 'http://')
        .replace('wss://', 'https://');
      
      const response = await fetch(httpUrl, {
        headers: {
          Accept: 'application/nostr+json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch relay info: ${response.status}`);
      }
      
      const info: RelayInformation = await response.json();
      return info;
    },
    enabled: !!relayUrl,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}