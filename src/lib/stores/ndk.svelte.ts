import { browser } from '$app/environment';
import type { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import NDK from '@nostr-dev-kit/ndk-svelte/svelte5';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';

let cacheAdapter: NDKCacheAdapter | undefined = $state(undefined);

cacheAdapter = new NDKCacheAdapterDexie({ dbName: 'mangostr' });

export const ndkStore = new NDK({
	explicitRelayUrls: [
		'wss://f7z.io',
		'wss://relay.damus.io',
		'wss://relay.primal.net',
		'wss://relay.jellyfish.land'
	],
	autoConnectUserRelays: true,
	cacheAdapter: cacheAdapter,
	clientName: 'Mangostr'
});

ndkStore.connect().then(() => console.log('NDK Connected'));

// Create a singleton instance that is the default export
const ndk = $state(ndkStore);

export default ndk;
