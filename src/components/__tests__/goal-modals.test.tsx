import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { EditGoalModal } from "@/components/investments/edit-goal-modal";
import { NewGoalModal } from "@/components/investments/new-goal-modal";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("@/hooks/use-profile", () => ({
  useProfile: () => ({
    profile: { couple_id: "couple-1" },
    isLoading: false,
  }),
}));

vi.mock("@/hooks/use-goals", () => ({
  goalSchema: z.object({
    title: z.string().min(1, "O titulo e obrigatorio"),
    target_amount: z.coerce.number().positive("O valor alvo deve ser maior que zero"),
    saved_amount: z.coerce.number().min(0).optional(),
    deadline: z.date().optional().nullable(),
    image_url: z.string().optional().nullable(),
  }),
  useCreateGoal: () => ({ mutate: mocks.create, isPending: false }),
  useUpdateGoal: () => ({ mutate: mocks.update, isPending: false }),
  useDeleteGoal: () => ({ mutate: mocks.remove, isPending: false }),
}));

describe("goal modals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a valid new goal", async () => {
    const user = userEvent.setup();

    render(<NewGoalModal isOpen onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/t.tulo da meta/i), "Reserva de teste");
    await user.clear(screen.getByLabelText(/valor alvo/i));
    await user.type(screen.getByLabelText(/valor alvo/i), "1000");
    await user.click(screen.getByRole("button", { name: /criar meta/i }));

    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.create.mock.calls[0][0]).toMatchObject({
      title: "Reserva de teste",
      target_amount: 1000,
      saved_amount: 0,
    });
  });

  it("sends the selected goal id when deletion is confirmed", async () => {
    const user = userEvent.setup();
    const goal = {
      id: "goal-123",
      couple_id: "couple-1",
      title: "Meta de teste",
      target_amount: 1000,
      saved_amount: 100,
      deadline: null,
      image_url: null,
      created_at: "2026-06-14T00:00:00.000Z",
    };

    render(<EditGoalModal goal={goal} isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /eliminar meta/i }));
    await user.click(screen.getByRole("button", { name: /sim, eliminar meta/i }));

    expect(mocks.remove).toHaveBeenCalledTimes(1);
    expect(mocks.remove.mock.calls[0][0]).toBe("goal-123");
  });
});
