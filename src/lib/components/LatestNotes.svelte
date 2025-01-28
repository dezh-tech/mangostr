<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	import { getCurrentRelay } from '$lib/stores/relay.svelte';
	import { type Event } from 'nostr-tools';
	import { writable, type Writable } from 'svelte/store';

	const relay = $derived(getCurrentRelay());
	let events: Writable<Event[]> = writable([]);

	// svelte-ignore state_referenced_locally
	let sub = relay?.relay?.subscribe(
		[
			{
				limit: 10
			}
		],
		{
			onevent(event) {
				events.update((currentEvents) => {
					currentEvents.push(event);
					return currentEvents;
				});
				console.log(event);
			},

			oneose() {
				sub?.close();
			}
		}
	);
</script>

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
				{#each $events as e}
					<Table.Row>
						<Table.Cell>
							<div class="font-medium">{e.pubkey}</div>
						</Table.Cell>
						<Table.Cell class="xl:table.-column">{e.content}</Table.Cell>
						<Table.Cell class="xl:table.-column">
							<Badge class="text-xs" variant="outline">{e.kind}</Badge>
						</Table.Cell>
						<Table.Cell class="md:table.-cell xl:table.-column"
							>{new Date(e.created_at).toString()}</Table.Cell
						>
						<Table.Cell class="text-right">
							<Button href="##" size="sm" class="ml-auto gap-1">
								Open
								<ArrowUpRight class="h-4 w-4" />
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
