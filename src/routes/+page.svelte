<script lang="ts">
	import Event from 'lucide-svelte/icons/send';
	import Cable from 'lucide-svelte/icons/cable';
	import Timer from 'lucide-svelte/icons/timer';
	import Flame from 'lucide-svelte/icons/flame';
	import SnowFlake from 'lucide-svelte/icons/snowflake';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Header from '$lib/components/Header.svelte';
	import RelayInfo from '$lib/components/RelayInfo.svelte';
	import RelayModal from '$lib/components/RelayModal.svelte';
	import LatestNotes from '$lib/components/LatestNotes.svelte';

	let showModal = true;

	function closeModal() {
		showModal = false;
	}
</script>

<div class="flex min-h-screen w-full flex-col">
	<Header />
	<RelayModal show={showModal} on:close={closeModal} />
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
			<LatestNotes />
			<RelayInfo />
		</div>
	</main>
</div>
