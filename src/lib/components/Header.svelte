<script lang="ts">
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Menu from 'lucide-svelte/icons/menu';

	import Logo from '$lib/assets/logo.webp';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';

	import { getCurrentUser, setCurrentUser, unSetCurrentUser } from '$lib/stores/currentUser.svelte';
	import {
		fetchUserProfile,
		getUserProfile,
		unSetUserProfile
	} from '$lib/stores/userProfile.svelte';
	import { onMount } from 'svelte';
	import ndk from '$lib/stores/ndk.svelte';
	import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
	import { shortenString } from '$lib/utils/utils';

	const currentUser = $derived(getCurrentUser());
	const currentUserProfile = $derived(getUserProfile());
	const userNpub = $derived.by(() => {
		return shortenString(currentUser?.user?.npub);
	});

	function login() {
		if (window.nostr) {
			ndk.signer = new NDKNip07Signer();
			ndk.signer.user().then((user) => {
				console.log('user', user);
				setCurrentUser(user);
				fetchUserProfile(user);
			});
		}
	}

	function logout() {
		unSetCurrentUser();
		unSetUserProfile();
	}

	onMount(() => {
		if (window.nostr) login();
	});
</script>

<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
	>
		<a href="/" class="flex items-center gap-2 text-lg font-semibold md:text-base">
			<img src={Logo} alt="Mangostr logo" class="h-8 w-8 object-cover" />
			<span>Mangostr</span>
		</a>
		<a href="##" class="pl-10 text-foreground transition-colors hover:text-foreground">
			Dashboard
		</a>
		<a href="##" class="text-muted-foreground transition-colors hover:text-foreground"> Access </a>
		<a href="##" class="text-muted-foreground transition-colors hover:text-foreground"> Storage </a>
		<a href="##" class="text-muted-foreground transition-colors hover:text-foreground"> Setting </a>
	</nav>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<nav class="grid gap-6 text-lg font-medium">
				<a href="##" class="flex items-center gap-2 text-lg font-semibold">
					<img src={Logo} alt="Mangostr logo" class="h-8 w-8 object-cover" />

					<span>Mangostr</span>
				</a>
				<a href="##" class="hover:text-foreground"> Dashboard </a>
				<a href="##" class="text-muted-foreground hover:text-foreground"> Orders </a>
				<a href="##" class="text-muted-foreground hover:text-foreground"> Access </a>
				<a href="##" class="text-muted-foreground hover:text-foreground"> Storage </a>
				<a href="##" class="text-muted-foreground hover:text-foreground"> Setting </a>
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
		<div class="ml-auto flex-1 sm:flex-initial"></div>
		<LightSwitch />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
					{#if currentUserProfile}
						<img
							src={currentUserProfile?.image}
							alt="user profile"
							class="h-10 w-10 rounded-full"
						/>
					{:else}
						<CircleUser class="h-5 w-5" />
					{/if}
					<span class="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#if currentUserProfile}
					<DropdownMenu.Label>{currentUserProfile.displayName}</DropdownMenu.Label>
				{/if}
				{#if currentUser}
					<DropdownMenu.Label>{userNpub}</DropdownMenu.Label>
				{:else}
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
				{/if}
				<DropdownMenu.Item on:click={logout}>Logout</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
