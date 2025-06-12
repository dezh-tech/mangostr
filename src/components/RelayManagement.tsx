import { useState } from 'react';
import { Plus, Trash2, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useManagedRelays } from '@/hooks/useManagedRelays';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';
import { RelayInfoCard } from './RelayInfoCard';
import { LoginArea } from './auth/LoginArea';

export function RelayManagement() {
  const [newRelayUrl, setNewRelayUrl] = useState('');
  const [selectedRelay, setSelectedRelay] = useState<string | null>(null);
  const { user } = useCurrentUser();
  const { toast } = useToast();
  
  const {
    managedRelays,
    isLoading,
    addRelay,
    removeRelay,
    checkRelayStatus,
    relayStatuses,
    isAddingRelay,
    isRemovingRelay,
  } = useManagedRelays();

  const handleAddRelay = () => {
    if (!newRelayUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a relay URL',
        variant: 'destructive',
      });
      return;
    }

    // Validate URL format
    try {
      const url = new URL(newRelayUrl);
      if (!url.protocol.startsWith('ws')) {
        throw new Error('Invalid protocol');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Please enter a valid WebSocket URL (ws:// or wss://)',
        variant: 'destructive',
      });
      return;
    }

    addRelay(newRelayUrl);
    setNewRelayUrl('');
  };

  const handleRemoveRelay = (relayUrl: string) => {
    removeRelay(relayUrl);
    if (selectedRelay === relayUrl) {
      setSelectedRelay(null);
    }
  };

  const handleCheckStatus = async (relayUrl: string) => {
    await checkRelayStatus(relayUrl);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Relay Management
            </CardTitle>
            <CardDescription>
              Manage your Nostr relays using NIP-86 protocol
            </CardDescription>
          </CardHeader>
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-6">
              <p className="text-muted-foreground">
                Please log in to manage your relays
              </p>
              <LoginArea className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Relay Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Nostr relays using NIP-86 protocol
          </p>
        </div>
        <LoginArea className="max-w-60" />
      </div>

      {/* Add Relay Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Relay
          </CardTitle>
          <CardDescription>
            Enter a WebSocket URL to add a new relay to your managed list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="wss://relay.example.com"
              value={newRelayUrl}
              onChange={(e) => setNewRelayUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRelay()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddRelay}
              disabled={isAddingRelay}
              className="min-w-20"
            >
              {isAddingRelay ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Relay List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Managed Relays</CardTitle>
              <CardDescription>
                {managedRelays.length} relay{managedRelays.length !== 1 ? 's' : ''} in your list
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : managedRelays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground space-y-4">
                  <p>No relays added yet. Add your first relay above.</p>
                  <div className="text-sm">
                    <p className="mb-2">Popular relays to try:</p>
                    <div className="space-y-1">
                      <div className="font-mono text-xs">wss://relay.damus.io</div>
                      <div className="font-mono text-xs">wss://relay.nostr.band</div>
                      <div className="font-mono text-xs">wss://relay.primal.net</div>
                      <div className="font-mono text-xs">wss://nos.lol</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {managedRelays.map((relay) => (
                    <div
                      key={relay.url}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                        selectedRelay === relay.url ? 'bg-muted' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedRelay(relay.url)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(relayStatuses[relay.url] || 'offline')}`} />
                        <div>
                          <div className="font-medium">{relay.url}</div>
                          <div className="text-sm text-muted-foreground">
                            {getStatusText(relayStatuses[relay.url] || 'offline')}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckStatus(relay.url);
                          }}
                          disabled={relayStatuses[relay.url] === 'connecting'}
                        >
                          {relayStatuses[relay.url] === 'connecting' ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRelay(relay.url);
                          }}
                          disabled={isRemovingRelay}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Relay Info Panel */}
        <div className="lg:col-span-1">
          {selectedRelay ? (
            <RelayInfoCard relayUrl={selectedRelay} />
          ) : (
            <Card>
              <CardContent className="py-12 px-8 text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a relay to view its information
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Powered by{' '}
          <a
            href="https://soapbox.pub/tools/mkstack/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Vibed with MKStack
          </a>
        </p>
      </div>
    </div>
  );
}