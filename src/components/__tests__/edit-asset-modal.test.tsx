import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EditAssetModal } from "@/components/investments/edit-asset-modal";
import { Database } from "@/integrations/supabase/types";

type Investment = Database["public"]["Tables"]["investments"]["Row"];

vi.mock("@/hooks/use-investment-mutations", () => ({
  useUpdateInvestment: () => ({ mutate: vi.fn(), isPending: false }),
}));

const investment: Investment = {
  id: "investment-1",
  couple_id: "couple-1",
  asset_type: "STOCK",
  ticker: "PETR4",
  quantity: 10,
  average_price: 30,
  purchase_date: "2026-06-01",
  custom_rate: null,
  created_at: "2026-06-01T12:00:00.000Z",
  updated_at: "2026-06-01T12:00:00.000Z",
};

describe("EditAssetModal", () => {
  it("can open after initially rendering without an asset", () => {
    const { rerender } = render(<EditAssetModal isOpen={false} onClose={vi.fn()} asset={null} />);
    expect(() =>
      rerender(<EditAssetModal isOpen onClose={vi.fn()} asset={investment} />),
    ).not.toThrow();
  });
});
