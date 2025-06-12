import { ExternalLink, Globe, Shield, DollarSign, Database, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRelayInfo } from '@/hooks/useRelayInfo';

interface RelayInfoCardProps {
  relayUrl: string;
}

export function RelayInfoCard({ relayUrl }: RelayInfoCardProps) {
  const { data: info, isLoading, error } = useRelayInfo(relayUrl);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-12" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Relay Information
          </CardTitle>
          <CardDescription>{relayUrl}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to fetch relay information: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formatUrl = (url: string) => {
    return url.replace('ws://', 'http://').replace('wss://', 'https://');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {info?.name || 'Relay Information'}
        </CardTitle>
        <CardDescription className="break-all">{relayUrl}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {info?.description && (
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </div>
        )}

        {info?.software && (
          <div>
            <h4 className="font-medium mb-2">Software</h4>
            <p className="text-sm">
              {info.software}
              {info.version && ` v${info.version}`}
            </p>
          </div>
        )}

        {info?.contact && (
          <div>
            <h4 className="font-medium mb-2">Contact</h4>
            <p className="text-sm text-muted-foreground break-all">{info.contact}</p>
          </div>
        )}

        <Separator />

        {info?.supported_nips && info.supported_nips.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Supported NIPs
            </h4>
            <div className="flex flex-wrap gap-1">
              {info.supported_nips.slice(0, 10).map((nip) => (
                <Badge key={nip} variant="secondary" className="text-xs">
                  NIP-{nip}
                </Badge>
              ))}
              {info.supported_nips.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{info.supported_nips.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {info?.limitation && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Limitations
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {info.limitation.max_message_length && (
                <div>Max message length: {info.limitation.max_message_length.toLocaleString()}</div>
              )}
              {info.limitation.max_subscriptions && (
                <div>Max subscriptions: {info.limitation.max_subscriptions}</div>
              )}
              {info.limitation.max_filters && (
                <div>Max filters: {info.limitation.max_filters}</div>
              )}
              {info.limitation.max_content_length && (
                <div>Max content length: {info.limitation.max_content_length.toLocaleString()}</div>
              )}
              {info.limitation.auth_required && (
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Authentication required
                </div>
              )}
              {info.limitation.payment_required && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Payment required
                </div>
              )}
            </div>
          </div>
        )}

        {info?.fees && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fees
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {info.fees?.admission && info.fees.admission.length > 0 && (
                <div>
                  Admission: {info.fees.admission.map((fee, i) => (
                    <span key={i}>
                      {fee.amount} {fee.unit}
                      {i < (info.fees?.admission?.length || 0) - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {info.fees?.subscription && info.fees.subscription.length > 0 && (
                <div>
                  Subscription: {info.fees.subscription.map((fee, i) => (
                    <span key={i}>
                      {fee.amount} {fee.unit}/{fee.period}s
                      {i < (info.fees?.subscription?.length || 0) - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {info?.relay_countries && info.relay_countries.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Countries</h4>
            <div className="flex flex-wrap gap-1">
              {info.relay_countries.map((country) => (
                <Badge key={country} variant="outline" className="text-xs">
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {info?.language_tags && info.language_tags.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Languages</h4>
            <div className="flex flex-wrap gap-1">
              {info.language_tags.map((lang) => (
                <Badge key={lang} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(formatUrl(relayUrl), '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Relay
          </Button>
          {info?.payments_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(info.payments_url, '_blank')}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}