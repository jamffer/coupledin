/**
 * Pure greeting utility — Single Source of Truth for the Header greeting.
 * Extracted to be unit-testable and reusable across Dashboard layouts.
 */
export interface ProfileLike {
  display_name?: string | null;
}

export function buildGreeting(
  profile: ProfileLike | null | undefined,
  partner: ProfileLike | null | undefined,
  now: Date = new Date()
): string {
  const hour = now.getHours();
  let base = 'Bom dia';
  if (hour >= 12 && hour < 18) base = 'Boa tarde';
  if (hour >= 18 || hour < 5) base = 'Boa noite';

  if (!profile?.display_name) return base;

  const firstName = profile.display_name.split(' ')[0];

  if (partner?.display_name) {
    const partnerFirstName = partner.display_name.split(' ')[0];
    return `${base}, ${firstName} e ${partnerFirstName}!`;
  }

  return `${base}, ${firstName}!`;
}
