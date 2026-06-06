import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { buildGreeting, type ProfileLike } from '@/lib/greeting';

interface PartnerGreetingHeaderProps {
  userId: string;
  coupleId: string;
  initialProfile: ProfileLike | null;
  initialPartner: ProfileLike | null;
}

/**
 * Reactive Header component:
 * - Renders the dynamic greeting based on user + partner profiles.
 * - Subscribes to realtime updates on the `profiles` table, filtered by couple_id.
 * - When the partner connects (INSERT/UPDATE), updates greeting & avatar without reload.
 */
export function PartnerGreetingHeader({
  userId,
  coupleId,
  initialProfile,
  initialPartner,
}: PartnerGreetingHeaderProps) {
  const [profile, setProfile] = useState<ProfileLike | null>(initialProfile);
  const [partner, setPartner] = useState<ProfileLike | null>(initialPartner);

  useEffect(() => {
    const channel = supabase
      .channel('couple-profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload: any) => {
          const newRow = payload?.new;
          if (!newRow) return;
          if (newRow.id === userId) {
            setProfile(newRow);
          } else {
            setPartner(newRow);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, coupleId]);

  return (
    <header>
      <h1 data-testid="greeting">{buildGreeting(profile, partner)}</h1>
      {partner ? (
        <div data-testid="partner-avatar" aria-label={`Avatar de ${partner.display_name}`}>
          {partner.display_name?.[0]}
        </div>
      ) : (
        <div
          data-testid="pending-avatar"
          role="button"
          aria-label="Aguardando convite"
        >
          +
        </div>
      )}
    </header>
  );
}
