// NIP-11 Relay Information Document
export interface RelayInformation {
  name?: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips?: number[];
  software?: string;
  version?: string;
  limitation?: {
    max_message_length?: number;
    max_subscriptions?: number;
    max_filters?: number;
    max_limit?: number;
    max_subid_length?: number;
    max_event_tags?: number;
    max_content_length?: number;
    min_pow_difficulty?: number;
    auth_required?: boolean;
    payment_required?: boolean;
    created_at_lower_limit?: number;
    created_at_upper_limit?: number;
  };
  retention?: Array<{
    kinds?: number[];
    time?: number;
    count?: number;
  }>;
  relay_countries?: string[];
  language_tags?: string[];
  tags?: string[];
  posting_policy?: string;
  payments_url?: string;
  fees?: {
    admission?: Array<{
      amount: number;
      unit: string;
    }>;
    subscription?: Array<{
      amount: number;
      unit: string;
      period: number;
    }>;
    publication?: Array<{
      kinds: number[];
      amount: number;
      unit: string;
    }>;
  };
  icon?: string;
}

// NIP-86 Management Event Kinds
export const RELAY_MANAGEMENT_KINDS = {
  SET_RELAY_LIST: 10166,
  ADD_RELAY: 16266,
  REMOVE_RELAY: 16267,
  RELAY_STATUS: 16268,
} as const;

export interface ManagedRelay {
  url: string;
  info?: RelayInformation;
  status: 'online' | 'offline' | 'connecting' | 'error';
  lastChecked?: number;
  error?: string;
  isManaged: boolean;
}