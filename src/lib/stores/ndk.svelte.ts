import NDK from '@nostr-dev-kit/ndk-svelte/svelte5';

export const ndkStore = new NDK({
	explicitRelayUrls: ['wss://f7z.io', 'wss://relay.primal.net', 'wss://relay.jellyfish.land'],
	autoConnectUserRelays: true,
	clientName: 'Mangostr'
});

ndkStore.connect().then(() => console.log('NDK Connected'));

// Create a singleton instance that is the default export
const ndk = $state(ndkStore);

export default ndk;
