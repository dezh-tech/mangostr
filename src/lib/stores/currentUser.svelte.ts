import { browser } from '$app/environment';
import ndk from '$lib/stores/ndk.svelte';
import {
	type Hexpubkey,
	type NDKEvent,
	NDKKind,
	NDKNip07Signer,
	type NDKRelay,
	type NDKUser
} from '@nostr-dev-kit/ndk';

let currentUser: CurrentUser | null = $state(null);

class CurrentUser {
	user: NDKUser | null = $state(null);

	constructor(user: NDKUser) {
		this.user = user;
	}
}

export function getCurrentUser(): CurrentUser | null {
	return currentUser;
}

export function setCurrentUser(user: NDKUser | null): CurrentUser | null {
	currentUser = user ? new CurrentUser(user) : null;
	return currentUser;
}
