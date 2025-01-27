import { NDKUser, NDKUserProfile } from '@nostr-dev-kit/ndk';

let userProfile: NDKUserProfile | null = $state(null);

export async function fetchUserProfile(user: NDKUser) {
	if (user) {
		const profile = await user.fetchProfile();
		userProfile = profile;
		return profile;
	}
}

export function getUserProfile() {
	return userProfile;
}
