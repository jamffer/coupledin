import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { PartnerGreetingHeader } from '@/components/partner-greeting-header';
import type { ProfileLike } from '@/lib/greeting';

const mocks = vi.hoisted(() => {
  return {
    realtimeCallback: { current: null as ((payload: any) => void) | null },
    subscribeMock: vi.fn(),
    removeChannelMock: vi.fn(),
  };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: () => ({
      on: (_event: string, _filter: any, cb: (payload: any) => void) => {
        mocks.realtimeCallback.current = cb;
        return { subscribe: mocks.subscribeMock };
      },
    }),
    removeChannel: mocks.removeChannelMock,
  },
}));

const userProfile: ProfileLike = { display_name: 'Lilian' };
const partnerProfile: ProfileLike = { display_name: 'Jorge' };

describe('Couple lifecycle integration', () => {
  beforeEach(() => {
    mocks.realtimeCallback.current = null;
    mocks.subscribeMock.mockClear();
    mocks.removeChannelMock.mockClear();
    // Force a deterministic time (morning -> "Bom dia")
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 6, 9, 0, 0));
  });

  /**
   * Scenario A — Partner does not exist yet.
   * The Supabase response only contains the main user's profile.
   * Expectation: greeting shows only the user's first name AND the
   * "pending avatar" component is mounted in the DOM.
   */
  it('Scenario A: renders only the main user greeting and shows the pending avatar', () => {
    render(
      <PartnerGreetingHeader
        userId="user-1"
        coupleId="couple-1"
        initialProfile={userProfile}
        initialPartner={null}
      />
    );

    expect(screen.getByTestId('greeting')).toHaveTextContent('Bom dia, Lilian!');
    expect(screen.getByTestId('greeting').textContent).not.toMatch(/Jorge/);
    expect(screen.getByTestId('pending-avatar')).toBeInTheDocument();
    expect(screen.queryByTestId('partner-avatar')).not.toBeInTheDocument();
  });

  /**
   * Scenario C — Reactive greeting swap via the Realtime channel.
   * We mount the header without a partner, then push a synthetic
   * INSERT/UPDATE payload through the captured channel callback.
   * Expectation: the greeting node updates asynchronously to include
   * BOTH names — confirming the subscription is effective.
   */
  it('Scenario C: reactively updates the greeting when a partner joins via realtime', async () => {
    render(
      <PartnerGreetingHeader
        userId="user-1"
        coupleId="couple-1"
        initialProfile={userProfile}
        initialPartner={null}
      />
    );

    expect(screen.getByTestId('greeting')).toHaveTextContent('Bom dia, Lilian!');
    expect(mocks.realtimeCallback.current).toBeTypeOf('function');

    // Inject a fake realtime payload as if Supabase had fired it
    act(() => {
      mocks.realtimeCallback.current?.({
        eventType: 'INSERT',
        new: { id: 'user-2', display_name: 'Jorge', couple_id: 'couple-1' },
      });
    });

    expect(await screen.findByText('Bom dia, Lilian e Jorge!')).toBeInTheDocument();
    expect(screen.getByTestId('partner-avatar')).toBeInTheDocument();
    expect(screen.queryByTestId('pending-avatar')).not.toBeInTheDocument();
  });
});
