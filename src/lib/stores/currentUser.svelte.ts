import { type NDKUser } from '@nostr-dev-kit/ndk';

let currentUser: CurrentUser | null = $state(null);

export class CurrentUser {
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

export function unSetCurrentUser() {
	currentUser = null;
}
