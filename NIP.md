# NIP-86: Relay Management

`draft` `optional`

This NIP defines a protocol for users to manage their relay lists on the Nostr network. It allows users to add, remove, and organize their relays in a decentralized manner.

## Events

### Relay List Event (`kind:10166`)

A user publishes a list of relays they are managing. This event replaces any previous relay list event from the same author.

```json
{
  "kind": 10166,
  "content": "",
  "tags": [
    ["r", "wss://relay1.example.com"],
    ["r", "wss://relay2.example.com"],
    ["r", "wss://relay3.example.com"]
  ]
}
```

#### Tags

- `r` - Relay URL (WebSocket)
  - The relay URL MUST use WebSocket protocol (`ws://` or `wss://`)
  - Each relay is represented by a separate `r` tag

### Add Relay Event (`kind:16266`)

A user publishes an event to add a relay to their managed list. This is an optional event type for clients that want to track individual relay additions.

```json
{
  "kind": 16266,
  "content": "",
  "tags": [
    ["r", "wss://newrelay.example.com"],
    ["action", "add"]
  ]
}
```

### Remove Relay Event (`kind:16267`)

A user publishes an event to remove a relay from their managed list. This is an optional event type for clients that want to track individual relay removals.

```json
{
  "kind": 16267,
  "content": "",
  "tags": [
    ["r", "wss://oldrelay.example.com"],
    ["action", "remove"]
  ]
}
```

### Relay Status Event (`kind:16268`)

A user publishes relay status information. This can be used to share connectivity status or other metadata about relays.

```json
{
  "kind": 16268,
  "content": "",
  "tags": [
    ["r", "wss://relay.example.com"],
    ["status", "online"],
    ["last_checked", "1735012345"]
  ]
}
```

#### Status Values

- `online` - Relay is reachable and responding
- `offline` - Relay is not reachable
- `error` - Relay returned an error
- `connecting` - Currently attempting to connect

## Implementation

### Client Behavior

1. **Reading Relay Lists**: Clients SHOULD query for the most recent `kind:10166` event from a user to determine their current relay list.

2. **Updating Relay Lists**: When a user adds or removes relays, clients SHOULD publish an updated `kind:10166` event with the complete relay list.

3. **Individual Events**: Clients MAY also publish `kind:16266` and `kind:16267` events for individual additions and removals for better event history tracking.

4. **Status Tracking**: Clients MAY publish `kind:16268` events to share relay status information with other clients.

### Relay Integration

Relays implementing this NIP SHOULD:

1. Store and serve `kind:10166` events as replaceable events (only the most recent per author)
2. Store individual relay management events (`kind:16266`, `kind:16267`, `kind:16268`) as regular events
3. Support querying by relay URL using `#r` tag filters

## Relay Information (NIP-11 Integration)

This NIP works in conjunction with [NIP-11](https://github.com/nostr-protocol/nips/blob/master/11.md) to provide relay information. Clients implementing this NIP SHOULD:

1. Fetch NIP-11 relay information documents for managed relays
2. Display relay capabilities, limitations, and other metadata to users
3. Use relay information to help users make informed decisions about relay management

## Security Considerations

- Users should verify relay URLs before adding them to their lists
- Clients should validate that relay URLs use WebSocket protocols
- Relay status information should be treated as potentially outdated or inaccurate

## Privacy Considerations

- Publishing relay lists reveals which relays a user connects to
- Users concerned about privacy may choose not to publish their relay lists
- Clients SHOULD provide options for users to manage their relay lists privately

## Examples

### Basic Implementation

A simple client might only implement `kind:10166` events:

```javascript
// Add a relay
const currentRelays = await getUserRelayList(pubkey);
const newRelays = [...currentRelays, "wss://new.relay.com"];
await publishEvent({
  kind: 10166,
  content: "",
  tags: newRelays.map(url => ["r", url])
});

// Remove a relay  
const updatedRelays = currentRelays.filter(url => url !== "wss://old.relay.com");
await publishEvent({
  kind: 10166,
  content: "",
  tags: updatedRelays.map(url => ["r", url])
});
```

### Advanced Implementation

Clients may implement all event types for better tracking:

```javascript
// Add relay with individual event
await publishEvent({
  kind: 16266,
  content: "",
  tags: [
    ["r", "wss://new.relay.com"],
    ["action", "add"]
  ]
});

// Update complete list
await publishEvent({
  kind: 10166,
  content: "",
  tags: [...currentRelays, "wss://new.relay.com"].map(url => ["r", url])
});

// Publish status
await publishEvent({
  kind: 16268,
  content: "",
  tags: [
    ["r", "wss://new.relay.com"],
    ["status", "online"],
    ["last_checked", Math.floor(Date.now() / 1000).toString()]
  ]
});
```