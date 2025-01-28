import { nip11, Relay } from 'nostr-tools';

let currentRelay: CurrentRelay | null = $state(null);

class CurrentRelay {
	relay: Relay | null = $state(null);
	information: nip11.RelayInformation | null = $state(null);

	constructor(relay: Relay) {
		this.relay = relay;
	}

	async revolveNIP11() {
		if (this.relay?.url) {
			const info = await nip11.fetchRelayInformation(this.relay?.url);
			this.information = info;
			return info;
		} else {
			return null;
		}
	}

	getName() {
		if (this.information) {
			return this.information.name;
		}

		return 'No Name';
	}

	getIcon() {
		if (this.information) {
			return this.information.icon;
		}

		return 'https://placehold.co/400';
	}

	getLimitations() {
		if (this.information) {
			return this.information.limitation;
		}

		return undefined;
	}

	getURL() {
		if (this.relay) {
			const url = this.relay.url;
			if (url.startsWith('wss://')) {
				return url.slice(6);
			} else if (url.startsWith('ws://')) {
				return url.slice(5);
			}
		}

		return '';
	}
}

export function getCurrentRelay(): CurrentRelay | null {
	return currentRelay;
}

export function setCurrentRelay(relay: Relay | null): CurrentRelay | null {
	currentRelay = relay ? new CurrentRelay(relay) : null;
	return currentRelay;
}
