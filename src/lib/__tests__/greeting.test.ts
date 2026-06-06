import { describe, it, expect } from 'vitest';
import { buildGreeting } from '@/lib/greeting';

describe('buildGreeting utility', () => {
  it('returns base greeting when no profile is set', () => {
    expect(buildGreeting(null, null, new Date(2026, 0, 1, 9))).toBe('Bom dia');
  });

  it('returns single-name greeting when partner is absent', () => {
    expect(
      buildGreeting({ display_name: 'Lilian' }, null, new Date(2026, 0, 1, 9))
    ).toBe('Bom dia, Lilian!');
  });

  it('returns dual-name greeting when partner is present', () => {
    expect(
      buildGreeting(
        { display_name: 'Lilian Monteiro' },
        { display_name: 'Jorge Silva' },
        new Date(2026, 0, 1, 14)
      )
    ).toBe('Boa tarde, Lilian e Jorge!');
  });

  it('uses "Boa noite" after 18h', () => {
    expect(
      buildGreeting({ display_name: 'Lilian' }, null, new Date(2026, 0, 1, 21))
    ).toBe('Boa noite, Lilian!');
  });
});
