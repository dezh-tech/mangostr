<script lang="ts">
	import { setCurrentRelay } from '$lib/stores/relay.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index';
	import { Relay } from 'nostr-tools';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let show = false;
	let url = '';
	let loading = false;

	async function submit() {
		loading = true;
		const relay = new Relay(url);
		await relay.connect();
		setCurrentRelay(relay)?.revolveNIP11();
		dispatch('close');
		loading = false;
	}

	onMount(() => {
		if (show) {
			document.getElementById('urlInput')?.focus();
		}
	});
</script>

{#if show}
	{#if !loading}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<Card.Root class="w-full max-w-md rounded-lg p-6 shadow-lg">
				<Card.Header>
					<Card.Title class="text-lg font-medium">Enter Relay Address</Card.Title>
					<p class="text-sm text-gray-600">Submit a relay address that you want to manage.</p>
				</Card.Header>

				<Card.Content>
					<div class="mt-4">
						<Input
							id="urlInput"
							type="url"
							bind:value={url}
							placeholder="wss://..."
							class="w-full rounded border border-gray-300 bg-white p-2 text-black"
							required
						/>
					</div>

					<div class="mt-4 flex justify-end">
						<Button on:click={submit} class="rounded bg-black px-4 py-2 text-white">Submit</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{:else}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<Card.Root class="w-full max-w-md rounded-lg p-6 shadow-lg">
				<Card.Header>
					<Card.Title class="text-lg font-medium">Connecting to {url}!</Card.Title>
					<p class="text-sm text-gray-600">we are trying to connect to your relay...</p>
				</Card.Header>

				<Card.Content></Card.Content>
			</Card.Root>
		</div>
	{/if}
{/if}
