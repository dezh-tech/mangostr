<script lang="ts">
	import Pencil from 'lucide-svelte/icons/pencil';
	import Eye from 'lucide-svelte/icons/eye';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	import { getCurrentRelay } from '$lib/stores/relay.svelte';
	import { shortenString } from '$lib/utils/utils';
	import { nip19 } from 'nostr-tools';

	const relay = $derived(getCurrentRelay());

	function openRelayPage() {
		window.open(`https://next.nostr.watch/relays/wss/${relay?.getURL()}`, '_blank');
	}
</script>

<Card.Root class="relative border p-4">
	<Card.Content class="relative">
		<div class="mb-4 flex items-start">
			<img src={relay?.getIcon()} alt="relay logo" class="mr-4 h-32 w-32 rounded-full" />
			<div class="flex-grow">
				<h1 class="font-extrabold">{relay?.getName()}</h1>
				<p class="text-sm font-light">{relay?.information?.description}</p>
			</div>
			<div class="flex space-x-2">
				<Button class="h-7 w-7 items-center justify-center p-0">
					<Pencil />
				</Button>
				<Button class="h-7 w-7 items-center justify-center p-0">
					<Eye on:click={openRelayPage} />
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
					<Table.Cell class="text-right">{relay?.information?.software}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Contact</Table.Cell>
					<Table.Cell class="text-right">{relay?.information?.contact}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Pubkey</Table.Cell>
					<Table.Cell class="text-right"
						>{shortenString(
							nip19.npubEncode(
								relay?.information?.pubkey
									? relay?.information?.pubkey
									: '0000000000000000000000000000000000000000000000000000000000000000'
							)
						)}</Table.Cell
					>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Supported NIPs</Table.Cell>
					<Table.Cell class="text-right">{relay?.information?.supported_nips}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="font-medium">Version</Table.Cell>
					<Table.Cell class="text-right">{relay?.information?.version}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
