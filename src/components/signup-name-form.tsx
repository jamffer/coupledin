import { useState } from 'react';
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
});

interface SignupNameFormProps {
  onSubmit: (data: { name: string }) => void | Promise<void>;
}

/**
 * Minimal isolated form used to validate the "name is required" rule
 * before any API call is dispatched. Extracted so the validation behavior
 * can be covered with deterministic integration tests.
 */
export function SignupNameForm({ onSubmit }: SignupNameFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = signupSchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    await onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="signup-name">Como você quer ser chamado?</label>
      <input
        id="signup-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Continuar</button>
    </form>
  );
}
