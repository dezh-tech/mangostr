import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';

const Index = () => {
  const navigate = useNavigate();

  useSeoMeta({
    title: 'Nostr Relay Manager',
    description: 'Manage your Nostr relays with NIP-86 protocol and view relay information via NIP-11.',
  });

  useEffect(() => {
    // Redirect to relay manager
    navigate('/relay-manager', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground">
          Loading Relay Manager...
        </p>
      </div>
    </div>
  );
};

export default Index;
