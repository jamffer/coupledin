import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupNameForm } from '@/components/signup-name-form';

describe('Signup name validation (Scenario B)', () => {
  /**
   * Scenario B — Submitting without a name.
   * Expectation: Zod validation surfaces an error in the DOM
   * AND the onSubmit (representing the HTTP call) was NEVER invoked.
   */
  it('does not dispatch the HTTP call when name is empty and shows a validation error', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SignupNameForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /continuar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/obrigatório/i);
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('dispatches the HTTP call when a valid name is provided', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<SignupNameForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/como você quer ser chamado/i), 'Lilian');
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Lilian' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
