<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Event from 'lucide-svelte/icons/send';
	import Menu from 'lucide-svelte/icons/menu';
	import Cable from 'lucide-svelte/icons/cable';
	import Timer from 'lucide-svelte/icons/timer';
	import Flame from 'lucide-svelte/icons/flame';
	import SnowFlake from 'lucide-svelte/icons/snowflake';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Eye from 'lucide-svelte/icons/eye';

	import Logo from '$lib/assets/logo.webp';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';

	import { getCurrentUser, setCurrentUser } from '$lib/stores/currentUser.svelte';
	import { onMount } from 'svelte';
	import ndk from '$lib/stores/ndk.svelte';
	import { NDKNip07Signer } from '@nostr-dev-kit/ndk';

	const currentUser = $derived(getCurrentUser());

	function login() {
		if (window.nostr) {
			ndk.signer = new NDKNip07Signer();
			ndk.signer.user().then((user) => {
				console.log('user', user);
				setCurrentUser(user);
			});
		}
	}

	onMount(() => {
		if (window.nostr) login();
	});
</script>

<div class="flex min-h-screen w-full flex-col">
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
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Access
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Storage
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Setting
			</a>
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
						<!-- {#if currentUser}
							<img
								src={currentUser.profile?.image}
								alt="user profile"
								class="mr-4 h-32 w-32 rounded-full"
							/>
						{:else}
							<CircleUser class="h-5 w-5" />
						{/if} -->
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#if currentUser}
						<DropdownMenu.Label>{currentUser.user?.npub}</DropdownMenu.Label>
					{:else}
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
					{/if}
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Events</Card.Title>
					<Event class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">1,000,000</div>
					<p class="text-xs text-muted-foreground">~10 event/s</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Relay Uptime</Card.Title>
					<Timer class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">10 Hours</div>
					<p class="text-xs text-muted-foreground"></p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Live Connections(ws)</Card.Title>
					<Cable class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">50</div>
					<p class="text-xs text-muted-foreground"></p>
				</Card.Content>
			</Card.Root>
			<Card.Root class="relative">
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Is Active</Card.Title>
					<SnowFlake class="h-4 w-4 text-muted-foreground" />
					<!-- <Flame class="h-4 w-4 text-muted-foreground" /> -->
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">Freezed</div>
					<p class="text-xs text-muted-foreground">Freezed about 1 hour ago.</p>
				</Card.Content>
				<Button class="absolute right-5 top-20 bg-red-500 text-white">
					UnFreeze
					<Flame />
				</Button>
				<!-- <Button class="absolute right-5 top-20 bg-blue-500 text-white">
					Freeze
					<SnowFlake />
				</Button> -->
			</Card.Root>
		</div>
		<div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
			<Card.Root class="xl:col-span-2">
				<Card.Header class="flex flex-row items-center">
					<div class="grid gap-2">
						<Card.Title>Last Events</Card.Title>
						<Card.Description>Recent events received on this relay.</Card.Description>
					</div>
					<Button href="##" size="sm" class="ml-auto gap-1">
						View All
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>User</Table.Head>
								<Table.Head class="xl:table.-column">Content</Table.Head>
								<Table.Head class="xl:table.-column">Kind</Table.Head>
								<Table.Head class="xl:table.-column">Timestamp</Table.Head>
								<Table.Head class="text-right"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">Kay</div>
									<div class="text-sm text-muted-foreground md:inline">kay@nostr.eco</div>
								</Table.Cell>
								<Table.Cell class="xl:table.-column">BlahBlabBlah!</Table.Cell>
								<Table.Cell class="xl:table.-column">
									<Badge class="text-xs" variant="outline">Short Text Note</Badge>
								</Table.Cell>
								<Table.Cell class="md:table.-cell xl:table.-column">2023-06-23</Table.Cell>
								<Table.Cell class="text-right">
									<Button href="##" size="sm" class="ml-auto gap-1">
										Open
										<ArrowUpRight class="h-4 w-4" />
									</Button>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
			<Card.Root class="relative border p-4">
				<Card.Content class="relative">
					<div class="mb-4 flex items-start">
						<img
							src="https://placehold.co/400"
							alt="relay logo"
							class="mr-4 h-32 w-32 rounded-full"
						/>
						<div class="flex-grow">
							<h1 class="font-extrabold">Relay Name</h1>
							<p class="text-sm font-light">Relay Description</p>
						</div>
						<div class="flex space-x-2">
							<!-- todo: fix light mode issue. -->
							<Button class="flex h-10 w-10 items-center justify-center p-0 text-black">
								<Pencil />
							</Button>
							<Button class="flex h-10 w-10 items-center justify-center p-0 text-black">
								<Eye />
							</Button>
						</div>
					</div>

					<Table.Root class="relative mt-4">
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-[100px]">Name</Table.Head>
								<Table.Head class="text-right">Value</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell class="font-medium">Software</Table.Cell>
								<Table.Cell class="text-right">dezh-tech/immortal</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</main>
</div>
