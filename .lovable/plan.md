## Quality, Security, and Performance Review

### 1. Inconsistency in State Management
The application currently mixes **React Query** (in `CartoesPage`) and **Zustand with Persistence** (in `TransactionsPage`) for managing the same entities (transactions). Using `persist` in Zustand can lead to stale data when the partner updates a record in a shared couple workspace.

- **Action:** Transition `TransactionsPage` to primarily use React Query for data fetching, keeping Zustand only for UI-specific state if necessary.

### 2. Performance: Redundant Loops
In `CartoesPage`, the current implementation calculates card balances by filtering a global transaction list inside a `map` of cards ($O(N \times M)$).

- **Action:** Pre-calculate balances in a single pass ($O(M)$) using a `Map` or an object accumulator before rendering the card list.

### 3. Security: Storage Path Collision
Currently, avatar uploads use `Math.random()`. While the collision risk is low, it's not zero and is not a best practice for public-facing assets.

- **Action:** Use `crypto.randomUUID()` for unique, non-guessable filenames.

### 4. Security: Database Linter Warnings
The `handle_updated_at` function lacks a fixed `search_path`, which is a security best practice to prevent search path hijacking.

- **Action:** Apply a migration to set `search_path = public` on all public functions.

### 5. Code Quality: Currency Formatting
Currency formatting logic is repeated in several places with manual string manipulation.

- **Action:** Centralize currency formatting in `src/lib/utils.ts` and refactor inputs to use standardized logic.

## Technical Details

- **File Changes:**
  - `src/lib/utils.ts`: Add `formatCurrency` and `parseCurrency` utilities.
  - `src/components/add-card-modal.tsx`: Refactor limit input to use new utilities.
  - `src/components/image-cropper-modal.tsx`: Use `crypto.randomUUID()` for filenames.
  - `src/routes/cartoes.tsx`: Optimize balance calculation.
  - `src/routes/transacoes.tsx`: Streamline data fetching with React Query.
  - `supabase/migrations/...`: Fix function search paths.
